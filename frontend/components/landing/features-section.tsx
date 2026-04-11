"use client"

import { Activity, Brain, Clock, Ghost, Swords, Target, Trophy, Zap } from "lucide-react"

const features = [
  {
    icon: Swords,
    title: "LIVE ARENAS",
    description: "Real-time quiz battles against live opponents. Fast-paced, high-stakes knowledge warfare.",
    color: "cyan" as const,
    tag: "CORE",
  },
  {
    icon: Clock,
    title: "ARENA DRILLS",
    description: "30-second rapid-fire drill sessions. Pure speed, pure accuracy, zero downtime.",
    color: "pink" as const,
    tag: "DAILY",
  },
  {
    icon: Trophy,
    title: "RANKED SYSTEM",
    description: "Climb from Bronze to Apex. Every answer counts toward your global ranking.",
    color: "yellow" as const,
    tag: "COMPETE",
  },
  {
    icon: Ghost,
    title: "GHOST MODE",
    description: "Race against your past self. Watch your ghost replay and shatter personal records.",
    color: "cyan" as const,
    tag: "REPLAY",
  },
  {
    icon: Brain,
    title: "SKILL METRICS",
    description: "Track reaction speed, accuracy patterns, and cognitive performance across categories.",
    color: "pink" as const,
    tag: "DATA",
  },
  {
    icon: Target,
    title: "ACHIEVEMENTS",
    description: "Unlock rare combat badges. Complete streak challenges and milestone objectives.",
    color: "yellow" as const,
    tag: "UNLOCK",
  },
]

const colorMap = {
  cyan: {
    text: "text-neon-cyan",
    border: "border-neon-cyan/20",
    hoverBorder: "hover:border-neon-cyan/40",
    glow: "group-hover:shadow-[0_0_30px_rgba(0,240,255,0.06)]",
    tag: "text-neon-cyan border-neon-cyan/30",
    accent: "bg-neon-cyan/40",
    iconBg: "bg-neon-cyan/5",
  },
  pink: {
    text: "text-neon-pink",
    border: "border-neon-pink/20",
    hoverBorder: "hover:border-neon-pink/40",
    glow: "group-hover:shadow-[0_0_30px_rgba(255,45,111,0.06)]",
    tag: "text-neon-pink border-neon-pink/30",
    accent: "bg-neon-pink/40",
    iconBg: "bg-neon-pink/5",
  },
  yellow: {
    text: "text-neon-yellow",
    border: "border-neon-yellow",
    hoverBorder: "hover:border-neon-yellow shadow-[0_0_15px_rgba(255,184,0,0.1)]",
    glow: "group-hover:shadow-[0_0_30px_rgba(255,184,0,0.1)]",
    tag: "text-neon-yellow border-neon-yellow/50",
    accent: "bg-neon-yellow/40",
    iconBg: "bg-neon-yellow/5",
  },
}

export function FeaturesSection() {
  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-4">
          <Activity className="h-4 w-4 text-neon-cyan" />
          <span className="font-mono text-[11px] tracking-[0.3em] text-neon-cyan">
            COMBAT SYSTEMS
          </span>
          <div className="h-px flex-1 bg-panel-border" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
          BUILT FOR <span className="text-neon-cyan text-glow-cyan">BATTLE</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground lg:text-base">
          Every feature is engineered to push your cognitive limits. No lectures. No videos.
          Just you versus the clock.
        </p>

        {/* Feature grid */}
        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const colors = colorMap[feature.color as keyof typeof colorMap]
            return (
              <div
                key={feature.title}
                className={`group relative border ${colors.border} hover:border-${feature.color === 'yellow' ? 'neon-yellow/60' : feature.color === 'cyan' ? 'neon-cyan/60' : 'neon-pink/60'} bg-panel-bg/40 p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.08)] backdrop-blur-sm overflow-hidden`}
              >
                {/* Tag */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`font-mono text-[9px] tracking-[0.2em] border px-2 py-0.5 ${colors.tag} opacity-60 group-hover:opacity-100 transition-opacity`}
                  >
                    {feature.tag}
                  </span>
                  <Zap className="h-3 w-3 text-panel-border group-hover:text-muted-foreground transition-colors" />
                </div>

                {/* Icon */}
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center border ${colors.border} group-hover:border-${feature.color === 'yellow' ? 'neon-yellow' : feature.color === 'cyan' ? 'neon-cyan' : 'neon-pink'} ${colors.iconBg} ${colors.text} opacity-70 group-hover:opacity-100 transition-all`}>
                  <feature.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="font-mono text-xs font-bold tracking-widest text-foreground/80 group-hover:text-foreground mb-2 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground/80 group-hover:text-muted-foreground transition-colors">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500 ${colors.accent}`}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
