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

export default function DespreNoiPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar />

      <section className="relative h-[90vh] min-h-[560px] overflow-hidden">
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

      <section className="relative bg-cream px-6 py-16 md:py-24 lg:px-12">
        <div className="container mx-auto max-w-[94rem]">
          <h1 className="font-serif text-4xl font-bold leading-[0.98] tracking-tight text-forest text-balance md:text-5xl lg:whitespace-nowrap lg:text-[3.75rem] xl:text-[4.5rem] 2xl:text-[5rem]">
            Povestea livezii{' '}
            <span className="text-burgundy">Fructul Bucovinei</span>
          </h1>

          <div className="mt-8 grid gap-8 text-lg leading-relaxed text-forest/80 md:mt-10 md:grid-cols-2 md:gap-16 md:text-xl">
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

      <section className="relative bg-cream px-6 py-16 md:py-24 lg:px-12">
        <div className="container mx-auto max-w-[94rem]">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
            <div>
              <h2 className="font-serif text-4xl font-bold leading-[0.98] text-forest text-balance md:text-5xl lg:text-[3.75rem] xl:text-[4.5rem]">
                Despre{' '}
                <span className="text-burgundy">Fructul Bucovinei</span>
              </h2>

              <div className="mt-8 max-w-5xl space-y-5 text-lg leading-relaxed text-forest/80 md:mt-10 md:text-xl">
                {aboutParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-visible md:min-h-[480px] lg:-mr-24 lg:min-h-[680px] xl:-mr-36">
              <Image
                src="/imagini_despre/fructulbucovinei_cosmere1.png"
                alt="Coș cu mere Fructul Bucovinei"
                fill
                className="scale-110 object-contain object-right xl:scale-125"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </main>
  )
}
