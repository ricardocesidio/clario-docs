import { prisma } from "./prisma"
import fs from "fs"
import path from "path"

function getUploadDir() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads")
}

export function ensureUploadDir() {
  const dir = getUploadDir()
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function getUploadPath(fileName: string): string {
  return path.join(getUploadDir(), fileName)
}

export async function extractTextFromFile(
  filePath: string,
  fileType: string
): Promise<string> {
  if (fileType === "application/pdf") {
    try {
      const pdfParse = require("pdf-parse")
      const buffer = fs.readFileSync(filePath)
      const data = await pdfParse(buffer)
      return data.text || ""
    } catch (error) {
      console.error("PDF parsing error:", error)
      return "Failed to extract text from PDF. The file may be scanned or image-based."
    }
  }

  if (fileType === "text/plain" || fileType === ".txt") {
    return fs.readFileSync(filePath, "utf-8")
  }

  return "Unsupported file type for text extraction."
}

export function isAllowedFileType(mimeType: string): boolean {
  const allowed = [
    "application/pdf",
    "text/plain",
  ]
  return allowed.includes(mimeType)
}

export function getFileTypeLabel(mimeType: string): string {
  const labels: Record<string, string> = {
    "application/pdf": "PDF",
    "text/plain": "TXT",
  }
  return labels[mimeType] || "UNKNOWN"
}

export function generateFileName(originalName: string): string {
  const ext = path.extname(originalName)
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 8)
  return `${timestamp}-${random}${ext}`
}

export function deleteDocumentFile(storagePath: string) {
  const fullPath = getUploadPath(storagePath)
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
    }
  } catch (error) {
    console.error("Failed to delete file:", error)
  }
}

export async function getDocumentsByUser(
  userId: string,
  options?: { search?: string; type?: string; status?: string; sort?: string }
) {
  const where: any = { userId }

  if (options?.search) {
    where.originalName = { contains: options.search, mode: "insensitive" }
  }

  if (options?.type) {
    where.fileType = options.type
  }

  if (options?.status) {
    where.status = options.status
  }

  const orderBy: any =
    options?.sort === "oldest"
      ? { createdAt: "asc" }
      : { createdAt: "desc" }

  return prisma.document.findMany({
    where,
    orderBy,
    include: {
      analysis: {
        select: { documentType: true },
      },
    },
  })
}

export async function getDocumentById(documentId: string, userId: string) {
  return prisma.document.findFirst({
    where: { id: documentId, userId },
    include: {
      analysis: true,
    },
  })
}
