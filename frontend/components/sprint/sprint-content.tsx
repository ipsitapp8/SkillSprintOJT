"use client"

import { useEffect, useState, useCallback } from "react"
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Flame,
  RotateCcw,
  Timer,
  XCircle,
  Zap,
} from "lucide-react"

const sprintQuestions = [
  { q: "What is 2^10?", options: ["512", "1024", "2048", "256"], correct: 1 },
  { q: "HTML stands for?", options: ["Hyper Text Markup Language", "High Tech ML", "Hyper Transfer Markup", "None"], correct: 0 },
  { q: "Largest planet?", options: ["Saturn", "Jupiter", "Neptune", "Uranus"], correct: 1 },
  { q: "Boiling point of water in Celsius?", options: ["90", "100", "110", "120"], correct: 1 },
  { q: "Speed of light (approx)?", options: ["200,000 km/s", "300,000 km/s", "400,000 km/s", "150,000 km/s"], correct: 1 },
  { q: "Who painted the Mona Lisa?", options: ["Michelangelo", "Raphael", "Da Vinci", "Donatello"], correct: 2 },
  { q: "Capital of Japan?", options: ["Osaka", "Kyoto", "Tokyo", "Nagoya"], correct: 2 },
  { q: "O(1) describes which complexity?", options: ["Linear", "Constant", "Logarithmic", "Quadratic"], correct: 1 },
  { q: "H2O is the formula for?", options: ["Hydrogen Peroxide", "Water", "Ethanol", "Methane"], correct: 1 },
  { q: "Year the internet was invented?", options: ["1969", "1975", "1983", "1991"], correct: 0 },
]

export function SprintContent() {
  const [phase, setPhase] = useState<"ready" | "active" | "done">("ready")
  const [currentQ, setCurrentQ] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<Array<{ correct: boolean; time: number }>>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const question = sprintQuestions[currentQ]

  const advance = useCallback(() => {
    if (currentQ >= sprintQuestions.length - 1 || timeLeft <= 0) {
      setPhase("done")
      return
    }
    setCurrentQ((q) => q + 1)
    setSelected(null)
    setRevealed(false)
  }, [currentQ, timeLeft])

  useEffect(() => {
    if (phase !== "active" || revealed) return
    if (timeLeft <= 0) {
      setPhase("done")
      return
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, phase, revealed])

  function handleStart() {
    setPhase("active")
    setCurrentQ(0)
    setTimeLeft(30)
    setScore(0)
    setAnswers([])
    setSelected(null)
    setRevealed(false)
  }

  function handleSelect(index: number) {
    if (revealed || phase !== "active") return
    const isCorrect = index === question.correct
    setSelected(index)
    setRevealed(true)
    if (isCorrect) setScore((s) => s + 1)
    setAnswers((a) => [...a, { correct: isCorrect, time: 30 - timeLeft }])
    setTimeout(() => {
      if (timeLeft > 0) advance()
      else setPhase("done")
    }, 600)
  }

  const timerColor = timeLeft > 20 ? "text-neon-cyan" : timeLeft > 10 ? "text-neon-amber" : "text-neon-pink"
  const barColor = timeLeft > 20 ? "bg-neon-cyan" : timeLeft > 10 ? "bg-neon-amber" : "bg-neon-pink"

  if (phase === "ready") {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 border border-neon-amber/30 bg-neon-amber/5 px-3 py-1 mb-6">
            <Timer className="h-3 w-3 text-neon-amber" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-neon-amber">
              MICRO-SPRINT
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
            <span className="text-neon-amber text-glow-amber">30 SECONDS</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto mb-4">
            Answer as many questions as you can in 30 seconds. Speed and accuracy both matter.
          </p>
          <div className="flex items-center justify-center gap-4 mb-8 font-mono text-[10px] text-muted-foreground">
            <span>10 QUESTIONS</span>
            <span className="text-panel-border">|</span>
            <span>30 SECONDS</span>
            <span className="text-panel-border">|</span>
            <span>NO MERCY</span>
          </div>
          <button
            onClick={handleStart}
            className="group inline-flex items-center gap-3 border-2 border-neon-amber bg-neon-amber/10 px-10 py-4 font-mono text-sm tracking-widest text-neon-amber transition-all hover:bg-neon-amber/20 hover:shadow-[0_0_30px_rgba(255,184,0,0.3)] hud-panel"
          >
            <Zap className="h-4 w-4" />
            START SPRINT
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    )
  }

  if (phase === "done") {
    const accuracy = answers.length > 0 ? Math.round((score / answers.length) * 100) : 0

    return (
      <div className="relative min-h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative z-10 text-center max-w-md mx-auto px-4">
          <div className="inline-flex items-center gap-2 border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-1 mb-6">
            <Flame className="h-3 w-3 text-neon-cyan" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-neon-cyan">
              SPRINT COMPLETE
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-8">
            <span className="text-neon-cyan text-glow-cyan">{score}</span>
            <span className="text-muted-foreground text-2xl">/{answers.length}</span>
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="border border-panel-border bg-panel-bg/60 p-4">
              <span className="block font-mono text-xl font-bold text-neon-cyan">{accuracy}%</span>
              <span className="font-mono text-[10px] text-muted-foreground">ACCURACY</span>
            </div>
            <div className="border border-panel-border bg-panel-bg/60 p-4">
              <span className="block font-mono text-xl font-bold text-neon-amber">{answers.length}</span>
              <span className="font-mono text-[10px] text-muted-foreground">ATTEMPTED</span>
            </div>
            <div className="border border-panel-border bg-panel-bg/60 p-4">
              <span className="block font-mono text-xl font-bold text-neon-pink">30s</span>
              <span className="font-mono text-[10px] text-muted-foreground">TIME</span>
            </div>
          </div>

          {/* Answer review */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {answers.map((a, i) => (
              <div
                key={i}
                className={`flex h-8 w-8 items-center justify-center border ${
                  a.correct
                    ? "border-neon-cyan/40 bg-neon-cyan/10"
                    : "border-neon-pink/40 bg-neon-pink/10"
                }`}
              >
                {a.correct ? (
                  <CheckCircle className="h-3.5 w-3.5 text-neon-cyan" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-neon-pink" />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            className="group inline-flex items-center gap-3 border-2 border-neon-amber bg-neon-amber/10 px-8 py-4 font-mono text-xs tracking-widest text-neon-amber transition-all hover:bg-neon-amber/20 hover:shadow-[0_0_20px_rgba(255,184,0,0.2)] hud-panel"
          >
            <RotateCcw className="h-4 w-4" />
            SPRINT AGAIN
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-[80vh] flex flex-col">
      <div className="absolute inset-0 grid-bg opacity-20" />
      {timeLeft <= 10 && <div className="absolute inset-0 bg-neon-pink/3 animate-pulse" />}

      {/* Timer bar */}
      <div className="relative z-10 border-b border-panel-border">
        <div className="mx-auto max-w-2xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Timer className="h-4 w-4 text-neon-amber" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-neon-amber">MICRO-SPRINT</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground">
              Q{currentQ + 1}/{sprintQuestions.length}
            </span>
            <span className={`font-mono text-lg font-bold tabular-nums ${timerColor}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        <div className="h-1 bg-panel-border">
          <div
            className={`h-full ${barColor} transition-all duration-1000 ease-linear`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-3 w-3 text-neon-amber" />
            <span className="font-mono text-xs font-bold text-neon-amber">{score} CORRECT</span>
          </div>

          <h2 className="text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl mb-8 text-balance">
            {question.q}
          </h2>

          <div className="grid gap-2 grid-cols-2">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correct
              const isSelected = index === selected

              let classes = "border border-panel-border bg-panel-bg/60 hover:border-neon-cyan/40 hover:bg-neon-cyan/5"
              if (revealed) {
                if (isCorrect) classes = "border border-neon-cyan bg-neon-cyan/10"
                else if (isSelected && !isCorrect) classes = "border border-neon-pink bg-neon-pink/10"
                else classes = "border border-panel-border bg-panel-bg/20 opacity-30"
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={revealed}
                  className={`px-4 py-4 text-left transition-all duration-150 ${classes}`}
                >
                  <span className={`font-mono text-xs font-medium ${
                    revealed && isCorrect ? "text-neon-cyan" :
                    revealed && isSelected ? "text-neon-pink" :
                    "text-foreground/80"
                  }`}>
                    {option}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
