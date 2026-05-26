"use client"

import { ReactNode } from "react"
import { AppSidebar } from "./app-sidebar"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export function AppLayout({ children }: { children: ReactNode }) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto pt-12 lg:pt-0">{children}</div>
      </main>
    </div>
  )
}
