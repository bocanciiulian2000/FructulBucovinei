import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { CartPageContent } from '@/components/cart-page-content'

export default function CosPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar solid />

      <section className="container mx-auto max-w-[94rem] px-4 pb-16 pt-32 md:px-6 md:pt-40 lg:px-12">
        <h1 className="font-serif text-5xl font-bold leading-[0.98] text-forest md:text-7xl">
          Coșul de <span className="text-burgundy">cumpărături</span>
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-forest/75 md:text-xl">
          Verifică produsele adăugate, ajustează cantitățile și continuă către
          finalizarea comenzii.
        </p>

        <div className="mt-10 md:mt-14">
          <CartPageContent />
        </div>
      </section>

      <Footer />
    </main>
  )
}
