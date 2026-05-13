'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { PhotoGallery } from '@/components/ui/gallery'

export function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="galerie"
      ref={sectionRef}
      className="relative overflow-visible bg-cream py-12 md:py-20 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-[clamp(6rem,28vw,7rem)] -bottom-[clamp(5rem,18vw,7rem)] z-10 overflow-visible md:-top-[clamp(3rem,5vw,6rem)] md:bottom-0">
        <Image
          src="/imagini_landing-page/poza_fructulbucovinei_sectiuneagalerie.png"
          alt="Fundal galerie Fructul Bucovinei"
          fill
          className="scale-[1.16] object-contain object-left-top md:scale-[1] lg:scale-[1]"
          sizes="100vw"
        />
      </div>

      <div className="container relative z-30 mx-auto px-6 pt-44 md:pt-36 lg:px-12 lg:pt-52">
        <PhotoGallery />
      </div>
    </section>
  )
}
