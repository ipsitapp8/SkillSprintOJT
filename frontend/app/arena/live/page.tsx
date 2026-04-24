import { Suspense } from "react"
import { LiveArena } from "@/components/arena/live-arena"

export default function LiveArenaPage() {
  return (
    <main className="min-h-screen bg-deep-bg">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><span className="font-mono text-xs tracking-widest text-neon-cyan animate-pulse">LOADING...</span></div>}>
        <LiveArena />
      </Suspense>
    </main>
  )
}
