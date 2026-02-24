"use client"

import { useState } from "react"
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Ghost,
  Play,
  Target,
  Timer,
  Trophy,
  XCircle,
} from "lucide-react"

const pastSessions = [
  {
    id: 1,
    arena: "ALGORITHMS",
    date: "TODAY 14:32",
    score: 4,
    total: 5,
    time: 38,
    questions: [
      { q: "Binary search complexity?", yourAnswer: "O(log n)", ghostAnswer: "O(log n)", yourCorrect: true, ghostCorrect: true, yourTime: 3.2, ghostTime: 4.1 },
      { q: "Stack ordering?", yourAnswer: "Stack", ghostAnswer: "Queue", yourCorrect: true, ghostCorrect: false, yourTime: 2.1, ghostTime: 2.8 },
      { q: "Shortest path algo?", yourAnswer: "Dijkstra's", ghostAnswer: "Dijkstra's", yourCorrect: true, ghostCorrect: true, yourTime: 4.5, ghostTime: 3.9 },
      { q: "DNS stands for?", yourAnswer: "Domain Name System", ghostAnswer: "Domain Name System", yourCorrect: true, ghostCorrect: true, yourTime: 1.8, ghostTime: 2.2 },
      { q: "SQL filter groups?", yourAnswer: "WHERE", ghostAnswer: "HAVING", yourCorrect: false, ghostCorrect: true, yourTime: 8.1, ghostTime: 5.5 },
    ],
  },
  {
    id: 2,
    arena: "MATH LOGIC",
    date: "YESTERDAY 18:15",
    score: 3,
    total: 5,
    time: 42,
    questions: [],
  },
  {
    id: 3,
    arena: "PHYSICS",
    date: "2 DAYS AGO",
    score: 2,
    total: 5,
    time: 55,
    questions: [],
  },
]

export function GhostReplay() {
  const [selectedSession, setSelectedSession] = useState(pastSessions[0])
  const [playing, setPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  function handlePlay() {
    setPlaying(true)
    setCurrentStep(0)
    const interval = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= selectedSession.questions.length - 1) {
          clearInterval(interval)
          return s
        }
        return s + 1
      })
    }, 2000)
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-neon-cyan/3 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Ghost className="h-4 w-4 text-neon-cyan" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-neon-cyan">
            GHOST MODE
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-2">
          RACE YOUR <span className="text-neon-cyan text-glow-cyan">PAST SELF</span>
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Compare your current performance against previous sessions question by question.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Session list */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground mb-2">
              PAST SESSIONS
            </span>
            {pastSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => { setSelectedSession(session); setPlaying(false); setCurrentStep(0) }}
                className={`flex items-center gap-4 border px-4 py-3 text-left transition-all ${
                  selectedSession.id === session.id
                    ? "border-neon-cyan/40 bg-neon-cyan/5"
                    : "border-panel-border bg-panel-bg/40 hover:border-panel-border/80"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center border border-panel-border">
                  <Ghost className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-mono text-xs font-bold tracking-wider text-foreground">
                    {session.arena}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{session.date}</span>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-sm font-bold text-neon-cyan">
                    {session.score}/{session.total}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{session.time}s</span>
                </div>
              </button>
            ))}
          </div>

          {/* Replay view */}
          <div className="lg:col-span-2">
            <div className="border border-panel-border bg-panel-bg/60 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Ghost className="h-4 w-4 text-neon-cyan" />
                  <span className="font-mono text-[11px] tracking-[0.2em] text-foreground">
                    {selectedSession.arena} — GHOST COMPARISON
                  </span>
                </div>
                {!playing && selectedSession.questions.length > 0 && (
                  <button
                    onClick={handlePlay}
                    className="flex items-center gap-2 border border-neon-cyan/50 bg-neon-cyan/10 px-4 py-2 font-mono text-[10px] tracking-widest text-neon-cyan transition-all hover:bg-neon-cyan/20"
                  >
                    <Play className="h-3 w-3" />
                    REPLAY
                  </button>
                )}
              </div>

              {selectedSession.questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Ghost className="h-12 w-12 text-panel-border" />
                  <span className="font-mono text-xs text-muted-foreground">
                    DETAILED REPLAY NOT AVAILABLE
                  </span>
                </div>
              ) : (
                <>
                  {/* Comparison header */}
                  <div className="flex items-center gap-4 mb-4 border-b border-panel-border pb-3">
                    <span className="flex-1 font-mono text-[10px] tracking-wider text-muted-foreground">QUESTION</span>
                    <span className="w-32 text-center font-mono text-[10px] tracking-wider text-neon-cyan">
                      YOU (NOW)
                    </span>
                    <span className="w-32 text-center font-mono text-[10px] tracking-wider text-muted-foreground">
                      GHOST (PAST)
                    </span>
                  </div>

                  {/* Questions */}
                  <div className="flex flex-col gap-3">
                    {selectedSession.questions.map((q, i) => {
                      const isVisible = !playing || i <= currentStep

                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-4 border border-panel-border/50 px-4 py-3 transition-all duration-500 ${
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                          } ${playing && i === currentStep ? "border-neon-cyan/30 bg-neon-cyan/5" : "bg-secondary/10"}`}
                        >
                          <div className="flex-1 min-w-0">
                            <span className="font-mono text-[10px] text-muted-foreground mr-2">Q{i + 1}</span>
                            <span className="font-mono text-xs text-foreground">{q.q}</span>
                          </div>

                          <div className="w-32 flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1">
                              {q.yourCorrect ? (
                                <CheckCircle className="h-3 w-3 text-neon-cyan" />
                              ) : (
                                <XCircle className="h-3 w-3 text-neon-pink" />
                              )}
                              <span className={`font-mono text-[10px] ${q.yourCorrect ? "text-neon-cyan" : "text-neon-pink"}`}>
                                {q.yourTime}s
                              </span>
                            </div>
                          </div>

                          <div className="w-32 flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1">
                              {q.ghostCorrect ? (
                                <CheckCircle className="h-3 w-3 text-muted-foreground" />
                              ) : (
                                <XCircle className="h-3 w-3 text-neon-pink/60" />
                              )}
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {q.ghostTime}s
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 pt-4 border-t border-panel-border flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Target className="h-3.5 w-3.5 text-neon-cyan" />
                        <span className="font-mono text-xs text-foreground">
                          NOW: {selectedSession.questions.filter(q => q.yourCorrect).length}/{selectedSession.questions.length}
                        </span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <Ghost className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-mono text-xs text-muted-foreground">
                          GHOST: {selectedSession.questions.filter(q => q.ghostCorrect).length}/{selectedSession.questions.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="h-3.5 w-3.5 text-neon-amber" />
                      <span className="font-mono text-[10px] text-neon-amber">
                        {selectedSession.questions.reduce((a, q) => a + q.yourTime, 0).toFixed(1)}s vs{" "}
                        {selectedSession.questions.reduce((a, q) => a + q.ghostTime, 0).toFixed(1)}s
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
