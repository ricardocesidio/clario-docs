import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      )
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const stripeClient = stripe()
    let stripeCustomerId = fullUser.stripeCustomerId

    if (!stripeCustomerId) {
      const customer = await stripeClient.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      })
      stripeCustomerId = customer.id
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      })
    }

    const session = await stripeClient.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.headers.get("origin")}/dashboard?checkout=success`,
      cancel_url: `${request.headers.get("origin")}/pricing?checkout=canceled`,
      metadata: { userId: user.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
