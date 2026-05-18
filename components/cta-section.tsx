'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'

export function CtaSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative overflow-visible bg-cream py-24 text-forest lg:py-32"
    >
      <div className="pointer-events-none absolute -left-28 top-10 z-10 h-[26rem] w-[42rem] opacity-85 lg:hidden" aria-hidden="true">
        <Image
          src="/imagini_landing-page/propcrem.png"
          alt=""
          fill
          className="object-contain object-left"
          sizes="100vw"
        />
      </div>

      <div className="container relative z-30 mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
        >
          <div className="pointer-events-none relative z-10 hidden min-h-[500px] overflow-visible lg:block xl:min-h-[540px]" aria-hidden="true">
            <div className="absolute -left-[clamp(9rem,12vw,14rem)] -top-[clamp(6rem,8vw,9rem)] z-0 h-[clamp(36rem,35vw,45rem)] w-[clamp(46rem,44vw,56rem)] overflow-visible opacity-85 2xl:-left-[clamp(9rem,11vw,13rem)] 2xl:-top-[clamp(5rem,7vw,8rem)]">
              <Image
                src="/imagini_landing-page/propcrem.png"
                alt=""
                fill
                className="object-contain object-left"
                sizes="(max-width: 1280px) 820px, 44vw"
              />
            </div>

            <div className="absolute z-10 h-[clamp(39rem,37vw,47rem)] w-[clamp(43rem,41vw,52rem)] -left-[clamp(8rem,11vw,13rem)] -top-[clamp(5rem,7vw,8rem)] overflow-visible 2xl:-left-[clamp(8rem,10vw,12rem)] 2xl:-top-[clamp(4rem,6vw,7rem)]">
              <Image
                src="/imagini_landing-page/poza_fructulbucovinei_sectiuneacta.png"
                alt=""
                fill
                className="object-contain object-left"
                sizes="(max-width: 1280px) 780px, 41vw"
              />
            </div>
          </div>

          <div className="relative z-30 text-left lg:justify-self-end">
            <h2 className="font-serif text-5xl font-bold leading-[0.98] text-forest text-balance md:text-7xl lg:text-8xl">
              Haide să <span className="text-burgundy">vorbim</span>
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-forest/80 md:mt-8 md:text-xl">
              Dacă vrei să afli mai multe despre produsele noastre sau să adopți un pom, ne găsești aici:
            </p>

            <div className="mt-8 max-w-2xl space-y-5 text-lg text-forest/85 md:mt-10 md:space-y-7 md:text-xl">
              <div className="flex items-center gap-4">
                <MapPin size={30} className="shrink-0 fill-brown text-brown" />
                <span>Suceava, Bucovina, România</span>
              </div>
              <a
                href="tel:+40700000000"
                className="flex items-center gap-4 transition-colors hover:text-burgundy"
              >
                <Phone size={30} className="shrink-0 fill-brown text-brown" />
                <span>+40 700 000 000</span>
              </a>
              <a
                href="mailto:contact@fructulbucovinei.ro"
                className="flex items-center gap-4 transition-colors hover:text-burgundy"
              >
                <Mail size={30} className="shrink-0 fill-brown text-brown" />
                <span className="break-all">contact@fructulbucovinei.ro</span>
              </a>
            </div>

            <Link
              href="/contact"
              className="mt-8 inline-flex rounded-sm bg-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-forest md:px-8 md:py-4 md:text-sm"
            >
              Contactează-ne
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
