import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { CheckoutPageContent } from '@/components/checkout-page-content'

export default function CheckoutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar solid />

      <section className="container mx-auto max-w-[94rem] px-4 pb-16 pt-32 md:px-6 md:pt-40 lg:px-12">
        <h1 className="font-serif text-5xl font-bold leading-[0.98] text-forest md:text-7xl">
          Finalizare <span className="text-burgundy">comandă</span>
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-forest/75 md:text-xl">
          Completează datele de livrare și verifică sumarul comenzii din partea
          dreaptă.
        </p>

        <div className="mt-10 md:mt-14">
          <CheckoutPageContent />
        </div>
      </section>

      <Footer />
    </main>
  )
}
