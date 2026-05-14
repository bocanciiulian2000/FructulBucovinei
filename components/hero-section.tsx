'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

export function HeroSection() {
  const { scrollYProgress } = useScroll()

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section className="relative h-[95vh] min-h-[630px] overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Image
          src="/images/hero-orchard.jpg"
          alt="Livada Fructul Bucovinei la răsărit"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest/40 via-forest/20 to-forest/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
      >
        <h1
          className="font-serif text-5xl font-bold leading-[0.94] text-cream text-balance md:text-8xl lg:text-9xl max-w-6xl"
        >
          Fructul Bucovinei
        </h1>

        <p
          className="mt-6 max-w-4xl text-lg leading-relaxed text-cream/85 text-balance md:mt-8 md:text-2xl"
        >
          Mere românești crescute cu grijă în inima Bucovinei,
          culese proaspăt și aduse mai aproape de tine.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-12"
        >
          <a
            href="#intro"
            className="group relative overflow-hidden rounded-sm bg-cream px-6 py-3 text-xs font-medium uppercase tracking-wide text-forest transition-all duration-500 hover:bg-burgundy hover:text-cream md:px-8 md:py-4 md:text-sm"
          >
            <span className="relative z-10">Descoperă povestea</span>
          </a>
          <a
            href="#adopta"
            className="group rounded-sm border border-cream/60 px-6 py-3 text-xs font-medium uppercase tracking-wide text-cream transition-all duration-500 hover:bg-cream hover:text-forest md:px-8 md:py-4 md:text-sm"
          >
            Adoptă un pom
          </a>
        </div>

      </motion.div>
    </section>
  )
}
