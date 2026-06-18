import Image from 'next/image'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ProductCard } from '@/components/product-card'
import { adoptPackages } from '@/lib/adopt-packages'

export default function AdoptaUnPomPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar solid />

      <section className="relative px-4 pb-10 pt-32 md:px-6 md:pb-14 md:pt-40 lg:px-12">
        <div className="container mx-auto max-w-[94rem]">
          <div className="mb-4 flex max-w-5xl -translate-x-6 justify-center md:mb-6 md:-translate-x-45">
            <Image
              src="/imagini_adoptaunpom/propfrunzulita.png"
              alt=""
              width={160}
              height={120}
              className="h-auto w-28 object-contain md:w-48"
              priority
            />
          </div>
          <h1 className="mt-3 max-w-5xl font-serif text-4xl font-bold leading-[0.98] text-forest md:text-6xl lg:text-[4.5rem]">
            <span className="text-burgundy">Pachete</span>{' '}
            <span className="text-forest">„Adoptă un pom”</span>
          </h1>
          <div className="mt-5 grid gap-8 md:mt-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.5fr)] lg:items-center lg:gap-12">
            <p className="max-w-3xl text-base leading-relaxed text-forest/75 md:text-xl">
              Un pom poate face mai mult decât să rodească. Poate păstra o amintire, un nume, un gând sau
              o valoare pe care vrei să o lași mai departe. Prin campania „Adoptă un Pom”, alegi un pom din
              livada noastră și îi dăruiești o parte din povestea ta. Un citat, un mesaj sau câteva cuvinte care
              te reprezintă vor însoți pomul și vor deveni parte din identitatea lui. Noi îi vom purta de grijă în
              fiecare anotimp, iar tu vei primi rodul muncii și al naturii, împreună cu povești despre viața
              simplă, respectul pentru pământ și tradițiile care încă dau sens lucrurilor făcute cu răbdare.
              Fiecare pom adoptat devine un simbol al legăturii dintre oameni și natură, dintre prezent și ceea
              ce alegem să lăsăm în urmă. Pentru că cele mai frumoase povești nu se scriu pe hârtie. Ele
              cresc, înfloresc și dau roade.
            </p>
            <div className="relative mt-8 aspect-[4/3] w-full max-w-2xl scale-110 justify-self-center md:mt-10 md:-translate-x-14 md:scale-[1.25] lg:mt-0 lg:max-w-5xl lg:-translate-x-24 lg:-translate-y-12 lg:scale-[1.5]">
              <Image
                src="/imagini_adoptaunpom/propcrem.png"
                alt=""
                fill
                className="z-0 scale-110 object-contain"
                sizes="(max-width: 1024px) 85vw, 34vw"
              />
              <Image
                src="/imagini_adoptaunpom/fructulbucovinei_mereimprastiate.png"
                alt="Mere împrăștiate Fructul Bucovinei"
                fill
                priority
                className="z-10 object-contain"
                sizes="(max-width: 1024px) 85vw, 34vw"
              />
            </div>
          </div>
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
