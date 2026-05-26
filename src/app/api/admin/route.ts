import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const totalUsers = await prisma.user.count()
  const totalDocuments = await prisma.document.count()
  const totalAnalyses = await prisma.analysis.count()
  const activeSubscriptions = await prisma.user.count({
    where: { subscriptionStatus: "ACTIVE" },
  })

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      createdAt: true,
    },
  })

  const recentDocuments = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: { select: { email: true } },
    },
  })

  const usersByPlanRaw = await prisma.user.groupBy({
    by: ["plan"],
    _count: true,
  })
  const usersByPlan = usersByPlanRaw.map((u) => ({
    plan: u.plan,
    count: u._count,
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
      createdAt: {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      },
    },
    select: { createdAt: true },
  })

  recentDocs.forEach((doc) => {
    const key = doc.createdAt.toISOString().split("T")[0]
    if (dayCount[key] !== undefined) dayCount[key]++
  })

  const documentsByDay = Object.entries(dayCount).map(([date, count]) => ({
    date,
    count,
  }))

  return NextResponse.json({
    totalUsers,
    totalDocuments,
    totalAnalyses,
    activeSubscriptions,
    recentUsers,
    recentDocuments,
    usersByPlan,
    documentsByDay,
  })
}
