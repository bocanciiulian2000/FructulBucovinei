import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { IntroSection } from '@/components/intro-section'
import { AdoptSection } from '@/components/adopt-section'
import { AdoptProgramSection } from '@/components/adopt-program-section'
import { EventsSection } from '@/components/events-section'
import { GallerySection } from '@/components/gallery-section'
import { CtaSection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <IntroSection />
      <AdoptSection />
      <AdoptProgramSection />
      <EventsSection />
      <GallerySection />
      <CtaSection />
      <Footer />
    </main>
  )
}
