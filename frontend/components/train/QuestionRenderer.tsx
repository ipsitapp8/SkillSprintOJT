"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { AIDebrief } from "./ai-debrief"

interface Question {
  id: string
  prompt: string
  type: string
  options?: { id: string, text: string }[]
  template?: string
  hint?: string
}

interface RendererProps {
  question: Question
  answer: string
  onChange: (value: string) => void
  isLocked?: boolean
  result?: { isCorrect: boolean, feedback: string, explanation: string, correctOptionId?: string }
}

export function QuestionRenderer({ question, answer, onChange, isLocked, result }: RendererProps) {
  // Normalize types
  const type = question.type.toLowerCase()

  // 1. MCQ Renderer
  if (type === "mcq") {
    return (
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {question.options?.map((opt) => {
            const isSelected = answer === opt.id
            const isCorrect = result?.correctOptionId === opt.id
            const isWrong = isSelected && result && !isCorrect
            
            let borderClass = "border-panel-border bg-panel-bg/60 hover:border-neon-cyan/40"
            if (isSelected) borderClass = "border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            if (isLocked && isCorrect) borderClass = "border-neon-green bg-neon-green/10 shadow-[0_0_20px_rgba(0,255,150,0.15)]"
            if (isLocked && isWrong) borderClass = "border-neon-pink bg-neon-pink/10 shadow-[0_0_20px_rgba(255,45,111,0.15)]"

            return (
              <button
                key={opt.id}
                disabled={isLocked}
                onClick={() => onChange(opt.id)}
                className={`p-5 text-left border transition-all ${borderClass} ${isLocked ? 'cursor-default' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-foreground">{opt.text}</span>
                  {isLocked && isCorrect && <div className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse" />}
                </div>
              </button>
            )
          })}
        </div>
        {result && (
          <AIDebrief 
            isCorrect={result.isCorrect} 
            feedback={result.feedback} 
            explanation={result.explanation} 
          />
        )}
      </div>
    )
  }

  // 2. Code Renderer (Debug, Fix, Write)
  if (type.includes("code") || type.includes("debug") || type.includes("fix")) {
    return (
      <div className="flex flex-col gap-6">
        <div className="relative group">
           <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
           <textarea
            disabled={isLocked}
            value={answer || question.template || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="// Enter your code solution here..."
            className={`relative w-full h-[400px] bg-deep-bg/60 border ${result ? (result.isCorrect ? 'border-neon-green/40' : 'border-neon-pink/40') : 'border-panel-border'} p-6 font-mono text-xs leading-relaxed text-foreground focus:border-neon-cyan/50 focus:outline-none resize-none transition-colors`}
            spellCheck={false}
          />
          {result && (
            <div className={`absolute top-4 right-4 font-mono text-[9px] px-2 py-0.5 border ${result.isCorrect ? 'text-neon-green border-neon-green/30 bg-neon-green/5' : 'text-neon-pink border-neon-pink/30 bg-neon-pink/5'} uppercase tracking-widest`}>
              {result.isCorrect ? 'SYNC_SUCCESS' : 'SYNC_FAILED'}
            </div>
          )}
        </div>
        {result && (
          <AIDebrief 
            isCorrect={result.isCorrect} 
            feedback={result.feedback} 
            explanation={result.explanation} 
          />
        )}
      </div>
    )
  }

  // 3. Logic / Subjective Renderer (Explanation, Scenario, Brainstorm, or Unknown)
  const isGeneric = !type.includes("logic") && !type.includes("scenario") && !type.includes("brainstorm") && !type.includes("explanation")
  
  return (
    <div className="flex flex-col gap-6">
      <div className="relative group">
        {isGeneric && (
           <div className="absolute top-0 right-0 -mt-3 mr-4 z-10 px-2 py-0.5 bg-panel-bg border border-neon-cyan/50">
             <span className="font-mono text-[8px] text-neon-cyan uppercase font-bold tracking-widest leading-none block">Universal Input Fallback</span>
           </div>
        )}
        <textarea
          disabled={isLocked}
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isGeneric ? "Awaiting neural input..." : "Deconstruct your logic here..."}
          className={`w-full h-60 bg-deep-bg/60 border ${result ? (result.isCorrect ? 'border-neon-green/40' : 'border-neon-pink/40') : (isGeneric ? 'border-neon-cyan/30' : 'border-panel-border')} p-6 font-mono text-sm leading-relaxed text-foreground focus:border-neon-cyan/50 focus:outline-none resize-none transition-colors`}
        />
        {result && (
            <div className={`absolute top-4 right-4 font-mono text-[9px] px-2 py-0.5 border ${result.isCorrect ? 'text-neon-green border-neon-green/30 bg-neon-green/5' : 'text-neon-pink border-neon-pink/30 bg-neon-pink/5'} uppercase tracking-widest`}>
              {result.isCorrect ? 'LOGIC_MATCH' : 'LOGIC_ANOMALY'}
            </div>
        )}
      </div>
      {result && (
          <AIDebrief 
            isCorrect={result.isCorrect} 
            feedback={result.feedback} 
            explanation={result.explanation} 
          />
      )}
    </div>
  )
}
