import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

const publicPaths = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/webhooks/stripe",
  "/_next",
  "/favicon.ico",
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const token = request.cookies.get("token")?.value

  if (!token) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/documents") ||
      pathname.startsWith("/settings") ||
      pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  const payload = verifyToken(token)

  if (!payload) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/documents") ||
      pathname.startsWith("/settings") ||
      pathname.startsWith("/admin")
    ) {
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.set("token", "", { maxAge: 0 })
      return response
    }
    return NextResponse.next()
  }

  if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
