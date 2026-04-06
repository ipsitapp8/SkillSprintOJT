import { Nav } from "@/components/nav"
import { ArenaLobby } from "@/components/arena/arena-lobby"

export default function ArenaPage() {
  return (
    <main className="min-h-screen bg-deep-bg">
      <Nav />
      <div className="pt-20">
        <ArenaLobby />
      </div>
    </main>
  )
}
