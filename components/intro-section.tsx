'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

export function IntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="intro"
      ref={sectionRef}
      className="relative z-20 flex min-h-[680px] items-center overflow-visible bg-cream py-24 lg:min-h-[720px] lg:py-0"
    >
      <div className="pointer-events-none absolute inset-x-0 -bottom-36 top-0 z-0 lg:-bottom-56">
        <Image
          src="/imagini_landing-page/poza_fructulbucovinei_prima-sectiune.png"
          alt="Livada Fructul Bucovinei"
          fill
          className="object-contain object-[80%_bottom] lg:object-[72%_bottom]"
          sizes="100vw"
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-6xl md:text-7xl lg:text-8xl text-forest font-bold leading-[0.98] mb-7 text-balance"
          >
            Fructul Bucovinei,{' '}
            <span className="text-burgundy">direct la tine acasă</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-earth text-xl leading-relaxed mb-5 max-w-2xl"
          >
            Fiecare fruct din livada noastră este crescut cu grijă, în ritmul naturii și cu respect pentru tradițiile bucovinene.
            Merele noastre păstrează gustul autentic al livezii și ajung proaspete, direct de la pom la masa ta.
          </motion.p>

          {/* Additional text about packages */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-earth text-xl leading-relaxed max-w-2xl"
          >
            Poți comanda pachete cu mere proaspete pentru tine, pentru familie sau pentru oamenii dragi, pregătite simplu și atent.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a
              href="#adopta"
              className="inline-block px-8 py-4 bg-burgundy text-cream font-semibold text-sm tracking-wide uppercase rounded-sm transition-all duration-500 hover:bg-forest"
            >
              Adoptă un pom
            </a>
            <a
              href="#adopta"
              className="inline-block px-8 py-4 border-2 border-forest text-forest font-semibold text-sm tracking-wide uppercase rounded-sm transition-all duration-500 hover:bg-forest hover:text-cream"
            >
              Vezi pachetele noastre
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
