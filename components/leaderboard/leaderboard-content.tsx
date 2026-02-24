"use client"

import { useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Crown,
  Flame,
  Minus,
  Shield,
  Skull,
  Star,
  Trophy,
} from "lucide-react"

const players = [
  { rank: 1, name: "APEX_MIND", rating: 2847, accuracy: 94.2, streak: 28, trend: "up", tier: "APEX" },
  { rank: 2, name: "SYNAPSE_X", rating: 2681, accuracy: 91.8, streak: 22, trend: "up", tier: "APEX" },
  { rank: 3, name: "CORTEX_PRIME", rating: 2534, accuracy: 89.5, streak: 15, trend: "down", tier: "APEX" },
  { rank: 4, name: "NEURAL_STORM", rating: 2410, accuracy: 88.1, streak: 19, trend: "up", tier: "CHAMPION" },
  { rank: 5, name: "QUANTUM_ACE", rating: 2356, accuracy: 87.3, streak: 11, trend: "same", tier: "CHAMPION" },
  { rank: 6, name: "BIT_CRUSHER", rating: 2201, accuracy: 85.6, streak: 8, trend: "up", tier: "CHAMPION" },
  { rank: 7, name: "LOGIC_BOMB", rating: 2098, accuracy: 84.2, streak: 14, trend: "down", tier: "CHAMPION" },
  { rank: 8, name: "CIPHER_ZERO", rating: 1987, accuracy: 82.9, streak: 6, trend: "up", tier: "VETERAN" },
  { rank: 9, name: "NEXUS_STRIKER", rating: 1347, accuracy: 78.4, streak: 12, trend: "up", tier: "ELITE", isYou: true },
  { rank: 10, name: "DATA_GHOST", rating: 1298, accuracy: 76.1, streak: 5, trend: "down", tier: "ELITE" },
  { rank: 11, name: "HEX_RUNNER", rating: 1245, accuracy: 75.8, streak: 3, trend: "same", tier: "ELITE" },
  { rank: 12, name: "STACK_TRACE", rating: 1190, accuracy: 74.2, streak: 7, trend: "up", tier: "ELITE" },
]

const tierConfig: Record<string, { icon: React.ElementType; color: string; borderColor: string }> = {
  APEX: { icon: Crown, color: "text-neon-amber", borderColor: "border-neon-amber/30" },
  CHAMPION: { icon: Skull, color: "text-neon-pink", borderColor: "border-neon-pink/30" },
  VETERAN: { icon: Flame, color: "text-neon-amber", borderColor: "border-neon-amber/20" },
  ELITE: { icon: Star, color: "text-neon-cyan", borderColor: "border-neon-cyan/20" },
  WARRIOR: { icon: Shield, color: "text-neon-cyan", borderColor: "border-neon-cyan/15" },
}

const tabs = ["GLOBAL", "WEEKLY", "DAILY"]

export function LeaderboardContent() {
  const [activeTab, setActiveTab] = useState("GLOBAL")

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-neon-amber/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-4 w-4 text-neon-amber" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-neon-amber">
            RANKINGS
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-6">
          GLOBAL <span className="text-neon-amber text-glow-amber">LEADERBOARD</span>
        </h1>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 font-mono text-[11px] tracking-widest transition-all ${
                activeTab === tab
                  ? "border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan"
                  : "border border-panel-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          {players.slice(0, 3).map((player, i) => {
            const tier = tierConfig[player.tier]
            const TierIcon = tier.icon
            const podiumColors = [
              "border-neon-amber/40 bg-neon-amber/5",
              "border-muted-foreground/20 bg-secondary/30",
              "border-neon-amber/20 bg-neon-amber/3",
            ]

            return (
              <div
                key={player.name}
                className={`relative border p-6 text-center ${podiumColors[i]}`}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center border ${tier.borderColor} ${tier.color}`}>
                    <TierIcon className="h-6 w-6" />
                  </div>
                </div>
                <span className={`block font-mono text-2xl font-bold ${
                  i === 0 ? "text-neon-amber text-glow-amber" : "text-foreground"
                } mb-1`}>
                  #{player.rank}
                </span>
                <span className="block font-mono text-sm font-bold tracking-wider text-foreground mb-1">
                  {player.name}
                </span>
                <span className={`block font-mono text-lg font-bold ${tier.color} mb-2`}>
                  {player.rating} SR
                </span>
                <div className="flex items-center justify-center gap-4">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {player.accuracy}% ACC
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {player.streak} STREAK
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Full rankings list */}
        <div className="border border-panel-border bg-panel-bg/40">
          {/* Table header */}
          <div className="flex items-center gap-4 border-b border-panel-border px-4 py-3 text-muted-foreground">
            <span className="w-12 font-mono text-[10px] tracking-wider">RANK</span>
            <span className="flex-1 font-mono text-[10px] tracking-wider">PLAYER</span>
            <span className="w-20 text-right font-mono text-[10px] tracking-wider hidden sm:block">RATING</span>
            <span className="w-16 text-right font-mono text-[10px] tracking-wider hidden md:block">ACC</span>
            <span className="w-16 text-right font-mono text-[10px] tracking-wider hidden md:block">STREAK</span>
            <span className="w-12 text-center font-mono text-[10px] tracking-wider">TREND</span>
          </div>

          {/* Rows */}
          {players.map((player) => {
            const tier = tierConfig[player.tier]
            const TierIcon = tier.icon

            return (
              <div
                key={player.name}
                className={`flex items-center gap-4 border-b border-panel-border/50 px-4 py-3 transition-all hover:bg-secondary/20 ${
                  player.isYou ? "bg-neon-cyan/5 border-l-2 border-l-neon-cyan" : ""
                }`}
              >
                <span className={`w-12 font-mono text-sm font-bold ${
                  player.rank <= 3 ? "text-neon-amber" : player.isYou ? "text-neon-cyan" : "text-muted-foreground"
                }`}>
                  #{player.rank}
                </span>

                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`flex h-7 w-7 items-center justify-center border ${tier.borderColor} ${tier.color} flex-shrink-0`}>
                    <TierIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className={`block font-mono text-xs font-bold tracking-wider truncate ${
                      player.isYou ? "text-neon-cyan" : "text-foreground"
                    }`}>
                      {player.name}
                      {player.isYou && <span className="ml-2 text-[10px] text-neon-cyan/60">(YOU)</span>}
                    </span>
                    <span className={`font-mono text-[10px] ${tier.color}`}>{player.tier}</span>
                  </div>
                </div>

                <span className="w-20 text-right font-mono text-sm font-bold text-foreground hidden sm:block">
                  {player.rating}
                </span>

                <span className="w-16 text-right font-mono text-xs text-muted-foreground hidden md:block">
                  {player.accuracy}%
                </span>

                <span className="w-16 text-right font-mono text-xs text-muted-foreground hidden md:block">
                  {player.streak}
                </span>

                <div className="w-12 flex items-center justify-center">
                  {player.trend === "up" && <ArrowUp className="h-3.5 w-3.5 text-neon-cyan" />}
                  {player.trend === "down" && <ArrowDown className="h-3.5 w-3.5 text-neon-pink" />}
                  {player.trend === "same" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
