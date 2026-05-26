"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with basic document analysis",
    features: [
      "5 documents per month",
      "Basic AI summaries",
      "Document chat",
      "10MB file limit",
    ],
    cta: "Current Plan",
    priceId: null,
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Best for professionals and power users",
    features: [
      "100 documents per month",
      "Advanced AI analysis",
      "Unlimited document chat",
      "Export to Markdown & PDF",
      "Priority processing",
      "25MB file limit",
    ],
    cta: "Upgrade to Pro",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
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
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
    featured: false,
  },
]

export default function PricingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (priceId: string, planName: string) => {
    if (!user) {
      router.push("/register")
      return
    }

    if (user.plan === planName.toUpperCase()) {
      toast.info("You are already on this plan")
      return
    }

    setLoading(planName)
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed")
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground">Choose the plan that fits your needs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = user?.plan === plan.name.toUpperCase()

          return (
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

              <Button
                className={`w-full ${
                  plan.featured && !isCurrentPlan
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white border-0"
                    : ""
                }`}
                variant={isCurrentPlan ? "outline" : plan.featured ? "default" : "outline"}
                disabled={isCurrentPlan || loading === plan.name}
                onClick={() => {
                  if (plan.priceId) {
                    handleCheckout(plan.priceId, plan.name)
                  } else {
                    // Free plan - already on it or go to register
                    if (!user) router.push("/register")
                  }
                }}
              >
                {loading === plan.name ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isCurrentPlan ? "Current Plan" : plan.cta}
              </Button>
            </div>
          )
        })}
      </div>

      {!user && (
        <Card className="max-w-lg mx-auto border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Create an account to get started with the Free plan
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
