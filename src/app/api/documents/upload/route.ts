import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { checkUsageLimit, incrementUsage } from "@/lib/usage"
import { analyzeDocument } from "@/lib/openai"
import {
  saveDocumentFile,
  generateFileName,
  extractTextFromFile,
  isAllowedFileType,
} from "@/lib/documents"

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!isAllowedFileType(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and TXT files are allowed." },
        { status: 400 }
      )
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      )
    }

    const limitCheck = await checkUsageLimit(user.id)
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: limitCheck.reason,
          usageLimit: true,
          current: limitCheck.current,
          limit: limitCheck.limit,
        },
        { status: 403 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = generateFileName(file.name)
    await saveDocumentFile(fileName, buffer)

    const document = await prisma.document.create({
      data: {
        userId: user.id,
        fileName,
        originalName: file.name,
        fileType: file.type,
        fileSize: file.size,
        storagePath: fileName,
        status: "PROCESSING",
      },
    })

    const extractedText = await extractTextFromFile(fileName, file.type)

    await prisma.document.update({
      where: { id: document.id },
      data: { extractedText, status: "PROCESSING" },
    })

    try {
      const { source, ...analysis } = await analyzeDocument(extractedText)

      await prisma.analysis.create({
        data: {
          documentId: document.id,
          shortSummary: analysis.shortSummary,
          detailedSummary: analysis.detailedSummary,
          keyPoints: analysis.keyPoints,
          risks: analysis.risks,
          suggestedActions: analysis.suggestedActions,
          keywords: analysis.keywords,
          documentType: analysis.documentType,
          tone: analysis.tone,
          confidenceScore: analysis.confidenceScore,
          suggestedQuestions: analysis.suggestedQuestions,
          source,
        },
      })

      await prisma.document.update({
        where: { id: document.id },
        data: { status: "COMPLETED" },
      })

      await incrementUsage(user.id)
    } catch (aiError) {
      console.error("AI analysis failed:", aiError)
      await prisma.document.update({
        where: { id: document.id },
        data: { status: "FAILED" },
      })
    }

    const updated = await prisma.document.findUnique({
      where: { id: document.id },
      include: { analysis: true },
    })

    return NextResponse.json({ document: updated })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
