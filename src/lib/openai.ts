import OpenAI from "openai"
import { AnalysisResult } from "@/types"

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === "sk-placeholder") {
    throw new Error("OpenAI API key not configured")
  }
  return new OpenAI({ apiKey })
}

export async function analyzeDocument(text: string): Promise<AnalysisResult> {
  const client = getClient()

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

  if (!content) {
    throw new Error("AI returned empty response")
  }

  try {
    const parsed = JSON.parse(content) as AnalysisResult
    return parsed
  } catch {
    throw new Error("Failed to parse AI response as JSON")
  }
}

export async function chatWithDocument(
  documentText: string,
  userMessage: string,
  chatHistory: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<string> {
  const client = getClient()

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
