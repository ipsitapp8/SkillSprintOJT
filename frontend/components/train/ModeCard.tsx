"use client"

import { LucideIcon, Play } from "lucide-react"

interface ModeCardProps {
  title: string
  description: string
  icon: LucideIcon
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  color: "cyan" | "pink" | "yellow"
}

export function ModeCard({ title, description, icon: Icon, duration, difficulty, color }: ModeCardProps) {
  const themes = {
    cyan: "border-neon-cyan/20 text-neon-cyan bg-neon-cyan/5 hover:border-neon-cyan shadow-none hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]",
    pink: "border-neon-pink/20 text-neon-pink bg-neon-pink/5 hover:border-neon-pink shadow-none hover:shadow-[0_0_20px_rgba(255,45,111,0.15)]",
    yellow: "border-neon-yellow/10 text-neon-yellow bg-neon-yellow/5 hover:border-neon-yellow/60 shadow-none hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]"
  }

  return (
    <div className={`group flex items-center gap-6 border ${themes[color]} p-6 transition-all duration-300 relative overflow-hidden h-full`}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-inherit bg-white/5 relative z-10 transition-colors">
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </div>

      <div className="flex-1 relative z-10 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-mono text-xs font-bold tracking-[0.2em] text-foreground uppercase truncate">
            {title}
          </h3>
          <span className="font-mono text-[9px] text-muted-foreground uppercase py-0.5 px-2 border border-panel-border bg-panel-bg/40">
            {difficulty}
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2 pr-10">
          {description}
        </p>
        <div className="mt-3 flex items-center gap-4 text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-inherit" />
            {duration} Session
          </span>
        </div>
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center border border-panel-border bg-panel-bg/40 text-muted-foreground group-hover:bg-foreground group-hover:text-deep-bg transition-all">
        <Play className="h-3 w-3 fill-current" />
      </div>
    </div>
  )
}
