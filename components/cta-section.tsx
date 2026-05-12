'use client'

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
      className="relative overflow-hidden bg-cream py-24 text-forest lg:py-32"
    >
      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
        >
          <div className="text-left">
            <h2 className="font-serif text-6xl font-bold leading-[0.98] text-forest text-balance md:text-7xl lg:text-8xl">
              Haide să vorbim
            </h2>
            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-forest/80">
              Dacă vrei să afli mai multe despre produsele noastre sau să adopți un pom, ne găsești aici:
            </p>

            <div className="mt-10 max-w-2xl space-y-7 text-xl text-forest/85">
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
          </div>

          <div className="hidden min-h-[360px] lg:block" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  )
}
