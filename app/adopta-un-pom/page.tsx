import Image from 'next/image'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

export default function AdoptaUnPomPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar />

      <section className="relative h-[62vh] min-h-[390px] overflow-hidden md:h-[70vh] md:min-h-[460px]">
        <Image
          src="/images/hero-orchard.jpg"
          alt="Livada Fructul Bucovinei"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/35 via-forest/10 to-forest/40" />
      </section>

      <Footer />
    </main>
  )
}
