import { Nav } from "@/components/nav"
import { SprintContent } from "@/components/sprint/sprint-content"

export default function SprintPage() {
  return (
    <main className="min-h-screen bg-deep-bg">
      <Nav />
      <div className="pt-20">
        <SprintContent />
      </div>
    </main>
  )
}
