"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Clock,
  Ghost,
  Swords,
  Target,
  Timer,
  Trophy,
  Zap,
} from "lucide-react"

export function ResultsContent() {
  const searchParams = useSearchParams()
  const score = parseInt(searchParams.get("score") || "3")
  const total = parseInt(searchParams.get("total") || "5")
  const time = parseInt(searchParams.get("time") || "38")

  const accuracy = Math.round((score / total) * 100)
  const avgTime = (time / total).toFixed(1)
  const ratingChange = score >= total / 2 ? Math.floor(score * 6) : -Math.floor((total - score) * 4)
  const isWin = score >= total / 2
  const rank = 2

  const opponents = [
    { name: "QUANTUM_ACE", score: score + 1, rank: 1 },
    { name: "YOU", score, rank: 2 },
    { name: "CYB3R_FOX", score: Math.max(0, score - 1), rank: 3 },
    { name: "NULL_PTR", score: Math.max(0, score - 2), rank: 4 },
  ]

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-cyan/5 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 lg:px-8">
        {/* Result header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 border px-4 py-1.5 mb-6 ${
            isWin ? "border-neon-cyan/30 bg-neon-cyan/5" : "border-neon-pink/30 bg-neon-pink/5"
          }`}>
            {isWin ? <Trophy className="h-4 w-4 text-neon-cyan" /> : <Swords className="h-4 w-4 text-neon-pink" />}
            <span className={`font-mono text-[11px] tracking-[0.3em] ${isWin ? "text-neon-cyan" : "text-neon-pink"}`}>
              {isWin ? "VICTORY" : "DEFEATED"}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-4">
            {isWin ? (
              <span className="text-neon-cyan text-glow-cyan">WELL FOUGHT</span>
            ) : (
              <span className="text-neon-pink text-glow-pink">LEARN & RETURN</span>
            )}
          </h1>

          <div className="flex items-center justify-center gap-2">
            {ratingChange > 0 ? (
              <ArrowUp className="h-4 w-4 text-neon-cyan" />
            ) : (
              <ArrowDown className="h-4 w-4 text-neon-pink" />
            )}
            <span className={`font-mono text-lg font-bold ${ratingChange > 0 ? "text-neon-cyan" : "text-neon-pink"}`}>
              {ratingChange > 0 ? "+" : ""}{ratingChange} SR
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 mb-8">
          <div className="border border-panel-border bg-panel-bg/60 p-4 text-center">
            <Target className="h-4 w-4 text-neon-cyan mx-auto mb-2" />
            <span className="block font-mono text-2xl font-bold text-neon-cyan text-glow-cyan">
              {accuracy}%
            </span>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">ACCURACY</span>
          </div>
          <div className="border border-panel-border bg-panel-bg/60 p-4 text-center">
            <Trophy className="h-4 w-4 text-neon-amber mx-auto mb-2" />
            <span className="block font-mono text-2xl font-bold text-neon-amber text-glow-amber">
              {score}/{total}
            </span>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">CORRECT</span>
          </div>
          <div className="border border-panel-border bg-panel-bg/60 p-4 text-center">
            <Timer className="h-4 w-4 text-neon-pink mx-auto mb-2" />
            <span className="block font-mono text-2xl font-bold text-neon-pink text-glow-pink">
              {avgTime}s
            </span>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">AVG SPEED</span>
          </div>
          <div className="border border-panel-border bg-panel-bg/60 p-4 text-center">
            <Zap className="h-4 w-4 text-foreground mx-auto mb-2" />
            <span className="block font-mono text-2xl font-bold text-foreground">
              #{rank}
            </span>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">PLACEMENT</span>
          </div>
        </div>

        {/* Match rankings */}
        <div className="border border-panel-border bg-panel-bg/60 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-4 w-4 text-neon-amber" />
            <span className="font-mono text-[11px] tracking-[0.2em] text-foreground">
              MATCH RANKINGS
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {opponents.map((opp) => (
              <div
                key={opp.name}
                className={`flex items-center gap-4 px-4 py-3 border ${
                  opp.name === "YOU"
                    ? "border-neon-cyan/30 bg-neon-cyan/5"
                    : "border-panel-border bg-secondary/20"
                }`}
              >
                <span className={`font-mono text-lg font-bold w-8 ${
                  opp.rank === 1 ? "text-neon-amber" : opp.name === "YOU" ? "text-neon-cyan" : "text-muted-foreground"
                }`}>
                  #{opp.rank}
                </span>
                <span className={`font-mono text-xs tracking-wider flex-1 ${
                  opp.name === "YOU" ? "text-neon-cyan font-bold" : "text-foreground"
                }`}>
                  {opp.name}
                </span>
                <span className="font-mono text-sm font-bold text-foreground">
                  {opp.score}/{total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/arena"
            className="group flex items-center justify-center gap-3 border-2 border-neon-cyan bg-neon-cyan/10 px-8 py-4 font-mono text-xs tracking-widest text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] hud-panel"
          >
            <Swords className="h-4 w-4" />
            BATTLE AGAIN
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/ghost"
            className="flex items-center justify-center gap-3 border border-panel-border bg-panel-bg/40 px-8 py-4 font-mono text-xs tracking-widest text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
          >
            <Ghost className="h-4 w-4" />
            GHOST REPLAY
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-3 border border-panel-border bg-panel-bg/40 px-8 py-4 font-mono text-xs tracking-widest text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
          >
            DASHBOARD
          </Link>
        </div>
      </div>
    </div>
  )
}
