
import { ArenaLobby } from "@/components/arena/arena-lobby"
import { TestArena } from "@/components/arena/test-arena"

export default function ArenaPage() {
  return (
    <main className="min-h-screen bg-deep-bg">

      <div className="pt-20">
        <ArenaLobby />
      </div>

      {/* Coding Tests Section */}
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-4">
        <div className="h-px bg-panel-border" />
      </div>
      <TestArena />
    </main>
  )
}
