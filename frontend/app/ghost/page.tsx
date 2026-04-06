import { Nav } from "@/components/nav"
import { GhostReplay } from "@/components/ghost/ghost-replay"

export default function GhostPage() {
  return (
    <main className="min-h-screen bg-deep-bg">
      <Nav />
      <div className="pt-20">
        <GhostReplay />
      </div>
    </main>
  )
}
