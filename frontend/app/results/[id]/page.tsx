import { Nav } from "@/components/nav"
import { ResultsContent } from "@/components/results/results-content"
import { Suspense } from "react"

export default function ResultsDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-deep-bg">
      <Nav />
      <div className="pt-20">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><span className="font-mono text-muted-foreground animate-pulse">DECRYPTING DATA...</span></div>}>
          <ResultsContent id={params.id} />
        </Suspense>
      </div>
    </main>
  )
}
