import { notFound } from 'next/navigation'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { PackageImageGallery } from '@/components/package-image-gallery'
import { PackageStockPurchasePanel } from '@/components/package-stock-purchase-panel'
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

  const adoptionFormId = `adoption-details-${pkg.slug}`

  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar solid />

      <section className="relative overflow-visible bg-cream px-4 pb-12 pt-32 md:px-6 md:pb-20 md:pt-36 lg:px-12">
        <div className="container mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-start lg:gap-12">
          <PackageImageGallery
            name={pkg.name}
            image={pkg.image}
            gallery={pkg.gallery}
          />

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

            <PackageStockPurchasePanel pkg={pkg} formId={adoptionFormId} />
          </div>
        </div>
      </section>

      <section className="relative bg-cream px-4 pb-16 md:px-6 md:pb-24 lg:px-12">
        <div className="container mx-auto max-w-6xl border-t border-brown/35 pt-10 md:pt-14">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif text-3xl font-bold leading-none text-forest md:text-5xl">
                Ce primește clientul
              </h2>
              <ul className="mt-5 space-y-2 text-sm leading-snug text-forest/80 md:mt-6 md:text-lg">
                {pkg.includes.map((item) => {
                  const isSubheading = item.startsWith('COȘ CU PRODUSE')

                  return (
                    <li
                      key={item}
                      className={isSubheading ? 'pt-3 font-bold uppercase tracking-wide text-burgundy' : 'flex gap-2'}
                    >
                      {isSubheading ? (
                        item
                      ) : (
                        <>
                          <span className="mt-3 size-1.5 shrink-0 rounded-full bg-burgundy" />
                          <span>{item}</span>
                        </>
                      )}
                    </li>
                  )
                })}
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
