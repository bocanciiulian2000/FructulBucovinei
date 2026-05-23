import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { adoptPackages } from '@/lib/adopt-packages'

type PackageDetailsPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return adoptPackages.map((pkg) => ({
    slug: pkg.slug,
  }))
}

export default async function PackageDetailsPage({ params }: PackageDetailsPageProps) {
  const { slug } = await params
  const pkg = adoptPackages.find((item) => item.slug === slug)

  if (!pkg) {
    notFound()
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar solid />

      <section className="relative overflow-visible bg-cream px-4 pb-12 pt-32 md:px-6 md:pb-20 md:pt-36 lg:px-12">
        <div className="container mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-start lg:gap-12">
          <div>
            <div className="relative aspect-[4/4.35] overflow-hidden rounded-3xl bg-[#fbf7ee] shadow-sm ring-1 ring-forest/10 md:aspect-square">
              <Image
                src={pkg.image}
                alt={pkg.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
              <button
                type="button"
                className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-forest shadow-sm transition-colors hover:bg-burgundy hover:text-cream"
                aria-label="Imaginea anterioară"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-forest shadow-sm transition-colors hover:bg-burgundy hover:text-cream"
                aria-label="Imaginea următoare"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              {pkg.gallery.slice(1).map((image) => (
                <div
                  key={image}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-[#fbf7ee] shadow-sm ring-1 ring-forest/10"
                >
                  <Image
                    src={image}
                    alt={pkg.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 24vw"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-3xl rounded-3xl bg-[#fbf7ee] p-6 shadow-sm ring-1 ring-forest/10 md:p-8 lg:p-10">
            <p className="font-serif text-xl font-bold leading-none text-forest md:text-3xl">
              Adoptă un pom - Pachet fizic
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-[0.94] text-brown text-balance md:text-6xl lg:text-7xl">
              {pkg.name}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-forest/80 md:text-xl">
              {pkg.description}
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <p className="text-sm font-bold text-forest md:text-lg">
                  Cantitate {pkg.contents}
                </p>
                <p className="mt-2 text-2xl font-bold text-forest md:text-4xl">
                  Preț: <span>{pkg.price}</span>
                </p>
                <p className="mt-2 text-xs text-forest/70 md:text-base">
                  (TVA inclus, transport inclus).
                </p>
                <p className="mt-5 font-serif text-lg italic text-forest/65 md:text-xl">
                  În stoc
                </p>
              </div>

              <div>
                <label htmlFor="apple-type" className="text-sm font-bold text-forest md:text-base">
                  Tipul de mere
                </label>
                <select
                  id="apple-type"
                  className="mt-3 h-12 w-full rounded-xl border border-forest/20 bg-cream px-4 text-sm text-forest outline-none transition-colors focus:border-burgundy md:h-14 md:text-base"
                  defaultValue=""
                >
                  <option value="">Alege o opțiune</option>
                  <option>Mere roșii - Red Chief</option>
                  <option>Mere Golden</option>
                  <option>Mere mixte din livadă</option>
                </select>
              </div>

              <div className="pt-4">
                <h2 className="text-sm font-bold text-forest md:text-lg">
                  Completează detaliile pentru certificatul de adopție:
                </h2>

                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="certificate-name" className="text-xs font-semibold text-forest md:text-sm">
                      Numele care să apară pe certificat
                    </label>
                    <input
                      id="certificate-name"
                      type="text"
                      placeholder="Popescu Andrei"
                      className="mt-2 h-12 w-full rounded-xl border border-forest/20 bg-cream px-4 text-sm text-forest outline-none transition-colors focus:border-burgundy md:text-base"
                    />
                  </div>

                  <div>
                      <label htmlFor="tree-name" className="text-xs font-semibold text-forest md:text-sm">
                        Numele pomului adoptat
                      </label>
                      <input
                        id="tree-name"
                        type="text"
                        placeholder="Dobi"
                        className="mt-2 h-12 w-full rounded-xl border border-forest/20 bg-cream px-4 text-sm text-forest outline-none transition-colors focus:border-burgundy md:text-base"
                      />
                  </div>

                  <div>
                    <label htmlFor="tree-message" className="text-xs font-semibold text-forest md:text-sm">
                      Mesaj personalizat pentru pom
                    </label>
                    <textarea
                      id="tree-message"
                      placeholder="Scrie aici mesajul care va fi pus în fața pomului."
                      rows={4}
                      className="mt-2 w-full resize-none rounded-xl border border-forest/20 bg-cream px-4 py-3 text-sm leading-relaxed text-forest outline-none transition-colors focus:border-burgundy md:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-[8rem_1fr]">
                <div className="grid h-14 grid-cols-3 overflow-hidden rounded-xl border border-brown/45 bg-cream text-forest">
                  <button type="button" className="flex items-center justify-center transition-colors hover:bg-burgundy hover:text-cream" aria-label="Scade cantitatea">
                    <Minus size={16} />
                  </button>
                  <span className="flex items-center justify-center text-sm font-bold">1</span>
                  <button type="button" className="flex items-center justify-center transition-colors hover:bg-burgundy hover:text-cream" aria-label="Crește cantitatea">
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  className="h-14 rounded-xl bg-burgundy px-6 text-sm font-bold text-cream transition-colors hover:bg-forest md:text-base"
                >
                  Adaugă în coș
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-cream px-4 pb-16 md:px-6 md:pb-24 lg:px-12">
        <div className="container mx-auto max-w-6xl border-t border-brown/35 pt-10 md:pt-14">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif text-3xl font-bold leading-none text-forest md:text-5xl">
                Include
              </h2>
              <ul className="mt-5 space-y-2 text-sm leading-snug text-forest/80 md:mt-6 md:text-lg">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-3 size-1.5 shrink-0 rounded-full bg-burgundy" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-bold leading-none text-forest md:text-5xl">
                Ce trebuie să știi
              </h2>
              <ul className="mt-5 space-y-2 text-sm leading-snug text-forest/80 md:mt-6 md:text-lg">
                {pkg.usefulDetails.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-3 size-1.5 shrink-0 rounded-full bg-burgundy" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
