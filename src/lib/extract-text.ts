import fs from "fs"
import path from "path"
import os from "os"

export async function extractText(
  buffer: Buffer,
  fileType: string,
  fileName?: string
): Promise<string> {
  if (fileType === "application/pdf") {
    return extractPdfText(buffer, fileName)
  }

  if (fileType === "text/plain") {
    return buffer.toString("utf-8")
  }

  return "Unsupported file type for text extraction."
}

async function extractPdfText(buffer: Buffer, _originalName?: string): Promise<string> {
  try {
    const { PDFParse } = require("pdf-parse")
    const tmpPath = path.join(os.tmpdir(), `clariodocs-${Date.now()}.pdf`)
    fs.writeFileSync(tmpPath, buffer)

    const parser = new PDFParse({ url: tmpPath })
    const result = await parser.getText()
    const text = result?.text || ""

    try { fs.unlinkSync(tmpPath) } catch {}

    if (!text || text.trim().length === 0) {
      return "Failed to extract text from PDF. The file may be scanned or image-based."
    }

    return text
  } catch (error) {
    console.error("PDF parsing error:", error)
    return "Failed to extract text from PDF. The file may be scanned or image-based."
  }
}
