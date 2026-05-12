'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const packages = [
  {
    id: 1,
    name: 'Loren Ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    image: '/images/tree-apple.jpg',
  },
  {
    id: 2,
    name: 'Loren Ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    image: '/images/tree-pear.jpg',
  },
  {
    id: 3,
    name: 'Loren Ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    image: '/images/tree-plum.jpg',
  },
]

export function AdoptSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="adopta"
      ref={sectionRef}
      className="relative py-16 lg:py-24 bg-cream overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl text-forest font-bold text-balance max-w-4xl mx-auto leading-[0.98]">
            Alege unul din{' '}
            <span className="text-burgundy">pachetele noastre</span>
          </h2>
          <p className="text-earth mt-5 max-w-2xl mx-auto text-xl leading-relaxed">
            Alege unul din pachetele Fructul Bucovinei și bucură-te de fructele livezii noastre, crescute cu grijă.
          </p>
        </motion.div>

        {/* Package Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                {/* Subtitle */}
                <span className="text-burgundy/70 text-xs tracking-widest uppercase font-semibold">
                  {pkg.subtitle}
                </span>
                
                {/* Title */}
                <h3 className="font-serif text-2xl lg:text-3xl text-forest font-semibold mt-2 mb-3">
                  {pkg.name}
                </h3>
                
                {/* Description */}
                <p className="text-earth/70 text-sm leading-relaxed mb-6">
                  {pkg.description}
                </p>

                {/* Price & CTA Row */}
                <div className="flex items-end justify-between pt-4 border-t border-forest/5">
                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-3xl text-burgundy font-semibold">
                      xxx
                    </span>
                    <span className="text-earth/60 text-sm font-medium">
                      RON/an
                    </span>
                  </div>
                  
                  {/* CTA Button */}
                  <button className="group/btn flex items-center gap-2 px-5 py-2.5 bg-forest text-cream text-sm font-semibold rounded-full transition-all duration-300 hover:bg-burgundy hover:gap-3">
                    <span>Adoptă</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
