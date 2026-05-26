# ClarioDocs

**AI-Powered Document Analysis Platform**

Upload any document — contracts, reports, invoices, resumes — and get instant AI summaries, risks, insights, and answers. Chat with your documents to extract deeper understanding.

## 🎥 Full Project Walkthrough

[![Watch the walkthrough](https://img.youtube.com/vi/YOUTUBE_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID)

## Screenshots

### Landing Page
![Landing Page](./public/screenshots/landing.png)

### Dashboard
![Dashboard](./public/screenshots/dashboard.png)

### Document Analysis
![Document Analysis](./public/screenshots/document-analysis.png)

### Document Chat
![Document Chat](./public/screenshots/document-chat.png)

### Pricing
![Pricing](./public/screenshots/pricing.png)

### Admin Dashboard
![Admin Dashboard](./public/screenshots/admin.png)

> Screenshots will be added after deployment. See the [walkthrough video](#-full-project-walkthrough) for a live demo.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (Base UI) |
| Database | PostgreSQL + Prisma 7 ORM |
| Auth | Custom JWT (bcrypt + jsonwebtoken) |
| AI | OpenAI API (GPT-4o-mini) |
| Payments | Stripe Subscriptions |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | Sonner |
| PDF Parsing | pdf-parse |
| Deployment | Vercel + Neon (recommended) |

## Features

### Core Features
- **Landing Page** — Premium SaaS landing with hero, features, use cases, pricing, FAQ, and footer
- **Authentication** — Register, login, JWT session management, protected routes via middleware
- **Dashboard** — Usage stats, charts (bar + pie), recent documents, monthly limits, upgrade CTAs
- **Document Upload** — PDF/TXT upload with drag & drop, type/size validation, processing states
- **AI Analysis** — Structured analysis: summaries, key points, risks, actions, keywords, document type, tone, suggested questions
- **Document Chat** — Ask questions about each document, AI answers based on content with message history
- **Documents List** — Search, filter by type, sort by date, delete with confirmation
- **Export Analysis** — Download analysis as Markdown (Pro feature)
- **How It Works** — Step-by-step guide to using the platform

### Business Features
- **Pricing Plans** — Free (5/mo), Pro ($29/mo, 100 docs), Business ($99/mo, 500 docs)
- **Stripe Integration** — Checkout sessions, webhooks, customer portal, subscription management
- **Usage Limits** — Monthly document limits enforced per plan with upgrade prompts
- **Admin Panel** — Platform analytics: total users, documents, analyses, active subscriptions, charts
- **Settings** — Profile management, subscription management, account info

### Quality of Life
- **Loading Skeletons** — All major pages have skeleton loading states
- **Empty States** — Contextual empty states with CTAs on every list page
- **Error Handling** — Clean error messages for validation, auth, limits, and API failures
- **Responsive Design** — Mobile, tablet, and desktop optimized
- **Dark Mode** — Premium dark SaaS aesthetic with purple/blue gradient accents
- **SEO Metadata** — Proper page titles, descriptions, and keywords
- **Demo Accounts** — One-click demo login for recruiters and reviewers

## App Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Premium SaaS landing page |
| Login | `/login` | Login with demo/admin one-click buttons |
| Register | `/register` | Create account |
| Dashboard | `/dashboard` | Analytics, charts, recent docs, usage |
| Documents | `/documents` | List, search, filter, sort documents |
| Upload | `/documents/upload` | Drag & drop file upload |
| Document Detail | `/documents/[id]` | Full analysis view + chat |
| Pricing | `/pricing` | Plan comparison + Stripe checkout |
| How It Works | `/how-it-works` | Step-by-step platform guide |
| Settings | `/settings` | Profile and subscription management |
| Admin | `/admin` | Platform analytics (admin only) |

## AI Workflow

```
User uploads file → Backend validates → Text extracted → Sent to OpenAI API
→ Structured JSON response → Stored in database → Displayed on document page
→ User can chat with AI about the document
```

The AI prompt requests structured JSON with:
- `shortSummary` — One-sentence summary
- `detailedSummary` — 2-3 paragraph detailed analysis
- `keyPoints` — 3-7 key points
- `risks` — Warnings and concerning items
- `suggestedActions` — 3-5 recommended actions
- `keywords` — 5-10 important keywords
- `documentType` — Contract, invoice, resume, report, etc.
- `tone` — Formal, informal, urgent, etc.
- `confidenceScore` — 0-1 confidence rating
- `suggestedQuestions` — 3-5 follow-up questions

## Stripe Workflow

```
User clicks "Upgrade" → Backend creates Stripe Checkout session
→ User completes payment on Stripe → Webhook updates user plan
→ Usage limits increase → User can manage subscription via Customer Portal
```

## Database Schema

### User
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| name | String? | Display name |
| email | String (unique) | Login email |
| passwordHash | String? | Bcrypt hashed password |
| role | USER \| ADMIN | Access level |
| plan | FREE \| PRO \| BUSINESS | Current plan |
| stripeCustomerId | String? | Stripe customer reference |
| stripeSubscriptionId | String? | Stripe subscription reference |
| subscriptionStatus | Enum | Active, inactive, canceled, etc. |

### Document
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| userId | String | Owner reference |
| originalName | String | Uploaded file name |
| fileType | String | MIME type |
| fileSize | Int | Size in bytes |
| storagePath | String | File system path |
| extractedText | String? | Raw text content |
| status | Enum | Uploaded, processing, completed, failed |

### Analysis
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| documentId | String (unique) | Document reference |
| shortSummary | String? | One-sentence summary |
| detailedSummary | String? | Full analysis text |
| keyPoints | Json? | Array of key points |
| risks | Json? | Array of risks |
| suggestedActions | Json? | Array of actions |
| keywords | Json? | Array of keywords |
| documentType | String? | Detected type |
| tone | String? | Document tone |
| confidenceScore | Float? | AI confidence (0-1) |
| suggestedQuestions | Json? | Array of questions |

### ChatMessage
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| documentId | String | Document reference |
| userId | String | Author reference |
| role | USER \| ASSISTANT | Message sender |
| content | String | Message text |

### Usage
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| userId | String | User reference |
| month | Int | Month number |
| year | Int | Year |
| documentsAnalyzed | Int | Monthly count |

## API Reference

### Auth
- `POST /api/auth/register` — Create account (`{ name, email, password }`)
- `POST /api/auth/login` — Sign in (`{ email, password }`)
- `GET /api/auth/me` — Get current user
- `PATCH /api/auth/me` — Update profile (`{ name }`)
- `POST /api/auth/logout` — Clear session

### Documents
- `GET /api/documents` — List documents (`?search=&type=&status=&sort=`)
- `POST /api/documents/upload` — Upload document (multipart/form-data)
- `GET /api/documents/[id]` — Get document with analysis
- `DELETE /api/documents/[id]` — Delete document
- `GET /api/documents/[id]/export` — Download analysis as Markdown
- `GET /api/documents/[id]/chat` — Get chat messages
- `POST /api/documents/[id]/chat` — Send message (`{ message }`)

### Dashboard
- `GET /api/dashboard` — User dashboard stats

### Billing
- `POST /api/billing/checkout` — Create Stripe checkout (`{ priceId }`)
- `POST /api/billing/portal` — Open Stripe customer portal
- `POST /api/webhooks/stripe` — Stripe webhook handler

### Admin
- `GET /api/admin` — Platform analytics

## Environment Variables

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/clariodocs?schema=public"

# JWT Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-key-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI API Key (https://platform.openai.com/api-keys)
OPENAI_API_KEY="sk-..."

# Stripe Keys (https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Price IDs (create products in Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID="price_..."

# Optional
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=10
```

## Installation

### Prerequisites
- Node.js 18+ (recommended: 20+)
- PostgreSQL database (local or Neon/Supabase)
- OpenAI API key
- Stripe account (test mode)

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/clariodocs.git
cd clariodocs

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your values
```

### Database Setup

```bash
# Push the schema to your database
npm run db:push

# Seed with demo data
npm run db:seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Stripe Setup

1. Create a [Stripe account](https://dashboard.stripe.com/register) (use test mode)
2. Go to Stripe Dashboard → Products → Add Product
3. Create two subscription products:
   - **Pro** — $29/month (recurring)
   - **Business** — $99/month (recurring)
4. Copy the price IDs to your `.env.local`
5. For local webhook testing:
   ```bash
   # Install Stripe CLI and run:
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
6. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## OpenAI Setup

1. Create an [OpenAI account](https://platform.openai.com/)
2. Navigate to API keys → Create new secret key
3. Add credits to your account (at least $5)
4. Copy the key to `OPENAI_API_KEY` in `.env.local`

## Demo Accounts

After seeding the database:

| Role | Email | Password | Plan |
|------|-------|----------|------|
| Demo User | demo@clariodocs.com | demo1234 | FREE (4/5 documents used) |
| Admin | admin@clariodocs.com | admin1234 | BUSINESS |

Use the one-click demo buttons on the login page to try the app instantly.

## Deployment

### Vercel + Neon (Recommended)

1. Push code to GitHub
2. Create a [Vercel](https://vercel.com) account and import the repo
3. Create a [Neon](https://neon.tech) PostgreSQL database
4. Add all environment variables in Vercel dashboard
5. Deploy
6. Set up Stripe webhook endpoint → `https://yourdomain.com/api/webhooks/stripe`

### Docker (Alternative)

```bash
docker build -t clariodocs .
docker run -p 3000:3000 --env-file .env.local clariodocs
```

## Project Structure

```
clariodocs/
├── prisma/
│   ├── schema.prisma          # Database models & enums
│   ├── seed.ts                # Demo data seeder
│   └── prisma.config.ts       # Prisma configuration
├── public/
│   └── favicon.ico
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── providers.tsx      # Auth + Toast providers
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # User dashboard
│   │   ├── documents/         # Documents CRUD
│   │   │   ├── page.tsx       # Document list
│   │   │   ├── upload/        # Upload page
│   │   │   └── [id]/          # Document detail + chat
│   │   ├── how-it-works/      # How It Works page
│   │   ├── pricing/           # Pricing + Stripe
│   │   ├── settings/          # User settings
│   │   ├── admin/             # Admin panel
│   │   └── api/               # API routes
│   │       ├── auth/          # Login, register, me, logout
│   │       ├── documents/     # CRUD, upload, chat, export
│   │       ├── dashboard/     # Dashboard stats
│   │       ├── billing/       # Checkout, portal
│   │       ├── webhooks/      # Stripe webhooks
│   │       └── admin/         # Admin stats
│   ├── components/
│   │   ├── ui/                # shadcn UI components
│   │   └── layout/            # App layout + sidebar
│   ├── lib/
│   │   ├── auth.ts            # JWT + password utilities
│   │   ├── auth-context.tsx   # React auth context
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── openai.ts          # OpenAI integration
│   │   ├── stripe.ts          # Stripe client
│   │   ├── usage.ts           # Usage limit tracking
│   │   ├── documents.ts       # File handling utilities
│   │   └── utils.ts           # cn() helper
│   ├── types/
│   │   └── index.ts           # Shared types & constants
│   └── middleware.ts           # Auth guard middleware
├── .env.example
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Portfolio Notes

This project demonstrates:

- **Full-stack SaaS architecture** — Next.js 16 with API routes, middleware, database, auth
- **Payment integration** — Stripe subscriptions with webhooks and customer portal
- **AI integration** — OpenAI API with structured JSON responses
- **Modern UI** — Tailwind CSS v4, shadcn/ui with Base UI, dark theme, responsive design
- **TypeScript** — Full type safety throughout
- **Database design** — Prisma ORM with PostgreSQL, migrations, seed data
- **Security** — JWT auth, bcrypt password hashing, route protection, file validation
- **DevOps ready** — Environment-based config, Vercel/Neon deployment ready

## Known Limitations

- **File type support:** PDF and TXT are fully supported. DOC/DOCX support is planned but not yet implemented.
- **Export:** Markdown export is supported. PDF export is planned.
- **Storage:** Local file storage is used in development. For production, migrate to S3, Cloudflare R2, or UploadThing.
- **Password change:** Not yet implemented in settings.
- **Email notifications:** Not yet implemented (Resend integration planned).
- **Team workspaces:** Not yet implemented.
- **Light mode:** Dark mode only (light mode planned).

## Future Improvements

- Cloudflare R2 or S3 storage for production file handling
- Team workspaces with shared documents
- PDF export with formatting
- DOC/DOCX text extraction
- Email notifications via Resend
- Advanced semantic search over all documents
- Organization billing and admin controls
- Light mode theme support

## License

MIT

---

Built with [Next.js](https://nextjs.org) · [Prisma](https://prisma.io) · [Tailwind CSS](https://tailwindcss.com) · [shadcn/ui](https://ui.shadcn.com) · [OpenAI](https://openai.com) · [Stripe](https://stripe.com) · [Recharts](https://recharts.org)
