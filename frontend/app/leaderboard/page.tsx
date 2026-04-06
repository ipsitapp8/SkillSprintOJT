import { Nav } from "@/components/nav"
import { LeaderboardContent } from "@/components/leaderboard/leaderboard-content"

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-deep-bg">
      <Nav />
      <div className="pt-20">
        <LeaderboardContent />
      </div>
    </main>
  )
}
