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
      className="relative z-10 py-16 lg:py-24 bg-cream overflow-visible"
    >
      <div className="pointer-events-none absolute -left-12 -top-20 z-0 hidden h-[370px] w-[880px] overflow-visible lg:block xl:-left-16 xl:-top-28 xl:h-[460px] xl:w-[1100px]">
        <Image
          src="/imagini_landing-page/poza_fructulbucovinei_sectiuneaexperiente.png"
          alt=""
          fill
          className="object-contain object-left"
          sizes="1100px"
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl text-forest font-bold leading-[0.98] text-balance">
            Experiențe din livada{' '}
            <span className="text-burgundy">Fructul Bucovinei</span>
          </h2>
          <p className="text-earth mt-5 max-w-2xl mx-auto text-xl leading-relaxed">
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
            className="group inline-flex items-center gap-3 px-8 py-4 bg-burgundy text-cream font-semibold text-sm tracking-wide uppercase rounded-sm transition-all duration-500 hover:bg-forest hover:gap-4"
          >
            <span>Explorează evenimentele</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
