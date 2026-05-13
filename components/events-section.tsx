'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const galleryImages = [
  { id: 1, src: '/images/event-tasting.jpg', alt: 'Degustare în livadă' },
  { id: 2, src: '/images/event-picnic.jpg', alt: 'Picnic în livadă' },
  { id: 3, src: '/images/event-festival.jpg', alt: 'Festival de toamnă' },
  { id: 4, src: '/images/event-workshop.jpg', alt: 'Atelier creativ' },
  { id: 5, src: '/images/gallery-1.jpg', alt: 'Livada dimineața' },
  { id: 6, src: '/images/gallery-5.jpg', alt: 'Familie în livadă' },
]

export function EventsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="evenimente"
      ref={sectionRef}
      className="relative overflow-visible bg-cream py-16 lg:py-24"
    >
      <div className="pointer-events-none absolute z-10 h-[clamp(12rem,48vw,16rem)] w-[100vw] left-0 -top-[clamp(3rem,12vw,5rem)] overflow-visible lg:h-[clamp(23rem,24vw,29rem)] lg:w-[clamp(52rem,57vw,70rem)] lg:-left-[clamp(3rem,4vw,5rem)] lg:-top-[clamp(5rem,7vw,8rem)]">
        <Image
          src="/imagini_landing-page/poza_fructulbucovinei_sectiuneaexperiente.png"
          alt=""
          fill
          className="object-contain object-left"
          sizes="(max-width: 1024px) 100vw, (max-width: 1440px) 880px, 57vw"
        />
      </div>

      <div className="container relative z-30 mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center lg:mb-16"
        >
          <h2 className="font-serif text-5xl font-bold leading-[0.98] text-forest text-balance md:text-7xl lg:text-8xl">
            Experiențe din livada{' '}
            <span className="text-burgundy">Fructul Bucovinei</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-earth md:mt-5 md:text-xl">
            Descoperă farmecul livezii noastre prin evenimente memorabile. De la degustări și picnicuri, 
            la ateliere și festivaluri, fiecare vizită devine o amintire de neuitat.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
              className={`group relative overflow-hidden rounded-xl ${
                index === 0 || index === 5 ? 'aspect-[4/3]' : 'aspect-square'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/20 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-10 lg:mt-14"
        >
          <a
            href="#"
            className="group inline-flex items-center gap-3 rounded-sm bg-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-wide text-cream transition-all duration-500 hover:gap-4 hover:bg-forest md:px-8 md:py-4 md:text-sm"
          >
            <span>Explorează evenimentele</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
