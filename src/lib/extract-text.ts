import fs from "fs"
import path from "path"

export async function extractText(
  buffer: Buffer,
  fileType: string,
  _fileName?: string
): Promise<string> {
  if (fileType === "application/pdf") {
    try {
      const pdfParse = require("pdf-parse")
      const data = await pdfParse(buffer)
      return data.text || ""
    } catch (error) {
      console.error("PDF parsing error:", error)
      return "Failed to extract text from PDF. The file may be scanned or image-based."
    }
  }

  if (fileType === "text/plain") {
    return buffer.toString("utf-8")
  }

  return "Unsupported file type for text extraction."
}
