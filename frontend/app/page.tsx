import { Nav } from "@/components/nav"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { ArenaPreviewSection } from "@/components/landing/arena-preview-section"
import { RanksSection } from "@/components/landing/ranks-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <HeroSection />
      <FeaturesSection />
      <ArenaPreviewSection />
      <RanksSection />
      <Footer />
    </main>
  )
}
