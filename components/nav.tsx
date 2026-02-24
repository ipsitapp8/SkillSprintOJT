"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Zap } from "lucide-react"

const navLinks = [
  { href: "/dashboard", label: "DASHBOARD" },
  { href: "/arena", label: "ARENA" },
  { href: "/leaderboard", label: "LEADERBOARD" },
  { href: "/sprint", label: "SPRINT" },
]

export function Nav() {
  const [open, setOpen] = useState(false)

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
          <Link
            href="/dashboard"
            className="px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            LOG IN
          </Link>
          <Link
            href="/arena"
            className="border border-neon-cyan/50 bg-neon-cyan/10 px-5 py-2 font-mono text-[10px] tracking-widest text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
          >
            ENTER ARENA
          </Link>
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
              <Link
                href="/dashboard"
                className="px-4 py-3 font-mono text-xs tracking-widest text-muted-foreground"
              >
                LOG IN
              </Link>
              <Link
                href="/arena"
                className="border border-neon-cyan/50 bg-neon-cyan/10 px-5 py-3 text-center font-mono text-xs tracking-widest text-neon-cyan"
              >
                ENTER ARENA
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
