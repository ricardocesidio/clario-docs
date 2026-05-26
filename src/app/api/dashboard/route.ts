import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { getMonthlyUsage } from "@/lib/usage"

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const totalDocuments = await prisma.document.count({
    where: { userId: user.id },
  })

  const documentsThisMonth = await prisma.document.count({
    where: {
      userId: user.id,
      createdAt: { gte: startOfMonth },
    },
  })

  const recentDocuments = await prisma.document.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      analysis: {
        select: { documentType: true },
      },
    },
  })

  const allDocuments = await prisma.document.findMany({
    where: {
      userId: user.id,
      analysis: { isNot: null },
    },
    include: {
      analysis: { select: { documentType: true } },
    },
  })

  const typeCount: Record<string, number> = {}
  allDocuments.forEach((doc) => {
    const type = doc.analysis?.documentType || "Unknown"
    typeCount[type] = (typeCount[type] || 0) + 1
  })

  const documentsByType = Object.entries(typeCount).map(([name, value]) => ({
    name,
    value,
  }))

  const days = 14
  const dayCount: Record<string, number> = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split("T")[0]
    dayCount[key] = 0
  }

  const recentDocs = await prisma.document.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
      },
    },
    select: { createdAt: true },
  })

  recentDocs.forEach((doc) => {
    const key = doc.createdAt.toISOString().split("T")[0]
    if (dayCount[key] !== undefined) {
      dayCount[key]++
    }
  })

  const documentsByDay = Object.entries(dayCount).map(([date, count]) => ({
    date,
    count,
  }))

  const usage = await getMonthlyUsage(user.id)

  return NextResponse.json({
    totalDocuments,
    documentsThisMonth,
    plan: user.plan,
    planLimit: usage.limit,
    usagePercentage: usage.percentage,
    recentDocuments,
    documentsByType,
    documentsByDay,
  })
}
