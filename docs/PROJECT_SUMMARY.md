# Shared Bill Splitter - Project Summary

## What We're Building

A web app that lets friends split restaurant bills easily by:
1. Taking a photo/screenshot of a bill
2. Using AI to extract item names and prices automatically
3. Selecting which items each person had
4. Automatically calculating fair splits including taxes and service charges

## Key Features

✅ **Image Capture** - Camera or file upload  
✅ **AI Extraction** - OpenAI Vision extracts items and prices as JSON  
✅ **Item Selection** - Checkboxes for each item (all checked by default)  
✅ **VAT & Service Detection** - Automatically identifies and applies taxes  
✅ **Real-time Calculations** - Cost updates instantly as items are selected  
✅ **Per-Person Cost** - Shows how much each person should pay  

## Tech Stack

- **Frontend**: Remix + shadcn/ui + Tailwind CSS (TypeScript)
- **Backend**: Remix Routes (Node.js)
- **Database**: MongoDB (no auth needed)
- **AI**: OpenAI Vision API
- **Deployment**: Railway.app
- **Package Manager**: pnpm/npm

## Documentation Created

### 1. **README.md** ✅
   - Complete project overview
   - 6 detailed user stories with acceptance criteria
   - 7 project phases with 29 actionable tasks
   - File structure template
   - Setup instructions
   - Environment variable guide
   - Troubleshooting guide
   - OpenAI prompt strategy
   - Deployment to Railway instructions

### 2. **.env.example** ✅
   - Template for environment variables
   - Documented what each variable does
   - Links to where to get credentials

### 3. **Todo List** ✅
   - 29 tasks organized by phase
   - Tracks progress from setup to production
   - Phases:
     - Phase 1: Project Setup (4 tasks)
     - Phase 2: Backend API (4 tasks)
     - Phase 3: Frontend Components (6 tasks)
     - Phase 4: Business Logic (3 tasks)
     - Phase 5: UI/UX Polish (5 tasks)
     - Phase 6: Testing (3 tasks)
     - Phase 7: Deployment (2 tasks)

## How to Use These Documents

1. **Start with README.md** - It has everything you need to understand the project
2. **Use the Todo List** - Check off tasks as you complete them
3. **Update README as you go** - Keep track of progress
4. **.env.local** - You'll create this with your actual API keys (not committed to git)

## Next Steps

1. ✅ Create new Remix project with TypeScript
2. ✅ Setup shadcn/ui with Tailwind
3. ✅ Install dependencies (OpenAI, MongoDB)
4. ✅ Create .env.local with your keys
5. ✅ Build the API routes (/api/extract-bill)
6. ✅ Build the components
7. ✅ Test everything
8. ✅ Deploy to Railway

## Quick Reference: Environment Variables Needed

Before you start coding, you'll need:

1. **OPENAI_API_KEY** - Sign up at https://platform.openai.com
2. **MONGODB_URI** - Get connection string from https://www.mongodb.com/cloud/atlas

Both are required for the app to work!

---

**Ready to start building?** Begin with task #1 in the todo list: "Initialize Remix Project"
