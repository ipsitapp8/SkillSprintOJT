"use client"

import { LucideIcon } from "lucide-react"

interface TopicCardProps {
  title: string
  description: string
  icon: LucideIcon
  count: number
  mastery: number
  difficulty: "Easy" | "Medium" | "Hard"
  lastScore?: number
  color: "cyan" | "pink" | "yellow"
}

export function TopicCard({ title, description, icon: Icon, count, mastery, difficulty, lastScore, color }: TopicCardProps) {
  const themes = {
    cyan: {
      border: "border-neon-cyan/20 group-hover:border-neon-cyan",
      text: "text-neon-cyan/70 group-hover:text-neon-cyan",
      bg: "bg-neon-cyan/5",
      glow: "group-hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]",
      bar: "bg-neon-cyan",
      btn: "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20"
    },
    pink: {
      border: "border-neon-pink/20 group-hover:border-neon-pink",
      text: "text-neon-pink/70 group-hover:text-neon-pink",
      bg: "bg-neon-pink/5",
      glow: "group-hover:shadow-[0_0_25px_rgba(255,45,111,0.15)]",
      bar: "bg-neon-pink",
      btn: "border-neon-pink/40 bg-neon-pink/10 text-neon-pink hover:bg-neon-pink/20"
    },
    yellow: {
      border: "border-neon-yellow/10 group-hover:border-neon-yellow/60",
      text: "text-neon-yellow/70 group-hover:text-neon-yellow",
      bg: "bg-neon-yellow/5",
      glow: "group-hover:shadow-[0_0_25px_rgba(251,191,36,0.1)]",
      bar: "bg-neon-yellow",
      btn: "border-neon-yellow/40 bg-neon-yellow/10 text-neon-yellow hover:bg-neon-yellow/20"
    }
  }

  const difficultyColors = {
    Easy: "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/5",
    Medium: "text-neon-yellow border-neon-yellow/30 bg-neon-yellow/5",
    Hard: "text-neon-pink border-neon-pink/30 bg-neon-pink/5"
  }

  const theme = themes[color]

  return (
    <div className={`group relative flex flex-col border ${theme.border} bg-panel-bg/40 p-6 transition-all duration-300 hover:-translate-y-1 ${theme.glow} backdrop-blur-sm overflow-hidden h-full`}>
      {/* Top Meta */}
      <div className="flex items-start justify-between mb-4">
        <div className={`flex h-10 w-10 items-center justify-center border ${theme.border} ${theme.bg} ${theme.text.split(' ')[0]} transition-all duration-300`}>
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`font-mono text-[8px] px-2 py-0.5 border uppercase tracking-widest ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
          {lastScore !== undefined && (
            <span className="font-mono text-[8px] text-muted-foreground uppercase">
              Last: <span className={theme.text.split(' ')[0]}>{lastScore}%</span>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <h3 className="font-mono text-xs font-bold tracking-widest text-foreground uppercase mb-2">
        {title}
      </h3>
      <p className="text-[11px] leading-relaxed text-muted-foreground mb-6 line-clamp-2 min-h-[2rem]">
        {description}
      </p>

      {/* Progress */}
      <div className="space-y-2 mb-6 mt-auto">
        <div className="flex justify-between items-center text-[9px] font-mono text-muted-foreground">
          <span>{count} MODULES</span>
          <span className="uppercase">{mastery}% MASTERY</span>
        </div>
        <div className="h-1 w-full bg-white/5 overflow-hidden">
          <div 
            className={`h-full ${theme.bar} transition-all duration-500`} 
            style={{ width: `${mastery}%` }} 
          />
        </div>
      </div>

      {/* Action */}
      <button className={`w-full py-2.5 border font-mono text-[10px] font-bold tracking-[0.2em] transition-all uppercase ${theme.btn}`}>
        TRAIN NOW
      </button>

      {/* Hover accent line */}
      <div className={`absolute bottom-0 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-500 ${theme.bar}`} />
    </div>
  )
}
