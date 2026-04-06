"use client"

import { useEffect, useState } from "react"
import {
  Crown,
  Flame,
  Shield,
  Skull,
  Star,
  Trophy,
  Loader2,
  Award,
} from "lucide-react"

interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
}

const tierConfig: Record<string, { icon: React.ElementType; color: string; borderColor: string }> = {
  APEX: { icon: Crown, color: "text-neon-amber", borderColor: "border-neon-amber/30" },
  CHAMPION: { icon: Skull, color: "text-neon-pink", borderColor: "border-neon-pink/30" },
  VETERAN: { icon: Flame, color: "text-neon-amber", borderColor: "border-neon-amber/20" },
  ELITE: { icon: Star, color: "text-neon-cyan", borderColor: "border-neon-cyan/20" },
  WARRIOR: { icon: Shield, color: "text-neon-cyan", borderColor: "border-neon-cyan/15" },
}

export function LeaderboardContent() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("http://localhost:8080/api/attempts/leaderboard")
        if (res.ok) {
          const data = await res.json()
          setEntries(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 text-neon-cyan animate-spin" />
        <span className="font-mono text-xs tracking-widest text-neon-cyan">CALCULATING DOMINANCE...</span>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen pb-20">
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-4 w-4 text-neon-amber" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-neon-amber uppercase">
            GLOBAL RANKINGS
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-10">
          THE <span className="text-neon-amber text-glow-amber">ELITE</span> OPERATIVES
        </h1>

        {/* Top 3 podium */}
        <div className="grid gap-4 sm:grid-cols-3 mb-12">
          {entries.slice(0, 3).map((player, i) => {
            const tiers = ["APEX", "CHAMPION", "VETERAN"]
            const tier = tierConfig[tiers[i]] || tierConfig.ELITE
            const TierIcon = tier.icon
            
            return (
              <div
                key={player.userId}
                className={`relative border p-8 text-center bg-panel-bg/40 ${
                  i === 0 ? "border-neon-amber/50 scale-105 shadow-[0_0_30px_rgba(255,180,0,0.1)]" : "border-panel-border"
                }`}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center border ${tier.borderColor} ${tier.color}`}>
                    <TierIcon className="h-6 w-6" />
                  </div>
                </div>
                <span className={`block font-mono text-3xl font-black ${
                  i === 0 ? "text-neon-amber text-glow-amber" : "text-foreground"
                } mb-1`}>
                  #{i + 1}
                </span>
                <span className="block font-mono text-sm font-bold tracking-widest text-foreground mb-1 uppercase">
                  {player.username}
                </span>
                <span className={`block font-mono text-lg font-bold ${tier.color}`}>
                  {player.score} XP
                </span>
              </div>
            )
          })}
        </div>

        {/* List */}
        <div className="border border-panel-border bg-panel-bg/20 overflow-hidden">
          <div className="flex items-center gap-4 bg-panel-bg/60 border-b border-panel-border px-6 py-4">
            <span className="w-12 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">RANK</span>
            <span className="flex-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">OPERATIVE</span>
            <span className="w-24 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">TOTAL SCORE</span>
          </div>

          <div className="divide-y divide-panel-border/30">
            {entries.map((player, i) => (
              <div
                key={player.userId}
                className="flex items-center gap-4 px-6 py-4 transition-all hover:bg-secondary/10"
              >
                <span className={`w-12 font-mono text-sm font-bold ${
                  i < 3 ? "text-neon-amber" : "text-muted-foreground"
                }`}>
                  #{i + 1}
                </span>
                <div className="flex-1 flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-neon-cyan/40" />
                   <span className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">
                     {player.username}
                   </span>
                </div>
                <span className="w-24 text-right font-mono text-sm font-bold text-neon-cyan">
                  {player.score}
                </span>
              </div>
            ))}
            {entries.length === 0 && (
              <div className="py-20 text-center text-muted-foreground font-mono text-xs">NO PERFORMANCE DATA RECORDED YET.</div>
            )}
          </div>
        </div>

        <div className="mt-12 p-6 border border-panel-border bg-panel-bg/40 text-center">
            <Award className="h-6 w-6 text-neon-cyan mx-auto mb-3" />
            <h3 className="font-mono text-sm font-bold text-foreground mb-2">WANT TO CLIMB THE RANKS?</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              Every battle in the arena contributes to your global rating. Efficiency and accuracy are key to reaching the APEX tier.
            </p>
        </div>
      </div>
    </div>
  )
}
