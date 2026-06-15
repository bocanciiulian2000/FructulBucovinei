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
          src="/imagini_landing-page/poza_fructulbucovinei_hero.jpeg"
          alt="Livada Fructul Bucovinei la răsărit"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest/40 via-forest/20 to-forest/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,56,45,0.42)_0%,rgba(34,56,45,0.22)_38%,rgba(34,56,45,0.08)_68%,transparent_100%)]" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
      >
        <h1
          className="max-w-6xl font-serif text-5xl font-bold leading-[0.94] text-cream text-balance md:text-8xl lg:text-9xl"
        >
          Fructul Bucovinei
        </h1>

        <p className="mt-6 max-w-4xl font-serif text-3xl font-bold leading-tight text-cream text-balance md:mt-8 md:text-5xl">
          Oameni și o poveste.
        </p>

        <p className="mt-4 max-w-4xl text-lg leading-relaxed text-cream/85 text-balance md:mt-6 md:text-2xl">
          Din rădăcini. Pentru generații.
          <br />
          Fructe crescute la granița dintre tradiție și viitor.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-12"
        >
          <a
            href="/adopta-un-pom"
            className="group relative overflow-hidden rounded-sm bg-cream px-6 py-3 text-xs font-medium uppercase tracking-wide text-forest transition-all duration-500 hover:bg-burgundy hover:text-cream md:px-8 md:py-4 md:text-sm"
          >
            <span className="relative z-10">Adoptă un pom</span>
          </a>
          <a
            href="/despre-noi"
            className="group rounded-sm border border-cream/60 px-6 py-3 text-xs font-medium uppercase tracking-wide text-cream transition-all duration-500 hover:bg-cream hover:text-forest md:px-8 md:py-4 md:text-sm"
          >
            Despre noi
          </a>
        </div>

      </motion.div>
    </section>
  )
}
