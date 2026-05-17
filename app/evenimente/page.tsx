import Image from 'next/image'
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
      'În preajma Paștelui, livada devine un loc de joacă plin de culoare, cu surprize ascunse printre pomi și momente frumoase pentru copii.',
    image: '/images/event-festival.jpg',
    alt: 'Vânătoare de ouă în livadă',
  },
  {
    title: 'Picnicuri în livadă',
    description:
      'Pregătim un cadru relaxat pentru timp petrecut afară, cu gustări simple, aer curat și o atmosferă potrivită pentru familie sau prieteni.',
    image: '/images/event-picnic.jpg',
    alt: 'Picnic în livada Fructul Bucovinei',
  },
  {
    title: 'Campanii verzi și educative',
    description:
      'Organizăm activități prin care cei mici și cei mari pot înțelege mai bine natura, pomii fructiferi și grija pentru locul în care trăim.',
    image: '/images/story-orchard.jpg',
    alt: 'Activitate educativă în livadă',
  },
  {
    title: 'Ateliere de suc',
    description:
      'De la fruct la pahar, participanții descoperă pașii prin care merele se transformă în suc proaspăt, într-o experiență practică și gustoasă.',
    image: '/images/gallery-3.jpg',
    alt: 'Atelier de suc de mere',
  },
]

export default function EvenimentePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar />
      <section className="relative h-[70vh] min-h-[460px] overflow-hidden">
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
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl text-left">
              <h1 className="font-serif text-5xl font-bold leading-[0.94] text-cream text-balance md:text-8xl lg:text-9xl">
                Experiențe de neuitat,{' '}
                <span className="text-cream/85">în livadă.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-cream/85 text-balance md:mt-8 md:text-2xl">
                Vino cu cei dragi să te bucuri de culesul de mere,
                direct din livada Fructul Bucovinei.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-visible bg-cream px-6 py-12 md:py-16 lg:px-12">
        <div className="container mx-auto grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative min-h-[420px] overflow-visible md:min-h-[580px] lg:min-h-[620px]">
            <div className="absolute -left-16 top-1/2 h-[120%] w-[120%] -translate-y-1/2 md:-left-28 md:h-[126%] md:w-[126%] lg:-left-72 lg:h-[132%] lg:w-[145%]">
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
            <h2 className="font-serif text-5xl font-bold leading-[0.98] text-forest text-balance md:text-7xl lg:text-8xl">
              Vino și culege merele,{' '}
              <span className="text-burgundy">chiar tu.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-forest/80 md:mt-8 md:text-xl">
              Fructul Bucovinei îți oferă posibilitatea să culegi recolta chiar tu,
              direct din pomi. Te așteptăm în livadă cu oameni dragi, aer curat și mere
              proaspete, pentru o experiență simplă, autentică și plină de gust.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-cream px-6 py-12 md:py-16 lg:px-12">
        <div className="container mx-auto">
          <div className="mx-auto max-w-5xl text-left">
            <h2 className="font-serif text-5xl font-bold leading-[0.98] text-forest text-balance md:text-7xl lg:text-8xl">
              Activități pentru{' '}
              <span className="text-burgundy">familii</span>
            </h2>
            <p className="mt-6 max-w-4xl text-lg leading-relaxed text-forest/80 md:mt-8 md:text-xl">
              Experiențele din livadă sunt gândite pentru familii, copii și grupuri de prieteni
              care vor să petreacă timp frumos în natură. De la culesul merelor până la plimbări
              printre pomi, fiecare vizită devine o amintire caldă și ușor de dus mai departe.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:mt-16 md:grid-cols-3 lg:gap-7">
            {familyActivityImages.map((image) => (
              <div
                key={image.src}
                className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#fbf7ee] shadow-sm ring-1 ring-forest/10"
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

          <div className="mx-auto mt-16 max-w-5xl text-left md:mt-20">
            <h3 className="font-serif text-5xl font-bold leading-[0.98] text-forest text-balance md:text-7xl">
              Activități{' '}
              <span className="text-burgundy">speciale</span>
            </h3>
            <p className="mt-5 max-w-4xl text-lg leading-relaxed text-forest/80 md:text-xl">
              Pe lângă vizitele clasice în livadă, pregătim activități de sezon și experiențe
              educative, potrivite pentru copii, familii și grupuri care vor să petreacă timp
              cu sens în natură.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-2 lg:gap-7">
            {specialActivities.map((activity) => (
              <article
                key={activity.title}
                className="grid overflow-hidden rounded-3xl bg-[#fbf7ee] shadow-sm ring-1 ring-forest/10 md:grid-cols-[0.92fr_1.08fr]"
              >
                <div className="relative aspect-[4/3] md:aspect-auto">
                  <Image
                    src={activity.image}
                    alt={activity.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 24vw"
                  />
                </div>
                <div className="flex min-h-[220px] flex-col justify-center p-6 md:p-7">
                  <h4 className="font-serif text-3xl font-bold leading-none text-forest md:text-4xl">
                    {activity.title}
                  </h4>
                  <p className="mt-4 text-base leading-relaxed text-forest/75 md:text-lg">
                    {activity.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
