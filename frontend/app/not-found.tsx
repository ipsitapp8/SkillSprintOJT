import Link from "next/link"
import { AlertCircle, ChevronLeft } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden bg-deep-bg">
      
      {/* Background anomalies */}
      <div className="absolute inset-0 scanlines opacity-50" />
      <div className="absolute w-[800px] h-[800px] bg-red-900/10 rounded-full blur-[150px] -top-[20%] -left-[10%] animate-pulse" />
      
      <div className="z-10 flex flex-col items-center text-center p-8 max-w-lg border border-border bg-panel-bg/80 backdrop-blur-md relative overflow-hidden">
        {/* Borders */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-destructive to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-destructive to-transparent opacity-50" />
        
        <AlertCircle className="h-16 w-16 text-destructive mb-6 animate-pulse" />
        
        <h1 className="font-mono text-5xl font-black text-white mb-2 tracking-tighter">
          404 <span className="text-destructive">_</span>
        </h1>
        
        <h2 className="font-mono text-xl text-foreground mb-6 tracking-widest uppercase">
          SIGNAL LOST
        </h2>
        
        <p className="font-sans text-sm text-muted-foreground mb-10 leading-relaxed">
          The requested coordinate does not exist within the SkillSprint network.
          It may have been purged, or your authorization level is insufficient.
        </p>
        
        <Link 
          href="/dashboard"
          className="group flex items-center gap-3 border border-neon-cyan text-neon-cyan px-6 py-3 font-mono text-xs tracking-widest hover:bg-neon-cyan/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          RETURN TO DASHBOARD
        </Link>
      </div>
    </div>
  )
}
