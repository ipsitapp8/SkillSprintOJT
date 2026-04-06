"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Zap, LogOut, User } from "lucide-react"

const navLinks = [
  { href: "/dashboard", label: "DASHBOARD" },
  { href: "/arena", label: "ARENA" },
  { href: "/leaderboard", label: "LEADERBOARD" },
  { href: "/sprint", label: "SPRINT" },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{id: string, username?: string, email: string} | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:8080/api/auth/me", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          const userData = data.user ? data.user : data
          setUser(userData)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  async function handleLogout() {
    await fetch("http://localhost:8080/api/auth/logout", { method: "POST", credentials: "include" })
    setUser(null)
    router.push("/login")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neon-cyan/10 bg-deep-bg/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 lg:px-8">
        {/* Left accent line */}
        <div className="absolute left-0 bottom-0 h-px w-24 bg-gradient-to-r from-neon-cyan/50 to-transparent" />
        <div className="absolute right-0 bottom-0 h-px w-24 bg-gradient-to-l from-neon-pink/50 to-transparent" />

        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-7 w-7 items-center justify-center border border-neon-cyan/40 bg-neon-cyan/10">
            <Zap className="h-3.5 w-3.5 text-neon-cyan" />
          </div>
          <span className="font-mono text-sm font-bold tracking-wider text-foreground">
            SKILL<span className="text-neon-cyan text-glow-cyan">SPRINT</span>
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 font-mono text-[10px] tracking-[0.15em] text-muted-foreground transition-colors hover:text-neon-cyan border border-transparent hover:border-neon-cyan/10 hover:bg-neon-cyan/5"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!loading && user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 border border-neon-cyan/30 bg-neon-cyan/5">
                <User className="h-4 w-4 text-neon-cyan" />
                <span className="font-mono text-[11px] font-bold tracking-widest text-neon-cyan uppercase">
                  {user.username || user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-neon-pink"
              >
                <LogOut className="h-3 w-3" />
                LOG OUT
              </button>
            </>
          ) : !loading && !user ? (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-neon-cyan"
              >
                LOGIN
              </Link>
              <Link
                href="/login?mode=signup"
                className="flex items-center gap-2 px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-neon-pink"
              >
                SIGN UP
              </Link>
              <Link
                href="/arena"
                className="border border-neon-cyan/50 bg-neon-cyan/10 px-5 py-2 font-mono text-[10px] tracking-widest text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
              >
                ENTER ARENA
              </Link>
            </>
          ) : (
            <div className="h-8 w-24 animate-pulse bg-neon-cyan/10 border border-neon-cyan/20" />
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-foreground md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-panel-border bg-deep-bg/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 font-mono text-xs tracking-widest text-muted-foreground transition-colors hover:text-neon-cyan"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-panel-border pt-4">
              {!loading && user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 border border-neon-cyan/30 bg-neon-cyan/5">
                    <User className="h-4 w-4 text-neon-cyan" />
                    <span className="font-mono text-xs font-bold tracking-widest text-neon-cyan uppercase">
                      {user.username || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-widest text-muted-foreground hover:text-neon-pink"
                  >
                    <LogOut className="h-4 w-4" />
                    LOG OUT
                  </button>
                </>
              ) : !loading && !user ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-widest text-muted-foreground hover:text-neon-cyan"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/login?mode=signup"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-widest text-muted-foreground hover:text-neon-pink"
                  >
                    SIGN UP
                  </Link>
                  <Link
                    href="/arena"
                    onClick={() => setOpen(false)}
                    className="border border-neon-cyan/50 bg-neon-cyan/10 px-5 py-3 text-center font-mono text-xs tracking-widest text-neon-cyan"
                  >
                    ENTER ARENA
                  </Link>
                </>
              ) : (
                <div className="h-10 w-full animate-pulse bg-neon-cyan/10 border border-neon-cyan/20" />
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
