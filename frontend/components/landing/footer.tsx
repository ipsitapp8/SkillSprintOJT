import { Zap } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="relative border-t border-panel-border bg-deep-bg py-12">
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center border border-neon-cyan/30 bg-neon-cyan/5">
              <Zap className="h-3.5 w-3.5 text-neon-cyan" />
            </div>
            <span className="font-mono text-sm font-bold tracking-wider text-foreground">
              SKILL<span className="text-neon-cyan">SPRINT</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6">
            {["ARENA", "LEADERBOARD", "DASHBOARD", "ACHIEVEMENTS"].map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase()}`}
                className="font-mono text-[11px] tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulse-glow" />
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-panel-border flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground/60">
            SKILLSPRINT // COMPETITIVE MICROLEARNING PLATFORM
          </span>
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground/40">
            BUILD v3.2.1
          </span>
        </div>
      </div>
    </footer>
  )
}
