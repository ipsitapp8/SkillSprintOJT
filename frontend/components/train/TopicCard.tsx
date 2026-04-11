"use client"

import { LucideIcon } from "lucide-react"

interface TopicCardProps {
  title: string
  description: string
  icon: LucideIcon
  count: number
  mastery: number
  color: "cyan" | "pink" | "yellow"
}

export function TopicCard({ title, description, icon: Icon, count, mastery, color }: TopicCardProps) {
  const themes = {
    cyan: {
      border: "border-neon-cyan/20 group-hover:border-neon-cyan",
      text: "text-neon-cyan/70 group-hover:text-neon-cyan",
      bg: "bg-neon-cyan/5",
      glow: "group-hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]",
      bar: "bg-neon-cyan"
    },
    pink: {
      border: "border-neon-pink/20 group-hover:border-neon-pink",
      text: "text-neon-pink/70 group-hover:text-neon-pink",
      bg: "bg-neon-pink/5",
      glow: "group-hover:shadow-[0_0_20px_rgba(255,45,111,0.15)]",
      bar: "bg-neon-pink"
    },
    yellow: {
      border: "border-neon-yellow/10 group-hover:border-neon-yellow/60",
      text: "text-neon-yellow/70 group-hover:text-neon-yellow",
      bg: "bg-neon-yellow/5",
      glow: "group-hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]",
      bar: "bg-neon-yellow"
    }
  }

  const theme = themes[color]

  return (
    <div className={`group relative border ${theme.border} bg-panel-bg/40 p-6 transition-all duration-300 ${theme.glow} backdrop-blur-sm overflow-hidden`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`flex h-12 w-12 items-center justify-center border ${theme.border} ${theme.bg} ${theme.text.split(' ')[0]} transition-all duration-300`}>
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <div className="text-right">
          <span className="block font-mono text-[10px] text-muted-foreground uppercase">Mastery</span>
          <span className={`font-mono text-sm font-bold ${theme.text.split(' ')[0]}`}>{mastery}%</span>
        </div>
      </div>

      <h3 className="font-mono text-xs font-bold tracking-widest text-foreground uppercase mb-2">
        {title}
      </h3>
      <p className="text-xs leading-relaxed text-muted-foreground mb-6 line-clamp-2">
        {description}
      </p>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-[9px] font-mono text-muted-foreground">
          <span>{count} MODULES</span>
          <span className="uppercase">Level 1 // Apprentice</span>
        </div>
        <div className="h-1 w-full bg-white/5 overflow-hidden">
          <div 
            className={`h-full ${theme.bar} transition-all duration-500`} 
            style={{ width: `${mastery}%` }} 
          />
        </div>
      </div>

      {/* Hover accent */}
      <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${theme.bar}`} />
    </div>
  )
}
