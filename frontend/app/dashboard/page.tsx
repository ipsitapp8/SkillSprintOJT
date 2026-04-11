
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-deep-bg">

        <div className="pt-20">
          <DashboardContent />
        </div>
      </main>
    </ProtectedRoute>
  )
}
