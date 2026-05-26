import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ClarioDocs — AI Document Intelligence SaaS",
  description:
    "Upload documents and get instant AI summaries, risks, insights, suggested actions, and answers. AI-powered document analysis platform.",
  keywords: "document analysis, AI, PDF analysis, document insights, SaaS, AI summaries, contract analysis",
  openGraph: {
    title: "ClarioDocs — AI Document Intelligence SaaS",
    description:
      "Upload documents and get instant AI summaries, risks, insights, suggested actions, and answers.",
    type: "website",
    siteName: "ClarioDocs",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClarioDocs — AI Document Intelligence SaaS",
    description:
      "Upload documents and get instant AI summaries, risks, insights, suggested actions, and answers.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
