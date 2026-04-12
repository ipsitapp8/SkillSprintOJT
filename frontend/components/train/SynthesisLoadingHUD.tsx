"use client"

import { useEffect, useState } from "react"
import { Loader2, Zap, Brain, Shield, Activity, Globe } from "lucide-react"

interface SynthesisLoadingHUDProps {
  topic: string
  difficulty: string
}

export function SynthesisLoadingHUD({ topic, difficulty }: SynthesisLoadingHUDProps) {
  const [logs, setLogs] = useState<string[]>([
    "Initializing neural link...",
    "Accessing technical archives...",
  ])

  useEffect(() => {
    const statuses = [
      `Analyzing domain: ${topic}...`,
      "Identifying interview patterns...",
      `Structuring ${difficulty} level puzzles...`,
      "Synchronizing logic constraints...",
      "Finalizing neural injection...",
    ]

    let current = 0
    const interval = setInterval(() => {
      if (current < statuses.length) {
        setLogs(prev => [...prev.slice(-3), statuses[current]])
        current++
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [topic, difficulty])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-deep-bg/95 backdrop-blur-xl transition-all duration-500">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      
      <div className="relative w-full max-w-lg px-8 py-12 flex flex-col items-center">
        {/* Animated Neural Core */}
        <div className="relative mb-12">
            <div className="absolute inset-0 rounded-full bg-neon-cyan/20 blur-3xl animate-pulse" />
            <div className="relative h-24 w-24">
                <Loader2 className="absolute inset-0 h-24 w-24 text-neon-cyan animate-spin opacity-40" />
                <div className="absolute inset-4 rounded-full border border-neon-cyan/30 flex items-center justify-center">
                    <Brain className="h-8 w-8 text-neon-cyan animate-pulse" />
                </div>
                <Zap className="absolute -top-2 -right-2 h-6 w-6 text-neon-pink animate-bounce delay-700" />
            </div>
        </div>

        {/* Text Area */}
        <div className="text-center space-y-6 w-full">
            <div className="space-y-1">
                <h2 className="text-3xl font-black italic tracking-widest text-foreground uppercase">NEURAL SYNTHESIS</h2>
                <div className="flex items-center justify-center gap-2">
                    <span className="h-px w-8 bg-neon-cyan/40" />
                    <span className="font-mono text-[10px] tracking-[0.4em] text-neon-cyan uppercase">AI Generation In Progress</span>
                    <span className="h-px w-8 bg-neon-cyan/40" />
                </div>
            </div>

            {/* Matrix Logs */}
            <div className="bg-black/40 border border-panel-border p-6 rounded-lg text-left space-y-2 min-h-[140px]">
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-3 items-center animate-in fade-in slide-in-from-left-4 duration-500">
                        <Activity className="h-3 w-3 text-neon-cyan/60" />
                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                           [{new Date().toLocaleTimeString([], { hour12: false })}] <span className="text-foreground/80">{log}</span>
                        </span>
                    </div>
                ))}
            </div>

            {/* Neural Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between font-mono text-[9px] text-muted-foreground tracking-widest">
                    <span>STATUS: GENERATING</span>
                    <span className="text-neon-cyan">88%</span>
                </div>
                <div className="h-1 bg-panel-border overflow-hidden">
                    <div className="h-full bg-neon-cyan animate-progress shadow-[0_0_15px_#00e5ff]" />
                </div>
            </div>
            
            <p className="font-mono text-[9px] text-muted-foreground uppercase opacity-40 max-w-xs mx-auto">
                Decrypting high-frequency technical parameters from the source. Please remain connected.
            </p>
        </div>
      </div>
    </div>
  )
}
