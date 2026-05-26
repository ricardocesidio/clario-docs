# Video Recording Checklist

## Video Details

| Item | Value |
|------|-------|
| **Recommended Length** | 4–6 minutes |
| **Recommended Title** | ClarioDocs — AI Document Intelligence SaaS Walkthrough |
| **Language** | English |
| **Tone** | Professional, clear, enthusiastic |
| **Platform** | YouTube (unlisted or public for portfolio) |

## Setup Before Recording

- [ ] Deploy the app to Vercel (or use localhost if deploying isn't ready)
- [ ] Run `npm run db:seed` so demo data is loaded
- [ ] Open the app in a clean browser tab (incognito mode)
- [ ] Close all other tabs and applications
- [ ] Set screen resolution to 1440×900
- [ ] Test microphone audio levels
- [ ] Have a small sample PDF file ready to upload (or use the seed data)
- [ ] Ensure Stripe is in test mode so checkout demo works
- [ ] Have OpenAI API key active so AI analysis works

## Walkthrough Script

### 0:00 — Intro (30s)
- "Hi, welcome to ClarioDocs — an AI-powered document analysis SaaS."
- "The problem: reading documents takes too long. Contracts, reports, invoices — you have to manually find the important parts."
- "ClarioDocs solves this: upload any document, and AI instantly generates summaries, identifies risks, extracts key points, and lets you chat with your document."

### 0:30 — Landing Page Overview (30s)
- Show the landing page
- Point out: hero section, CTA buttons, feature cards, use cases
- "The landing page clearly communicates what the product does in the first 3 seconds."

### 1:00 — Demo Login (30s)
- Click "Login" at the top
- Show "Try Demo" button and click it
- "Instead of registering, reviewers can try the app with one click."
- Click "Sign In"

### 1:30 — Dashboard (45s)
- Show dashboard overview
- Point out: stat cards, usage progress bar, charts, recent documents
- "The dashboard gives you a complete overview of your document activity."

### 2:15 — Upload a Document (30s)
- Click "Upload Document"
- Show the drag & drop interface
- Upload a PDF (can use one of the seed documents)
- "Uploading is simple — drag and drop or click to browse."

### 2:45 — AI Analysis Result (60s)
- After analysis completes, show the result page
- Go through each section: summary, key points, risks, actions, keywords
- Point out the confidence score and document type detection
- "The AI generates a structured analysis with everything you need to understand the document."

### 3:45 — Document Chat (45s)
- Scroll to the chat section
- Click a suggested question or type your own
- Show the AI response
- "You can ask questions about the document and get answers based on its content."

### 4:30 — Export (30s)
- Click "MD" or "PDF" export button
- Show the downloaded file briefly
- "Export the analysis as Markdown or PDF for documentation."

### 5:00 — Pricing & Stripe (30s)
- Navigate to Pricing
- Show the 3 plans
- Quick mention: "Stripe handles subscriptions, webhooks update plan limits."
- Don't do a full checkout on video unless needed

### 5:30 — Admin Panel (30s)
- Log out, log in with "Try Admin"
- Show admin dashboard: stats, charts, recent users/documents
- "The admin panel gives a platform-wide view."

### 6:00 — Tech Stack & Closing (30s)
- "Built with Next.js, TypeScript, Prisma, PostgreSQL, OpenAI, and Stripe."
- "Full source code on GitHub — link in the description."
- "Thanks for watching!"

## Post-Recording

- [ ] Trim the start and end
- [ ] Add intro/outro music (optional)
- [ ] Add captions
- [ ] Upload to YouTube (unlisted)
- [ ] Copy the YouTube video ID
- [ ] Update README.md with the video ID:
      Replace `YOUTUBE_VIDEO_ID` in the walkthrough embed URL
- [ ] Add video to LinkedIn profile (optional)

## YouTube Description Template

```
ClarioDocs — AI Document Intelligence SaaS

Upload documents and get instant AI summaries, risks, insights, and answers.

In this walkthrough:
0:00 — Introduction
0:30 — Landing Page
1:00 — Demo Login
1:30 — Dashboard Overview
2:15 — Document Upload
2:45 — AI Analysis
3:45 — Document Chat
4:30 — Export
5:00 — Pricing & Stripe
5:30 — Admin Panel
6:00 — Tech Stack & Closing

Tech stack: Next.js 16, TypeScript, Prisma 7, OpenAI API, Stripe, Tailwind CSS

Source code: https://github.com/ricardocesidio/clario-docs
```
