"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Check,
  FileText,
  Brain,
  Shield,
  Zap,
  BarChart3,
  MessageSquare,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Upload,
  Search,
  Download,
  TrendingUp,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced AI extracts summaries, risks, key points, and insights from any document automatically.",
  },
  {
    icon: MessageSquare,
    title: "Chat With Documents",
    description: "Ask questions about your documents and get intelligent answers based on the content.",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Upload a PDF or text file and get a structured analysis in seconds.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your documents are encrypted and processed securely. You control access.",
  },
  {
    icon: BarChart3,
    title: "Smart Dashboard",
    description: "Track your document history, usage, and insights from a single dashboard.",
  },
  {
    icon: Download,
    title: "Export & Share",
    description: "Export analysis as Markdown or PDF. Share insights with your team.",
  },
]

const steps = [
  {
    icon: Upload,
    title: "Upload Your Document",
    description: "Drag and drop any PDF or text file. Supports contracts, reports, invoices, and more.",
  },
  {
    icon: Brain,
    title: "AI Analyzes Content",
    description: "Our AI extracts text, identifies document type, and generates structured insights.",
  },
  {
    icon: FileText,
    title: "Get Structured Insights",
    description: "Receive summaries, risks, key points, suggested actions, and more.",
  },
  {
    icon: MessageSquare,
    title: "Ask Questions",
    description: "Chat with your document. Get answers, clarifications, and deeper understanding.",
  },
]

const useCases = [
  {
    title: "Contract Risk Analysis",
    description: "Analyze contracts, identify risky clauses, and get actionable legal insights instantly.",
    icon: Shield,
  },
  {
    title: "Invoice Extraction",
    description: "Extract key financial data, payment terms, amounts, and due dates from invoices automatically.",
    icon: BarChart3,
  },
  {
    title: "Resume Screening",
    description: "Screen candidates faster. Get skill analysis, experience summaries, and role fit assessment.",
    icon: Search,
  },
  {
    title: "Business Reports",
    description: "Parse quarterly reports, extract KPIs, identify trends, and generate executive summaries.",
    icon: TrendingUp,
  },
  {
    title: "Academic Papers",
    description: "Summarize research papers, extract methodologies, findings, and key citations instantly.",
    icon: FileText,
  },
  {
    title: "Internal Documents",
    description: "Analyze internal memos, policies, and documentation. Keep your team aligned and informed.",
    icon: FileText,
  },
]

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "5 documents per month",
      "Basic AI summaries",
      "Document chat",
      "10MB file limit",
    ],
    cta: "Get Started",
    href: "/register",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Best for professionals",
    features: [
      "100 documents per month",
      "Advanced AI analysis",
      "Unlimited document chat",
      "Export to Markdown & PDF",
      "Priority processing",
      "25MB file limit",
    ],
    cta: "Upgrade to Pro",
    href: "/pricing",
    featured: true,
  },
  {
    name: "Business",
    price: "$99",
    period: "/month",
    description: "For teams and organizations",
    features: [
      "500 documents per month",
      "Advanced AI insights",
      "Unlimited document chat",
      "Export & sharing",
      "Priority support",
      "50MB file limit",
      "Team collaboration",
    ],
    cta: "Upgrade to Business",
    href: "/pricing",
    featured: false,
  },
]

const faqs = [
  {
    question: "What types of documents can I analyze?",
    answer: "ClarioDocs supports PDF and text files. This includes contracts, reports, invoices, resumes, technical documentation, articles, and more.",
  },
  {
    question: "How accurate is the AI analysis?",
    answer: "Our AI provides highly accurate analysis with confidence scoring. For best results, ensure your documents have clear, extractable text.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. Documents are encrypted in transit and at rest. We never share your data with third parties. You can delete your documents at any time.",
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel anytime through your Stripe customer portal. Your plan will remain active until the end of the billing period.",
  },
  {
    question: "What happens when I reach my document limit?",
    answer: "You'll receive a notification and can upgrade to a higher tier plan or wait until your monthly limit resets.",
  },
  {
    question: "Can I export my analysis?",
    answer: "Pro and Business plans support exporting analysis as Markdown or PDF for sharing and documentation.",
  },
]

export default function LandingPage() {
  const { user } = useAuth()
  const [mobileMenu, setMobileMenu] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold">ClarioDocs</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Log in</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white border-0">
                      Start Free
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 cursor-pointer">
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-border bg-background p-4 space-y-3">
            <Link href="#features" onClick={() => setMobileMenu(false)} className="block text-sm text-muted-foreground hover:text-foreground">Features</Link>
            <Link href="#pricing" onClick={() => setMobileMenu(false)} className="block text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
            <Link href="#faq" onClick={() => setMobileMenu(false)} className="block text-sm text-muted-foreground hover:text-foreground">FAQ</Link>
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <Link href="/dashboard"><Button className="w-full">Dashboard</Button></Link>
              ) : (
                <>
                  <Link href="/login"><Button variant="outline" className="w-full">Log in</Button></Link>
                  <Link href="/register"><Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white border-0">Start Free</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm bg-primary/5 border-primary/20 text-primary">
            AI-Powered Document Analysis Platform
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Upload Documents.
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              Get Summaries, Risks & Insights Instantly.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload any document — contracts, reports, invoices, resumes. Our AI extracts text, generates structured summaries, identifies risks, suggests actions, and answers your questions. No more manual reading.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? "/dashboard" : "/register"}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white border-0 text-base px-8 h-12">
                {user ? "Go to Dashboard" : "Start Free"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                See How It Works
              </Button>
            </Link>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="relative rounded-xl border border-border bg-gradient-to-b from-card to-background p-2 shadow-2xl">
              <div className="rounded-lg overflow-hidden bg-muted/50">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <div className="ml-4 text-xs text-muted-foreground">clariodocs.com — Document Analysis</div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="w-4 h-4 text-primary" /> Software Development Contract.pdf
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded w-3/4" />
                        <div className="h-2 bg-muted rounded w-1/2" />
                        <div className="h-2 bg-muted rounded w-2/3" />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {["contract", "legal", "IP rights", "confidentiality"].map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3 border-l border-border pl-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-muted-foreground">Risk Score:</span>
                        <span className="font-medium">Medium</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">Contract</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Non-compete clause may be overly restrictive. IP clause needs review.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need for Document Analysis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From upload to insights — a complete platform for understanding your documents.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four simple steps from upload to deep document understanding.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="text-center">
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-500/20 border border-primary/20 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Use Cases</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From legal to finance — ClarioDocs helps you understand any document.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase) => {
              const Icon = useCase.icon
              return (
                <div
                  key={useCase.title}
                  className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you need more. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-xl border ${
                  plan.featured
                    ? "border-primary bg-gradient-to-b from-primary/10 to-card shadow-xl shadow-primary/10"
                    : "border-border bg-card"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    className={`w-full ${
                      plan.featured
                        ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white border-0"
                        : ""
                    }`}
                    variant={plan.featured ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about ClarioDocs.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-border pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-border bg-gradient-to-b from-card/50 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Your Document Workflow?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who use ClarioDocs to analyze documents faster and make better decisions.
          </p>
          <Link href={user ? "/dashboard" : "/register"}>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white border-0 text-base px-8 h-12">
              {user ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium">ClarioDocs</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>&copy; {new Date().getFullYear()} ClarioDocs.</span>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">Powered by OpenAI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
