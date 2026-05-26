import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL || ""
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPassword = await bcrypt.hash("admin1234", 12)
  const demoPassword = await bcrypt.hash("demo1234", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@clariodocs.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@clariodocs.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      plan: "BUSINESS",
    },
  })

  const demo = await prisma.user.upsert({
    where: { email: "demo@clariodocs.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@clariodocs.com",
      passwordHash: demoPassword,
      role: "USER",
      plan: "FREE",
    },
  })

  console.log("Seed users created:")
  console.log(`  Admin: admin@clariodocs.com / admin1234`)
  console.log(`  Demo:  demo@clariodocs.com / demo1234`)

  const docs = [
    {
      originalName: "Software Development Contract.pdf",
      fileType: "application/pdf",
      fileSize: 245000,
      content: `SOFTWARE DEVELOPMENT SERVICES AGREEMENT

This Agreement is entered into on January 15, 2025, between TechCorp Solutions ("Client") and DevStudio Inc. ("Developer").

1. SERVICES: Developer shall provide software development services including frontend and backend development for the Client's e-commerce platform.

2. COMPENSATION: Client shall pay Developer $150,000 per year, payable monthly at $12,500.

3. TERM: This Agreement shall commence on February 1, 2025 and continue for twelve (12) months.

4. INTELLECTUAL PROPERTY: All work product created by Developer shall be owned by Client upon full payment.

5. CONFIDENTIALITY: Developer shall maintain confidentiality of Client's proprietary information for three (3) years after termination.

6. TERMINATION: Either party may terminate with 30 days written notice. Client may terminate for cause immediately if Developer breaches confidentiality.

7. LIMITATION OF LIABILITY: Developer's liability shall not exceed the total compensation paid.

8. NON-COMPETE: Developer shall not work with Client's direct competitors for six (6) months after termination.

RISK FACTORS: The non-compete clause may be overly restrictive. The IP clause should specify pre-existing materials. No SLA or uptime guarantees are defined.`,
    },
    {
      originalName: "Q4 Financial Report 2024.pdf",
      fileType: "application/pdf",
      fileSize: 520000,
      content: `Q4 2024 FINANCIAL REPORT - Acme Corporation

Executive Summary: Acme Corporation achieved revenue of $12.5M in Q4 2024, representing 18% growth YoY. Net profit reached $2.1M with a 16.8% margin.

Key Metrics:
- Total Revenue: $12,500,000
- Cost of Goods Sold: $5,200,000
- Gross Profit: $7,300,000 (58.4% margin)
- Operating Expenses: $4,100,000
- Net Income: $2,100,000
- EBITDA: $3,200,000
- Cash on Hand: $8,400,000
- AR: $2,100,000
- AP: $1,300,000

Revenue Breakdown:
- Product Sales: $8,200,000 (65.6%)
- Services: $2,800,000 (22.4%)
- Licensing: $1,500,000 (12.0%)

Year-over-Year Comparison:
- 2023 Q4 Revenue: $10,600,000
- 2024 Q4 Revenue: $12,500,000
- Growth: 18%

Risks & Concerns:
- Operating expenses increased 22% due to new hires
- AR days increased from 32 to 45
- Supply chain costs up 15%

Recommendations:
- Implement AR reduction strategies
- Review operating expense growth
- Explore new revenue streams in APAC market`,
    },
    {
      originalName: "Invoice-2024-0891.pdf",
      fileType: "application/pdf",
      fileSize: 185000,
      content: `INVOICE #INV-2024-0891

From: DesignPro Agency
To: WebStore Inc.

Date: December 15, 2024
Due Date: January 14, 2025

Description:
- Website Redesign Package: $15,000
- SEO Optimization Service: $3,500
- Monthly Maintenance (Dec): $2,000
- Content Creation (12 articles): $4,800

Subtotal: $25,300
Discount (Early Payment 5%): -$1,265
Tax (8.5%): $2,025.50

Total Due: $26,060.50

Payment Terms: Net 30
Payment Methods: Bank Transfer, Credit Card, PayPal

Bank Details:
Bank: First National Bank
Account: 4839201749
Routing: 021000021

Notes: Late payments subject to 1.5% monthly interest.`,
    },
    {
      originalName: "Frontend Developer Resume.pdf",
      fileType: "application/pdf",
      fileSize: 125000,
      content: `JOHN DOE - FRONTEND DEVELOPER

Email: john.doe@email.com | Phone: (555) 123-4567 | Location: San Francisco, CA

SUMMARY: Senior Frontend Engineer with 5 years of experience building responsive web applications using React, TypeScript, and Next.js.

EXPERIENCE:

Senior Frontend Developer - TechStart Inc. (2021-Present)
- Led migration from JavaScript to TypeScript, reducing bugs by 40%
- Built component library used by 3 product teams
- Improved Core Web Vitals scores by 35%
- Mentored 4 junior developers

Frontend Developer - WebAgency Co. (2019-2021)
- Developed 12+ client websites using React and Next.js
- Implemented CI/CD pipelines with GitHub Actions
- Reduced page load times by 50% through optimization

EDUCATION:
B.S. Computer Science - UC Berkeley (2015-2019)

SKILLS: React, TypeScript, Next.js, Tailwind CSS, GraphQL, Jest, Cypress, Docker, AWS, Figma

ACHIEVEMENTS:
- Open source contributor to React ecosystem
- Speaker at ReactConf 2023
- Published 3 articles on web performance`,
    },
  ]

  for (const docData of docs) {
    const doc = await prisma.document.create({
      data: {
        userId: demo.id,
        fileName: docData.originalName.replace(/\s+/g, "-").toLowerCase(),
        originalName: docData.originalName,
        fileType: docData.fileType,
        fileSize: docData.fileSize,
        storagePath: `seed/${docData.originalName}`,
        extractedText: docData.content,
        status: "COMPLETED",
      },
    })

    const analysis = await prisma.analysis.create({
      data: {
        documentId: doc.id,
        shortSummary: getSummary(docData.originalName),
        detailedSummary: getDetailedSummary(docData.originalName),
        keyPoints: getKeyPoints(docData.originalName),
        risks: getRisks(docData.originalName),
        suggestedActions: getActions(docData.originalName),
        keywords: getKeywords(docData.originalName),
        documentType: getDocType(docData.originalName),
        tone: "formal",
        confidenceScore: 0.92,
        suggestedQuestions: getSuggestedQuestions(docData.originalName),
      },
    })

    console.log(`  Created document: ${docData.originalName} with analysis`)
  }

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  await prisma.usage.upsert({
    where: {
      userId_month_year: { userId: demo.id, month: currentMonth, year: currentYear },
    },
    update: { documentsAnalyzed: 4 },
    create: {
      userId: demo.id,
      month: currentMonth,
      year: currentYear,
      documentsAnalyzed: 4,
    },
  })

  console.log("Seed completed successfully!")
}

function getSummary(name: string): string {
  if (name.includes("Contract")) return "Software development agreement between TechCorp and DevStudio with IP and non-compete clauses."
  if (name.includes("Financial")) return "Acme Corporation achieved 18% revenue growth in Q4 2024 with strong profitability metrics."
  if (name.includes("Invoice")) return "Invoice from DesignPro Agency to WebStore Inc. totaling $26,060.50 for web design services."
  if (name.includes("Resume")) return "Senior Frontend Engineer with 5 years React/TypeScript experience seeking new opportunities."
  return "Document analysis summary."
}

function getDetailedSummary(name: string): string {
  if (name.includes("Contract")) return "This is a 12-month software development services agreement between TechCorp Solutions and DevStudio Inc. valued at $150,000 annually. The contract covers development services for an e-commerce platform and includes standard IP assignment, confidentiality, and non-compete provisions. Key financial terms include monthly payments of $12,500 with a liability cap equal to total compensation."
  if (name.includes("Financial")) return "Acme Corporation's Q4 2024 report shows strong financial performance with $12.5M revenue (18% YoY growth) and $2.1M net profit. The company maintains healthy gross margins at 58.4% with $8.4M cash reserves. However, operating expenses grew 22% and accounts receivable days increased, which warrant attention."
  if (name.includes("Invoice")) return "DesignPro Agency has issued invoice INV-2024-0891 to WebStore Inc. for $26,060.50, covering website redesign, SEO, monthly maintenance, and content creation services. An early payment discount of 5% is offered, with net 30 payment terms and 1.5% monthly interest on late payments."
  if (name.includes("Resume")) return "John Doe is a Senior Frontend Engineer with 5 years of professional experience. He has a strong track record in TypeScript migration, component library development, and web performance optimization. Technical skills span React, Next.js, TypeScript, and modern frontend tooling."
  return "Detailed analysis of the document content."
}

function getKeyPoints(name: string): string[] {
  if (name.includes("Contract")) return ["12-month agreement valued at $150,000/year", "IP ownership transfers upon full payment", "30-day termination notice required", "Non-compete clause for 6 months post-termination", "Confidentiality obligation for 3 years", "No SLA or uptime guarantees defined"]
  if (name.includes("Financial")) return ["Revenue grew 18% YoY to $12.5M", "Net profit margin of 16.8%", "$8.4M cash on hand", "Operating expenses increased 22%", "AR days increased from 32 to 45"]
  if (name.includes("Invoice")) return ["Total amount due: $26,060.50", "Net 30 payment terms", "5% early payment discount available", "Services include redesign, SEO, maintenance", "1.5% monthly late payment interest"]
  if (name.includes("Resume")) return ["5 years frontend development experience", "Led TypeScript migration reducing bugs by 40%", "Improved Core Web Vitals by 35%", "Mentored 4 junior developers", "Open source contributor and conference speaker"]
  return ["Key point 1", "Key point 2"]
}

function getRisks(name: string): string[] {
  if (name.includes("Contract")) return ["Non-compete clause may be overly restrictive", "IP clause unclear about pre-existing materials", "No service level agreement defined", "No uptime or performance guarantees"]
  if (name.includes("Financial")) return ["Operating expenses growing faster than revenue", "AR days increasing indicates collection issues", "Supply chain costs up 15%", "No mention of cash flow projections"]
  if (name.includes("Invoice")) return ["Late payment penalty of 1.5% monthly is significant", "No late payment grace period specified"]
  if (name.includes("Resume")) return ["No end date for current position - still employed?", "Employment gaps not explained", "No formal portfolio or GitHub link provided"]
  return []
}

function getActions(name: string): string[] {
  if (name.includes("Contract")) return ["Review non-compete clause with legal counsel", "Clarify pre-existing IP exclusion", "Add SLA and uptime guarantees", "Specify acceptance testing criteria"]
  if (name.includes("Financial")) return ["Implement AR reduction strategies", "Review operating expense growth trajectory", "Explore APAC market expansion", "Consider supply chain diversification"]
  if (name.includes("Invoice")) return ["Schedule payment before due date", "Consider early payment for discount", "Verify all services were delivered as specified"]
  if (name.includes("Resume")) return ["Request portfolio and GitHub links", "Clarify availability and notice period", "Verify technical skills through technical interview", "Check references from TechStart Inc."]
  return []
}

function getKeywords(name: string): string[] {
  if (name.includes("Contract")) return ["software development", "agreement", "IP rights", "confidentiality", "non-compete", "liability", "termination"]
  if (name.includes("Financial")) return ["revenue", "profit", "EBITDA", "financial report", "growth", "Q4 2024", "metrics"]
  if (name.includes("Invoice")) return ["invoice", "payment", "net 30", "web design", "SEO", "maintenance", "discount"]
  if (name.includes("Resume")) return ["frontend", "React", "TypeScript", "Next.js", "web performance", "senior engineer", "portfolio"]
  return []
}

function getDocType(name: string): string {
  if (name.includes("Contract")) return "Contract"
  if (name.includes("Financial")) return "Financial Report"
  if (name.includes("Invoice")) return "Invoice"
  if (name.includes("Resume")) return "Resume/CV"
  return "Document"
}

function getSuggestedQuestions(name: string): string[] {
  if (name.includes("Contract")) return [
    "What are the key risks in this contract?",
    "Summarize the payment terms",
    "What happens if we terminate early?",
    "Are there any non-compete clauses?",
    "What are the IP ownership terms?",
  ]
  if (name.includes("Financial")) return [
    "What is the revenue growth rate?",
    "Summarize key financial metrics",
    "What are the main risk factors?",
    "How does this quarter compare to last year?",
    "What are the recommended actions?",
  ]
  if (name.includes("Invoice")) return [
    "What is the total amount due?",
    "When is the payment deadline?",
    "Are there any discounts available?",
    "What services were provided?",
    "What are the payment terms?",
  ]
  if (name.includes("Resume")) return [
    "What are the candidate's top skills?",
    "Summarize their work experience",
    "Is this candidate a good fit for a senior role?",
    "What are their key achievements?",
    "Are there any gaps in employment?",
  ]
  return [
    "Summarize this document",
    "What are the key points?",
    "What actions should I take?",
  ]
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
