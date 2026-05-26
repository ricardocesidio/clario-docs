"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FileText,
  Upload,
  Search,
  Trash2,
  Calendar,
  Filter,
  ArrowUpDown,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

type Document = {
  id: string
  originalName: string
  fileType: string
  status: string
  createdAt: string
  analysis?: { documentType?: string | null; shortSummary?: string | null } | null
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sort, setSort] = useState("newest")

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (typeFilter !== "all") params.set("type", typeFilter)
      params.set("sort", sort)

      const res = await fetch(`/api/documents?${params}`)
      const data = await res.json()
      setDocuments(data.documents || [])
    } catch {
      toast.error("Failed to load documents")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [typeFilter, sort])

  useEffect(() => {
    const timer = setTimeout(fetchDocuments, 300)
    return () => clearTimeout(timer)
  }, [search])

  const deleteDocument = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" })
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id))
        toast.success(`Deleted "${name}"`)
      } else {
        toast.error("Failed to delete document")
      }
    } catch {
      toast.error("Failed to delete document")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage your uploaded documents</p>
        </div>
        <Link href="/documents/upload">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white border-0">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </Link>
      </div>

      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => v && setTypeFilter(v)}>
              <SelectTrigger className="w-full sm:w-36">
                <Filter className="w-3 h-3 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="application/pdf">PDF</SelectItem>
                <SelectItem value="text/plain">TXT</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => v && setSort(v)}>
              <SelectTrigger className="w-full sm:w-36">
                <ArrowUpDown className="w-3 h-3 mr-2" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {documents.length} document{documents.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                >
                  <Link href={`/documents/${doc.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{doc.originalName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{doc.analysis?.documentType || "Unknown"}</span>
                        <span>·</span>
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={
                        doc.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : doc.status === "PROCESSING"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : doc.status === "FAILED"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : ""
                      }
                    >
                      {doc.status}
                    </Badge>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        deleteDocument(doc.id, doc.originalName)
                      }}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-1">No documents found</p>
              <p className="text-xs text-muted-foreground mb-4">
                {search ? "Try a different search" : "Upload your first document to get started"}
              </p>
              {!search && (
                <Link href="/documents/upload">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
