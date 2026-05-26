export type PlanLimits = {
  FREE: { documentsPerMonth: number; maxFileSizeMB: number }
  PRO: { documentsPerMonth: number; maxFileSizeMB: number }
  BUSINESS: { documentsPerMonth: number; maxFileSizeMB: number }
}

export const PLAN_LIMITS: PlanLimits = {
  FREE: { documentsPerMonth: 5, maxFileSizeMB: 10 },
  PRO: { documentsPerMonth: 100, maxFileSizeMB: 25 },
  BUSINESS: { documentsPerMonth: 500, maxFileSizeMB: 50 },
}

export type AnalysisResult = {
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

export type DashboardStats = {
  totalDocuments: number
  documentsThisMonth: number
  plan: string
  planLimit: number
  recentDocuments: Array<{
    id: string
    originalName: string
    fileType: string
    status: string
    createdAt: Date
    analysis?: {
      documentType?: string | null
    } | null
  }>
  documentsByType: Array<{ name: string; value: number }>
  documentsByDay: Array<{ date: string; count: number }>
}

export type AdminStats = {
  totalUsers: number
  totalDocuments: number
  totalAnalyses: number
  activeSubscriptions: number
  recentUsers: Array<{
    id: string
    name: string | null
    email: string
    plan: string
    createdAt: Date
  }>
  recentDocuments: Array<{
    id: string
    originalName: string
    user: { email: string }
    status: string
    createdAt: Date
  }>
  usersByPlan: Array<{ plan: string; count: number }>
  documentsByDay: Array<{ date: string; count: number }>
}
