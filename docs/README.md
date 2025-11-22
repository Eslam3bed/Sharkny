# Shared Bill Splitter

A simple web app that allows friends to easily split bills by taking a screenshot of a receipt and having AI extract item-by-item details for fair cost splitting.

## Project Overview

This application leverages OpenAI's vision capabilities to automatically extract items and prices from bills/receipts, then provides an interactive interface for friends to calculate individual shares, accounting for VAT and service charges.

---

## Tech Stack

- **Frontend Framework**: [Remix](https://remix.run) with Server-Side Rendering
- **UI Components**: [shadcn/ui](https://www.shadcn.io/ui) + Tailwind CSS
- **Database**: MongoDB (no authentication required)
- **AI/ML**: OpenAI API (Vision + GPT)
- **Deployment**: Railway.app
- **Language**: TypeScript
- **Package Manager**: pnpm or npm

---

## Requirements Analysis

### Functional Requirements

1. **Bill Capture**
   - Allow users to take a screenshot or photo of a bill using browser media APIs
   - Support both camera and file upload options
   - Handle image compression and validation

2. **AI Processing**
   - Send images to OpenAI Vision API for analysis
   - Extract items, prices, quantities, and descriptions
   - Identify and extract VAT percentage if present
   - Identify and extract service charge if present
   - Return structured JSON response

3. **Bill Display & Interaction**
   - Display extracted items as a list
   - Show item names, prices, and quantities
   - Include checkboxes for each item (all initially checked)
   - Display VAT and service charge separately

4. **Calculations**
   - Calculate total based on all items
   - Calculate subtotal based on selected items (checked)
   - Apply VAT percentage to selected items
   - Apply service charge to selected items
   - Display real-time cost per person

5. **Data Persistence**
   - Store bills in MongoDB for potential future reference
   - No user authentication (bills are stateless/temporary)

---

## User Stories

### Story 1: Capture Bill Image
**As a user**
I want to take a screenshot or photo of a bill
So that I can quickly digitize the receipt

**Acceptance Criteria:**
- [ ] Button to open camera/file picker
- [ ] Image preview before submission
- [ ] Supported formats: JPG, PNG, WebP
- [ ] File size validation (max 5MB)
- [ ] Loading state while processing

### Story 2: Extract Bill Details
**As a user**
I want the app to automatically extract items and prices from the bill
So that I don't have to manually type everything

**Acceptance Criteria:**
- [ ] OpenAI Vision API processes the image
- [ ] Items, prices, and quantities are extracted
- [ ] VAT percentage is identified and extracted
- [ ] Service charge is identified and extracted
- [ ] Response is properly validated and parsed

### Story 3: View Extracted Items
**As a user**
I want to see a clean list of extracted items with prices
So that I can verify accuracy and make adjustments

**Acceptance Criteria:**
- [ ] Items displayed in a sortable table/list
- [ ] Item name, price, quantity visible
- [ ] Easy to read and scan
- [ ] Shows item subtotal (price × quantity)

### Story 4: Select Items for Splitting
**As a user**
I want to check/uncheck items to control what gets split
So that I can exclude items I didn't order

**Acceptance Criteria:**
- [ ] Each item has a checkbox
- [ ] All checkboxes initially checked
- [ ] Unchecking removes item from calculation
- [ ] Visual feedback of selection state

### Story 5: Calculate Split
**As a user**
I want the app to calculate how much each person should pay
So that we can split the bill fairly

**Acceptance Criteria:**
- [ ] Real-time calculation on checkbox change
- [ ] Shows subtotal of selected items
- [ ] Shows VAT applied to selected items
- [ ] Shows service charge applied to selected items
- [ ] Shows total amount to split
- [ ] Shows per-person cost (total ÷ number of people)

### Story 6: Specify Number of People
**As a user**
I want to specify how many people are splitting the bill
So that the app can calculate individual shares correctly

**Acceptance Criteria:**
- [ ] Input field for number of people
- [ ] Minimum 2 people
- [ ] Real-time recalculation when number changes
- [ ] Display cost per person prominently

---

## Technical Tasks

### Phase 1: Project Setup ✅ → 🔄 → ✓

- [ ] **Initialize Remix Project**
  - Create new Remix app with TypeScript
  - Configure for Node.js/Railway deployment
  - Setup environment variables structure

- [ ] **Install & Configure shadcn/ui**
  - Run shadcn CLI init
  - Configure Tailwind CSS
  - Setup postcss.config.js
  - Import styles in root.tsx
  - Setup path aliases in tsconfig.json

- [ ] **Install Core Dependencies**
  - OpenAI SDK (`openai`)
  - MongoDB driver (`mongodb`) or Mongoose
  - Form handling library if needed
  - Image compression library (sharp or similar)

- [ ] **Environment Setup**
  - Create `.env.example` file
  - Document required variables:
    - `OPENAI_API_KEY`
    - `MONGODB_URI`
    - `MONGODB_DB_NAME`
  - Setup .env.local (user-created, not in repo)

### Phase 2: Core Backend API Routes 🔄

- [ ] **Create API Route: `/api/extract-bill`**
  - Accept multipart form data with image
  - Validate image file (type, size)
  - Send to OpenAI Vision API
  - Parse response into structured format
  - Error handling and validation
  - Return JSON: `{ items: [], vat: number, service: number }`

- [ ] **Create API Route: `/api/save-bill` (optional)**
  - Accept extracted bill data
  - Store in MongoDB with timestamp
  - Return bill ID for potential future reference

- [ ] **OpenAI Integration Module**
  - Create utility for Vision API calls
  - Implement prompt engineering for consistent JSON extraction
  - Handle API errors gracefully
  - Rate limiting considerations

- [ ] **MongoDB Integration**
  - Setup connection pooling
  - Create schema for bills collection
  - Index on timestamp for cleanup queries

### Phase 3: Frontend Components 🔄

- [ ] **Add shadcn/ui Components**
  - Button
  - Card
  - Input
  - Checkbox
  - Form
  - Dialog (for image upload)
  - Alert

- [ ] **Create ImageUpload Component**
  - File input with drag-and-drop
  - Camera capture support
  - Image preview
  - Loading state
  - Error display

- [ ] **Create BillItemsList Component**
  - Display extracted items in table/list
  - Item name, quantity, price columns
  - Subtotal per item
  - Checkbox for selection
  - Responsive design

- [ ] **Create SplitCalculator Component**
  - Number of people input
  - Subtotal display
  - VAT calculation display
  - Service charge display
  - Total display
  - Per-person cost (prominently displayed)
  - Real-time updates on checkbox change

- [ ] **Create Main Index Route**
  - Layout with header
  - Image upload section
  - Processing state
  - Results display
  - Error handling

### Phase 4: Business Logic 🔄

- [ ] **Bill Processing Service**
  - Image compression before sending
  - OpenAI Vision API integration
  - Response parsing to extract:
    - Item name
    - Quantity
    - Unit price
    - VAT percentage (if any)
    - Service charge percentage (if any)
  - Validation of extracted data
  - Error handling for malformed responses

- [ ] **Calculation Engine**
  - Calculate subtotal from selected items
  - Apply VAT to selected subtotal
  - Apply service charge to selected subtotal
  - Calculate per-person cost
  - Handle edge cases (0 people, no items selected, etc.)

- [ ] **Data Validation**
  - Validate extracted prices are numbers
  - Validate extracted quantities are positive
  - Validate VAT/service percentages are 0-100%
  - Sanitize all user inputs

### Phase 5: UI/UX Polish 🔄

- [ ] **Responsive Design**
  - Mobile-first approach
  - Test on various screen sizes
  - Touch-friendly buttons
  - Readable on small screens

- [ ] **Accessibility**
  - Semantic HTML
  - ARIA labels where needed
  - Keyboard navigation support
  - Color contrast compliance

- [ ] **Loading States**
  - Show spinner during image processing
  - Disable buttons during processing
  - Show estimated time if processing takes >3s

- [ ] **Error Handling UI**
  - User-friendly error messages
  - Retry functionality
  - Clear guidance on what went wrong

- [ ] **Visual Feedback**
  - Highlight selected vs unselected items
  - Smooth animations
  - Clear visual hierarchy
  - Toast notifications for actions

### Phase 6: Optimization & Testing 🔄

- [ ] **Performance**
  - Optimize image compression
  - Minimize bundle size
  - Lazy load components if needed
  - Cache bust strategy for assets

- [ ] **Testing**
  - Unit tests for calculation logic
  - Integration tests for API routes
  - Manual testing with various bill formats

- [ ] **Browser Compatibility**
  - Test on Chrome, Firefox, Safari, Edge
  - Verify Media APIs work
  - Fallback for unsupported browsers

### Phase 7: Deployment & DevOps 🔄

- [ ] **Railway Configuration**
  - Create Railway account
  - Connect GitHub repository
  - Configure environment variables
  - Setup MongoDB Atlas or Railway Postgres

- [ ] **Build & Deploy Setup**
  - Verify build process works
  - Test production build locally
  - Setup automatic deployments on push
  - Monitor deployment logs

- [ ] **Documentation**
  - Add deployment instructions
  - Document environment setup
  - Add troubleshooting guide
  - Create local dev setup guide

---

## File Structure (After Setup)

```
shared-bill/
├── app/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── ImageUpload.tsx
│   │   ├── BillItemsList.tsx
│   │   ├── SplitCalculator.tsx
│   │   └── Layout.tsx
│   ├── routes/
│   │   ├── _index.tsx           # Main page
│   │   ├── api/
│   │   │   ├── extract-bill.tsx
│   │   │   └── save-bill.tsx
│   │   └── _layout.tsx          # Root layout
│   ├── lib/
│   │   ├── openai.server.ts     # OpenAI integration
│   │   ├── mongodb.server.ts    # MongoDB integration
│   │   ├── calculations.ts      # Bill calculations
│   │   └── validation.ts        # Data validation
│   ├── root.tsx
│   └── tailwind.css
├── .env.example
├── .env.local                   # (gitignored)
├── remix.config.js
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+ 
- pnpm, npm, or yarn
- MongoDB connection string
- OpenAI API key

### Setup Steps

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd shared-bill
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or: npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your keys:
   # OPENAI_API_KEY=sk-...
   # MONGODB_URI=mongodb+srv://...
   # MONGODB_DB_NAME=shared_bill
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

---

## Environment Variables

```
# OpenAI Configuration
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-vision-preview

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=shared_bill

# Optional: Railway specific
NODE_ENV=development
```

---

## OpenAI Prompt Strategy

The app uses a carefully crafted prompt to extract consistent JSON from bills:

```
Extract all line items from this receipt/bill image. 
Return ONLY valid JSON with this exact structure:
{
  "items": [
    {"name": "Item name", "quantity": 1, "unitPrice": 10.50, "subtotal": 10.50},
    ...
  ],
  "vatPercentage": 0,
  "serviceChargePercentage": 0,
  "total": 0
}

Rules:
- Only include items, ignore headers/footers
- Extract quantity and unit price separately if possible
- Calculate subtotal as quantity × unitPrice
- If VAT/service shown as percentage, extract it; otherwise 0
- If shown as amount, calculate percentage from total
- Return only the JSON object, no other text
```

---

## Key Design Decisions

1. **No Authentication**: Bills are temporary/stateless. Users don't log in. Can add later if needed.

2. **MongoDB for Flexibility**: Allows storing bills for audit/reference without strict schema requirements.

3. **Server-Side Processing**: Image sent to backend to keep API keys secure and use Remix's powerful forms.

4. **Real-Time Calculations**: All calculations done client-side after extraction for instant feedback.

5. **Progressive Enhancement**: Works without JavaScript as much as possible (extract-bill form can be progressive enhancement).

---

## Potential Enhancements (Future)

- [ ] Multi-currency support
- [ ] Split by custom amounts (not equal)
- [ ] Export to CSV/PDF
- [ ] Share bill link with others
- [ ] Receipt history (with optional login)
- [ ] Manual item editing after extraction
- [ ] Tip calculator
- [ ] Multiple bill splitting in one session
- [ ] OCR fallback for OpenAI failures

---

## Deployment to Railway

1. **Connect GitHub**
   - Push code to GitHub
   - Connect repo in Railway dashboard

2. **Set Environment Variables**
   - Add `OPENAI_API_KEY` in Railway dashboard
   - Add `MONGODB_URI` in Railway dashboard
   - Add `NODE_ENV=production`

3. **Configure Build Command**
   ```bash
   npm run build
   ```

4. **Configure Start Command**
   ```bash
   npm run start
   ```

5. **Deploy**
   - Railway auto-deploys on push to main branch

---

## Progress Tracking

### Completed Tasks
- [x] Requirements analysis
- [x] Tech stack finalization
- [x] README & task breakdown

### In Progress
- [ ] Phase 1: Project Setup

### Todo
- [ ] Phase 2-7: See tasks above

---

## Contributing

1. Follow the existing code style
2. Test locally before pushing
3. Update README when adding features
4. Keep components reusable and accessible

---

## License

MIT

---

## Support

For issues or questions:
1. Check the troubleshooting section below
2. Review the component documentation
3. Check OpenAI API documentation

---

## Troubleshooting

### Image Upload Not Working
- Check browser supports Media Capture APIs (Chrome, Edge, Firefox)
- Verify image file size < 5MB
- Ensure proper CORS if cross-origin

### OpenAI API Errors
- Verify API key is valid
- Check API usage/quota in OpenAI dashboard
- Review error logs in Railway

### MongoDB Connection Issues
- Verify connection string is correct
- Check MongoDB Atlas network access whitelist
- Ensure database exists

### Calculations Not Updating
- Check browser console for errors
- Verify checkbox onChange handlers are attached
- Inspect state management in React DevTools

