// app/page.tsx
import { HeroSection } from '@/components/hero-section'
import { FeatureGrid } from '@/components/feature-grid'
import { HowItWorks } from '@/components/how-it-works'
import { TrendingApps } from '@/components/trending-apps'
import { PricingSection } from '@/components/pricing-section'
import { CTASection } from '@/components/cta-section'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <div className="gradient-bg fixed inset-0 pointer-events-none" />
      <HeroSection />
      <FeatureGrid />
      <HowItWorks />
      <TrendingApps />
      <PricingSection />
      <CTASection />
    </main>
  )
}