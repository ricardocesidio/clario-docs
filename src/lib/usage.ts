import { prisma } from "./prisma"
import { PLAN_LIMITS } from "@/types"

export async function getUsageRecord(userId: string) {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  let usage = await prisma.usage.findUnique({
    where: {
      userId_month_year: { userId, month, year },
    },
  })

  if (!usage) {
    usage = await prisma.usage.create({
      data: { userId, month, year, documentsAnalyzed: 0 },
    })
  }

  return usage
}

export async function incrementUsage(userId: string) {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const usage = await prisma.usage.upsert({
    where: {
      userId_month_year: { userId, month, year },
    },
    update: {
      documentsAnalyzed: { increment: 1 },
    },
    create: {
      userId,
      month,
      year,
      documentsAnalyzed: 1,
    },
  })

  return usage
}

export async function checkUsageLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  })

  if (!user) {
    return { allowed: false, reason: "User not found" }
  }

  const limit = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS]
  const usage = await getUsageRecord(userId)

  if (usage.documentsAnalyzed >= limit.documentsPerMonth) {
    return {
      allowed: false,
      reason: "Monthly document limit reached. Upgrade your plan to analyze more documents.",
      current: usage.documentsAnalyzed,
      limit: limit.documentsPerMonth,
    }
  }

  return {
    allowed: true,
    current: usage.documentsAnalyzed,
    limit: limit.documentsPerMonth,
  }
}

export async function getMonthlyUsage(userId: string) {
  const usage = await getUsageRecord(userId)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  })

  const limit = PLAN_LIMITS[(user?.plan || "FREE") as keyof typeof PLAN_LIMITS]

  return {
    current: usage.documentsAnalyzed,
    limit: limit.documentsPerMonth,
    percentage: Math.round((usage.documentsAnalyzed / limit.documentsPerMonth) * 100),
  }
}
