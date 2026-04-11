import { LiveArena } from "@/components/arena/live-arena"

export default function ArenaPlayPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-deep-bg">
      <div className="pt-16">
        <LiveArena arenaId={params.id} />
      </div>
    </main>
  )
}
