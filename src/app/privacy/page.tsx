"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold">ClarioDocs</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <Card className="border-border mb-6">
          <CardContent className="p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p><strong className="text-foreground">Last updated:</strong> January 2025</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">1. Information We Collect</h2>
            <p>We collect information you provide when creating an account (name, email) and when uploading documents for analysis. Document content is processed temporarily and stored encrypted.</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">2. How We Use Your Information</h2>
            <p>Your information is used to provide and improve the document analysis service, process AI analysis via OpenAI API, manage subscriptions, and communicate with you about your account.</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">3. Data Security</h2>
            <p>Files are encrypted in transit (TLS) and at rest. We do not share your document content with third parties beyond the AI processing required for analysis. You can delete your documents at any time.</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">4. Third-Party Services</h2>
            <p>We use OpenAI for document analysis, Stripe for payment processing, and PostgreSQL for data storage. Each service has its own privacy policy and data processing agreements.</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">5. Data Retention</h2>
            <p>Account data is retained until you delete your account. Document content and analyses are retained until you delete them. Usage statistics are anonymized after 12 months.</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">6. Your Rights</h2>
            <p>You can access, update, export, or delete your data at any time through your account settings. Contact us for additional privacy requests.</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">7. Contact</h2>
            <p>For privacy inquiries, email privacy@clariodocs.com.</p>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-primary hover:underline">Back to home</Link>
        </div>
      </div>
    </div>
  )
}
