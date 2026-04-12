"use client"

import { Zap, Shield, Brain, ArrowRight, Activity, MessageSquare } from "lucide-react"

interface AIDebriefProps {
  isCorrect: boolean
  feedback: string
  explanation: string
  concept?: string
}

export function AIDebrief({ isCorrect, feedback, explanation, concept }: AIDebriefProps) {
  if (!feedback && !explanation) return null

  return (
    <div className={`relative overflow-hidden border p-5 transition-all animate-in fade-in slide-in-from-top-4 duration-500 ${
      isCorrect 
        ? "border-neon-cyan/30 bg-neon-cyan/[0.03]" 
        : "border-neon-pink/30 bg-neon-pink/[0.03]"
    }`}>
      {/* Cinematic status line */}
      <div className="flex items-center justify-between mb-4 border-b border-panel-border/30 pb-3">
        <div className="flex items-center gap-2">
           <Activity className={`h-3 w-3 ${isCorrect ? 'text-neon-cyan' : 'text-neon-pink'}`} />
           <span className="font-mono text-[9px] tracking-[0.3em] font-black uppercase text-foreground opacity-80">
             {isCorrect ? 'NEURAL_SYNC_STABLE' : 'SYNC_FAILURE_DETECTED'}
           </span>
        </div>
        {concept && (
            <span className="font-mono text-[9px] px-2 py-0.5 border border-panel-border text-muted-foreground uppercase">
                Topic: {concept}
            </span>
        )}
      </div>

      <div className="space-y-4">
        {/* The Analysis */}
        <div className="flex gap-4 items-start">
            <div className={`mt-1 p-1.5 rounded-full ${isCorrect ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-neon-pink/10 text-neon-pink'}`}>
                <Brain className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-1">
                <span className="block font-mono text-[10px] uppercase font-bold text-foreground/80 tracking-wider">Neural Logic Deconstruction</span>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                    &quot;{feedback}&quot;
                </p>
            </div>
        </div>

        {/* The Explanation */}
        {explanation && (
            <div className="flex gap-4 items-start border-t border-panel-border/20 pt-4">
                <div className="mt-1 p-1.5 rounded-full bg-white/5 text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1">
                    <span className="block font-mono text-[10px] uppercase font-bold text-foreground/80 tracking-wider">Concept Alignment</span>
                    <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                        {explanation}
                    </p>
                </div>
            </div>
        )}

        {/* Optimization Path */}
        {!isCorrect && (
            <div className="flex items-center justify-between gap-4 border-t border-panel-border/20 pt-4 bg-neon-yellow/[0.02] -mx-5 -mb-5 p-5 mt-4">
                <div className="flex items-center gap-3">
                    <Shield className="h-3.5 w-3.5 text-neon-yellow" />
                    <div>
                        <span className="block font-mono text-[9px] uppercase font-black text-neon-yellow tracking-widest">Study Recommendation</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono">Focus on logical edge-case verification</span>
                    </div>
                </div>
                <div className="h-8 w-8 rounded-full border border-neon-yellow/30 flex items-center justify-center text-neon-yellow">
                    <ArrowRight className="h-4 w-4" />
                </div>
            </div>
        )}
      </div>

      {/* Background decoration */}
      <div className={`absolute -right-4 -bottom-4 h-24 w-24 blur-3xl opacity-10 ${isCorrect ? 'bg-neon-cyan' : 'bg-neon-pink'}`} />
    </div>
  )
}
