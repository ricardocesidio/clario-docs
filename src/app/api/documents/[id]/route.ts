import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { deleteDocumentFile } from "@/lib/documents"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const document = await prisma.document.findFirst({
    where: { id, userId: user.id },
    include: { analysis: true },
  })

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  return NextResponse.json({ document })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const document = await prisma.document.findFirst({
    where: { id, userId: user.id },
  })

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  deleteDocumentFile(document.storagePath)
  await prisma.document.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
