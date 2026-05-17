import Image from 'next/image'
import { CtaSection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

const familyActivityImages = [
  {
    src: '/images/event-picnic.jpg',
    alt: 'Familie la picnic în livadă',
  },
  {
    src: '/images/gallery-5.jpg',
    alt: 'Familie în livada Fructul Bucovinei',
  },
  {
    src: '/images/event-workshop.jpg',
    alt: 'Atelier pentru copii în livadă',
  },
]

const specialActivities = [
  {
    title: 'Vânătoare de ouă',
    description:
      'O activitate de Paște pentru copii, cu surprize ascunse printre pomi și multă bucurie în aer liber.',
    image: '/imagini_evenimente/vanatoareadeoua.jpeg',
    alt: 'Vânătoare de ouă în livadă',
  },
  {
    title: 'Picnicuri în livadă',
    description:
      'Un cadru relaxat pentru familie sau prieteni, cu gustări simple, aer curat și timp petrecut în natură.',
    image: '/images/event-picnic.jpg',
    alt: 'Picnic în livada Fructul Bucovinei',
  },
  {
    title: 'Campanii verzi și educative',
    description:
      'Activități prin care copiii și adulții descoperă natura, pomii fructiferi și grija pentru mediu.',
    image: '/imagini_evenimente/campaniiverzi.jpg',
    alt: 'Activitate educativă în livadă',
  },
  {
    title: 'Ateliere de suc',
    description:
      'O experiență practică și gustoasă, în care merele se transformă în suc proaspăt, pas cu pas.',
    image: '/imagini_evenimente/atelierdesuc.jpg',
    alt: 'Atelier de suc de mere',
  },
]

const testimonials = [
  {
    quote:
      'A fost una dintre cele mai frumoase ieșiri cu copiii. Au cules mere, au alergat prin livadă și au plecat acasă cu povești de spus.',
    name: 'Andra',
    location: 'Suceava',
  },
  {
    quote:
      'Ne-a plăcut mult atmosfera simplă și caldă. Totul a fost relaxat, iar livada are un farmec aparte, mai ales în perioada recoltei.',
    name: 'Mihai',
    location: 'Iași',
  },
  {
    quote:
      'Am venit cu un grup de prieteni și ne-am simțit ca într-o mică vacanță. Culesul merelor a fost partea preferată a tuturor.',
    name: 'Elena',
    location: 'Botoșani',
  },
]

export default function EvenimentePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar />
      <section className="relative h-[62vh] min-h-[390px] overflow-hidden md:h-[70vh] md:min-h-[460px]">
        <Image
          src="/imagini_evenimente/fructulbucovinei_herogalerie.jpg"
          alt="Experiențe în livada Fructul Bucovinei"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/70 via-forest/35 to-forest/10" />

        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-4 md:px-6 lg:px-12">
            <div className="max-w-[18rem] text-left md:max-w-4xl">
              <h1 className="font-serif text-4xl font-bold leading-[0.94] text-cream text-balance md:text-8xl lg:text-9xl">
                Experiențe de neuitat,{' '}
                <span className="text-cream/85">în livadă.</span>
              </h1>
              <p className="mt-4 max-w-[17rem] text-sm leading-relaxed text-cream/85 text-balance md:mt-8 md:max-w-3xl md:text-2xl">
                Vino cu cei dragi să te bucuri de culesul de mere,
                direct din livada Fructul Bucovinei.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-visible bg-cream px-4 py-8 md:px-6 md:py-16 lg:px-12">
        <div className="container mx-auto grid grid-cols-[0.85fr_1.15fr] items-center gap-3 md:gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[250px] overflow-visible md:min-h-[580px] lg:min-h-[620px]">
            <div className="pointer-events-none absolute -left-4 top-1/2 h-[88%] w-[104%] -translate-y-1/2 md:-left-12 md:h-[104%] md:w-[112%] lg:-left-35 lg:h-[112%] lg:w-[128%]">
              <Image
                src="/imagini_evenimente/props/propcrem.png"
                alt=""
                fill
                className="object-contain object-left"
                sizes="(max-width: 1024px) 120vw, 68vw"
              />
            </div>
            <div className="absolute -left-16 top-1/2 h-[122%] w-[142%] -translate-y-1/2 md:-left-28 md:h-[126%] md:w-[126%] lg:-left-72 lg:h-[132%] lg:w-[145%]">
              <Image
                src="/imagini_evenimente/props/propcosmere.png"
                alt="Coș cu mere Fructul Bucovinei"
                fill
                className="object-contain object-left"
                sizes="(max-width: 1024px) 115vw, 64vw"
              />
            </div>
          </div>

          <div className="relative z-10 max-w-3xl text-left">
            <Image
              src="/imagini_evenimente/props/propfrunzulita.png"
              alt=""
              width={260}
              height={260}
              className="pointer-events-none mx-auto mb-2 h-auto w-20 -translate-x-3 object-contain md:mb-5 md:w-56 md:-translate-x-10 lg:w-64 lg:-translate-x-24"
            />
            <h2 className="font-serif text-3xl font-bold leading-[0.98] text-forest text-balance md:text-7xl lg:text-8xl">
              Vino și culege merele,{' '}
              <span className="text-burgundy">chiar tu.</span>
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-forest/80 md:mt-8 md:text-xl">
              Fructul Bucovinei îți oferă posibilitatea să culegi recolta chiar tu,
              direct din pomi. Te așteptăm în livadă cu oameni dragi, aer curat și mere
              proaspete, pentru o experiență simplă, autentică și plină de gust.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-cream px-4 py-8 md:px-6 md:py-16 lg:px-12">
        <div className="container mx-auto">
          <div className="mx-auto max-w-5xl text-left">
            <h2 className="font-serif text-4xl font-bold leading-[0.98] text-forest text-balance md:text-7xl lg:text-8xl">
              Activități pentru{' '}
              <span className="text-burgundy">familii</span>
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-forest/80 md:mt-8 md:text-xl">
              Experiențele din livadă sunt gândite pentru familii, copii și grupuri de prieteni
              care vor să petreacă timp frumos în natură. De la culesul merelor până la plimbări
              printre pomi, fiecare vizită devine o amintire caldă și ușor de dus mai departe.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-3 gap-2 md:mt-16 md:gap-5 lg:gap-7">
            {familyActivityImages.map((image) => (
              <div
                key={image.src}
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#fbf7ee] shadow-sm ring-1 ring-forest/10 md:rounded-3xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-5xl text-left md:mt-20">
            <h3 className="font-serif text-4xl font-bold leading-[0.98] text-forest text-balance md:text-7xl">
              Activități{' '}
              <span className="text-burgundy">speciale</span>
            </h3>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-forest/80 md:text-xl">
              Pe lângă vizitele clasice în livadă, pregătim activități de sezon și experiențe
              educative, potrivite pentru copii, familii și grupuri care vor să petreacă timp
              cu sens în natură.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 md:mt-10 md:gap-5 lg:grid-cols-4 lg:gap-6">
            {specialActivities.map((activity) => (
              <article
                key={activity.title}
                className="overflow-hidden rounded-xl bg-[#fbf7ee] shadow-sm ring-1 ring-forest/10 md:rounded-3xl"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={activity.image}
                    alt={activity.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 24vw"
                  />
                </div>
                <div className="p-3 md:p-5">
                  <h4 className="font-serif text-xl font-bold leading-none text-forest md:text-3xl">
                    {activity.title}
                  </h4>
                  <p className="mt-2 text-[0.72rem] leading-snug text-forest/75 md:mt-3 md:text-base md:leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-visible bg-cream px-4 py-8 md:px-6 md:py-16 lg:px-12">
        <div className="container mx-auto grid grid-cols-[0.85fr_1.15fr] items-center gap-3 md:gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[250px] overflow-visible md:min-h-[580px] lg:min-h-[620px]">
            <div className="absolute -left-10 top-1/2 h-[112%] w-[132%] -translate-y-1/2 md:-left-28 md:h-[126%] md:w-[126%] lg:-left-72 lg:h-[132%] lg:w-[145%]">
              <Image
                src="/imagini_evenimente/props/propparericlienti.png"
                alt="Păreri de la clienții Fructul Bucovinei"
                fill
                priority
                className="object-contain object-left"
                sizes="(max-width: 1024px) 115vw, 64vw"
              />
            </div>
          </div>

          <div className="relative z-10 max-w-3xl text-left">
            <div className="relative overflow-visible">
              <div className="pointer-events-none absolute -bottom-10 -left-10 -right-8 -top-10 z-0 md:-bottom-22 md:-left-90 md:-right-22 md:-top-26">
                <Image
                  src="/imagini_evenimente/props/proppatacrem.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 48vw"
                />
              </div>
              <h2 className="relative z-10 font-serif text-3xl font-bold leading-[0.98] text-forest text-balance md:text-7xl lg:text-8xl">
                Păreri de la{' '}
                <span className="text-burgundy">clienții noștri</span>
              </h2>
            </div>

            <div className="mt-4 space-y-2 md:mt-10 md:space-y-5">
              {testimonials.map((testimonial) => (
                <article
                  key={`${testimonial.name}-${testimonial.location}`}
                  className="rounded-xl bg-[#fbf7ee] p-3 shadow-sm ring-1 ring-forest/10 md:rounded-3xl md:p-6"
                >
                  <p className="text-[0.7rem] leading-snug text-forest/80 md:text-lg md:leading-relaxed">
                    “{testimonial.quote}”
                  </p>
                  <div className="mt-3 border-t border-brown/25 pt-3 md:mt-5 md:pt-4">
                    <h3 className="font-serif text-xl font-bold leading-none text-brown md:text-3xl">
                      {testimonial.name}
                    </h3>
                    <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-wide text-forest/60 md:mt-2 md:text-sm">
                      {testimonial.location}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaSection />

      <Footer />
    </main>
  )
}
