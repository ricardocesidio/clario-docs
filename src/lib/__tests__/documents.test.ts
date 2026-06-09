import { describe, it, expect } from "vitest"
import { isAllowedFileType, getFileTypeLabel, generateFileName } from "../documents"

describe("isAllowedFileType", () => {
  it("allows PDF files", () => {
    expect(isAllowedFileType("application/pdf")).toBe(true)
  })

  it("allows text files", () => {
    expect(isAllowedFileType("text/plain")).toBe(true)
  })

  it("rejects DOCX files", () => {
    expect(isAllowedFileType("application/vnd.openxmlformats-officedocument.wordprocessingml.document")).toBe(false)
  })

  it("rejects image files", () => {
    expect(isAllowedFileType("image/png")).toBe(false)
    expect(isAllowedFileType("image/jpeg")).toBe(false)
  })

  it("rejects empty string", () => {
    expect(isAllowedFileType("")).toBe(false)
  })

  it("rejects nullish values", () => {
    expect(isAllowedFileType(null as unknown as string)).toBe(false)
    expect(isAllowedFileType(undefined as unknown as string)).toBe(false)
  })
})

describe("getFileTypeLabel", () => {
  it("returns PDF for application/pdf", () => {
    expect(getFileTypeLabel("application/pdf")).toBe("PDF")
  })

  it("returns TXT for text/plain", () => {
    expect(getFileTypeLabel("text/plain")).toBe("TXT")
  })

  it("returns UNKNOWN for unrecognized types", () => {
    expect(getFileTypeLabel("image/png")).toBe("UNKNOWN")
  })
})

describe("generateFileName", () => {
  it("preserves file extension", () => {
    const name = generateFileName("document.pdf")
    expect(name.endsWith(".pdf")).toBe(true)
  })

  it("handles multiple extensions", () => {
    const name = generateFileName("archive.tar.gz")
    expect(name.endsWith(".gz")).toBe(true)
  })

  it("handles file without extension", () => {
    const name = generateFileName("README")
    expect(name).not.toContain(".")
  })

  it("generates unique names for the same input", () => {
    const name1 = generateFileName("test.pdf")
    const name2 = generateFileName("test.pdf")
    expect(name1).not.toBe(name2)
  })

  it("includes a timestamp component", () => {
    const name = generateFileName("doc.pdf")
    const prefix = name.split("-")[0]
    expect(/^\d+$/.test(prefix)).toBe(true)
  })
})
