import { Nav } from "@/components/nav"
import { ResultsContent } from "@/components/results/results-content"
import { Suspense } from "react"

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-deep-bg">
      <Nav />
      <div className="pt-20">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><span className="font-mono text-muted-foreground">LOADING...</span></div>}>
          <ResultsContent />
        </Suspense>
      </div>
    </main>
  )
}
