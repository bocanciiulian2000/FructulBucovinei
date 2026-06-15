import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ProductCard } from '@/components/product-card'
import { adoptPackages } from '@/lib/adopt-packages'

export default function ProdusePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar solid />

      <section className="relative px-4 pb-10 pt-32 md:px-6 md:pb-14 md:pt-40 lg:px-12">
        <div className="container mx-auto max-w-[94rem]">
          <p className="font-serif text-xl font-semibold text-burgundy md:text-2xl">
            Fructul Bucovinei
          </p>
          <h1 className="mt-3 max-w-5xl font-serif text-4xl font-bold leading-[0.98] text-forest md:text-6xl lg:text-[4.5rem]">
            Produsele <span className="text-burgundy">noastre</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-forest/75 md:mt-7 md:text-xl">
            Alege pachetul care ți se potrivește și bucură-te de gustul livezii
            Fructul Bucovinei, pregătit cu grijă, poveste și roade crescute
            autentic.
          </p>
        </div>
      </section>

      <section className="relative px-4 pb-16 md:px-6 md:pb-24 lg:px-12">
        <div className="container mx-auto grid max-w-[94rem] gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7">
          {adoptPackages.map((pkg, index) => (
            <ProductCard key={pkg.id} pkg={pkg} index={index} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
