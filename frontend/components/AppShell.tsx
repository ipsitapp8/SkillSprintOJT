"use client"

import { usePathname } from "next/navigation"
import { Nav } from "./nav"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register')

  return (
    <div className="min-h-screen bg-deep-bg text-foreground">
      {!isAuthPage && <Nav />}
      <main className={!isAuthPage ? "pt-16 min-h-[calc(100vh-64px)] p-0" : "min-h-screen p-0"}>
        {children}
      </main>
    </div>
  )
}
