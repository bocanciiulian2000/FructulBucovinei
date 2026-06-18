'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { adoptPackages, type AdoptPackage } from '@/lib/adopt-packages'

const carouselVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 44 : -44,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -44 : 44,
  }),
}

export function AdoptSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [activePackageIndex, setActivePackageIndex] = useState(0)
  const [carouselDirection, setCarouselDirection] = useState(1)

  const goToPreviousPackage = () => {
    setCarouselDirection(-1)
    setActivePackageIndex((currentIndex) =>
      currentIndex === 0 ? adoptPackages.length - 1 : currentIndex - 1
    )
  }

  const goToNextPackage = () => {
    setCarouselDirection(1)
    setActivePackageIndex((currentIndex) =>
      currentIndex === adoptPackages.length - 1 ? 0 : currentIndex + 1
    )
  }

  const goToPackage = (index: number) => {
    if (index === activePackageIndex) {
      return
    }

    setCarouselDirection(index > activePackageIndex ? 1 : -1)
    setActivePackageIndex(index)
  }

  return (
    <section
      id="adopta"
      ref={sectionRef}
      className="relative py-16 lg:py-24 bg-cream overflow-hidden"
    >
      <div className="container relative z-30 mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center lg:mb-16"
        >
          <h2 className="mx-auto max-w-7xl font-serif text-4xl font-bold leading-[0.98] text-forest text-balance md:text-5xl lg:text-[3.45rem] xl:text-[3.9rem] 2xl:text-[4.25rem]">
            <span className="block lg:whitespace-nowrap">Vino în povestea noastră și scrie o parte din a ta.</span>
            <span className="block text-burgundy">Adoptă un pom în Bucovina.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-earth md:mt-5 md:text-xl">
            Adu natura la tine pe masă. Natura și povestea noastră.
          </p>
        </motion.div>

        {/* Mobile Package Carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={carouselDirection}>
              <motion.div
                key={adoptPackages[activePackageIndex].id}
                custom={carouselDirection}
                variants={carouselVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <PackageCard pkg={adoptPackages[activePackageIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={goToPreviousPackage}
              className="flex size-12 items-center justify-center rounded-full border border-forest/30 text-forest transition-colors hover:border-burgundy hover:bg-burgundy hover:text-cream"
              aria-label="Pachetul anterior"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="flex items-center gap-2">
              {adoptPackages.map((pkg, index) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => goToPackage(index)}
                  className={`size-2.5 rounded-full transition-all ${
                    index === activePackageIndex
                      ? 'w-7 bg-burgundy'
                      : 'bg-forest/25 hover:bg-forest/45'
                  }`}
                  aria-label={`Mergi la pachetul ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goToNextPackage}
              className="flex size-12 items-center justify-center rounded-full border border-forest/30 text-forest transition-colors hover:border-burgundy hover:bg-burgundy hover:text-cream"
              aria-label="Pachetul următor"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Desktop Package Cards */}
        <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {adoptPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function PackageCard({ pkg }: { pkg: AdoptPackage }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-[#fbf7ee] shadow-sm transition-all duration-500 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-6 lg:p-8">
        <h3 className="mb-3 font-serif text-xl font-semibold text-forest md:text-2xl lg:text-3xl">
          {pkg.name}
        </h3>

        <div className="flex flex-1 flex-col">
          <p className="text-sm leading-relaxed text-earth/70">
            {pkg.description}
          </p>

        </div>

        <div className="mt-6 flex items-end justify-between border-t border-forest/5 pt-4">
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-2xl font-semibold text-burgundy md:text-3xl">
              {pkg.price}
            </span>
          </div>

          <Link
            href={`/adopta-un-pom/${pkg.slug}`}
            className="group/btn flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream transition-all duration-300 hover:gap-3 hover:bg-burgundy md:px-5 md:py-2.5 md:text-sm"
          >
            <span>Vezi pachetul</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
