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
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!fullUser?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 400 }
      )
    }

    const stripeClient = stripe()
    const session = await stripeClient.billingPortal.sessions.create({
      customer: fullUser.stripeCustomerId,
      return_url: `${request.headers.get("origin")}/settings`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Portal error:", error)
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    )
  }
}
