import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || undefined
  const type = searchParams.get("type") || undefined
  const status = searchParams.get("status") || undefined
  const sort = searchParams.get("sort") || "newest"

  const where: any = { userId: user.id }

  if (search) {
    where.originalName = { contains: search, mode: "insensitive" }
  }

  if (type) {
    where.fileType = type
  }

  if (status) {
    where.status = status
  }

  const documents = await prisma.document.findMany({
    where,
    orderBy: sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" },
    include: {
      analysis: {
        select: { documentType: true, shortSummary: true },
      },
    },
  })

  return NextResponse.json({ documents })
}
