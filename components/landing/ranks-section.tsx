"use client"

import Image from "next/image"
import Link from "next/link"
import { Crown, Flame, Shield, Skull, Star, Sword, Swords, Zap } from "lucide-react"

const ranks = [
  { name: "RECRUIT", icon: Shield, rating: "0 - 499", color: "text-muted-foreground", border: "border-muted-foreground/20", bg: "bg-muted-foreground/5" },
  { name: "WARRIOR", icon: Sword, rating: "500 - 999", color: "text-neon-cyan", border: "border-neon-cyan/20", bg: "bg-neon-cyan/5" },
  { name: "ELITE", icon: Star, rating: "1000 - 1499", color: "text-neon-cyan", border: "border-neon-cyan/30", bg: "bg-neon-cyan/5" },
  { name: "VETERAN", icon: Flame, rating: "1500 - 1999", color: "text-neon-amber", border: "border-neon-amber/30", bg: "bg-neon-amber/5" },
  { name: "CHAMPION", icon: Skull, rating: "2000 - 2499", color: "text-neon-pink", border: "border-neon-pink/30", bg: "bg-neon-pink/5" },
  { name: "APEX", icon: Crown, rating: "2500+", color: "text-neon-amber", border: "border-neon-amber/40", bg: "bg-neon-amber/5" },
]

export function RanksSection() {
  return (
    <section className="relative bg-background py-24 lg:py-32 overflow-hidden">
      {/* Ambient image accent */}
      <div className="absolute inset-y-0 left-0 w-1/3 opacity-[0.04] hidden lg:block">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HEb82YGGhzok3kcILKzoCSYySBrIGL.png"
          alt=""
          fill
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/80 to-transparent" />
      </div>

      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-neon-amber/3 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-4">
          <Swords className="h-4 w-4 text-neon-amber" />
          <span className="font-mono text-[11px] tracking-[0.3em] text-neon-amber">
            RANK SYSTEM
          </span>
          <div className="h-px flex-1 bg-panel-border" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
          CLIMB THE <span className="text-neon-amber text-glow-amber">RANKS</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground lg:text-base">
          Every correct answer pushes you closer to the top. Every mistake drops you back.
          Only the sharpest minds reach Apex.
        </p>

        {/* Ranks grid */}
        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ranks.map((rank, i) => (
            <div
              key={rank.name}
              className={`relative flex items-center gap-4 border ${rank.border} bg-panel-bg/40 p-5 transition-all hover:bg-panel-bg/60 backdrop-blur-sm`}
            >
              <div className={`flex h-10 w-10 items-center justify-center border ${rank.border} ${rank.bg} ${rank.color}`}>
                <rank.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-sm font-bold tracking-widest ${rank.color}`}>
                    {rank.name}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {`TIER ${i + 1}`}
                  </span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {rank.rating} SR
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-px w-16 bg-panel-border" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              ARE YOU READY?
            </span>
            <div className="h-px w-16 bg-panel-border" />
          </div>
          <Link
            href="/arena"
            className="group relative flex items-center gap-3 border-2 border-neon-cyan bg-neon-cyan/10 px-10 py-4 font-mono text-sm tracking-widest text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
          >
            <Zap className="h-4 w-4" />
            START YOUR FIRST SPRINT
          </Link>
        </div>
      </div>
    </section>
  )
}
