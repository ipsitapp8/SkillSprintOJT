import { Nav } from "@/components/nav"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-deep-bg">
      <Nav />
      <div className="pt-20">
        <DashboardContent />
      </div>
    </main>
  )
}
