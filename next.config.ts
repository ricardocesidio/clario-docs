import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  serverExternalPackages: [],
  devIndicators: {
    position: "bottom-right",
  },
}

export default nextConfig
