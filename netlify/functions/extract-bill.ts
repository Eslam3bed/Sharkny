import OpenAI from 'openai';

interface BillItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number; // Calculated on frontend, not from AI
  // Optional bilingual labels returned by the LLM
  itemLabel?: {
    en?: string;
    ar?: string;
  };
}

interface AIBillResponse {
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    itemLabel?: {
      en?: string;
      ar?: string;
    };
  }[];
  currency: string;
  vatPercentage: number;
  serviceChargePercentage: number;
}

interface BillData {
  items: BillItem[];
  currency: string;
  vatPercentage: number;
  serviceChargePercentage: number;
  total: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async (request: Request) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { status: 400, headers }
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return new Response(
        JSON.stringify({ error: 'File must be an image' }),
        { status: 400, headers }
      );
    }

    // Validate file size (max 10MB for original, since we're not compressing)
    if (imageFile.size > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'Image must be smaller than 10MB' }),
        { status: 400, headers }
      );
    }

    // Convert file to buffer and then to base64 for OpenAI
    const buffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      // model: "gpt-4o",
      // model: "gpt-4-turbo",
      model: "gpt-4.1",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert receipt/bill validator and parser. First validate if this image is a valid bill/receipt, then extract the data with extreme precision.

STEP 1: BILL VALIDATION
First, determine if this image contains a valid bill, receipt, or invoice. Look for:
- Store/restaurant/business name or logo
- Date and time of transaction
- List of purchased items with prices
- Subtotal, tax, or total amounts
- Transaction ID, order number, or receipt number
- Currency symbols or values

If this is NOT a valid bill/receipt (e.g., regular photo, document, menu without transaction, screenshot of non-bill content), respond with:
{"error": "NOT_A_BILL", "message": "This image does not appear to be a bill or receipt. Please upload a valid receipt with transaction details."}

STEP 2: BILL DATA EXTRACTION (only if Step 1 confirms it's a valid bill)

CRITICAL: For each extracted line item, in addition to the raw name, return bilingual labels in both English and Arabic so the frontend can display localized names directly. For every item object include an "itemLabel" field with the shape: {"en": "Normalized English name", "ar": "Arabic (Jordanian) label"}. Example item object:
{"name": "raw scanned name", "quantity": 2, "unitPrice": 5.50, "itemLabel": {"en": "Coffee", "ar": "قهوة"}}

The Arabic labels should be friendly, colloquial (Jordanian dialect) when appropriate. The English labels should be normalized, title-cased, and concise.

CRITICAL: Focus on PERFECT NUMBER ACCURACY. Extract prices and quantities exactly as shown on the receipt.

NUMBER FORMAT AWARENESS:
- Default format is xx.xx (e.g., 12.50, 125.75)
- European format may use comma as decimal: xx,xx (e.g., 12,50)
- Thousands separators vary: 1,250.00 (US) vs 1.250,00 (EU) vs 1 250,00 (French)
- Convert ALL extracted numbers to standard xx.xx format (decimal point, no thousands separator)
- Examples: "12,50" → 12.50, "1.250,00" → 1250.00, "1,250.50" → 1250.50

RECEIPT STRUCTURE ANALYSIS:
- Receipts typically have columns: [Item Name] [Quantity] [Unit Price] [Total Price]
- Some receipts show: [Quantity] x [Item Name] @ [Unit Price] = [Line Total]
- Look for patterns like "2 x Coffee @ 5.50 = 11.00" or "Coffee 2 5.50 11.00"
- Unit prices are often smaller amounts, line totals are calculated amounts
- Quantities can be: whole numbers (1, 2, 3) or decimals (0.5, 1.5, 2.5)

Required JSON structure for valid bills (ALL NUMBERS IN xx.xx FORMAT):
{
  "items": [
    {"name": "raw scanned name", "quantity": 1, "unitPrice": 10.50, "itemLabel": {"en": "English label", "ar": "Arabic label"}}
  ],
  "currency": "EGP",
  "vatPercentage": 0,
  "serviceChargePercentage": 0
}

EXTRACTION RULES - FOLLOW PRECISELY:
1. IDENTIFY COLUMNS: Look for item names, quantities, unit prices, and line totals
2. NUMBER FORMAT CONVERSION:
   - If you see "12,50" convert to 12.50
   - If you see "1.250,00" convert to 1250.00
   - If you see "1,250.50" keep as 1250.50
   - Always output numbers in standard xx.xx decimal format
3. UNIT PRICE vs LINE TOTAL: 
   - Unit Price = price per single item (smaller amount)
   - Line Total = quantity × unit price (larger amount - ignore this)
4. QUANTITY DETECTION:
   - Look for "x" symbols: "2 x Coffee" means quantity = 2
   - Look for separate quantity columns
   - If no quantity shown, assume quantity = 1
   - Convert quantity number format too: "2,5" → 2.5
5. PRICE EXTRACTION:
   - Extract the UNIT PRICE (price per item), NOT the line total
   - If you see "2 x Coffee 5,50 11,00" → quantity=2, unitPrice=5.50 (not 11.00)
   - If unclear which is unit vs total, choose the smaller reasonable price as unit price
6. ITEM NAMES: Extract complete item names, remove any quantity prefixes
7. CURRENCY: Look for symbols (£, $, €, LE, SAR, AED) or currency codes
8. TAXES: 
   - VAT/Tax: Look for "VAT", "Tax", "ضريبة" with percentage or amount
   - Service: Look for "Service", "خدمة" with percentage or amount
   - If shown as amount only, estimate percentage from subtotal
   - Convert tax percentages: "12,5%" → 12.5

DO NOT:
- Calculate or estimate prices
- Round numbers unless converting formats
- Include non-menu items (headers, totals, restaurant info)
- Confuse line totals with unit prices
- Add markdown formatting
- Keep original number formats - always convert to xx.xx

RESPOND: Either error JSON for non-bills OR valid bill data JSON with all numbers in standard xx.xx decimal format, no extra text or explanations`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${imageFile.type || 'image/jpeg'};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1024,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response - handle markdown code blocks
    let aiResponse: AIBillResponse | { error: string; message: string };
    try {
      // Remove markdown code blocks if present
      const cleanContent = content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      
      aiResponse = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      console.error('Parse error:', parseError);
      throw new Error('Invalid response format from AI');
    }

    // Check if AI detected that this is not a bill
    if ('error' in aiResponse && aiResponse.error === 'NOT_A_BILL') {
      return new Response(
        JSON.stringify({ 
          error: 'NOT_A_BILL',
          message: aiResponse.message || 'This image does not appear to be a bill or receipt. Please upload a valid receipt with transaction details.'
        }),
        { status: 400, headers }
      );
    }

    // Cast to bill response type for further processing
    const billResponse = aiResponse as AIBillResponse;

    // Validate the response structure
    if (!Array.isArray(billResponse.items)) {
      throw new Error('Invalid response structure: items must be an array');
    }

    // Validate each item
    for (const item of billResponse.items) {
      if (typeof item.name !== 'string' || 
          typeof item.quantity !== 'number' || 
          typeof item.unitPrice !== 'number') {
        throw new Error('Invalid item structure in response');
      }

      // If itemLabel provided, ensure shape is reasonable
      if (item.itemLabel) {
        if (typeof item.itemLabel !== 'object') {
          throw new Error('Invalid itemLabel structure in response');
        }
        // optional strings
        if (item.itemLabel.en && typeof item.itemLabel.en !== 'string') {
          throw new Error('Invalid itemLabel.en value');
        }
        if (item.itemLabel.ar && typeof item.itemLabel.ar !== 'string') {
          throw new Error('Invalid itemLabel.ar value');
        }
      }
    }

    // Additional validation to catch common AI extraction errors
    const validatedItems = billResponse.items.filter(item => {
      // Remove items with unrealistic values
      if (item.quantity <= 0 || item.quantity > 100) {
        console.warn(`Filtered out item with invalid quantity: ${item.name} (qty: ${item.quantity})`);
        return false;
      }
      if (item.unitPrice <= 0 || item.unitPrice > 10000) {
        console.warn(`Filtered out item with invalid unit price: ${item.name} (price: ${item.unitPrice})`);
        return false;
      }
      if (!item.name || item.name.trim().length === 0) {
        console.warn(`Filtered out item with empty name`);
        return false;
      }
      return true;
    });

    // Check for potential unit price vs line total confusion
    const correctedItems = validatedItems.map(item => {
      // If the calculated total seems too high compared to other items, 
      // the AI might have confused line total with unit price
      const avgUnitPrice = validatedItems.reduce((sum, i) => sum + i.unitPrice, 0) / validatedItems.length;
      
      if (item.unitPrice > avgUnitPrice * 3 && item.quantity > 1) {
        // Possible confusion: AI extracted line total as unit price
        const possibleUnitPrice = item.unitPrice / item.quantity;
        console.warn(`Possible price correction for ${item.name}: ${item.unitPrice} → ${possibleUnitPrice}`);
        
        return {
          ...item,
          unitPrice: Math.round(possibleUnitPrice * 100) / 100
        };
      }
      
      return item;
    });

    if (correctedItems.length === 0) {
      throw new Error('No valid items found after validation');
    }

    // Calculate subtotals and total using corrected items
    const itemsWithSubtotals: BillItem[] = correctedItems.map(item => ({
      ...item,
      subtotal: Math.round(item.quantity * item.unitPrice * 100) / 100,
      // preserve bilingual label if provided by AI
      itemLabel: item.itemLabel ? { ...item.itemLabel } : undefined,
    }));
    
    const itemsTotal = itemsWithSubtotals.reduce((sum, item) => sum + item.subtotal, 0);
    const vatAmount = itemsTotal * (billResponse.vatPercentage / 100);
    const serviceAmount = itemsTotal * (billResponse.serviceChargePercentage / 100);
    const calculatedTotal = itemsTotal + vatAmount + serviceAmount;

    // Create final bill data with calculated values
    const billData: BillData = {
      items: itemsWithSubtotals,
      currency: billResponse.currency,
      vatPercentage: billResponse.vatPercentage,
      serviceChargePercentage: billResponse.serviceChargePercentage,
      total: Math.round(calculatedTotal * 100) / 100 // Round to 2 decimal places
    };

    return new Response(JSON.stringify(billData), { 
      status: 200, 
      headers 
    });

  } catch (error) {
    console.error('Extract bill error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to extract bill' 
      }),
      { status: 500, headers }
    );
  }
};