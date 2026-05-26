"use client"

import { ReactNode } from "react"
import { AppLayout } from "@/components/layout/app-layout"

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}
