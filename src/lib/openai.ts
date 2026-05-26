import OpenAI from "openai"
import { AnalysisResult } from "@/types"

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === "sk-placeholder") {
    return null
  }
  return new OpenAI({ apiKey })
}

export async function analyzeDocument(text: string): Promise<AnalysisResult> {
  const client = getClient()

  if (client) {
    try {
      return await realAnalysis(client, text)
    } catch (error: any) {
      if (
        error?.code === "insufficient_quota" ||
        error?.status === 429 ||
        error?.message?.includes("quota")
      ) {
        console.warn("OpenAI quota exceeded, using mock analysis")
      } else {
        console.warn("OpenAI API error, using mock analysis:", error?.message)
      }
    }
  }

  return mockAnalysis(text)
}

export async function chatWithDocument(
  documentText: string,
  userMessage: string,
  chatHistory: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<string> {
  const client = getClient()

  if (client) {
    try {
      return await realChat(client, documentText, userMessage, chatHistory)
    } catch (error: any) {
      if (
        error?.code === "insufficient_quota" ||
        error?.status === 429 ||
        error?.message?.includes("quota")
      ) {
        console.warn("OpenAI quota exceeded, using mock chat")
      } else {
        console.warn("OpenAI chat error, using mock response:", error?.message)
      }
    }
  }

  return mockChat(documentText, userMessage)
}

async function realAnalysis(client: OpenAI, text: string): Promise<AnalysisResult> {
  const prompt = `You are a document analysis AI. Analyze the following document text and return a structured JSON response.

Document text:
${text.slice(0, 30000)}

Return a JSON object with these exact fields:
- shortSummary: A one-sentence summary
- detailedSummary: A 2-3 paragraph detailed summary
- keyPoints: Array of 3-7 key points
- risks: Array of any risks, warnings, or concerning items (empty array if none)
- suggestedActions: Array of 3-5 recommended actions based on the document
- keywords: Array of 5-10 important keywords
- documentType: The type of document (contract, invoice, resume, report, article, technical, letter, etc.)
- tone: The tone of the document (formal, informal, urgent, neutral, persuasive, etc.)
- confidenceScore: A number between 0 and 1 indicating how confident you are in your analysis
- suggestedQuestions: Array of 3-5 questions a user might want to ask about this document

ONLY return valid JSON, no other text.`

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a document analysis AI. You always respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 2000,
  })

  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error("AI returned empty response")

  try {
    return JSON.parse(content) as AnalysisResult
  } catch {
    throw new Error("Failed to parse AI response as JSON")
  }
}

async function realChat(
  client: OpenAI,
  documentText: string,
  userMessage: string,
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const systemPrompt = `You are a document analysis assistant. You have access to the following document content. Answer the user's questions based on this document. Be concise, accurate, and helpful.

Document content:
${documentText.slice(0, 25000)}`

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...chatHistory.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: userMessage },
  ]

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.5,
    max_tokens: 1500,
  })

  return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your question."
}

function mockAnalysis(text: string): AnalysisResult {
  const wordCount = text.split(/\s+/).length
  const hasNumbers = /\d+/.test(text)
  const hasCurrency = /[$€£¥]/.test(text)
  const hasDate = /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(text)
  const hasEmail = /\S+@\S+\.\S+/.test(text)
  const lower = text.toLowerCase()

  let documentType = "Document"
  let tone = "neutral"
  const keyPoints: string[] = []
  const risks: string[] = []
  const actions: string[] = []
  const keywords: string[] = []

  if (lower.includes("agreement") || lower.includes("contract") || lower.includes("terms") || lower.includes("party")) {
    documentType = "Contract"
    tone = "formal"
    keyPoints.push("Document appears to be a legal or contractual agreement")
    keyPoints.push(`Contains approximately ${wordCount} words of content`)
    risks.push("Review all terms and conditions carefully before signing")
    risks.push("Check for auto-renewal or termination clauses")
    actions.push("Review all clauses with legal counsel if needed")
    actions.push("Verify all party names and dates are correct")
    keywords.push("agreement", "terms", "parties", "obligations", "legal")
  } else if (lower.includes("invoice") || lower.includes("payment") || lower.includes("due") || hasCurrency) {
    documentType = "Invoice"
    tone = "formal"
    keyPoints.push("Document appears to be a financial invoice or billing document")
    if (hasCurrency) keyPoints.push("Contains monetary amounts")
    risks.push("Verify all charges are accurate before processing payment")
    risks.push("Check payment terms and late fee policies")
    actions.push("Process payment before the due date")
    actions.push("Reconcile with purchase orders if applicable")
    keywords.push("invoice", "payment", "amount", "due", "billing")
  } else if (lower.includes("resume") || lower.includes("cv") || lower.includes("experience") || lower.includes("skills")) {
    documentType = "Resume/CV"
    tone = "professional"
    keyPoints.push("Document is a resume or curriculum vitae")
    keyPoints.push(`Contains ${wordCount} words describing professional experience`)
    if (hasEmail) keyPoints.push("Contact information is included")
    risks.push("Verify employment dates and credentials")
    actions.push("Review against job requirements")
    actions.push("Prepare interview questions based on listed experience")
    keywords.push("resume", "experience", "skills", "career", "qualifications")
  } else if (lower.includes("report") || lower.includes("analysis") || lower.includes("summary") || lower.includes("quarter")) {
    documentType = "Business Report"
    tone = "formal"
    keyPoints.push("Document is a business or analytical report")
    if (hasNumbers) keyPoints.push("Contains numerical data and metrics")
    keyPoints.push(`Approximately ${wordCount} words in length`)
    actions.push("Review key findings and recommendations")
    actions.push("Share relevant sections with stakeholders")
    keywords.push("report", "analysis", "data", "findings", "metrics")
  } else if (lower.includes("dear") || lower.includes("hello") || lower.includes("regards") || lower.includes("sincerely")) {
    documentType = "Letter/Correspondence"
    tone = "professional"
    keyPoints.push("Document is a letter or formal correspondence")
    risks.push("Verify sender identity and authenticity")
    actions.push("Respond within the stated timeframe if applicable")
    keywords.push("letter", "correspondence", "communication")
  } else {
    keyPoints.push(`Document contains approximately ${wordCount} words`)
    keyPoints.push("Content covers general topics")
    actions.push("Review the full document for context")
    actions.push("Extract any action items or next steps")
    keywords.push("document", "content", "information")
  }

  if (hasDate) {
    keyPoints.push("Contains date references — check for deadlines or important dates")
  }

  return {
    shortSummary: `This ${documentType.toLowerCase()} contains ${wordCount} words and discusses relevant topics that warrant attention.`,
    detailedSummary: `This ${documentType.toLowerCase()} has been analyzed by ClarioDocs AI. The document contains approximately ${wordCount} words. Based on the content analysis, it appears to be a ${tone} document. ${
      hasNumbers ? "The document includes numerical data that may be significant. " : ""
    }${
      hasDate ? "Date references are present and should be reviewed for deadlines. " : ""
    }A thorough review of the full content is recommended to fully understand the context and implications.`,
    keyPoints,
    risks,
    suggestedActions: actions,
    keywords: [...new Set(keywords)],
    documentType,
    tone,
    confidenceScore: 0.75,
    suggestedQuestions: [
      "Summarize this in 3 bullet points",
      "What are the most important items here?",
      "What actions should I take next?",
      "Are there any deadlines I should be aware of?",
      "Explain this document in simple terms",
    ],
  }
}

function mockChat(documentText: string, userMessage: string): string {
  const lower = userMessage.toLowerCase()
  const preview = documentText.slice(0, 500)

  if (lower.includes("summar") || lower.includes("bullet")) {
    const wordCount = documentText.split(/\s+/).length
    return `Based on the document content (${wordCount} words total):

• This document covers various topics and contains information that should be reviewed
• Key details and important points are spread throughout the content
• A thorough reading is recommended to capture all relevant information

For a more specific summary, consider asking about particular aspects of the document.`
  }

  if (lower.includes("risk") || lower.includes("concern") || lower.includes("alert") || lower.includes("watch")) {
    return `Based on my analysis of this document, here are potential areas to review:

• Verify the accuracy of all names, dates, and figures mentioned
• Check for any terms or conditions that may require action
• Ensure all parties and their obligations are clearly defined
• Look for any deadlines or expiration dates

These are general recommendations — consult with appropriate professionals for specific advice.`
  }

  if (lower.includes("action") || lower.includes("next") || lower.includes("should i") || lower.includes("todo")) {
    return `Recommended next steps based on this document:

1. Review the full document content carefully
2. Identify any dates, deadlines, or time-sensitive items
3. Extract key contact information if present
4. File or archive the document appropriately
5. Follow up on any action items mentioned in the content

Prioritize based on your specific needs and context.`
  }

  if (lower.includes("keyword") || lower.includes("topic") || lower.includes("theme") || lower.includes("category")) {
    return `Based on the document content, here are relevant topics and themes:

• General business and professional content
• Information that may require further categorization
• Mixed content spanning multiple topics

The document appears to cover a range of subjects. For more specific keyword analysis, consider using the main analysis view.`
  }

  if (lower.includes("simple") || lower.includes("explain") || lower.includes("dumb") || lower.includes("easy")) {
    return `Here's a simple explanation of this document:

This is a document that contains information organized in a structured way. It includes text, and possibly numbers, dates, or other data. The best way to understand it is to:

1. Start with the summary section of your analysis
2. Review the key points highlighted
3. Check for any risks or warnings
4. Then read the full document if needed

Feel free to ask more specific questions about the content!`
  }

  return `Thank you for your question about this document. Based on the content available:

${preview}

For a more detailed answer, try asking about specific aspects such as:
• Summarize the key points
• What are the main risks?
• What actions should I take?
• Explain this in simple terms`
}
