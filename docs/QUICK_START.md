# Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Node.js 18+ installed
- OpenAI API key (https://platform.openai.com/api-keys)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)

### Step 1: Create Remix App
```bash
npx create-remix@latest shared-bill
cd shared-bill
# Choose: TypeScript, Node.js
```

### Step 2: Setup shadcn/ui
```bash
npx shadcn@latest init
# Use defaults
npx shadcn@latest add button card input checkbox form dialog alert
```

### Step 3: Install Dependencies
```bash
npm install openai mongodb sharp
npm install -D tailwindcss autoprefixer
```

### Step 4: Configure Tailwind
Create `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Update `remix.config.js`:
```javascript
export default {
  tailwind: true,
  postcss: true,
};
```

### Step 5: Create .env.local
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
OPENAI_API_KEY=sk-your-key-here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=shared_bill
```

### Step 6: Run Development Server
```bash
npm run dev
# Visit http://localhost:3000
```

---

## Building Phase by Phase

### Phase 1: Backend Setup (Estimated: 30 mins)

**Goal**: Get API routes working to extract bills

```typescript
// app/lib/openai.server.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractBillFromImage(imageBase64: string) {
  const message = await openai.messages.create({
    model: "gpt-4-vision-preview",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: {
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: `Extract all line items from this bill. Return ONLY valid JSON:
{
  "items": [{"name": "Item", "quantity": 1, "unitPrice": 10.00, "subtotal": 10.00}],
  "vatPercentage": 0,
  "serviceChargePercentage": 0
}`,
          },
        ],
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  
  return JSON.parse(content.text);
}
```

```typescript
// app/routes/api/extract-bill.tsx
import { json, type ActionFunction } from "@remix-run/node";
import sharp from "sharp";
import { extractBillFromImage } from "~/lib/openai.server";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return json({ error: "No image provided" }, { status: 400 });
    }

    // Compress image
    const buffer = await imageFile.arrayBuffer();
    const compressed = await sharp(Buffer.from(buffer))
      .resize(1280, 720, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Extract with OpenAI
    const result = await extractBillFromImage(compressed.toString("base64"));

    return json(result);
  } catch (error) {
    console.error("Extract bill error:", error);
    return json(
      { error: "Failed to extract bill" },
      { status: 500 }
    );
  }
};
```

### Phase 2: Frontend Components (Estimated: 45 mins)

**Goal**: Create UI for uploading images and displaying results

```typescript
// app/components/ImageUpload.tsx
import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export function ImageUpload({ isLoading }: { isLoading: boolean }) {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Upload Receipt</h2>
      <Form method="post" encType="multipart/form-data" action="/api/extract-bill">
        <input 
          type="file" 
          name="image" 
          accept="image/*" 
          required
          disabled={isLoading}
          className="mb-4"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Extract Bill"}
        </Button>
      </Form>
    </Card>
  );
}
```

```typescript
// app/components/BillItemsList.tsx
import { Checkbox } from "~/components/ui/checkbox";

interface Item {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export function BillItemsList({
  items,
  selected,
  onChange,
}: {
  items: Item[];
  selected: boolean[];
  onChange: (index: number) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-4 p-3 border rounded">
          <Checkbox
            checked={selected[i]}
            onCheckedChange={() => onChange(i)}
          />
          <div className="flex-1">
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-gray-600">
              {item.quantity} × ${item.unitPrice.toFixed(2)}
            </div>
          </div>
          <div className="font-bold">${item.subtotal.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}
```

```typescript
// app/components/SplitCalculator.tsx
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";

export function SplitCalculator({
  subtotal,
  vat,
  service,
  numPeople,
  onChange,
}: {
  subtotal: number;
  vat: number;
  service: number;
  numPeople: number;
  onChange: (num: number) => void;
}) {
  const vatAmount = subtotal * (vat / 100);
  const serviceAmount = subtotal * (service / 100);
  const total = subtotal + vatAmount + serviceAmount;
  const perPerson = numPeople > 0 ? total / numPeople : 0;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Split Calculator</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {vat > 0 && (
          <div className="flex justify-between">
            <span>VAT ({vat}%):</span>
            <span>${vatAmount.toFixed(2)}</span>
          </div>
        )}
        {service > 0 && (
          <div className="flex justify-between">
            <span>Service ({service}%):</span>
            <span>${serviceAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold border-t pt-3">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Number of People:
        </label>
        <Input
          type="number"
          min="1"
          value={numPeople}
          onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded text-lg font-bold">
        Per Person: ${perPerson.toFixed(2)}
      </div>
    </Card>
  );
}
```

### Phase 3: Main Page (Estimated: 20 mins)

**Goal**: Put it all together

```typescript
// app/routes/_index.tsx
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { Card } from "~/components/ui/card";
import { ImageUpload } from "~/components/ImageUpload";
import { BillItemsList } from "~/components/BillItemsList";
import { SplitCalculator } from "~/components/SplitCalculator";

interface BillData {
  items: Array<{ name: string; quantity: number; unitPrice: number; subtotal: number }>;
  vatPercentage: number;
  serviceChargePercentage: number;
}

export default function Index() {
  const fetcher = useFetcher<BillData>();
  const [selected, setSelected] = useState<boolean[]>([]);
  const [numPeople, setNumPeople] = useState(2);

  const data = fetcher.data;
  const isLoading = fetcher.state === "submitting";

  // Initialize selected items when data loads
  if (data && selected.length === 0) {
    setSelected(data.items.map(() => true));
  }

  const selectedItems = data?.items.filter((_, i) => selected[i]) ?? [];
  const subtotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Shared Bill Splitter</h1>
        <p className="text-gray-600 mb-8">
          Take a photo of your receipt and we'll help you split it fairly.
        </p>

        <ImageUpload isLoading={isLoading} />

        {isLoading && (
          <Card className="p-6 text-center">
            <p>Processing your bill...</p>
          </Card>
        )}

        {fetcher.data?.error && (
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-700">{fetcher.data.error}</p>
          </Card>
        )}

        {data && !isLoading && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Items</h2>
              <BillItemsList
                items={data.items}
                selected={selected}
                onChange={(i) => {
                  const newSelected = [...selected];
                  newSelected[i] = !newSelected[i];
                  setSelected(newSelected);
                }}
              />
            </div>

            <SplitCalculator
              subtotal={subtotal}
              vat={data.vatPercentage}
              service={data.serviceChargePercentage}
              numPeople={numPeople}
              onChange={setNumPeople}
            />
          </>
        )}
      </div>
    </div>
  );
}
```

---

## Common Issues & Solutions

### Issue: "Cannot find module '~/components/ui/button'"
**Solution**: Ensure `tsconfig.json` has path alias:
```json
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./app/*"]
    }
  }
}
```

### Issue: CSS not loading
**Solution**: Ensure `root.tsx` imports styles:
```typescript
import styles from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];
```

### Issue: OpenAI API errors
**Solution**: Check API key and quota:
```bash
# Test your key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Issue: MongoDB connection fails
**Solution**: Verify connection string and whitelist IP:
```bash
# In MongoDB Atlas: Network Access > Add IP Address
# Choose "Allow access from anywhere" for development
```

---

## Testing Your Build

```bash
# 1. Start dev server
npm run dev

# 2. Upload a test bill image
# Use your phone to take a photo or use a real receipt

# 3. Check browser console for errors
# DevTools > Console tab

# 4. Check Terminal for server logs
# Look for [EXTRACT_BILL] logs

# 5. Verify calculations work
# Uncheck some items and verify total changes
```

---

## Next: Deploy to Railway

Once everything works locally:

1. Push to GitHub
2. Connect to Railway
3. Add environment variables
4. Railway auto-deploys!

See README.md for detailed deployment steps.
