import { LiveArena } from "@/components/arena/live-arena"

export default function LiveArenaPage({ searchParams }: { searchParams: { arenaId?: string } }) {
  const arenaId = searchParams.arenaId || "1" // Fallback if missing
  return (
    <main className="min-h-screen bg-deep-bg">
      <LiveArena arenaId={arenaId} />
    </main>
  )
}
