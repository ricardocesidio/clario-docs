"use client"

import Link from "next/link"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Upload,
  FileText,
  Brain,
  MessageSquare,
  LayoutDashboard,
  Download,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "1. Upload Your Document",
    description: "Drag and drop any PDF or text file. We accept contracts, invoices, reports, resumes, and more.",
    details: [
      "Supported formats: PDF, TXT",
      "Max file size: 10MB (up to 50MB on Business plan)",
      "Files are encrypted in transit and at rest",
      "You control access and can delete anytime",
    ],
  },
  {
    icon: FileText,
    title: "2. Text Extraction",
    description: "Our system securely extracts the text content from your document for AI processing.",
    details: [
      "PDF text extraction with layout preservation",
      "Plain text file parsing",
      "Structured content preparation",
      "No raw data is stored longer than necessary",
    ],
  },
  {
    icon: Brain,
    title: "3. AI Analysis",
    description: "OpenAI-powered analysis generates structured insights from your document content.",
    details: [
      "Short and detailed summaries",
      "Key point extraction",
      "Risk and alert identification",
      "Suggested actions and recommendations",
      "Keyword and topic detection",
      "Document type classification",
    ],
  },
  {
    icon: MessageSquare,
    title: "4. Review & Chat",
    description: "Explore the analysis and ask questions about your document. Get instant AI-powered answers.",
    details: [
      "Structured analysis view with sections",
      "Suggested questions to get started",
      "Natural language chat interface",
      "Context-aware answers based on document content",
    ],
  },
  {
    icon: LayoutDashboard,
    title: "5. Manage Everything",
    description: "All your documents and analyses are organized in your dashboard.",
    details: [
      "View document history and stats",
      "Track monthly usage and limits",
      "Search and filter documents",
      "Export analysis as Markdown",
    ],
  },
  {
    icon: Sparkles,
    title: "6. Upgrade & Scale",
    description: "Choose the plan that fits your needs. From free to business, scale as you grow.",
    details: [
      "Free: 5 documents per month",
      "Pro: 100 documents per month",
      "Business: 500 documents per month",
      "Higher limits, priority processing, and more",
    ],
  },
]

export default function HowItWorksPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">How ClarioDocs Works</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From upload to insights in minutes. Here&apos;s how the platform works step by step.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <Card key={step.title} className="border-border">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                  <ul className="space-y-1.5">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center pt-4">
          <p className="text-muted-foreground mb-4">Ready to analyze your first document?</p>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white border-0">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
