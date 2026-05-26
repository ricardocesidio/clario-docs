import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  serverExternalPackages: ["pdf-parse", "pdfkit"],
  devIndicators: {
    position: "bottom-right",
  },
}

export default nextConfig
