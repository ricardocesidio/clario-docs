import * as pdfjs from "pdfjs-dist"
import "pdfjs-dist/build/pdf.worker.min.mjs"

export async function extractText(
  buffer: Buffer,
  fileType: string,
  _fileName?: string
): Promise<string> {
  if (fileType === "application/pdf") {
    return extractPdfText(buffer)
  }
  if (fileType === "text/plain") {
    return buffer.toString("utf-8")
  }
  return "Unsupported file type for text extraction."
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const data = new Uint8Array(buffer)
    const doc = await pdfjs.getDocument({ data }).promise
    const pages: string[] = []

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i)
      const content = await page.getTextContent()
      const text = content.items.map((item: { str?: string }) => item.str || "").join(" ")
      pages.push(text)
    }

    const full = pages.join("\n\n").trim()
    if (!full || full.length < 10) {
      return "Failed to extract text from PDF. The file may be scanned or image-based."
    }
    return full
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("PDF parsing error:", message)
    return "Failed to extract text from PDF. The file may be scanned or image-based."
  }
}
