"use client"

import { ReactNode } from "react"
import { AppLayout } from "@/components/layout/app-layout"

export default function PricingLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}
