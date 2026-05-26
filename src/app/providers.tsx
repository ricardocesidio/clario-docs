"use client"

import { ReactNode, useEffect } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "sonner"

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const orig = console.error
    console.error = (...args: any[]) => {
      const msg = typeof args[0] === "string" ? args[0] : ""
      if (
        msg.includes("bis_skin") ||
        msg.includes("A tree hydrated but some attributes") ||
        msg.includes("hydration")
      ) {
        return
      }
      orig.apply(console, args)
    }
    return () => { console.error = orig }
  }, [])

  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.15 0.015 260)",
            border: "1px solid oklch(0.25 0.02 260)",
            color: "oklch(0.95 0.01 260)",
          },
        }}
      />
    </AuthProvider>
  )
}
