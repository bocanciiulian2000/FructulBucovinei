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
      className="relative z-20 overflow-visible bg-cream py-20 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-12 bottom-0 z-0 overflow-visible lg:-top-24">
        <Image
          src="/imagini_landing-page/poza_fructulbucovinei_sectiuneagalerie.png"
          alt="Fundal galerie Fructul Bucovinei"
          fill
          className="scale-[1.06] object-contain object-left-top lg:scale-[1.12]"
          sizes="100vw"
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 pt-36 lg:px-12 lg:pt-52">
        <PhotoGallery />
      </div>
    </section>
  )
}
