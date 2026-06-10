import { PDFParse } from "pdf-parse"

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
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    const text = result?.text || ""

    if (!text || text.trim().length === 0) {
      return "Failed to extract text from PDF. The file may be scanned or image-based."
    }

    return text
  } catch (error) {
    console.error("PDF parsing error:", error)
    return "Failed to extract text from PDF. The file may be scanned or image-based."
  }
}
