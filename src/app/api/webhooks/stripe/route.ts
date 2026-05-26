import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature") || ""

  let event
  let stripeClient: ReturnType<typeof stripe>

  try {
    stripeClient = stripe()
    event = stripeClient.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )
  } catch (err) {
    console.error("Webhook verification failed:", err)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any
        const userId = session.metadata?.userId
        const subscriptionId = session.subscription
        const customerId = session.customer

        if (userId && subscriptionId) {
          const subscription = await stripeClient.subscriptions.retrieve(subscriptionId)
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)

          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              plan: plan as any,
              subscriptionStatus: "ACTIVE" as any,
            },
          })
        }
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as any
        const subscriptionId = invoice.subscription
        if (subscriptionId) {
          const subscription = await stripeClient.subscriptions.retrieve(subscriptionId)
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)

          await prisma.user.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
              plan: plan as any,
              subscriptionStatus: "ACTIVE" as any,
            },
          })
        }
        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any
        const status = subscription.status.toUpperCase()

        const dbStatus =
          status === "ACTIVE"
            ? "ACTIVE"
            : status === "CANCELED"
              ? "CANCELED"
              : status === "PAST_DUE"
                ? "PAST_DUE"
                : status === "TRIALING"
                  ? "TRIALING"
                  : "INACTIVE"

        const data: any = { subscriptionStatus: dbStatus as any }

        if (status === "canceled" || status === "unpaid" || status === "incomplete_expired") {
          data.plan = "FREE"
        }

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data,
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

function getPlanFromPriceId(priceId: string | undefined) {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) return "PRO"
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID) return "BUSINESS"
  return "FREE"
}
