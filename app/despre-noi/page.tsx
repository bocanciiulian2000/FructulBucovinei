import Image from 'next/image'
import { CtaSection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

const storyParagraphs = [
  'La granița dintre Bucovina și Vechea Moldovă nu s-a născut doar o livadă, s-a născut o poveste.',
  'O poveste care nu începe cu noi. Nici măcar cu tata. Începe cu palmele asprite ale bunicului, cu spatele încovoiat de muncă și cu credința că un pom sădit azi e o promisiune pentru mâine.',
  'Noi nu am moștenit doar pământ. Am moștenit răbdarea de a aștepta rodul. Am moștenit tăcerea dimineților reci în livadă. Am moștenit credința că nimic crescut cu drag nu se pierde.',
  'Dacă l-ai întreba pe tata ce-a făcut o viață întreagă, n-ar vorbi despre hectare. Ar zâmbi și ar spune simplu: „Am sădit un pom și-am crescut un pui de om.”',
  'Pentru că aici nu e doar despre fructe. E despre oameni. Despre rădăcinile care nu se văd, dar care țin totul în picioare. Despre mâini murdare de pământ și inimi curate.',
  'Fructul Bucovinei nu e un nume, e o promisiune. Promisiunea că vom continua să plantăm nu doar copaci, ci și visuri. Că fiecare pom va purta în el o poveste. Că fiecare roadă va spune, fără cuvinte, cine suntem.',
  'Poate că începutul nostru a fost scris demult, într-o vreme în care tu încă nu existai, dar fiecare om care ne trece pragul scrie un nou capitol. Iar noi astăzi ne scriem începutul pe hârtie.',
  'Fiindcă iubirea, atunci când e plantată bine, rodește pentru totdeauna.',
]

const storyColumns = [
  storyParagraphs.slice(0, 4).join(' '),
  storyParagraphs.slice(4).join(' '),
]

const aboutParagraphs = [
  'Astăzi cultivăm livezi moderne de măr, păr și prun în comunele Cornu Luncii și Rădășeni din județul Suceava, îmbinând tradiția pomiculturii cu tehnologiile agricole moderne. Dezvoltarea exploatației a fost susținută atât prin investiții proprii, cât și prin proiecte europene, care ne-au permis să înființăm plantații intensive și superintensive și să dotăm ferma cu utilaje performante.',
  'Punem accent pe calitate, trasabilitate și producție responsabilă, iar fructele noastre ajung atât la consumatorii locali, cât și în marile rețele de retail din România. Suntem membri ai unei cooperative agricole și credem că dezvoltarea durabilă se construiește prin colaborare, profesionalism și respect față de consumatori.',
  'La Fructul Bucovinei, fiecare recoltă poartă amprenta unei familii care și-a dedicat întreaga activitate cultivării unor fructe sănătoase, gustoase și autentice, crescute în inima Bucovinei.',
]

const cultivationSections = [
  {
    title: 'Ce cultivăm',
    text: 'În livezile noastre cultivăm soiuri de mere alese pentru gust, prospețime și echilibru. Printre ele se află soiul x și Golden, două soiuri apreciate pentru aromă, textură și felul în care păstrează caracterul autentic al fructelor crescute în Bucovina. Fiecare pom este îngrijit cu atenție, iar recolta ajunge la tine curată, gustoasă și plină de poveste.',
  },
  {
    title: 'Standarde de calitate',
    text: 'Lucrăm responsabil, cu grijă pentru pământ, pentru oameni și pentru fiecare fruct care pleacă din livadă. Urmărim calitatea din fiecare etapă, de la îngrijirea pomilor până la recoltare, sortare și pregătirea produselor pentru livrare.',
  },
]

const teamGalleryImages = [
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
  '/images/gallery-5.jpg',
  '/images/gallery-6.jpg',
]

export default function DespreNoiPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar />

      <section className="relative h-[50vh] min-h-[360px] overflow-hidden md:h-[90vh] md:min-h-[560px]">
        <Image
          src="/imagini_landing-page/poza_fructulbucovinei_hero.jpeg"
          alt="Livada Fructul Bucovinei"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/35 via-forest/10 to-forest/40" />
      </section>

      <section className="relative bg-cream px-4 py-12 md:px-6 md:py-24 lg:px-12">
        <div className="container mx-auto max-w-[94rem]">
          <h1 className="font-serif text-3xl font-bold leading-[0.98] tracking-tight text-forest text-balance md:text-5xl lg:whitespace-nowrap lg:text-[3.75rem] xl:text-[4.5rem] 2xl:text-[5rem]">
            Povestea livezii{' '}
            <span className="text-burgundy">Fructul Bucovinei</span>
          </h1>

          <div className="mt-6 grid gap-4 text-[0.85rem] leading-relaxed text-forest/80 md:mt-10 md:grid-cols-2 md:gap-16 md:text-xl">
            {storyColumns.map((column) => (
              <p key={column}>{column}</p>
            ))}
          </div>

        </div>
      </section>

      <section className="relative h-[42vh] min-h-[280px] w-full overflow-hidden md:h-[56vh] md:min-h-[420px]">
        <Image
          src="/imagini_despre/fructulbucovinei_ladamere.png"
          alt="Ladă cu mere Fructul Bucovinei"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </section>

      <section className="relative bg-cream px-4 py-12 md:px-6 md:py-24 lg:px-12">
        <div className="container mx-auto max-w-[94rem]">
          <div className="grid grid-cols-[1.32fr_0.38fr] items-center gap-2 md:grid-cols-[1.08fr_0.92fr] md:gap-10 lg:gap-16">
            <h2 className="relative z-30 col-span-2 whitespace-nowrap font-serif text-[1.72rem] font-bold leading-[0.98] text-forest md:hidden">
              Despre <span className="text-burgundy">Fructul Bucovinei</span>
            </h2>

            <div className="relative z-20">
              <div className="pointer-events-none absolute -bottom-14 -left-16 -right-44 -top-10 z-0 hidden md:block md:-bottom-20 md:-left-24 md:-right-225 md:-top-16">
                <Image
                  src="/imagini_despre/propcrem.png"
                  alt=""
                  fill
                  className="object-contain object-right opacity-90 md:scale-110"
                  sizes="(max-width: 768px) 120vw, (max-width: 1024px) 80vw, 54vw"
                />
              </div>
              <div className="relative z-10">
                <h2 className="hidden whitespace-nowrap font-serif font-bold leading-[0.98] text-forest md:block md:text-5xl lg:text-[3.75rem] xl:text-[4.5rem]">
                  Despre{' '}
                  <span className="text-burgundy">Fructul Bucovinei</span>
                </h2>

                <div className="mt-4 max-w-5xl space-y-2 text-[0.85rem] leading-relaxed text-forest/80 md:mt-10 md:space-y-5 md:text-xl">
                  {aboutParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative -mr-64 min-h-[340px] overflow-visible md:-mr-16 md:min-h-[480px] lg:-mr-36 lg:min-h-[680px] xl:-mr-52">
              <Image
                src="/imagini_despre/fructulbucovinei_cosmere1.png"
                alt="Coș cu mere Fructul Bucovinei"
                fill
                className="z-10 translate-x-8 scale-[1.85] object-contain object-right md:translate-x-0 md:scale-110 xl:scale-125"
                sizes="(max-width: 768px) 78vw, (max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-cream px-4 py-12 md:px-6 md:py-24 lg:px-12">
        <div className="container mx-auto grid max-w-[82rem] gap-8 md:gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
          <div className="relative mx-auto w-full max-w-[88%] overflow-visible md:max-w-none">
            <div className="pointer-events-none absolute -bottom-32 -left-40 -right-36 -top-32 z-0 hidden md:block">
              <Image
                src="/imagini_despre/propcremlung.png"
                alt=""
                fill
                className="scale-150 object-contain opacity-95"
                sizes="(max-width: 1024px) 140vw, 66vw"
              />
            </div>
            <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-3xl bg-[#fbf7ee] shadow-sm ring-1 ring-forest/10">
              <Image
                src="/imagini_despre/fructulbucovinei_cecultivam.jpg"
                alt="Fructe cultivate în livada Fructul Bucovinei"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </div>

          <div className="space-y-8 md:space-y-14 lg:space-y-20">
            {cultivationSections.map((section) => (
              <div key={section.title}>
                <h2 className="font-serif text-3xl font-bold leading-[0.98] text-forest text-balance md:text-7xl">
                  {section.title === 'Ce cultivăm' ? (
                    <>
                      Ce <span className="text-burgundy">cultivăm</span>
                    </>
                  ) : (
                    <>
                      Standarde de <span className="text-burgundy">calitate</span>
                    </>
                  )}
                </h2>
                <p className="mt-3 max-w-3xl text-[0.85rem] leading-relaxed text-forest/80 md:mt-6 md:text-xl">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-cream px-4 py-12 md:px-6 md:py-24 lg:px-12">
        <div className="container mx-auto max-w-[94rem]">
          <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-end md:gap-8">
            <h2 className="whitespace-nowrap font-serif text-3xl font-bold leading-[0.98] text-forest md:col-span-2 md:text-7xl">
              Echipa livezii{' '}
              <span className="text-burgundy">Fructul Bucovinei</span>
            </h2>

            <p className="max-w-3xl text-[0.85rem] leading-relaxed text-forest/80 md:col-start-2 md:text-xl lg:ml-auto">
              Fructul Bucovinei este o afacere de familie, crescută cu răbdare,
              muncă și respect pentru pământ. În spatele fiecărui pom, fiecărei
              recolte și fiecărui pachet pregătit se află oameni care cunosc
              livada, îi înțeleg ritmul și duc mai departe povestea ei.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 md:mt-14 md:gap-5">
            {teamGalleryImages.map((image, index) => (
              <div
                key={image}
                className={`relative overflow-hidden rounded-3xl bg-[#fbf7ee] shadow-sm ring-1 ring-forest/10 ${
                  index === 0 || index === 5 ? 'aspect-[4/3]' : 'aspect-square'
                }`}
              >
                <Image
                  src={image}
                  alt="Echipa și livada Fructul Bucovinei"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </main>
  )
}
