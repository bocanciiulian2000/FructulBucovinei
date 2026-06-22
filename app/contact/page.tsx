'use client'

import Image from 'next/image'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import FAQs from '@/components/ui/faqs-component'

const contactDetails = [
  {
    icon: MapPin,
    label: 'Locație',
    value: 'Suceava, Bucovina, România',
  },
  {
    icon: Phone,
    label: 'Telefon',
    value: '+40 764 417 635',
    href: 'tel:+40764417635',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@fructulbucovinei.ro',
    href: 'mailto:contact@fructulbucovinei.ro',
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
        <div className="container relative z-30 mx-auto grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="relative">
            <h2 className="font-serif text-5xl font-bold leading-[0.98] text-forest text-balance md:text-7xl lg:text-8xl">
              Ia legătura{' '}
              <span className="text-burgundy">cu noi</span>
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-forest/80 md:mt-8 md:text-xl">
              Dacă ai întrebări legate de produsele noastre, experiențele din livadă
              sau adopția de pomi, nu ezita să ne contactezi.
            </p>

            <div className="pointer-events-none absolute -bottom-10 -left-20 -right-16 top-[42%] z-0 md:-bottom-16 md:-left-32 md:-right-28 md:top-[38%]">
              <Image
                src="/imagini_contact/props/propcrem.png"
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 54vw"
              />
            </div>

            <div className="relative z-10 mt-8 space-y-3 md:mt-10">
              {contactDetails.map((detail) => {
                const Icon = detail.icon
                const content = (
                  <div className="flex items-center gap-3 rounded-2xl bg-[#fbf7ee] p-4 shadow-sm ring-1 ring-forest/10">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-burgundy text-cream">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-brown">
                        {detail.label}
                      </span>
                      <span className="mt-0.5 block text-base leading-relaxed text-forest/85 md:text-lg">
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
            </div>
          </div>

          <form className="rounded-3xl bg-[#fbf7ee] p-5 shadow-sm ring-1 ring-forest/10 md:p-7">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-wide text-brown">
                  Nume și prenume
                </span>
                <input
                  type="text"
                  name="name"
                  className="mt-2 h-12 w-full rounded-xl border border-brown/25 bg-cream px-4 text-base text-forest outline-none transition-colors placeholder:text-forest/45 focus:border-burgundy"
                  placeholder="Numele și prenumele tău"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-wide text-brown">
                  Telefon
                </span>
                <input
                  type="tel"
                  name="phone"
                  className="mt-2 h-12 w-full rounded-xl border border-brown/25 bg-cream px-4 text-base text-forest outline-none transition-colors placeholder:text-forest/45 focus:border-burgundy"
                  placeholder="+40712345678"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-semibold uppercase tracking-wide text-brown">
                Email
              </span>
              <input
                type="email"
                name="email"
                className="mt-2 h-12 w-full rounded-xl border border-brown/25 bg-cream px-4 text-base text-forest outline-none transition-colors placeholder:text-forest/45 focus:border-burgundy"
                placeholder="Email-ul tău"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold uppercase tracking-wide text-brown">
                Mesaj
              </span>
              <textarea
                name="message"
                rows={6}
                className="mt-2 w-full resize-none rounded-xl border border-brown/25 bg-cream px-4 py-3 text-base text-forest outline-none transition-colors placeholder:text-forest/45 focus:border-burgundy"
                placeholder="Scrie-ne câteva detalii..."
              />
            </label>

            <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-forest/75">
              <input
                type="checkbox"
                name="dataConsent"
                required
                onInvalid={(event) => {
                  event.currentTarget.setCustomValidity(
                    'Te rugam bifeaza casuta aceasta daca vrei sa continui.',
                  )
                }}
                onChange={(event) => {
                  event.currentTarget.setCustomValidity('')
                }}
                className="mt-1 size-4 shrink-0 accent-burgundy"
              />
              <span>
                Sunt de acord cu prelucrarea datelor în scopul ofertei solicitate.
              </span>
            </label>

            <button
              type="submit"
              className="mt-5 inline-flex rounded-sm bg-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-forest md:px-8 md:py-4 md:text-sm"
            >
              Trimite mesajul
            </button>
          </form>
        </div>
      </section>

      <FAQs />

      <Footer />
    </main>
  )
}
