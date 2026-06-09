import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { chatWithDocument } from "@/lib/openai"

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
  })

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  const messages = await prisma.chatMessage.findMany({
    where: { documentId: id },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({ messages })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { message } = await request.json()

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  const document = await prisma.document.findFirst({
    where: { id, userId: user.id },
  })

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  if (!document.extractedText) {
    return NextResponse.json(
      { error: "Document has no extracted text" },
      { status: 400 }
    )
  }

  await prisma.chatMessage.create({
    data: {
      documentId: id,
      userId: user.id,
      role: "USER",
      content: message,
    },
  })

  const history = await prisma.chatMessage.findMany({
    where: { documentId: id },
    orderBy: { createdAt: "asc" },
    take: 20,
  })

  const chatHistory = history
    .filter((m) => m.role !== "ASSISTANT" || m.content !== message)
    .map((m) => ({
      role: m.role.toLowerCase() as "user" | "assistant",
      content: m.content,
    }))

  try {
    const response = await chatWithDocument(
      document.extractedText,
      message,
      chatHistory
    )

    const assistantMessage = await prisma.chatMessage.create({
      data: {
        documentId: id,
        userId: user.id,
        role: "ASSISTANT",
        content: response.content,
      },
    })

    return NextResponse.json({ message: assistantMessage, source: response.source })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    )
  }
}
