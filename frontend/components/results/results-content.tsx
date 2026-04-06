"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Clock,
  Shield,
  Swords,
  Target,
  Trophy,
  Zap,
  Loader2,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react"

interface Attempt {
  id: string;
  score: number;
  totalQuestions: number;
  startedAt: string;
  completedAt: string;
  quiz?: { title: string };
}

interface Answer {
  id: string;
  questionId: string;
  isCorrect: boolean;
  score: number;
  feedback: string;
  explanation: string;
  evaluatedBy: string;
  writtenAnswer?: string;
}

export function ResultsContent({ id }: { id: string }) {
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`http://localhost:8080/api/attempts/${id}`, { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setAttempt(data.attempt)
          setAnswers(data.answers)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 text-neon-cyan animate-spin" />
        <span className="font-mono text-xs tracking-widest text-neon-cyan">DECRYPTING RESULTS...</span>
      </div>
    )
  }

  if (!attempt) return <div className="text-center py-20">Attempt not found</div>

  const accuracy = Math.round((attempt.score / (attempt.totalQuestions * 10 || 1)) * 100) // Assuming max 10 per q
  const isWin = attempt.score > 0
  
  return (
    <div className="relative min-h-screen pb-20">
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 border px-4 py-1.5 mb-6 ${
            isWin ? "border-neon-cyan/30 bg-neon-cyan/5" : "border-neon-pink/30 bg-neon-pink/5"
          }`}>
            <Trophy className={`h-4 w-4 ${isWin ? "text-neon-cyan" : "text-neon-pink"}`} />
            <span className={`font-mono text-[11px] tracking-[0.3em] ${isWin ? "text-neon-cyan" : "text-neon-pink"}`}>
              MISSION COMPLETE
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            {attempt.quiz?.title || "ARENA BATTLE"}
          </h1>
          
          <div className="flex flex-col items-center">
             <span className="text-6xl font-black text-neon-cyan text-glow-cyan mb-2">{attempt.score}</span>
             <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">TOTAL SCORE ACCUMULATED</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-3 px-2">
            <Target className="h-4 w-4 text-neon-pink" />
            <span className="font-mono text-xs tracking-[0.2em] text-foreground font-bold">PERFORMANCE LOG</span>
          </div>

          {answers.map((ans, idx) => (
            <div key={ans.id} className="border border-panel-border bg-panel-bg/40 overflow-hidden">
               <div className="flex items-center justify-between p-4 border-b border-panel-border/50">
                  <div className="flex items-center gap-3">
                     <span className="font-mono text-xs text-muted-foreground">Q#{idx + 1}</span>
                     {ans.isCorrect ? (
                       <CheckCircle className="h-4 w-4 text-neon-cyan" />
                     ) : (
                       <XCircle className="h-4 w-4 text-neon-pink" />
                     )}
                     <span className={`font-mono text-xs font-bold ${ans.isCorrect ? 'text-neon-cyan' : 'text-neon-pink'}`}>
                       {ans.isCorrect ? 'SUCCESS' : 'FAILURE'}
                     </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-foreground">
                    SCORE: <span className="text-neon-cyan">{ans.score}</span>
                  </div>
               </div>
               
               <div className="p-4 flex flex-col gap-4">
                  {ans.writtenAnswer && (
                    <div className="bg-deep-bg/50 p-3 border-l-2 border-panel-border">
                       <span className="block font-mono text-[9px] text-muted-foreground mb-1">YOUR ANSWER:</span>
                       <p className="font-mono text-xs text-foreground italic">"{ans.writtenAnswer}"</p>
                    </div>
                  )}

                  {ans.feedback && (
                    <div className="flex gap-3">
                       <MessageSquare className="h-4 w-4 text-neon-cyan flex-shrink-0 mt-1" />
                       <div>
                          <span className="block font-mono text-[10px] text-neon-cyan font-bold tracking-wider mb-1">AI FEEDBACK</span>
                          <p className="text-xs text-muted-foreground leading-relaxed">{ans.feedback}</p>
                       </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                     <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                     <div>
                        <span className="block font-mono text-[10px] text-muted-foreground font-bold tracking-wider mb-1">REFERENCE EXPLANATION</span>
                        <p className="text-xs text-muted-foreground leading-relaxed">{ans.explanation}</p>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/arena"
            className="flex items-center justify-center gap-3 border-2 border-neon-cyan bg-neon-cyan/10 px-8 py-4 font-mono text-xs tracking-widest text-neon-cyan hover:bg-neon-cyan/20 transition-all"
          >
            <Swords className="h-4 w-4" />
            RE-ENTER ARENA
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-3 border border-panel-border bg-panel-bg/40 px-8 py-4 font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground transition-all"
          >
            DASHBOARD
          </Link>
        </div>
      </div>
    </div>
  )
}
