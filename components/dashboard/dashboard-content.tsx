"use client"

import {
  Activity,
  Brain,
  ChevronRight,
  Clock,
  Crown,
  Flame,
  Ghost,
  Swords,
  Target,
  Timer,
  Trophy,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { PerformanceChart } from "./performance-chart"

const userData = {
  name: "NEXUS_STRIKER",
  rank: "ELITE",
  rating: 1347,
  accuracy: 78.4,
  reactionAvg: 2.3,
  streak: 12,
  matchesPlayed: 246,
  questionsAnswered: 3891,
  dailySprintsCompleted: 89,
  winRate: 64.2,
}

const recentMatches = [
  { id: 1, arena: "CS ALGORITHMS", result: "WIN", ratingChange: +18, accuracy: 85, time: "2m ago" },
  { id: 2, arena: "MATH LOGIC", result: "WIN", ratingChange: +22, accuracy: 90, time: "18m ago" },
  { id: 3, arena: "PHYSICS", result: "LOSS", ratingChange: -12, accuracy: 60, time: "1h ago" },
  { id: 4, arena: "HISTORY", result: "WIN", ratingChange: +15, accuracy: 75, time: "3h ago" },
  { id: 5, arena: "BIOLOGY", result: "LOSS", ratingChange: -8, accuracy: 55, time: "5h ago" },
]

const activeChallenges = [
  { name: "WIN 5 IN A ROW", progress: 3, total: 5, reward: "STREAK MASTER BADGE", color: "cyan" as const },
  { name: "DAILY MICRO-SPRINT", progress: 1, total: 1, reward: "+50 XP", color: "amber" as const },
  { name: "ANSWER 100 TODAY", progress: 67, total: 100, reward: "CENTURION BADGE", color: "pink" as const },
]

export function DashboardContent() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse-glow" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-neon-cyan">
                COMMAND CENTER
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              WELCOME BACK, <span className="text-neon-cyan text-glow-cyan">{userData.name}</span>
            </h1>
          </div>
          <Link
            href="/arena"
            className="group flex items-center gap-3 border-2 border-neon-cyan bg-neon-cyan/10 px-6 py-3 font-mono text-xs tracking-widest text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] hud-panel"
          >
            <Swords className="h-4 w-4" />
            ENTER ARENA
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Top stats row */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            label="RATING"
            value={userData.rating.toString()}
            icon={Crown}
            color="cyan"
            sub={userData.rank}
          />
          <StatCard
            label="ACCURACY"
            value={`${userData.accuracy}%`}
            icon={Target}
            color="pink"
            sub="PRECISION"
          />
          <StatCard
            label="AVG SPEED"
            value={`${userData.reactionAvg}s`}
            icon={Timer}
            color="amber"
            sub="REACTION"
          />
          <StatCard
            label="WIN STREAK"
            value={userData.streak.toString()}
            icon={Flame}
            color="cyan"
            sub="CURRENT"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column - Performance chart + Quick actions */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Performance chart */}
            <div className="border border-panel-border bg-panel-bg/60 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-neon-cyan" />
                  <span className="font-mono text-[11px] tracking-[0.2em] text-foreground">
                    PERFORMANCE OVERVIEW
                  </span>
                </div>
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
                  LAST 7 DAYS
                </span>
              </div>
              <PerformanceChart />
            </div>

            {/* Recent matches */}
            <div className="border border-panel-border bg-panel-bg/60 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-4 w-4 text-neon-pink" />
                <span className="font-mono text-[11px] tracking-[0.2em] text-foreground">
                  RECENT BATTLES
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {recentMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center gap-4 border border-panel-border/50 bg-secondary/20 px-4 py-3 transition-all hover:bg-secondary/30"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center border ${
                        match.result === "WIN"
                          ? "border-neon-cyan/30 text-neon-cyan"
                          : "border-neon-pink/30 text-neon-pink"
                      }`}
                    >
                      {match.result === "WIN" ? (
                        <Trophy className="h-3.5 w-3.5" />
                      ) : (
                        <Swords className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold tracking-wider text-foreground truncate">
                          {match.arena}
                        </span>
                        <span
                          className={`font-mono text-[10px] tracking-wider ${
                            match.result === "WIN" ? "text-neon-cyan" : "text-neon-pink"
                          }`}
                        >
                          {match.result}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {match.accuracy}% accuracy
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`block font-mono text-xs font-bold ${
                          match.ratingChange > 0 ? "text-neon-cyan" : "text-neon-pink"
                        }`}
                      >
                        {match.ratingChange > 0 ? "+" : ""}
                        {match.ratingChange} SR
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {match.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Profile card + Challenges + Quick actions */}
          <div className="flex flex-col gap-6">
            {/* Profile card */}
            <div className="relative border border-panel-border bg-panel-bg/60 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="h-4 w-4 text-neon-amber" />
                <span className="font-mono text-[11px] tracking-[0.2em] text-foreground">
                  COMBAT STATS
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <StatRow label="MATCHES PLAYED" value={userData.matchesPlayed.toString()} />
                <div className="h-px bg-panel-border" />
                <StatRow label="QUESTIONS ANSWERED" value={userData.questionsAnswered.toLocaleString()} />
                <div className="h-px bg-panel-border" />
                <StatRow label="WIN RATE" value={`${userData.winRate}%`} />
                <div className="h-px bg-panel-border" />
                <StatRow label="DAILY SPRINTS" value={userData.dailySprintsCompleted.toString()} />
              </div>
            </div>

            {/* Active challenges */}
            <div className="border border-panel-border bg-panel-bg/60 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="h-4 w-4 text-neon-cyan" />
                <span className="font-mono text-[11px] tracking-[0.2em] text-foreground">
                  ACTIVE OBJECTIVES
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {activeChallenges.map((challenge) => (
                  <div key={challenge.name} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] tracking-wider text-foreground">
                        {challenge.name}
                      </span>
                      <span
                        className={`font-mono text-[10px] tracking-wider ${
                          challenge.color === "cyan"
                            ? "text-neon-cyan"
                            : challenge.color === "pink"
                              ? "text-neon-pink"
                              : "text-neon-amber"
                        }`}
                      >
                        {challenge.progress}/{challenge.total}
                      </span>
                    </div>
                    <div className="h-1 bg-panel-border">
                      <div
                        className={`h-full transition-all ${
                          challenge.color === "cyan"
                            ? "bg-neon-cyan"
                            : challenge.color === "pink"
                              ? "bg-neon-pink"
                              : "bg-neon-amber"
                        }`}
                        style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {challenge.reward}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-col gap-2">
              <Link
                href="/sprint"
                className="flex items-center gap-3 border border-neon-amber/30 bg-neon-amber/5 px-4 py-3 font-mono text-[11px] tracking-widest text-neon-amber transition-all hover:bg-neon-amber/10"
              >
                <Timer className="h-4 w-4" />
                DAILY MICRO-SPRINT
                <ChevronRight className="ml-auto h-3 w-3" />
              </Link>
              <Link
                href="/ghost"
                className="flex items-center gap-3 border border-panel-border bg-panel-bg/40 px-4 py-3 font-mono text-[11px] tracking-widest text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
              >
                <Ghost className="h-4 w-4" />
                GHOST REPLAY
                <ChevronRight className="ml-auto h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string
  value: string
  icon: React.ElementType
  color: "cyan" | "pink" | "amber"
  sub: string
}) {
  const colorClasses = {
    cyan: "text-neon-cyan border-neon-cyan/20",
    pink: "text-neon-pink border-neon-pink/20",
    amber: "text-neon-amber border-neon-amber/20",
  }
  const glowClasses = {
    cyan: "text-glow-cyan",
    pink: "text-glow-pink",
    amber: "text-glow-amber",
  }

  return (
    <div className={`border ${colorClasses[color]} bg-panel-bg/60 p-4 transition-all hover:bg-panel-bg/80`}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${colorClasses[color].split(" ")[0]}`} />
      </div>
      <div className={`font-mono text-2xl font-bold ${colorClasses[color].split(" ")[0]} ${glowClasses[color]}`}>
        {value}
      </div>
      <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
        {sub}
      </span>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[11px] tracking-wider text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-bold text-foreground">{value}</span>
    </div>
  )
}
