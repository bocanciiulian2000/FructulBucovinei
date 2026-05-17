import Image from 'next/image'
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

const contactDetails = [
  {
    icon: MapPin,
    label: 'Locație',
    value: 'Suceava, Bucovina, România',
  },
  {
    icon: Phone,
    label: 'Telefon',
    value: '+40 700 000 000',
    href: 'tel:+40700000000',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@fructulbucovinei.ro',
    href: 'mailto:contact@fructulbucovinei.ro',
  },
]

const socialLinks = [
  {
    href: 'https://www.instagram.com/fructulbucovinei/',
    icon: Instagram,
    label: 'Instagram',
  },
  {
    href: 'https://www.facebook.com/fructulbucovinei2018',
    icon: Facebook,
    label: 'Facebook',
  },
]

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar />

      <section className="relative h-[58vh] min-h-[430px] overflow-hidden">
        <Image
          src="/images/hero-orchard.jpg"
          alt="Livada Fructul Bucovinei"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/75 via-forest/40 to-forest/10" />

        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl text-left">
              <h1 className="font-serif text-5xl font-bold leading-[0.94] text-cream text-balance md:text-8xl lg:text-9xl">
                Hai să <span className="text-cream/85">vorbim</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-cream/85 text-balance md:mt-8 md:text-2xl">
                Dacă vrei să afli mai multe despre produsele noastre, evenimente sau programul
                Adoptă un pom, ne găsești aici.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-visible bg-cream px-6 py-14 md:py-20 lg:px-12">
        <div className="pointer-events-none absolute -right-[clamp(7rem,28vw,13rem)] -top-20 z-10 h-[clamp(18rem,54vw,34rem)] w-[clamp(18rem,54vw,34rem)] overflow-visible md:-right-[clamp(12rem,18vw,20rem)] md:-top-28 md:h-[clamp(34rem,42vw,52rem)] md:w-[clamp(34rem,42vw,52rem)]">
          <Image
            src="/imagini_landing-page/poza_fructulbucovinei_footer2.png"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 54vw, 42vw"
          />
        </div>

        <div className="container relative z-30 mx-auto grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <h2 className="font-serif text-5xl font-bold leading-[0.98] text-forest text-balance md:text-7xl lg:text-8xl">
              Contactează{' '}
              <span className="text-burgundy">Fructul Bucovinei</span>
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-forest/80 md:mt-8 md:text-xl">
              Scrie-ne sau sună-ne și revenim cu detalii despre comenzi, vizite în livadă,
              evenimente și colaborări.
            </p>
          </div>

          <div className="space-y-4">
            {contactDetails.map((detail) => {
              const Icon = detail.icon
              const content = (
                <div className="flex items-center gap-4 rounded-3xl bg-[#fbf7ee] p-5 shadow-sm ring-1 ring-forest/10 md:p-6">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-burgundy text-cream">
                    <Icon size={24} strokeWidth={1.8} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold uppercase tracking-wide text-brown">
                      {detail.label}
                    </span>
                    <span className="mt-1 block text-lg leading-relaxed text-forest/85 md:text-xl">
                      {detail.value}
                    </span>
                  </span>
                </div>
              )

              return detail.href ? (
                <a key={detail.label} href={detail.href} className="block hover:text-burgundy">
                  {content}
                </a>
              ) : (
                <div key={detail.label}>{content}</div>
              )
            })}

            <div className="flex items-center gap-3 pt-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-11 items-center justify-center rounded-full bg-forest text-cream transition-colors hover:bg-burgundy"
                  aria-label={social.label}
                >
                  <social.icon size={19} strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
