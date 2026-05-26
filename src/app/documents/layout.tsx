"use client"

import { ReactNode } from "react"
import { AppLayout } from "@/components/layout/app-layout"

export default function DocumentsLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}
