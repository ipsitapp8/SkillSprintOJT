"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {
  BarChart3,
  ChevronRight,
  FileText,
  FolderOpen,
  Loader2,
  Lock,
  Shield,
  Zap,
} from "lucide-react"

const sidebarLinks = [
  { href: "/admin", label: "TESTS", icon: FileText },
  { href: "/admin/topics", label: "TOPICS", icon: FolderOpen },
  { href: "/admin/analytics", label: "ANALYTICS", icon: BarChart3 },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Role check — redirect non-admins
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-deep-bg gap-4">
        <Loader2 className="h-8 w-8 text-neon-cyan animate-spin" />
        <span className="font-mono text-xs tracking-widest text-neon-cyan uppercase">
          VERIFYING ADMIN CLEARANCE...
        </span>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-deep-bg gap-4">
        <Lock className="h-10 w-10 text-neon-pink" />
        <span className="font-mono text-xs tracking-widest text-neon-pink uppercase">
          ACCESS DENIED
        </span>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-deep-bg">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-panel-border bg-panel-bg/40 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-panel-border">
          <div className="relative flex h-7 w-7 items-center justify-center border border-neon-pink/40 bg-neon-pink/10">
            <Shield className="h-3.5 w-3.5 text-neon-pink" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold tracking-wider text-foreground">
              SKILL<span className="text-neon-pink text-glow-pink">SPRINT</span>
            </span>
            <span className="font-mono text-[8px] tracking-[0.3em] text-neon-pink uppercase">
              ADMIN PANEL
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = link.href === "/admin"
              ? pathname === "/admin" || pathname?.startsWith("/admin/tests/")
              : pathname?.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 font-mono text-[10px] tracking-[0.15em] transition-all border border-transparent ${
                  isActive
                    ? "text-neon-pink bg-neon-pink/10 border-neon-pink/20"
                    : "text-muted-foreground hover:text-neon-pink hover:bg-neon-pink/5"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom: back to app */}
        <div className="p-3 border-t border-panel-border">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-neon-cyan"
          >
            <ChevronRight className="h-3 w-3 rotate-180" />
            BACK TO APP
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
