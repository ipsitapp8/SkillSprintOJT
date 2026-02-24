"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  Clock,
  Shield,
  Swords,
  Target,
  Trophy,
  Zap,
} from "lucide-react"

const questions = [
  {
    category: "ALGORITHMS",
    question: "What is the time complexity of binary search on a sorted array?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correct: 1,
  },
  {
    category: "DATA STRUCTURES",
    question: "Which data structure uses LIFO (Last In, First Out) ordering?",
    options: ["Queue", "Linked List", "Stack", "Tree"],
    correct: 2,
  },
  {
    category: "ALGORITHMS",
    question: "What algorithm is used to find the shortest path in a weighted graph?",
    options: ["DFS", "BFS", "Dijkstra's", "Merge Sort"],
    correct: 2,
  },
  {
    category: "COMPUTER SCIENCE",
    question: "What does DNS stand for?",
    options: ["Data Network System", "Domain Name System", "Digital Node Service", "Distributed Naming Standard"],
    correct: 1,
  },
  {
    category: "DATABASES",
    question: "Which SQL clause is used to filter groups of rows?",
    options: ["WHERE", "HAVING", "GROUP BY", "FILTER"],
    correct: 1,
  },
]

const opponents = [
  { name: "CYB3R_FOX", rank: "ELITE", score: 0 },
  { name: "QUANTUM_ACE", rank: "VETERAN", score: 0 },
  { name: "NULL_PTR", rank: "ELITE", score: 0 },
]

export function LiveArena() {
  const router = useRouter()
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<Array<{ correct: boolean; time: number }>>([])
  const [finished, setFinished] = useState(false)
  const [opponentScores, setOpponentScores] = useState(opponents.map(() => 0))

  const question = questions[currentQ]

  const advanceQuestion = useCallback(() => {
    if (currentQ >= questions.length - 1) {
      setFinished(true)
      return
    }
    setCurrentQ((q) => q + 1)
    setSelected(null)
    setRevealed(false)
    setTimeLeft(15)
    // Simulate opponent scoring
    setOpponentScores((prev) =>
      prev.map((s) => s + (Math.random() > 0.4 ? 1 : 0))
    )
  }, [currentQ])

  useEffect(() => {
    if (finished || revealed) return
    if (timeLeft <= 0) {
      setRevealed(true)
      setResults((r) => [...r, { correct: false, time: 15 }])
      const timer = setTimeout(advanceQuestion, 1500)
      return () => clearTimeout(timer)
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, revealed, finished, advanceQuestion])

  function handleSelect(index: number) {
    if (revealed) return
    const isCorrect = index === question.correct
    setSelected(index)
    setRevealed(true)
    setResults((r) => [...r, { correct: isCorrect, time: 15 - timeLeft }])
    if (isCorrect) setScore((s) => s + 1)

    setTimeout(advanceQuestion, 1500)
  }

  if (finished) {
    router.push(`/results?score=${score}&total=${questions.length}&time=${results.reduce((a, r) => a + r.time, 0)}`)
    return null
  }

  const timerPercent = (timeLeft / 15) * 100
  const timerColor = timeLeft > 10 ? "text-neon-cyan" : timeLeft > 5 ? "text-neon-amber" : "text-neon-pink"
  const timerBarColor = timeLeft > 10 ? "bg-neon-cyan" : timeLeft > 5 ? "bg-neon-amber" : "bg-neon-pink"

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 grid-bg opacity-30" />
      {timeLeft <= 5 && (
        <div className="absolute inset-0 bg-neon-pink/3 animate-pulse" />
      )}

      {/* Top bar */}
      <div className="relative z-10 border-b border-panel-border bg-panel-bg/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Swords className="h-4 w-4 text-neon-pink" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-neon-pink">
              LIVE ARENA
            </span>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
              / ALGORITHMS
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono text-xs text-foreground">
                {currentQ + 1}/{questions.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5 text-neon-cyan" />
              <span className="font-mono text-xs font-bold text-neon-cyan">
                {score}
              </span>
            </div>
          </div>
        </div>

        {/* Timer bar */}
        <div className="h-1 bg-panel-border">
          <div
            className={`h-full ${timerBarColor} transition-all duration-1000 ease-linear`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Timer */}
          <div className="flex items-center justify-center mb-8">
            <div className={`relative flex h-20 w-20 items-center justify-center border-2 ${
              timeLeft > 10 ? "border-neon-cyan/40" : timeLeft > 5 ? "border-neon-amber/40" : "border-neon-pink/40"
            }`}>
              <Clock className={`absolute top-1.5 right-1.5 h-3 w-3 ${timerColor} opacity-50`} />
              <span className={`font-mono text-3xl font-bold tabular-nums ${timerColor} ${
                timeLeft > 10 ? "text-glow-cyan" : timeLeft > 5 ? "text-glow-amber" : "text-glow-pink"
              }`}>
                {timeLeft}
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1 bg-panel-border max-w-24" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-neon-cyan">
              {question.category}
            </span>
            <div className="h-px flex-1 bg-panel-border max-w-24" />
          </div>

          {/* Question */}
          <h2 className="text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl mb-10 text-balance">
            {question.question}
          </h2>

          {/* Options */}
          <div className="grid gap-3 sm:grid-cols-2">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correct
              const isSelected = index === selected

              let classes = "border border-panel-border bg-panel-bg/60 hover:border-neon-cyan/40 hover:bg-neon-cyan/5"
              if (revealed) {
                if (isCorrect) {
                  classes = "border-2 border-neon-cyan bg-neon-cyan/10 glow-cyan"
                } else if (isSelected && !isCorrect) {
                  classes = "border-2 border-neon-pink bg-neon-pink/10 glow-pink"
                } else {
                  classes = "border border-panel-border bg-panel-bg/20 opacity-30"
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={revealed}
                  className={`group flex items-center gap-4 px-5 py-5 text-left transition-all duration-200 ${classes}`}
                >
                  <span
                    className={`font-mono text-sm font-bold ${
                      revealed && isCorrect
                        ? "text-neon-cyan"
                        : revealed && isSelected
                          ? "text-neon-pink"
                          : "text-muted-foreground group-hover:text-neon-cyan"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      revealed && isCorrect
                        ? "text-neon-cyan"
                        : revealed && isSelected && !isCorrect
                          ? "text-neon-pink"
                          : "text-foreground/80"
                    }`}
                  >
                    {option}
                  </span>
                  {!revealed && (
                    <ChevronRight className="ml-auto h-4 w-4 text-panel-border group-hover:text-neon-cyan/40 transition-colors" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom: opponent tracker */}
      <div className="relative z-10 border-t border-panel-border bg-panel-bg/60 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3 gap-4 overflow-x-auto">
          {/* You */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex h-7 w-7 items-center justify-center border border-neon-cyan/30">
              <Shield className="h-3.5 w-3.5 text-neon-cyan" />
            </div>
            <div>
              <span className="block font-mono text-[10px] tracking-wider text-neon-cyan">YOU</span>
              <span className="font-mono text-xs font-bold text-foreground">{score}</span>
            </div>
          </div>

          <div className="h-6 w-px bg-panel-border flex-shrink-0" />

          <div className="flex items-center gap-6">
            {opponents.map((opp, i) => (
              <div key={opp.name} className="flex items-center gap-2 flex-shrink-0">
                <div className="flex h-6 w-6 items-center justify-center border border-panel-border">
                  <Zap className="h-3 w-3 text-muted-foreground" />
                </div>
                <div>
                  <span className="block font-mono text-[9px] tracking-wider text-muted-foreground">
                    {opp.name}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-foreground">
                    {opponentScores[i]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
