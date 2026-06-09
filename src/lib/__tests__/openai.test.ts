import { describe, it, expect } from "vitest"
import { analyzeDocument } from "../openai"

describe("analyzeDocument", () => {
  it("returns mock analysis with source field when no API key is set", async () => {
    const result = await analyzeDocument("This is a short test document about a business contract between two parties.")

    expect(result).toHaveProperty("source", "mock")
    expect(result).toHaveProperty("shortSummary")
    expect(result).toHaveProperty("detailedSummary")
    expect(result).toHaveProperty("keyPoints")
    expect(result).toHaveProperty("risks")
    expect(result).toHaveProperty("suggestedActions")
    expect(result).toHaveProperty("keywords")
    expect(result).toHaveProperty("documentType")
    expect(result).toHaveProperty("tone")
    expect(result).toHaveProperty("confidenceScore")
    expect(result).toHaveProperty("suggestedQuestions")
  })

  it("returns structurally valid analysis data", async () => {
    const result = await analyzeDocument("Quarterly report shows revenue growth of 15%.")

    expect(typeof result.shortSummary).toBe("string")
    expect(result.shortSummary.length).toBeGreaterThan(0)
    expect(typeof result.detailedSummary).toBe("string")
    expect(Array.isArray(result.keyPoints)).toBe(true)
    expect(Array.isArray(result.risks)).toBe(true)
    expect(Array.isArray(result.suggestedActions)).toBe(true)
    expect(Array.isArray(result.keywords)).toBe(true)
    expect(typeof result.documentType).toBe("string")
    expect(typeof result.tone).toBe("string")
    expect(typeof result.confidenceScore).toBe("number")
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0)
    expect(result.confidenceScore).toBeLessThanOrEqual(1)
    expect(Array.isArray(result.suggestedQuestions)).toBe(true)
  })

  it("generates relevant key points for contract text", async () => {
    const text = `AGREEMENT BETWEEN PARTIES
    This agreement is made between Company A and Company B.
    The parties agree to the following terms and conditions.
    Payment shall be made within 30 days of invoice.
    Either party may terminate with 60 days written notice.`

    const result = await analyzeDocument(text)
    expect(result.documentType.toLowerCase()).toContain("contract")
    expect(result.keyPoints.length).toBeGreaterThan(0)
  })

  it("generates relevant key points for invoice text", async () => {
    const text = `INVOICE #1234
    Total Due: $5,000.00
    Payment Terms: Net 30
    Due Date: 2025-01-15
    Item: Consulting Services - $5,000.00`

    const result = await analyzeDocument(text)
    expect(result.documentType).toMatch(/invoice|Invoice/i)
  })

  it("handles empty text gracefully", async () => {
    const result = await analyzeDocument("")
    expect(result).toBeDefined()
    expect(result.source).toBe("mock")
  })
})
