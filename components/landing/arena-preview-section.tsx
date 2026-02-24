"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AlertTriangle, ChevronRight, Clock, Zap } from "lucide-react"

const sampleQuestion = {
  category: "COMPUTER SCIENCE",
  question: "What is the time complexity of binary search on a sorted array?",
  options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
  correct: 1,
  difficulty: "ELITE",
}

export function ArenaPreviewSection() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0 || revealed) return
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, revealed])

  function handleSelect(index: number) {
    if (revealed) return
    setSelectedOption(index)
    setRevealed(true)
  }

  function handleReset() {
    setSelectedOption(null)
    setRevealed(false)
    setTimeLeft(30)
  }

  const timerColor =
    timeLeft > 20 ? "text-neon-cyan" : timeLeft > 10 ? "text-neon-amber" : "text-neon-pink"
  const timerGlow =
    timeLeft > 20 ? "text-glow-cyan" : timeLeft > 10 ? "text-glow-amber" : "text-glow-pink"
  const timerBarColor =
    timeLeft > 20
      ? "bg-neon-cyan"
      : timeLeft > 10
        ? "bg-neon-amber"
        : "bg-neon-pink"

  return (
    <section className="relative bg-deep-bg py-24 lg:py-32 overflow-hidden">
      {/* Subtle anime image as side accent */}
      <div className="absolute inset-y-0 right-0 w-1/2 opacity-[0.06] hidden lg:block">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HEb82YGGhzok3kcILKzoCSYySBrIGL.png"
          alt=""
          fill
          className="object-cover object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-bg via-deep-bg/80 to-transparent" />
      </div>

      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-neon-pink/3 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-neon-pink/30 bg-neon-pink/5 px-3 py-1 mb-6">
            <AlertTriangle className="h-3 w-3 text-neon-pink" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-neon-pink">
              LIVE DEMO
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            EXPERIENCE THE <span className="text-neon-pink text-glow-pink">ARENA</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-lg mx-auto">
            This is what battle feels like. Select an answer before the timer runs out.
          </p>
        </div>

        {/* Arena card */}
        <div className="mx-auto max-w-2xl">
          <div className="relative border border-panel-border bg-panel-bg/80 backdrop-blur-sm overflow-hidden">
            {/* Arena header */}
            <div className="flex items-center justify-between border-b border-panel-border px-6 py-3">
              <div className="flex items-center gap-3">
                <Zap className="h-3.5 w-3.5 text-neon-pink" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-neon-pink">
                  {sampleQuestion.difficulty}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                  / {sampleQuestion.category}
                </span>
              </div>
              <div className={`flex items-center gap-2 ${timerColor} ${timerGlow}`}>
                <Clock className="h-3.5 w-3.5" />
                <span className="font-mono text-sm font-bold tabular-nums">
                  {String(timeLeft).padStart(2, "0")}s
                </span>
              </div>
            </div>

            {/* Timer bar */}
            <div className="h-0.5 bg-panel-border">
              <div
                className={`h-full ${timerBarColor} transition-all duration-1000 ease-linear`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="px-6 py-8 lg:px-10 lg:py-10">
              <h3 className="text-xl font-bold tracking-tight text-foreground lg:text-2xl text-balance">
                {sampleQuestion.question}
              </h3>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2 px-6 pb-8 lg:px-10">
              {sampleQuestion.options.map((option, index) => {
                const isCorrect = index === sampleQuestion.correct
                const isSelected = index === selectedOption

                let optionClasses = "border border-panel-border bg-secondary/30 hover:border-neon-cyan/40 hover:bg-neon-cyan/5"
                if (revealed) {
                  if (isCorrect) {
                    optionClasses = "border border-neon-cyan bg-neon-cyan/10 glow-cyan"
                  } else if (isSelected && !isCorrect) {
                    optionClasses = "border border-neon-pink bg-neon-pink/10 glow-pink"
                  } else {
                    optionClasses = "border border-panel-border bg-secondary/10 opacity-40"
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    disabled={revealed}
                    className={`group flex items-center gap-4 px-5 py-4 text-left transition-all duration-200 ${optionClasses}`}
                  >
                    <span
                      className={`font-mono text-xs font-bold ${
                        revealed && isCorrect
                          ? "text-neon-cyan"
                          : revealed && isSelected
                            ? "text-neon-pink"
                            : "text-muted-foreground"
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
                      <ChevronRight className="ml-auto h-4 w-4 text-panel-border group-hover:text-neon-cyan/60 transition-colors" />
                    )}
                    {revealed && isCorrect && (
                      <span className="ml-auto font-mono text-[10px] tracking-wider text-neon-cyan">
                        CORRECT
                      </span>
                    )}
                    {revealed && isSelected && !isCorrect && (
                      <span className="ml-auto font-mono text-[10px] tracking-wider text-neon-pink">
                        WRONG
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Reset bar */}
            {revealed && (
              <div className="border-t border-panel-border px-6 py-4 flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-wider text-muted-foreground">
                  {selectedOption === sampleQuestion.correct
                    ? "VICTORY --- +25 RATING"
                    : "DEFEATED --- -10 RATING"}
                </span>
                <button
                  onClick={handleReset}
                  className="font-mono text-[11px] tracking-widest text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                >
                  RETRY
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
