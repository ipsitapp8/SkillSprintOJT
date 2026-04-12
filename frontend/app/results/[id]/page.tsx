import { ResultsContent } from "@/components/results/results-content"
import { Suspense } from "react"

export default async function ResultsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <main className="min-h-screen bg-deep-bg">
      <div className="pt-20">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><span className="font-mono text-muted-foreground animate-pulse">DECRYPTING DATA...</span></div>}>
          <ResultsContent id={id} />
        </Suspense>
      </div>
    </main>
  )
}
