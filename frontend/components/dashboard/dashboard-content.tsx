"use client"

import { useEffect, useState } from "react"
import {
  Activity,
  Brain,
  ChevronRight,
  Clock,
  Crown,
  Flame,
  Ghost,
  Shield,
  Swords,
  Target,
  Timer,
  Trophy,
  Zap,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { PerformanceChart } from "./performance-chart"

interface UserData {
  username: string;
  stats: {
    totalAttempts: number;
    highScore: number;
    avgScore: number;
  };
  recentAttempts: Array<{
    id: string;
    score: number;
    totalQuestions: number;
    completedAt: string;
    quiz: { title: string };
  }>;
}

export function DashboardContent() {
  const [data, setData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("http://localhost:8080/api/auth/me", { credentials: "include" })
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMe()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 text-neon-cyan animate-spin" />
        <span className="font-mono text-xs tracking-widest text-neon-cyan">LOADING COMMAND CENTER...</span>
      </div>
    )
  }

  if (!data) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
          <Shield className="h-12 w-12 text-neon-pink mb-2" />
          <h2 className="text-xl font-bold text-foreground">ACCESS DENIED</h2>
          <p className="text-muted-foreground text-sm max-w-xs">Please login to access your personal command center and track your rank.</p>
          <Link href="/login" className="px-8 py-3 bg-neon-cyan font-mono text-xs font-bold text-deep-bg tracking-widest">LOGIN NOW</Link>
       </div>
     )
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse-glow" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-neon-cyan uppercase">
                COMMAND CENTER // ONLINE
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              WELCOME BACK, <span className="text-neon-cyan text-glow-cyan uppercase">{data.username && !data.username.includes('@') ? data.username : data.email?.split('@')[0]}</span>
            </h1>
          </div>
          <Link
            href="/arena"
            className="group flex items-center gap-3 border border-neon-cyan bg-neon-cyan/10 px-6 py-3 font-mono text-xs tracking-widest text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            <Swords className="h-4 w-4" />
            ENTER ARENA
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Top stats row */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            label="TOTAL BATTLES"
            value={data.stats.totalAttempts.toString()}
            icon={Activity}
            color="cyan"
            sub="ATTEMPTS"
          />
          <StatCard
            label="PEAK SCORE"
            value={data.stats.highScore.toString()}
            icon={Crown}
            color="yellow"
            sub="PERSONAL BEST"
          />
          <StatCard
            label="AVG PERFORMANCE"
            value={data.stats.avgScore.toFixed(1)}
            icon={Target}
            color="pink"
            sub="ACCURACY OFFSET"
          />
          <StatCard
            label="ACTIVE STATUS"
            value="READY"
            icon={Flame}
            color="cyan"
            sub="SYSTEM OK"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          {/* Top Row: Chart (Left) and Sidebar (Right) */}
          <div className="lg:col-span-2 border border-panel-border bg-panel-bg/60 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-neon-cyan" />
                <span className="font-mono text-[11px] tracking-[0.2em] text-foreground uppercase">
                  SCORE PROGRESSION
                </span>
              </div>
            </div>
            <div className="flex-1 min-h-[300px]">
              <PerformanceChart />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex-1 border border-panel-border bg-panel-bg/60 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="h-4 w-4 text-neon-cyan" />
                <span className="font-mono text-[11px] tracking-[0.2em] text-foreground uppercase">
                  RANKING SYSTEM
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="group p-4 border border-neon-yellow/20 bg-neon-yellow/5 transition-all duration-300 hover:border-neon-yellow/60 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                  <span className="block font-mono text-[9px] text-neon-yellow/60 group-hover:text-neon-yellow mb-1 uppercase transition-colors">CURRENT RANK</span>
                  <span className="font-mono text-xl font-bold text-neon-yellow/80 group-hover:text-neon-yellow group-hover:text-glow-yellow uppercase transition-all">VETERAN</span>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
                  Complete more matches with high efficiency to upgrade your classification status.
                </p>
              </div>
            </div>

            <Link
              href="/leaderboard"
              className="flex-1 flex items-center justify-center gap-3 border border-panel-border bg-panel-bg/40 px-8 py-4 font-mono text-xs tracking-widest text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-all uppercase"
            >
              <Trophy className="h-4 w-4" />
              VIEW LEADERBOARD
            </Link>
          </div>
        </div>

        {/* Bottom Row: Recent Logs (Full Width) */}
        <div className="border border-panel-border bg-panel-bg/60 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-4 w-4 text-neon-pink" />
            <span className="font-mono text-[11px] tracking-[0.2em] text-foreground uppercase">
              RECENT LOGS
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {data.recentAttempts.map((match) => (
              <Link
                key={match.id}
                href={`/results/${match.id}`}
                className="flex items-center gap-4 border border-panel-border/50 bg-secondary/20 px-4 py-3 transition-all hover:bg-secondary/30"
              >
                <div className="flex h-8 w-8 items-center justify-center border border-neon-cyan/30 text-neon-cyan">
                  <Trophy className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold tracking-wider text-foreground truncate uppercase">
                      {match.quiz?.title || "ARENA BATTLE"}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase">
                    Score: {match.score} // {new Date(match.completedAt).toLocaleDateString()}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
            {data.recentAttempts.length === 0 && (
              <div className="py-10 text-center border border-dashed border-panel-border text-muted-foreground font-mono text-xs uppercase">
                NO BATTLE LOGS FOUND. ENTER THE ARENA TO START.
              </div>
            )}
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
    cyan: {
      border: "border-neon-cyan/20 group-hover:border-neon-cyan",
      text: "text-neon-cyan/70 group-hover:text-neon-cyan",
      glow: "group-hover:text-glow-cyan",
      shadow: "group-hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
    },
    pink: {
      border: "border-neon-pink/20 group-hover:border-neon-pink",
      text: "text-neon-pink/70 group-hover:text-neon-pink",
      glow: "group-hover:text-glow-pink",
      shadow: "group-hover:shadow-[0_0_20px_rgba(255,45,111,0.15)]"
    },
    yellow: {
      border: "border-neon-yellow/20 group-hover:border-neon-yellow",
      text: "text-neon-yellow/70 group-hover:text-neon-yellow",
      glow: "group-hover:text-glow-yellow",
      shadow: "group-hover:shadow-[0_0_20px_rgba(255,184,0,0.15)]"
    }
  }

  const current = colorClasses[color as keyof typeof colorClasses]

  return (
    <div className={`group border ${current.border} bg-panel-bg/60 p-4 transition-all duration-300 hover:bg-panel-bg/80 ${current.shadow}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${current.text.split(' ')[0]} transition-colors`} />
      </div>
      <div className={`font-mono text-2xl font-bold ${current.text} ${current.glow} transition-all`}>
        {value}
      </div>
      <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        {sub}
      </span>
    </div>
  )
}
