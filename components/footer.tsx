'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'

const primaryLinks = [
  { label: 'Produse', href: '/adopta-un-pom' },
  { label: 'Contact', href: '/contact' },
  { label: 'Comandă', href: '#cta' },
]

const mobilePrimaryLinks = [
  { label: 'Produse', href: '/adopta-un-pom' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '#' },
]

const productLinks = [
  'Lorem ipsum',
  'Dolor sit amet',
  'Consectetur elit',
]

const corporateLinks = [
  { label: 'Acasă', href: '/' },
  { label: 'Adoptă un pom', href: '/adopta-un-pom' },
  { label: 'Evenimente', href: '/evenimente' },
  { label: 'Despre noi', href: '/despre-noi' },
  { label: 'Galerie', href: '/galerie' },
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

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-visible bg-[#eadfcd] text-forest">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-[clamp(16rem,72vw,22rem)] overflow-hidden lg:w-[clamp(20rem,46vw,42rem)]">
        <Image
          src="/imagini_landing-page/poza_fructulbucovinei_footer.png"
          alt=""
          fill
          className="object-cover object-right"
          sizes="(max-width: 1024px) 320px, 46vw"
        />
      </div>

      <div className="pointer-events-none absolute z-10 h-[clamp(12rem,54vw,16rem)] w-[clamp(12rem,54vw,16rem)] -right-[clamp(2.5rem,11vw,4rem)] -top-[clamp(2rem,7vw,3rem)] -rotate-[30deg] overflow-visible lg:h-[clamp(28rem,29vw,35rem)] lg:w-[clamp(28rem,29vw,35rem)] lg:right-[clamp(1.5rem,3.5vw,4rem)] lg:-top-[clamp(5rem,7vw,7rem)] 2xl:right-[clamp(-0.25rem,0.6vw,1rem)]">
        <Image
          src="/imagini_landing-page/poza_fructulbucovinei_footer2.png"
          alt=""
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 58vw, (max-width: 1440px) 470px, 29vw"
        />
      </div>

      <div className="container relative z-30 mx-auto px-6 pt-8 lg:hidden">
        <div className="flex items-center justify-between gap-5">
          <Image
            src="/logo&favicon/logofructulbucovinei.png"
            alt="Fructul Bucovinei"
            width={132}
            height={122}
            className="h-auto w-55"
          />

          <div className="flex translate-y-10 items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex size-10 items-center justify-center rounded-full bg-forest text-cream transition-colors hover:bg-burgundy"
                aria-label={social.label}
              >
                <social.icon size={18} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer navigation mobil" className="mt-7">
          {mobilePrimaryLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group flex items-center justify-between border-b border-brown/45 py-2.5 font-serif text-2xl font-bold uppercase leading-none text-brown transition-colors hover:text-burgundy"
            >
              <span>{link.label}</span>
              <ArrowRight
                size={26}
                className="transition-transform duration-300 group-hover:translate-x-2"
              />
            </Link>
          ))}
        </nav>

        <div className="mt-7 grid grid-cols-2 items-center gap-3">
          <a
            href="https://anpc.ro/ce-este-sal/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ANPC SAL"
          >
            <Image
              src="/legal/anpc-sal.webp"
              alt="Soluționarea alternativă a litigiilor ANPC"
              width={250}
              height={66}
              className="h-auto w-full"
            />
          </a>
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ANPC SOL"
          >
            <Image
              src="/legal/anpc-sol.webp"
              alt="Soluționarea online a litigiilor"
              width={250}
              height={66}
              className="h-auto w-full"
            />
          </a>
        </div>
      </div>

      <div className="container relative z-30 mx-auto hidden px-6 pb-0 pt-10 lg:block lg:px-12 lg:pt-20">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-start lg:gap-12">
          <nav aria-label="Footer navigation" className="space-y-0 text-center lg:text-left">
            {primaryLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center justify-between border-b border-brown/45 py-3 font-serif text-3xl font-bold uppercase leading-none text-brown transition-colors hover:text-burgundy lg:text-4xl"
              >
                <span>{link.label}</span>
                <ArrowRight
                  size={28}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-5 lg:items-end">
            <div className="flex items-center justify-center gap-5 lg:justify-end">
              <Image
                src="/logo&favicon/logofructulbucovinei.png"
                alt="Fructul Bucovinei"
                width={132}
                height={122}
                className="h-auto w-36 lg:w-48"
              />
              <div className="flex flex-col gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex size-10 items-center justify-center rounded-full bg-forest text-cream transition-colors hover:bg-burgundy"
                    aria-label={social.label}
                  >
                    <social.icon size={18} strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:mt-14 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10">
          <div className="grid gap-7 text-left md:grid-cols-3 lg:max-w-3xl lg:gap-10">
            <div>
              <h3 className="font-serif text-xl font-bold text-brown">
                Loren Ipsum
              </h3>
              <ul className="mt-3 space-y-2 text-base text-forest/80">
                {productLinks.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-brown">
                Navigare
              </h3>
              <ul className="mt-3 space-y-2 text-base text-forest/80">
                {corporateLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-burgundy">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-brown">Contact</h3>
              <ul className="mt-3 space-y-3 text-base text-forest/80">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-brown" />
                  <span>Suceava, Bucovina, România</span>
                </li>
                <li>
                  <a
                    href="tel:+40700000000"
                    className="flex items-center gap-3 hover:text-burgundy"
                  >
                    <Phone size={18} className="shrink-0 text-brown" />
                    +40 700 000 000
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@fructulbucovinei.ro"
                    className="flex items-center gap-3 hover:text-burgundy"
                  >
                    <Mail size={18} className="shrink-0 text-brown" />
                    contact@fructulbucovinei.ro
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 lg:w-72 lg:items-end">
            <a
              href="https://anpc.ro/ce-este-sal/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ANPC SAL"
            >
              <Image
                src="/legal/anpc-sal.webp"
                alt="Soluționarea alternativă a litigiilor ANPC"
                width={250}
                height={66}
                className="h-auto w-56 lg:w-64"
              />
            </a>
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ANPC SOL"
            >
              <Image
                src="/legal/anpc-sol.webp"
                alt="Soluționarea online a litigiilor"
                width={250}
                height={66}
                className="h-auto w-56 lg:w-64"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-30 mt-10 bg-muted lg:mt-16">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 py-4 text-xs text-forest/80 lg:flex-row lg:px-12 lg:py-5 lg:text-sm">
          <p>
            Fructul Bucovinei © {new Date().getFullYear()} - Design de{' '}
            <a
              href="https://bocanciiulian.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-burgundy"
            >
              Bocanci Iulian
            </a>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="#" className="hover:text-burgundy">
              GDPR
            </Link>
            <Link href="#" className="hover:text-burgundy">
              Termeni și condiții
            </Link>
            <Link href="#" className="hover:text-burgundy">
              Politică de retur
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
