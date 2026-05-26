"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutDashboard,
  FileText,
  Upload,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
  { href: "/pricing", label: "Pricing", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isAdmin = user?.role === "ADMIN"

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border"
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto flex flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sidebar-foreground">ClarioDocs</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1 rounded hover:bg-sidebar-accent">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary/10 text-sidebar-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === "/admin"
                  ? "bg-sidebar-primary/10 text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm hover:bg-sidebar-accent transition-colors cursor-pointer">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="text-xs bg-primary/20 text-primary">
                  {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs text-sidebar-foreground/50">{user?.plan}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-sidebar-foreground/50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => window.location.href = "/settings"}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
