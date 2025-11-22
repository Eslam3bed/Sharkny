# Best Practices & Architecture Guide

## Architecture Overview

```
User Browser
    ↓
Remix Server Routes
    ├── Form Action: POST /api/extract-bill
    │   ├── Receives: Image file
    │   ├── Processes: Image compression, OpenAI call
    │   └── Returns: Extracted items JSON
    │
    └── Loader: GET /
        └── Returns: Initial page state

Client-Side React Components
    ├── ImageUpload (handles capture/file)
    ├── BillItemsList (displays items with checkboxes)
    └── SplitCalculator (real-time calculations)

Backend Services
    ├── OpenAI Integration (app/lib/openai.server.ts)
    ├── MongoDB Integration (app/lib/mongodb.server.ts)
    ├── Calculations (app/lib/calculations.ts)
    └── Validation (app/lib/validation.ts)
```

## OpenAI Integration Best Practices

### 1. Prompt Engineering
```typescript
// Use structured prompt for consistent JSON output
const extractionPrompt = `
Extract all line items from this bill/receipt image.
Return ONLY valid JSON with no additional text.

Required structure:
{
  "items": [
    {
      "name": "Item name",
      "quantity": 1,
      "unitPrice": 10.50,
      "subtotal": 10.50
    }
  ],
  "vatPercentage": 0,
  "serviceChargePercentage": 0,
  "currency": "USD"
}

Rules:
- Extract quantity and unit price separately
- Calculate subtotal = quantity × unitPrice
- If VAT/service shown as percentage, extract it
- If shown as amount, calculate: (amount / subtotal) × 100
- Return ONLY the JSON object
`;
```

### 2. Error Handling
```typescript
// Always validate API responses
try {
  const response = await openai.vision.extract(image);
  const parsed = JSON.parse(response.content);
  
  // Validate structure
  if (!Array.isArray(parsed.items)) {
    throw new Error("Invalid response structure");
  }
  
  return parsed;
} catch (error) {
  console.error("OpenAI extraction failed:", error);
  throw new Response("Could not extract bill. Please try again.", { status: 400 });
}
```

### 3. Rate Limiting & Cost Optimization
```typescript
// Compress images before sending to reduce costs
import sharp from 'sharp';

const compressedImage = await sharp(buffer)
  .resize(1280, 720, { fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 80 })
  .toBuffer();

// Only send compressed version to OpenAI
```

## MongoDB Best Practices

### 1. Connection Pooling
```typescript
// app/lib/mongodb.server.ts
let client: MongoClient;

export async function getMongoClient() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
  }
  return client;
}

// Use connection pool, don't create new connections per request
export async function extractBillsCollection() {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB_NAME).collection('bills');
}
```

### 2. Indexing Strategy
```typescript
// Create indexes for common queries
db.bills.createIndex({ createdAt: -1 });  // For recent bills
db.bills.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });  // For TTL cleanup
```

### 3. Schema Validation (Optional but recommended)
```typescript
// Validate data structure before saving
const billSchema = {
  bsonType: "object",
  required: ["items", "createdAt"],
  properties: {
    _id: { bsonType: "objectId" },
    items: {
      bsonType: "array",
      items: {
        bsonType: "object",
        required: ["name", "price"],
        properties: {
          name: { bsonType: "string" },
          quantity: { bsonType: "int", minimum: 1 },
          unitPrice: { bsonType: "decimal", minimum: 0 },
          subtotal: { bsonType: "decimal", minimum: 0 }
        }
      }
    },
    vatPercentage: { bsonType: "decimal", minimum: 0, maximum: 100 },
    serviceChargePercentage: { bsonType: "decimal", minimum: 0, maximum: 100 },
    createdAt: { bsonType: "date" },
    expiresAt: { bsonType: "date" }  // For TTL index
  }
};
```

## Remix Best Practices

### 1. Server vs Client Code Separation
```typescript
// ✅ DO: Put sensitive operations in .server.ts files
// app/lib/openai.server.ts - Only runs on server
export async function extractFromImage(image: Buffer) {
  // API key only accessible here
  const response = await openai.vision.extract({
    image: image.toString('base64'),
  });
}

// app/routes/api/extract-bill.tsx - Server action
import { extractFromImage } from "~/lib/openai.server";

export async function action({ request }: ActionFunction) {
  if (request.method !== "POST") return new Response(null, { status: 405 });
  
  const formData = await request.formData();
  const image = formData.get("image") as File;
  
  const result = await extractFromImage(await image.arrayBuffer());
  return json(result);
}

// ❌ DON'T: Put sensitive operations in client components
// API keys would be exposed!
```

### 2. Form Handling with Progressive Enhancement
```typescript
// app/routes/_index.tsx
export async function action({ request }: ActionFunction) {
  const formData = await request.formData();
  // Process on server
  const result = await extractBill(formData);
  return json(result);
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  
  return (
    <Form method="post" encType="multipart/form-data">
      <input type="file" name="image" accept="image/*" required />
      <button type="submit">Extract Bill</button>
    </Form>
  );
}
```

### 3. Error Boundaries
```typescript
// Catch errors gracefully
export function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} {error.statusText}</h1>
        <p>{error.data}</p>
      </div>
    );
  }
  
  return <div>Something went wrong</div>;
}
```

## Frontend Component Best Practices

### 1. State Management
```typescript
// Use Remix forms instead of React state when possible
// Less JavaScript required, better performance

// ✅ Prefer form with server action
<Form method="post">
  <input name="numPeople" type="number" />
  <button>Calculate</button>
</Form>

// ❌ Avoid unnecessary client state
const [numPeople, setNumPeople] = useState(2);
```

### 2. Real-Time Calculations
```typescript
// Do client-side calculations for instant feedback
// Keep server state in sync

export function SplitCalculator({ items, vat, service }) {
  const [selectedItems, setSelectedItems] = useState(items.map(() => true));
  const [numPeople, setNumPeople] = useState(2);
  
  const subtotal = selectedItems.reduce((sum, selected, i) => 
    selected ? sum + items[i].subtotal : sum, 0
  );
  
  const totalVat = subtotal * (vat / 100);
  const totalService = subtotal * (service / 100);
  const total = subtotal + totalVat + totalService;
  const perPerson = total / numPeople;
  
  return (
    <>
      <div>Per Person: ${perPerson.toFixed(2)}</div>
      {/* ... */}
    </>
  );
}
```

### 3. Accessibility
```typescript
// Use semantic HTML and ARIA labels
<fieldset>
  <legend>Select items to split</legend>
  {items.map((item, i) => (
    <div key={i}>
      <input
        type="checkbox"
        id={`item-${i}`}
        defaultChecked
        onChange={() => handleToggle(i)}
      />
      <label htmlFor={`item-${i}`}>
        {item.name} - ${item.price.toFixed(2)}
      </label>
    </div>
  ))}
</fieldset>
```

## Image Handling Best Practices

### 1. Validation
```typescript
// Validate file before processing
function validateImageFile(file: File) {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('File must be JPEG, PNG, or WebP');
  }
  
  if (file.size > MAX_SIZE) {
    throw new Error('File must be smaller than 5MB');
  }
  
  return true;
}
```

### 2. Compression Pipeline
```typescript
// Compress before sending to API
import sharp from 'sharp';

async function compressImage(buffer: Buffer) {
  const metadata = await sharp(buffer).metadata();
  
  let transform = sharp(buffer);
  
  // Resize if too large
  if ((metadata.width || 0) > 2048 || (metadata.height || 0) > 2048) {
    transform = transform.resize(2048, 2048, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }
  
  // Compress
  return transform.jpeg({ quality: 85 }).toBuffer();
}
```

## Calculation Engine Best Practices

### 1. Precision & Rounding
```typescript
// Use proper rounding for currency
function roundToNearest(num: number, decimals = 2): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function calculateSplit(
  items: Item[],
  selectedIndices: number[],
  vatPercent: number,
  servicePercent: number,
  numPeople: number
): CalculationResult {
  let subtotal = 0;
  for (const idx of selectedIndices) {
    subtotal += items[idx].subtotal;
  }
  
  const vat = roundToNearest(subtotal * (vatPercent / 100));
  const service = roundToNearest(subtotal * (servicePercent / 100));
  const total = roundToNearest(subtotal + vat + service);
  const perPerson = roundToNearest(total / numPeople);
  
  return { subtotal, vat, service, total, perPerson };
}
```

### 2. Edge Case Handling
```typescript
// Handle edge cases gracefully
if (numPeople < 1) {
  return { error: "Must have at least 1 person" };
}

if (selectedItems.length === 0) {
  return { 
    subtotal: 0, 
    vat: 0, 
    service: 0, 
    total: 0, 
    perPerson: 0 
  };
}

if (isNaN(vatPercent) || vatPercent < 0 || vatPercent > 100) {
  return { error: "Invalid VAT percentage" };
}
```

## Testing Best Practices

### 1. Unit Test Example (Calculations)
```typescript
// tests/calculations.test.ts
import { calculateSplit } from "~/lib/calculations";

describe("calculateSplit", () => {
  it("calculates per-person cost correctly", () => {
    const items = [
      { name: "Burger", subtotal: 10 },
      { name: "Fries", subtotal: 5 }
    ];
    
    const result = calculateSplit(
      items,
      [0, 1], // both selected
      10,     // 10% VAT
      0,      // no service
      2       // 2 people
    );
    
    // subtotal: 15, vat: 1.5, total: 16.5, perPerson: 8.25
    expect(result.perPerson).toBe(8.25);
  });
});
```

### 2. Integration Test Example (API)
```typescript
// tests/extract-bill.test.ts
describe("POST /api/extract-bill", () => {
  it("extracts items from bill image", async () => {
    const response = await fetch("/api/extract-bill", {
      method: "POST",
      body: formData // with image file
    });
    
    const data = await response.json();
    
    expect(data).toHaveProperty("items");
    expect(data).toHaveProperty("vatPercentage");
    expect(data).toHaveProperty("serviceChargePercentage");
    expect(Array.isArray(data.items)).toBe(true);
  });
});
```

## Deployment Best Practices

### 1. Environment Variables
```bash
# .env.local (never commit)
OPENAI_API_KEY=sk-...
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=shared_bill
NODE_ENV=development

# Railway will inject these
# Just set them in Railway dashboard
```

### 2. Build Optimization
```bash
# In package.json
"scripts": {
  "build": "remix build",
  "start": "remix-serve build",
  "dev": "remix dev",
  "typecheck": "tsc"
}
```

### 3. Monitoring
```typescript
// Log important events for debugging
console.log(`[EXTRACT_BILL] Processing image: ${fileSize}kb`);
console.error(`[EXTRACT_BILL] OpenAI error: ${error.message}`);
```

---

## Quick Checklist Before Launch

- [ ] All environment variables set in Railway
- [ ] OpenAI API quota sufficient
- [ ] MongoDB connection string valid
- [ ] Image compression working
- [ ] Error handling covers edge cases
- [ ] No API keys in version control
- [ ] Tests passing
- [ ] Performance acceptable (<3s for extraction)
- [ ] Mobile responsive
- [ ] Accessibility checks pass
