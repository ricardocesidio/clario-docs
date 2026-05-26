"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle, Lock } from "lucide-react"
import { toast } from "sonner"

export default function UploadPage() {
  const router = useRouter()
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const allowedTypes = [
    "application/pdf",
    "text/plain",
  ]

  const maxSize = 10 * 1024 * 1024

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return "Invalid file type. Only PDF and TXT files are supported."
    }
    if (file.size > maxSize) {
      return "File too large. Maximum size is 10MB."
    }
    return null
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      const err = validateFile(droppedFile)
      if (err) {
        setError(err)
        toast.error(err)
      } else {
        setFile(droppedFile)
        setError("")
      }
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      const err = validateFile(selected)
      if (err) {
        setError(err)
        toast.error(err)
      } else {
        setFile(selected)
        setError("")
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.usageLimit) {
          setError(data.error)
          toast.error(data.error)
          return
        }
        throw new Error(data.error || "Upload failed")
      }

      toast.success("Document uploaded and analysis started!")
      router.push(`/documents/${data.document.id}`)
    } catch (err: any) {
      const msg = err.message || "Upload failed"
      setError(msg)
      toast.error(msg)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Document</h1>
        <p className="text-muted-foreground">Upload a PDF or text file for AI analysis</p>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
            className={`relative flex flex-col items-center justify-center p-12 cursor-pointer transition-all border-2 border-dashed rounded-xl m-1 ${
              dragActive
                ? "border-primary bg-primary/5"
                : file
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileInput}
              className="hidden"
            />

            {file ? (
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="font-medium mb-1">{file.name}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                      setError("")
                    }}
                    variant="outline"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUpload()
                    }}
                    disabled={uploading}
                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white border-0"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3 mr-1" />
                        Upload & Analyze
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium mb-1">
                  {dragActive ? "Drop your file here" : "Drag & drop your file here"}
                </p>
                <p className="text-xs text-muted-foreground mb-2">or click to browse</p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF and TXT files (max 10MB)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card className="border-border">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            What happens after upload?
          </h3>
          <ol className="text-sm text-muted-foreground space-y-1.5 ml-6 list-decimal">
            <li>Your file is uploaded and stored securely</li>
            <li>AI extracts and analyzes the document content</li>
            <li>A structured analysis is generated with summaries, risks, and insights</li>
            <li>You can view, chat, and export the analysis</li>
          </ol>
        </CardContent>
      </Card>

      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">
          <Lock className="w-3 h-3 inline mr-1" />
          Files are encrypted in transit and at rest. Your data is processed securely and never shared.
        </p>
      </div>
    </div>
  )
}
