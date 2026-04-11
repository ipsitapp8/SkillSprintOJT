"use client"

import { FileUp, FileText, Zap } from "lucide-react"

export function NotesUpload() {
  return (
    <div className="relative border border-panel-border bg-panel-bg/60 p-8 lg:p-12 overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <FileText className="h-40 w-40 -mr-16 -mt-16" />
      </div>

      <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 flex items-center justify-center border border-neon-pink text-neon-pink bg-neon-pink/5">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-mono text-[10px] tracking-[0.3em] text-neon-pink uppercase">
              COGNITIVE SYNC
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl pr-10">
            TRAIN FROM YOUR <span className="text-neon-pink text-glow-pink">NOTES</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground lg:text-base max-w-lg">
            Upload your lecture notes, PDFs, or technical summaries. Our AI will analyze the content and generate a personalized training simulation focused on your specific data.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
             <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase py-1 px-3 border border-panel-border bg-panel-bg/20">
                <div className="h-1 w-1 rounded-full bg-neon-pink" />
                OCR Enabled
             </div>
             <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase py-1 px-3 border border-panel-border bg-panel-bg/20">
                <div className="h-1 w-1 rounded-full bg-neon-cyan" />
                Context Aware
             </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-panel-border bg-panel-bg/40 p-12 text-center transition-all hover:bg-panel-bg/60 hover:border-neon-pink/40 cursor-pointer group/upload">
            <div className="mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-neon-pink/5 text-neon-pink transition-transform group-hover/upload:-translate-y-1">
              <FileUp className="h-8 w-8" />
            </div>
            <p className="font-mono text-xs font-bold tracking-widest text-foreground uppercase mb-1">
              DROP YOUR DATA HERE
            </p>
            <p className="text-[10px] text-muted-foreground font-mono uppercase">
              PDF, TXT, or DOCX up to 10MB
            </p>
          </div>
          
          {/* Decorative frame */}
          <div className="absolute -inset-1 border border-neon-pink/0 group-hover:border-neon-pink/10 pointer-events-none transition-all duration-500" />
        </div>
      </div>
    </div>
  )
}
