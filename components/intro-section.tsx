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
      className="relative flex min-h-[680px] items-center overflow-visible bg-cream py-24 lg:min-h-[720px] lg:py-0"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-24 -bottom-12 z-10 sm:-top-8 sm:-bottom-[clamp(7rem,9vw,12rem)] lg:-top-12 lg:-bottom-[clamp(9rem,11vw,15rem)]">
        <Image
          src="/imagini_landing-page/poza_fructulbucovinei_prima-sectiune.png"
          alt="Livada Fructul Bucovinei"
          fill
          className="object-contain object-[80%_bottom] lg:object-[72%_bottom]"
          sizes="100vw"
        />
      </div>

      <div className="container relative z-30 mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-3 font-serif text-5xl font-bold leading-[0.98] text-forest text-balance md:mb-4 md:text-7xl lg:text-8xl"
          >
            Fructul Bucovinei,{' '}
            <span className="text-burgundy">direct la tine acasă</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mb-5 max-w-2xl font-serif text-2xl font-bold leading-tight text-forest md:mb-6 md:text-4xl lg:text-[3.25rem]"
          >
            Un pom. <span className="text-burgundy">Un an.</span>{' '}
            <span className="text-brown">O poveste.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl text-lg leading-relaxed text-earth md:text-xl"
          >
            Din primăvara în care înflorește până în toamna în care rodește, vei fi parte din viața unui pom din Bucovina.
            Îi vei cunoaște povestea, îi vei urmări parcursul și îi vei primi roadele.
            Pentru că uneori cea mai frumoasă legătură cu natura începe cu un singur pom.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a
              href="/adopta-un-pom"
              className="inline-block rounded-sm bg-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-wide text-cream transition-all duration-500 hover:bg-forest md:px-8 md:py-4 md:text-sm"
            >
              Adoptă un pom
            </a>
            <a
              href="/adopta-un-pom"
              className="inline-block rounded-sm border-2 border-forest px-6 py-3 text-xs font-semibold uppercase tracking-wide text-forest transition-all duration-500 hover:bg-forest hover:text-cream md:px-8 md:py-4 md:text-sm"
            >
              Vezi pachetele noastre
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
