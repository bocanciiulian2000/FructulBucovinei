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
  { label: 'Produse', href: '#adopta' },
  { label: 'Contact', href: '#contact' },
  { label: 'Comandă', href: '#cta' },
]

const productLinks = [
  'Lorem ipsum',
  'Dolor sit amet',
  'Consectetur elit',
]

const corporateLinks = [
  'Lorem ipsum',
  'Dolor sit amet',
  'Consectetur elit',
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
    <footer id="contact" className="relative overflow-visible bg-cream text-forest">
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-[46%] overflow-hidden">
        <Image
          src="/imagini_landing-page/poza_fructulbucovinei_footer.png"
          alt=""
          fill
          className="object-cover object-right"
          sizes="46vw"
        />
      </div>

      <div className="pointer-events-none absolute right-24 -top-20 z-0 hidden h-[470px] w-[470px] -rotate-[30deg] overflow-visible lg:block xl:right-32 xl:-top-28 xl:h-[560px] xl:w-[560px]">
        <Image
          src="/imagini_landing-page/poza_fructulbucovinei_footer2.png"
          alt=""
          fill
          className="object-contain"
          sizes="560px"
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 pb-0 pt-16 lg:px-12 lg:pt-20">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
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

        <div className="mx-auto mt-16 grid max-w-5xl gap-10 text-center md:grid-cols-3 lg:items-start">
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
              Loren Ipsum
            </h3>
            <ul className="mt-3 space-y-2 text-base text-forest/80">
              {corporateLinks.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold text-brown">Contact</h3>
            <ul className="mt-3 space-y-3 text-base text-forest/80">
              <li className="flex items-start justify-center gap-3">
                <MapPin size={20} className="mt-0.5 shrink-0 text-brown" />
                <span>Suceava, Bucovina, România</span>
              </li>
              <li>
                <a
                  href="tel:+40700000000"
                  className="flex items-center justify-center gap-3 hover:text-burgundy"
                >
                  <Phone size={18} className="shrink-0 text-brown" />
                  +40 700 000 000
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@fructulbucovinei.ro"
                  className="flex items-center justify-center gap-3 hover:text-burgundy"
                >
                  <Mail size={18} className="shrink-0 text-brown" />
                  contact@fructulbucovinei.ro
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-16 bg-muted">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-5 text-sm text-forest/80 lg:flex-row lg:px-12">
          <p>Fructul Bucovinei © {new Date().getFullYear()} - Design de Visual Edge</p>
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
