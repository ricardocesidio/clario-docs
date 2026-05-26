import { prisma } from "./prisma"
import { getStorageProvider } from "./storage"
import { extractText } from "./extract-text"
import path from "path"

export async function saveDocumentFile(fileName: string, buffer: Buffer): Promise<string> {
  const storage = getStorageProvider()
  return storage.save(fileName, buffer)
}

export function getDocumentPath(fileName: string): string {
  const storage = getStorageProvider()
  return storage.getPath(fileName)
}

export async function deleteDocumentFile(storagePath: string) {
  const storage = getStorageProvider()
  await storage.delete(storagePath)
}

export async function readDocumentFile(fileName: string): Promise<Buffer> {
  const storage = getStorageProvider()
  return storage.get(fileName)
}

export async function extractTextFromFile(
  fileName: string,
  fileType: string
): Promise<string> {
  const buffer = await readDocumentFile(fileName)
  return extractText(buffer, fileType, fileName)
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
