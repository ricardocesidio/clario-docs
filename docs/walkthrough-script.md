# ClarioDocs — Video Walkthrough Script

**Duration:** ~5 minutes

---

## 1. Intro (0:00 - 0:30)

"Hi, welcome to ClarioDocs — an AI-powered document analysis SaaS.

Reading through long documents takes time. Contracts, reports, invoices, resumes — you have to manually find the important parts.

ClarioDocs solves this. Upload any document, and the AI instantly generates summaries, identifies risks, suggests actions, extracts key points, and lets you chat with the document to ask questions.

In this walkthrough, I'll show you the full platform — from landing page to AI analysis to Stripe subscriptions."

---

## 2. Landing Page Overview (0:30 - 1:00)

(Show the landing page)

"This is the landing page. It clearly explains what the product does: upload documents, get insights instantly.

We have a hero section with CTAs to start free or view pricing. Below that are feature cards showing AI analysis, document chat, instant processing, security, dashboard, and export.

The How It Works section shows the 4-step flow: upload, AI analysis, get insights, ask questions.

Use cases show how different professionals can use it — legal, finance, HR, technical teams.

And pricing shows three plans: Free with 5 documents per month, Pro at $29 with 100 documents, and Business at $99 with 500 documents."

---

## 3. Demo Login (1:00 - 1:15)

(Click "Login" and show the login page)

"Instead of registering, recruiters and reviewers can try the app instantly with one click.

Click 'Try Demo' — it auto-fills the demo credentials. Click 'Sign In' and you're in.

There's also an 'Try Admin' button to access the admin panel."

---

## 4. Dashboard (1:15 - 1:45)

(Show the dashboard)

"This is the dashboard. It shows:

- Total documents uploaded
- Documents analyzed this month
- Current plan — Free in this case
- Usage stats with a progress bar

Below that, we have a bar chart showing document uploads over time, and a pie chart showing document types.

There's also a recent documents list for quick access, and an upgrade CTA if you've hit the free plan limit."

---

## 5. Documents Page (1:45 - 2:00)

(Navigate to Documents)

"The documents page lists all uploaded files. You can search by name, filter by file type, sort by date, and delete documents.

Each document shows its type, status badge, and upload date."

---

## 6. Upload a Document (2:00 - 2:15)

(Click Upload and show the upload page)

"Uploading is simple — drag and drop a PDF or text file, or click to browse. The system validates the file type and size, then uploads and processes it."

(Upload a PDF)

---

## 7. AI Analysis Result (2:15 - 3:00)

(Show the document detail page after analysis completes)

"Once the AI finishes analyzing, we get a structured result page.

At the top: the file name, status, upload date, file size.

Then the analysis sections:

- Short summary at the top
- Detailed summary below
- Key points extracted from the document
- Risks and alerts — this is really useful for contracts
- Suggested actions — what should you do next
- Keywords as tags
- Document type, tone, and AI confidence score

There are also suggested questions you can click to start a conversation about the document.

And an Export MD button to download the analysis as Markdown."

---

## 8. Chat with Document (3:00 - 3:30)

(Scroll down to chat)

"The chat panel lets you ask questions about the document. The AI uses the document content to answer.

For example:

'What are the main risks in this contract?'

'Summarize this in 5 bullet points'

'What actions should I take?'

The conversation is saved, so you can come back to it later."

---

## 9. Export Markdown (3:30 - 3:45)

(Click Export MD)

"Clicking Export MD downloads a complete Markdown file with all the analysis sections — perfect for documentation, reporting, or sharing."

---

## 10. Pricing and Stripe (3:45 - 4:15)

(Navigate to Pricing)

"The pricing page shows the three plans. The Pro plan is highlighted as most popular.

When you click Upgrade, it creates a Stripe Checkout session. After payment, the webhook updates your plan, and your usage limits increase.

You can manage your subscription from the Settings page through the Stripe Customer Portal."

---

## 11. Admin Panel (4:15 - 4:35)

(Switch to admin account and show admin)

"The admin panel gives a platform-wide view:

- Total users, documents, analyses, active subscriptions
- Users by plan breakdown
- Documents uploaded over time
- Recent users and documents lists

This is useful for monitoring the platform."

---

## 12. Tech Stack Overview (4:35 - 4:50)

"Built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui for the frontend.

PostgreSQL with Prisma 7 ORM for the database.

Custom JWT authentication with bcrypt password hashing.

OpenAI API for AI document analysis and chat.

Stripe for subscription payments and customer portal.

Charts are powered by Recharts.

Deployed on Vercel with Neon database."

---

## 13. Closing (4:50 - 5:00)

"ClarioDocs is a full-stack AI SaaS that demonstrates real product engineering — authentication, payments, AI integration, database design, and production-ready UI.

The full source code is available on GitHub. Check the description for links.

Thanks for watching!"
