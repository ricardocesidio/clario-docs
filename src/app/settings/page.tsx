"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, CreditCard, ExternalLink, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [loading, setLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  const updateName = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        toast.success("Name updated")
      } else {
        toast.error("Failed to update")
      }
    } catch {
      toast.error("Failed to update")
    } finally {
      setLoading(false)
    }
  }

  const openPortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error("No subscription found")
      }
    } catch {
      toast.error("Failed to open portal")
    } finally {
      setPortalLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and subscription</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled className="opacity-50" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button onClick={updateName} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium">Current Plan</p>
              <p className="text-xs text-muted-foreground">
                {user?.plan === "FREE"
                  ? "Free plan with limited features"
                  : `${user?.plan} plan with full features`}
              </p>
            </div>
            <Badge
              variant="outline"
              className={
                user?.plan === "FREE"
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-emerald-500/10 text-emerald-400"
              }
            >
              {user?.plan}
            </Badge>
          </div>

          {user?.plan !== "FREE" && (
            <Button
              variant="outline"
              onClick={openPortal}
              disabled={portalLoading}
              className="w-full"
            >
              {portalLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-2" />
              )}
              Manage Subscription
            </Button>
          )}

          {user?.plan === "FREE" && (
            <p className="text-xs text-muted-foreground">
              Upgrade to Pro or Business for more documents and advanced features.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Account Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>User ID: <span className="font-mono text-xs">{user?.id}</span></p>
            <p>Role: {user?.role}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
