import Image from 'next/image'
import { ArrowRight, CalendarHeart, PackageCheck, Sprout } from 'lucide-react'

const programHighlights = [
  {
    icon: Sprout,
    title: 'Alegi pomul',
    text: 'Îți alegi pachetul potrivit și devii parte din povestea livezii noastre.',
  },
  {
    icon: CalendarHeart,
    title: 'Urmărești sezonul',
    text: 'Noi avem grijă de pom pe tot parcursul anului și îți povestim cum crește recolta.',
  },
  {
    icon: PackageCheck,
    title: 'Primești fructele',
    text: 'La momentul potrivit, fructele ajung la tine proaspete, pregătite simplu și atent.',
  },
]

export function AdoptProgramSection() {
  return (
    <section className="relative z-10 overflow-visible bg-cream py-16 text-forest lg:py-24">
      <div className="pointer-events-none absolute right-0 -top-44 z-0 hidden h-[132%] w-[50%] overflow-visible lg:block">
        <Image
          src="/imagini_landing-page/poza_fructulbucovinei_footer.png"
          alt=""
          fill
          className="scale-x-[-1] object-cover object-right opacity-80"
          sizes="50vw"
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <h2 className="font-serif text-6xl font-bold leading-[0.98] text-forest text-balance md:text-7xl lg:text-8xl">
              Adoptă un pom{' '}
              <span className="text-burgundy">din livada noastră</span>
            </h2>
          </div>

          <div className="max-w-3xl lg:ml-auto">
            <p className="text-xl leading-relaxed text-forest/80">
              Programul „Adoptă un pom” este felul nostru de a te aduce mai aproape de livadă.
              Alegi un pom din Fructul Bucovinei, iar noi îl îngrijim cu răbdare, sezon după sezon,
              până când roadele lui ajung proaspete la tine acasă.
            </p>
            <p className="mt-6 text-xl leading-relaxed text-forest/80">
              Este un cadou cu sens pentru familie, prieteni sau parteneri, dar și o promisiune
              frumoasă pentru tine: fructe românești, crescute cu grijă și trimise direct din livadă.
            </p>
            <p className="mt-6 text-xl leading-relaxed text-forest/80">
              Îl poți vizita în livadă, iar la recoltare poți veni împreună cu familia sau prietenii
              să îi culegeți roadele. Dacă preferi, ne ocupăm noi de tot și îți trimitem recolta
              copacului tău direct acasă.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 border-y border-brown/30 py-8 md:grid-cols-3 lg:mt-16">
          {programHighlights.map((item) => {
            const Icon = item.icon

            return (
              <div key={item.title} className="flex gap-4">
                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-burgundy text-cream">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-serif text-3xl font-bold text-brown">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-forest/75">
                    {item.text}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10">
          <a
            href="#adopta"
            className="group inline-flex items-center gap-3 rounded-sm bg-burgundy px-8 py-4 text-sm font-semibold uppercase tracking-wide text-cream transition-all duration-500 hover:gap-4 hover:bg-forest"
          >
            <span>Vezi pachetele</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
