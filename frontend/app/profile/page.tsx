import { ProtectedRoute } from "@/components/ProtectedRoute"
import { User, Activity, Settings } from "lucide-react"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-2 w-2 rounded-full bg-neon-purple animate-pulse-glow" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-neon-purple uppercase">
            OPERATIVE DOSSIER
          </span>
        </div>
        
        <h1 className="text-3xl font-black uppercase tracking-tight text-foreground mb-10">
          YOUR <span className="text-neon-purple text-glow-purple">PROFILE</span>
        </h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 border border-border bg-card p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-2 border-neon-cyan/50 flex items-center justify-center mb-4 bg-neon-cyan/5">
              <User className="h-10 w-10 text-neon-cyan" />
            </div>
            <h2 className="font-mono font-bold text-lg text-foreground mb-1">OPERATIVE</h2>
            <div className="px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-mono text-[10px] tracking-widest mt-2">
              ACTIVE STATUS
            </div>
          </div>
          
          <div className="md:col-span-2 border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
               <Activity className="h-4 w-4 text-neon-purple" />
               <h3 className="font-mono text-sm tracking-widest text-foreground">STATISTICS</h3>
            </div>
            <p className="font-mono text-sm text-muted-foreground mt-10 text-center">
              Awaiting robust metric aggregation sequence...
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
