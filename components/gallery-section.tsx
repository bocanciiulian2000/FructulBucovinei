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
      className="relative z-20 overflow-visible bg-cream py-12 md:py-20 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-28 -bottom-28 z-0 overflow-visible md:-top-12 md:bottom-0 lg:-top-24">
        <Image
          src="/imagini_landing-page/poza_fructulbucovinei_sectiuneagalerie.png"
          alt="Fundal galerie Fructul Bucovinei"
          fill
          className="scale-[1.18] object-contain object-left-top md:scale-[1.06] lg:scale-[1.12]"
          sizes="100vw"
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 pt-44 md:pt-36 lg:px-12 lg:pt-52">
        <PhotoGallery />
      </div>
    </section>
  )
}
