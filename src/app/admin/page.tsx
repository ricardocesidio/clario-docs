"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  FileText,
  Brain,
  CreditCard,
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

type AdminData = {
  totalUsers: number
  totalDocuments: number
  totalAnalyses: number
  activeSubscriptions: number
  recentUsers: Array<{
    id: string
    name: string | null
    email: string
    plan: string
    createdAt: string
  }>
  recentDocuments: Array<{
    id: string
    originalName: string
    user: { email: string }
    status: string
    createdAt: string
  }>
  usersByPlan: Array<{ plan: string; count: number }>
  documentsByDay: Array<{ date: string; count: number }>
}

const COLORS = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b"]

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Platform analytics and management</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Users</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{data?.totalUsers || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Documents</span>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold">{data?.totalDocuments || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Analyses</span>
              <Brain className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold">{data?.totalAnalyses || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Subs</span>
              <CreditCard className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold">{data?.activeSubscriptions || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Users by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.usersByPlan && data.usersByPlan.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={data.usersByPlan}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      nameKey="plan"
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.usersByPlan.map((_, i) => (
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
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No data</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Documents (Last 14 Days)</CardTitle>
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
                    />
                    <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No data</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data?.recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-2 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium">{u.name || u.email}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <Badge variant="outline">{u.plan}</Badge>
                </div>
              ))}
              {(!data?.recentUsers || data.recentUsers.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">No users</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data?.recentDocuments.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-2 rounded-lg border border-border">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{d.originalName}</p>
                    <p className="text-xs text-muted-foreground">{d.user.email}</p>
                  </div>
                  <Badge variant="outline">{d.status}</Badge>
                </div>
              ))}
              {(!data?.recentDocuments || data.recentDocuments.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">No documents</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
