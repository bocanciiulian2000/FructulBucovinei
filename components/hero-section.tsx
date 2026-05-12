'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

export function HeroSection() {
  const { scrollYProgress } = useScroll()

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
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
          className="font-serif text-7xl md:text-8xl lg:text-9xl text-cream font-bold leading-[0.94] text-balance max-w-6xl"
        >
          Fructul Bucovinei
        </h1>

        <p
          className="max-w-4xl text-2xl text-cream/85 mt-8 leading-relaxed text-balance"
        >
          Mere românești crescute cu grijă în inima Bucovinei,
          culese proaspăt și aduse mai aproape de tine.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-12"
        >
          <a
            href="#intro"
            className="group relative px-8 py-4 bg-cream text-forest font-medium text-sm tracking-wide uppercase overflow-hidden rounded-sm transition-all duration-500 hover:bg-burgundy hover:text-cream"
          >
            <span className="relative z-10">Descoperă povestea</span>
          </a>
          <a
            href="#adopta"
            className="group px-8 py-4 border border-cream/60 text-cream font-medium text-sm tracking-wide uppercase rounded-sm transition-all duration-500 hover:bg-cream hover:text-forest"
          >
            Adoptă un pom
          </a>
        </div>

      </motion.div>
    </section>
  )
}
