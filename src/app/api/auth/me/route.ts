import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return NextResponse.json({ user })
}

export async function PATCH(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data: any = {}

    if (body.name !== undefined) {
      data.name = body.name
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        subscriptionStatus: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
