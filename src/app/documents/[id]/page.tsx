"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  ArrowLeft,
  Trash2,
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
  Download,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  Brain,
  AlertTriangle,
  Lightbulb,
  Tags,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

type Analysis = {
  shortSummary: string
  detailedSummary: string
  keyPoints: string[]
  risks: string[]
  suggestedActions: string[]
  keywords: string[]
  documentType: string
  tone: string
  confidenceScore: number
  suggestedQuestions: string[]
}

type Document = {
  id: string
  originalName: string
  fileType: string
  fileSize: number
  status: string
  extractedText: string
  createdAt: string
  analysis: Analysis | null
}

type ChatMessage = {
  id: string
  role: "USER" | "ASSISTANT"
  content: string
  createdAt: string
}

export default function DocumentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [doc, setDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [showText, setShowText] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/documents/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setDoc(data.document)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [params.id])

  useEffect(() => {
    fetch(`/api/documents/${params.id}/chat`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || [])
      })
      .catch(console.error)
  }, [params.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const exportDoc = async () => {
    try {
      const res = await fetch(`/api/documents/${params.id}/export`)
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${doc?.originalName?.replace(/\.[^/.]+$/, "") || "document"}-analysis.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Analysis exported as Markdown")
      } else {
        toast.error("Failed to export")
      }
    } catch {
      toast.error("Failed to export")
    }
  }

  const deleteDoc = async () => {
    if (!confirm("Delete this document permanently?")) return
    try {
      const res = await fetch(`/api/documents/${params.id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Document deleted")
        router.push("/documents")
      } else {
        toast.error("Failed to delete")
      }
    } catch {
      toast.error("Failed to delete")
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || sending) return
    const msg = input.trim()
    setInput("")

    setMessages((prev) => [
      ...prev,
      { id: "temp", role: "USER", content: msg, createdAt: new Date().toISOString() },
    ])
    setSending(true)

    try {
      const res = await fetch(`/api/documents/${params.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessages((prev) => [...prev, data.message])
      } else {
        toast.error(data.error || "Failed to send message")
      }
    } catch {
      toast.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const askQuestion = (question: string) => {
    setInput(question)
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      PROCESSING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
      UPLOADED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    }
    return styles[status] || ""
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Document not found</h2>
        <p className="text-muted-foreground mb-4">This document may have been deleted.</p>
        <Link href="/documents"><Button variant="outline">Back to Documents</Button></Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/documents">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold truncate max-w-[300px] sm:max-w-[500px]">
                {doc.originalName}
              </h1>
              <Badge variant="outline" className={statusBadge(doc.status)}>
                {doc.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(doc.createdAt).toLocaleDateString()} · {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {doc.analysis && (
            <Button variant="outline" size="sm" onClick={exportDoc} className="text-xs">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export MD
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={deleteDoc} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {doc.status === "PROCESSING" && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
            <p className="text-sm">AI is analyzing your document. This may take a moment...</p>
          </CardContent>
        </Card>
      )}

      {doc.status === "FAILED" && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-sm text-red-400">Analysis failed. The document may not contain extractable text.</p>
          </CardContent>
        </Card>
      )}

      {doc.analysis && (
        <>
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {doc.analysis.shortSummary}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{doc.analysis.detailedSummary}</p>
              </div>

              {doc.analysis.keyPoints && doc.analysis.keyPoints.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Key Points
                  </h3>
                  <ul className="space-y-1.5">
                    {doc.analysis.keyPoints.map((point: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {doc.analysis.risks && doc.analysis.risks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Risks & Alerts
                  </h3>
                  <ul className="space-y-1.5">
                    {doc.analysis.risks.map((risk: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {doc.analysis.suggestedActions && doc.analysis.suggestedActions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                    Suggested Actions
                  </h3>
                  <ul className="space-y-1.5">
                    {doc.analysis.suggestedActions.map((action: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Document Type</p>
                  <Badge variant="outline">{doc.analysis.documentType}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tone</p>
                  <Badge variant="outline">{doc.analysis.tone}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                  <Badge variant="outline">
                    {((doc.analysis.confidenceScore || 0) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>

              {doc.analysis.keywords && doc.analysis.keywords.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Tags className="w-3 h-3" />
                    Keywords
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.analysis.keywords.map((kw: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {doc.analysis.suggestedQuestions && doc.analysis.suggestedQuestions.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Suggested Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {doc.analysis.suggestedQuestions.map((q: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => askQuestion(q)}
                      className="px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Extracted Text
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowText(!showText)}
            className="text-xs"
          >
            {showText ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
            {showText ? "Hide" : "Show"}
          </Button>
        </CardHeader>
        {showText && doc.extractedText && (
          <CardContent>
            <ScrollArea className="h-64">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                {doc.extractedText}
              </pre>
            </ScrollArea>
          </CardContent>
        )}
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            Chat with Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] mb-4 pr-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="w-8 h-8 mb-2" />
                <p className="text-sm">Ask questions about this document</p>
                <p className="text-xs">Get answers based on the document content</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "USER" ? "justify-end" : ""}`}
                  >
                    {msg.role === "ASSISTANT" && (
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        msg.role === "USER"
                          ? "bg-primary/10 text-foreground"
                          : "bg-muted/50 text-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === "USER" && (
                      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {sending && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
            className="flex gap-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about this document..."
              className="min-h-10 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || sending}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white border-0 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">
          Powered by <span className="font-medium">OpenAI</span> · Your document content is processed securely
        </p>
      </div>
    </div>
  )
}
