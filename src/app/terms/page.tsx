"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function TermsPage() {
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

        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <Card className="border-border mb-6">
          <CardContent className="p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p><strong className="text-foreground">Last updated:</strong> January 2025</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">1. Acceptance of Terms</h2>
            <p>By accessing or using ClarioDocs, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">2. Description of Service</h2>
            <p>ClarioDocs is an AI-powered document analysis platform. Users can upload documents for automated AI analysis, including text extraction, summarization, risk identification, and question answering.</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate information when creating an account.</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">4. Acceptable Use</h2>
            <p>You agree not to upload illegal content, malicious files, or attempt to disrupt the service. We reserve the right to terminate accounts that violate these terms.</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">5. Subscriptions and Payments</h2>
            <p>Paid plans are billed monthly via Stripe. You can cancel anytime through the customer portal. Refunds are handled per Stripe's policies.</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">6. Limitation of Liability</h2>
            <p>ClarioDocs is provided "as is" without warranties. AI analysis may contain errors and should not be the sole basis for important decisions. We are not liable for damages arising from use of the service.</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">7. Changes to Terms</h2>
            <p>We may update these terms at any time. Continued use after changes constitutes acceptance of the new terms.</p>

            <h2 className="text-lg font-semibold text-foreground pt-4">8. Contact</h2>
            <p>For questions about these terms, contact legal@clariodocs.com.</p>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-primary hover:underline">Back to home</Link>
        </div>
      </div>
    </div>
  )
}
