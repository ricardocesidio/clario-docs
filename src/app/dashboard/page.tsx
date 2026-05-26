"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FileText,
  Upload,
  TrendingUp,
  FileType,
  Calendar,
  Sparkles,
  ArrowRight,
  AlertCircle,
  BarChart3,
  PieChart,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts"

type DashboardData = {
  totalDocuments: number
  documentsThisMonth: number
  plan: string
  planLimit: number
  usagePercentage: number
  recentDocuments: Array<{
    id: string
    originalName: string
    fileType: string
    status: string
    createdAt: string
    analysis?: { documentType?: string | null } | null
  }>
  documentsByType: Array<{ name: string; value: number }>
  documentsByDay: Array<{ date: string; count: number }>
}

const COLORS = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    )
  }

  const planColors: Record<string, string> = {
    FREE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    PRO: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    BUSINESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || user?.email}
          </p>
        </div>
        <Link href="/documents/upload">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white border-0">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Documents</span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{data?.totalDocuments || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">This Month</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{data?.documentsThisMonth || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current Plan</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <Badge variant="outline" className={planColors[data?.plan || "FREE"]}>
              {data?.plan || "FREE"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Usage</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {data?.documentsThisMonth || 0}/{data?.planLimit || 5}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium">Monthly Usage</p>
              <p className="text-xs text-muted-foreground">
                {data?.documentsThisMonth || 0} of {data?.planLimit || 5} documents analyzed
              </p>
            </div>
            <Badge variant="outline" className={planColors[data?.plan || "FREE"]}>
              {data?.plan || "FREE"}
            </Badge>
          </div>
          <Progress value={data?.usagePercentage || 0} className="h-2" />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">{data?.usagePercentage || 0}% used</span>
            <span className="text-xs text-muted-foreground">{((data?.planLimit || 5) - (data?.documentsThisMonth || 0))} remaining</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Documents Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.documentsByDay && data.documentsByDay.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.documentsByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0.02 260)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.02 260)" tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
                    <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0.02 260)" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.15 0.015 260)",
                        border: "1px solid oklch(0.25 0.02 260)",
                        borderRadius: "8px",
                        color: "oklch(0.95 0.01 260)",
                      }}
                      labelFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                    />
                    <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center flex-col gap-2 text-muted-foreground">
                <BarChart3 className="w-8 h-8" />
                <p className="text-sm">No data yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              Document Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.documentsByType && data.documentsByType.length > 0 ? (
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={data.documentsByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.documentsByType.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.15 0.015 260)",
                        border: "1px solid oklch(0.25 0.02 260)",
                        borderRadius: "8px",
                        color: "oklch(0.95 0.01 260)",
                      }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center flex-col gap-2 text-muted-foreground">
                <PieChart className="w-8 h-8" />
                <p className="text-sm">No data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Recent Documents</CardTitle>
          <Link href="/documents">
            <Button variant="ghost" size="sm" className="text-xs">
              View all <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {data?.recentDocuments && data.recentDocuments.length > 0 ? (
            <div className="space-y-2">
              {data.recentDocuments.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/documents/${doc.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">
                        {doc.originalName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{doc.analysis?.documentType || "Unknown"}</span>
                        <span>·</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
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
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm mb-4">No documents yet</p>
              <Link href="/documents/upload">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload your first document
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {data && data.documentsThisMonth >= data.planLimit && data.plan === "FREE" && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-medium">You&apos;ve reached your monthly limit</p>
                <p className="text-xs text-muted-foreground">Upgrade to Pro or Business for more documents</p>
              </div>
            </div>
            <Link href="/pricing">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-500 text-white border-0 shrink-0">
                Upgrade
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
