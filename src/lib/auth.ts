import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

const JWT_SECRET = process.env.NEXTAUTH_SECRET
if (!JWT_SECRET) {
  throw new Error("NEXTAUTH_SECRET environment variable is required")
}
const JWT_SECRET_KEY: string = JWT_SECRET

export type JWTPayload = {
  userId: string
  email: string
  role: string
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "7d" })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as JWTPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7)
  }
  const token = request.cookies.get("token")?.value
  return token || null
}

export async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      subscriptionStatus: true,
      createdAt: true,
    },
  })

  return user
}

export function requireAuth(
  request: NextRequest,
  handler: (userId: string, user: any) => Promise<NextResponse>
): Promise<NextResponse> {
  return (async () => {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return handler(user.id, user)
  })()
}

export function requireAdmin(
  request: NextRequest,
  handler: (userId: string, user: any) => Promise<NextResponse>
): Promise<NextResponse> {
  return (async () => {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return handler(user.id, user)
  })()
}
