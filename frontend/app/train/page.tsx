"use client"

import { ProtectedRoute } from "@/components/ProtectedRoute"
import { TopicCard } from "@/components/train/TopicCard"
import { ModeCard } from "@/components/train/ModeCard"
import { NotesUpload } from "@/components/train/NotesUpload"
import { 
  Brain, 
  Code2, 
  Database, 
  Layout, 
  MessageSquare, 
  Cpu, 
  Timer, 
  Target,
  UserCheck,
  Zap,
  Swords
} from "lucide-react"

const topTopics = [
  { 
    title: "DSA", 
    description: "Data Structures & Algorithms. Trees, Graphs, and DP combat prep.", 
    icon: Code2, 
    count: 42, 
    mastery: 65, 
    difficulty: "Hard" as const,
    lastScore: 78,
    color: "pink" as const 
  },
  { 
    title: "DBMS", 
    description: "Database Management. SQL, Normalization, and ACID architecture.", 
    icon: Database, 
    count: 24, 
    mastery: 42, 
    difficulty: "Medium" as const,
    lastScore: 85,
    color: "cyan" as const 
  },
  { 
    title: "OS", 
    description: "Operating Systems. Process Sync, Memory, and Kernel logic.", 
    icon: Cpu, 
    count: 18, 
    mastery: 15, 
    difficulty: "Medium" as const,
    lastScore: 40,
    color: "yellow" as const 
  },
  { 
    title: "JAVASCRIPT", 
    description: "JS Engines, Closures, Event Loop, and Web API mastery.", 
    icon: Layout, 
    count: 35, 
    mastery: 88, 
    difficulty: "Easy" as const,
    lastScore: 92,
    color: "cyan" as const 
  },
  { 
    title: "APTITUDE", 
    description: "Quantitative and Logical reasoning drills for speed.", 
    icon: Target, 
    count: 50, 
    mastery: 30, 
    difficulty: "Easy" as const,
    lastScore: 65,
    color: "yellow" as const 
  },
]

const trainingModes = [
  { title: "MOCK INTERVIEW", description: "Realistic AI-driven interview simulation with live feedback.", icon: UserCheck, duration: "30-min", difficulty: "Intermediate" as const, color: "cyan" as const },
  { title: "RAPID FIRE", description: "Fast-paced technical trivia to sharpen your reaction speed.", icon: Timer, duration: "5-min", difficulty: "Beginner" as const, color: "yellow" as const },
  { title: "SOFT SKILLS", description: "Behavioral practice with non-verbal and tonality analysis.", icon: MessageSquare, duration: "15-min", difficulty: "Intermediate" as const, color: "pink" as const },
]

export default function TrainPage() {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Hero Section */}
          <div className="flex flex-col gap-4 mb-12 lg:mb-16">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse-glow" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-neon-cyan uppercase">
                TRAINING DIVISION // ACTIVE
              </span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
                  DEVELOP YOUR <span className="text-neon-cyan text-glow-cyan">EDGE</span>
                </h1>
                <p className="font-mono text-sm leading-relaxed text-muted-foreground lg:text-base max-w-2xl">
                  Welcome to the Training Hub. Hone your technical skills, master advanced architecture, and simulate real-world interview conditions in a high-intensity environment.
                </p>
              </div>

              <div className="flex gap-4 p-4 border border-panel-border bg-panel-bg/40 backdrop-blur-sm self-start lg:self-auto">
                <div className="flex flex-col border-r border-panel-border pr-6">
                   <span className="font-mono text-[9px] text-muted-foreground uppercase mb-1">Weekly Intensity</span>
                   <span className="font-mono text-xl font-bold text-neon-cyan tracking-wider">12.4H</span>
                </div>
                <div className="flex flex-col pl-2">
                   <span className="font-mono text-[9px] text-muted-foreground uppercase mb-1">Global Tier</span>
                   <span className="font-mono text-xl font-bold text-neon-pink tracking-wider">Lvl 14</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Core Topics */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <Brain className="h-4 w-4 text-neon-cyan" />
              <span className="font-mono text-[11px] tracking-[0.3em] text-foreground uppercase">
                CORE TRAINING DOMAINS
              </span>
              <div className="h-px flex-1 bg-panel-border" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {topTopics.map((topic) => (
                <TopicCard key={topic.title} {...topic} />
              ))}
            </div>
          </div>

          {/* Section: Advanced Modes */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <Swords className="h-4 w-4 text-neon-yellow" />
              <span className="font-mono text-[11px] tracking-[0.3em] text-foreground uppercase">
                SPECIAL OPERATIONS
              </span>
              <div className="h-px flex-1 bg-panel-border" />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {trainingModes.map((mode) => (
                <ModeCard key={mode.title} {...mode} />
              ))}
            </div>
          </div>

          {/* Section: Notes / Upload */}
          <div className="mb-16">
            <NotesUpload />
          </div>

          {/* Ready status */}
          <div className="mt-20 flex flex-col items-center gap-6 pb-12">
            <div className="flex items-center gap-4">
              <div className="h-px w-16 bg-panel-border" />
              <div className="flex h-10 w-10 items-center justify-center border border-panel-border bg-panel-bg/40 animate-pulse">
                <Target className="h-5 w-5 text-neon-cyan" />
              </div>
              <div className="h-px w-16 bg-panel-border" />
            </div>
            <div className="text-center">
              <h3 className="font-mono text-xs font-bold tracking-[0.4em] text-foreground uppercase mb-2">READY TO SYNC?</h3>
              <p className="text-[10px] font-mono text-muted-foreground uppercase">SYSTEM STATUS: OPTIMAL // ALL MODULES LOADED</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
