"use client"

import { useEffect, useState, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { TrainingSolver } from "@/components/train/training-solver"
import { Loader2, ShieldAlert, ArrowLeft, RefreshCcw, Info, ShieldCheck } from "lucide-react"

import { getFallbackQuestions } from "@/lib/mock-questions"

export default function TrainingPlayPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const { id } = params
  const topic = searchParams.get("topic") || "General"
  const mode = searchParams.get("mode") || "Standard"
  const difficulty = searchParams.get("difficulty") || "Medium"
  const count = parseInt(searchParams.get("count") || "10")
  
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [offlineStatus, setOfflineStatus] = useState<string | null>(null)

  const fetchQuestions = async () => {
    if (!id) return;
    setLoading(true)
    setOfflineStatus(null)
    
    try {
      if (id === "synthetic_ai") {
         const localData = sessionStorage.getItem("skillsprint_pending_ai_session");
         if (localData) {
            setQuestions(JSON.parse(localData));
            setOfflineStatus("[ SYNTHETIC AI GENERATION METRICS APPLIED ]");
            setLoading(false);
            return;
         }
      }

      // 1. Try fetching as a direct Quiz ID first
      const directQRes = await fetch(`http://localhost:8080/api/quizzes/${id}/questions`);
      if (directQRes.ok) {
        const qs = await directQRes.json();
        if (qs && qs.length > 0) {
          setQuestions(qs);
          setLoading(false);
          return;
        }
      }

      // 2. Try fetching as an Arena ID
      const arenaRes = await fetch(`http://localhost:8080/api/arenas/${id}/quizzes`);
      if (arenaRes.ok) {
        const quizzes = await arenaRes.json();
        if (quizzes && quizzes.length > 0) {
          const activeQuiz = quizzes[0];
          const qRes = await fetch(`http://localhost:8080/api/quizzes/${activeQuiz.id}/questions`);
          if (qRes.ok) {
            const qs = await qRes.json();
            if (qs && qs.length > 0) {
              setQuestions(qs);
              setLoading(false);
              return;
            }
          }
        }
      }

      // 3. empty backend response
      setQuestions(getFallbackQuestions(id, count));
      setOfflineStatus("No modules found. Loading default training set.");
      setLoading(false);
    } catch (err: any) {
      // 4. Server unavailable
      setQuestions(getFallbackQuestions(id, count));
      setOfflineStatus("Server unavailable. Running offline mode.");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-deep-bg">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-neon-cyan animate-spin" />
          <div className="absolute inset-0 h-12 w-12 border-b-2 border-neon-cyan/30 rounded-full animate-pulse" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tracking-[0.4em] text-neon-cyan uppercase">Initializing Neural Session</span>
          <span className="font-mono text-[8px] text-muted-foreground uppercase opacity-40 italic">Decrypting logical parameters...</span>
        </div>
      </div>
    )
  }

  if (questions.length === 0 && !loading) {
     return (
       <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-deep-bg p-4 relative overflow-hidden">
         <ShieldAlert className="h-12 w-12 text-neon-pink" />
         <div className="text-center">
            <h2 className="text-xl font-bold font-mono text-foreground uppercase tracking-widest">CRITICAL ANOMALY</h2>
            <p className="text-xs text-muted-foreground font-mono mt-2 uppercase">No data found in vault and fallback datasets are compromised.</p>
         </div>
         <button onClick={() => router.push("/train")} className="px-6 py-3 border border-panel-border bg-panel-bg/50 text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase hover:bg-white/5 transition-all flex items-center justify-center gap-2">
           <ArrowLeft className="h-3 w-3" /> Return to Hub
         </button>
       </div>
     )
  }

  return (
    <ProtectedRoute>
      <div className="relative">
         {offlineStatus && (
           <div className="fixed top-20 right-8 z-50 animate-pulse">
             <div className="flex items-center gap-2 px-3 py-2 bg-neon-yellow/10 border border-neon-yellow/40 backdrop-blur">
               <ShieldCheck className="h-4 w-4 text-neon-yellow" />
               <span className="font-mono text-[9px] text-neon-yellow uppercase tracking-widest font-black max-w-[200px] truncate">{offlineStatus}</span>
             </div>
           </div>
         )}
         <TrainingSolver 
           initialQuestions={questions}
           topic={topic + (offlineStatus ? " (Offline)" : "")}
           mode={mode}
           difficulty={difficulty}
           count={offlineStatus ? questions.length : count}
           arenaId={id}
         />
      </div>
    </ProtectedRoute>
  )
}
