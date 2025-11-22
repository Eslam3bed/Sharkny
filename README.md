# Shared Bill Splitter

Effortlessly split restaurant bills with friends using AI. Just snap a photo of your receipt, let the app extract items and prices, and instantly calculate what everyone owes—including taxes and tips. No more manual math, confusion, or awkward moments.

---

**وصف مختصر بالعربية:**

تطبيق ذكي لتقسيم الفواتير بين الأصدقاء بسهولة وسرعة. فقط التقط صورة للفاتورة، وسيقوم التطبيق باستخراج تفاصيل البنود والأسعار تلقائيًا باستخدام الذكاء الاصطناعي، ثم يحسب نصيب كل شخص بدقة مع احتساب الضريبة والخدمة. مناسب للجوال وسهل الاستخدام، ويوفر تجربة شفافة وعادلة للجميع.

**SEO-friendly summary:**

> Shared Bill Splitter is a modern web app for fair, fast, and accurate bill splitting. Powered by OpenAI Vision, it extracts itemized details from receipts and helps groups split costs with transparency. Mobile-friendly, secure, and easy to use.

---

## المشروع: تقسيم الفاتورة الذكي

تطبيق ويب بسيط يساعد الأصدقاء على تقسيم فاتورة المطعم بسهولة. فقط التقط صورة للفاتورة، وسيقوم الذكاء الاصطناعي باستخراج البنود والأسعار تلقائيًا. يمكنك تحديد ما أكل كل شخص، وسيحسب التطبيق نصيب كل فرد بدقة، مع احتساب الضريبة والخدمة. لا حاجة للحسابات اليدوية أو الجدل حول من يدفع كم.

---

## What does it do?

- Take a photo of your bill/receipt
- AI extracts items, prices, VAT, and service charges
- Select which items each person had
- Instantly see what each person owes
- Works on mobile and desktop

---

## 🚀 Try the Live Demo

You can try Shared Bill Splitter instantly at:

👉 [https://sharkny.eslam.dev](https://sharkny.eslam.dev)

No signup required. Works on mobile and desktop. Your data stays private.

---

---

## Tech Stack

- **Frontend**: React (Remix), shadcn/ui, Tailwind CSS, TypeScript
- **Backend**: Node.js (Remix server routes)
- **AI**: OpenAI Vision API
- **Database**: MongoDB Atlas
- **Deployment**: Railway.app

---

## Developer Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- OpenAI API key ([get one](https://platform.openai.com/api-keys))
- MongoDB Atlas account ([get one](https://www.mongodb.com/cloud/atlas))

### Setup & Run

```bash
git clone https://github.com/Eslam3bed/Sharkny.git
cd shared-bill
cp .env.example .env.local # Add your keys
npm install
npm run dev
# Visit http://localhost:3000
```

### Environment Variables

Edit `.env.local`:

```
OPENAI_API_KEY=sk-...
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=shared_bill
```

---

## File Structure

```
src/
  components/
    ImageUpload.tsx        # Photo upload
    BillItemsList.tsx      # Item display
    SplitCalculator.tsx    # Cost calculation
  lib/
    openai.ts              # OpenAI integration
    storage.ts             # Bill history
    utils.ts               # Helpers
public/
docs/                     # Documentation
.env.example               # Environment template
```

---

## Contribution Guide

1. Fork the repo and clone your fork
2. Create a new branch for your feature/fix
3. Follow the existing code style and structure
4. Test locally before pushing
5. Update documentation if needed
6. Open a pull request with clear description

### Notes for Contributors

- Keep components reusable and accessible
- Never commit secrets—use `.env.local` only
- Document new environment variables in `.env.example`
- Run `npm run lint` and `npm run typecheck` before PR
- Check mobile and desktop responsiveness

---

## User Notes

1. Your API keys and database credentials go in `.env.local` (never share them)
2. For deployment, connect your repo to Railway and set environment variables in the dashboard
3. If you encounter issues, check the troubleshooting section below

---

## Extra Details & Audit Notes

- All bill data is processed locally in your browser; only the image and extracted items are sent to the backend for AI analysis.
- No personal data is stored—only bill history if you choose to save it (local storage).
- The app supports both English and Arabic, and detects currency automatically.
- Error handling and suggestions are built-in for a smooth user experience.
- The UI is designed for accessibility and mobile responsiveness.
- You can review technical details for any error (see the "Show technical details" link in error messages).
- For contributors: please check the code for accessibility, security, and performance best practices before submitting PRs.

---

---

## Troubleshooting

- **Image upload not working:** Check browser compatibility and file size (<5MB)
- **OpenAI API errors:** Verify your API key and usage quota
- **MongoDB issues:** Check your connection string and database access
- **Calculations not updating:** Check browser console for errors

---

## License

MIT
},
},
])

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
````
