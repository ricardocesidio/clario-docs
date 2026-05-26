import Stripe from "stripe"

export const PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || ""
export const BUSINESS_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID || ""

let _stripe: Stripe | null = null

export function stripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY || ""
    if (!key || key === "sk_test_placeholder") {
      throw new Error(
        "Stripe secret key not configured. Set STRIPE_SECRET_KEY in your environment variables."
      )
    }
    _stripe = new Stripe(key, {
      apiVersion: "2025-03-31.basel" as any,
    })
  }
  return _stripe
}
