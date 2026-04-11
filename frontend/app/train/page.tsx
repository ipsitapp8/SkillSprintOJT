import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Construction } from "lucide-react"

export default function TrainPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-neon-cyan/20 blur-2xl rounded-full animate-pulse" />
          <Construction className="h-16 w-16 text-neon-cyan relative z-10" />
        </div>
        
        <h1 className="text-3xl font-black uppercase tracking-widest text-foreground mb-4">
          TRAINING <span className="text-neon-cyan text-glow-cyan">OFFLINE</span>
        </h1>
        
        <p className="max-w-md font-mono text-sm text-muted-foreground leading-relaxed">
           The specialized training module is currently undergoing system maintenance. 
           Please return to the <span className="text-neon-cyan">ARENA</span> coordinate for active combat.
        </p>
      </div>
    </ProtectedRoute>
  )
}
