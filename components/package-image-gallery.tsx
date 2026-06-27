'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PackageImageGalleryProps = {
  name: string
  image: string
  gallery: string[]
}

export function PackageImageGallery({
  name,
  image,
  gallery,
}: PackageImageGalleryProps) {
  const images = useMemo(
    () => Array.from(new Set([image, ...gallery])),
    [gallery, image]
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex] ?? image
  const hasMultipleImages = images.length > 1

  const showPreviousImage = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1
    )
  }

  const showNextImage = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1
    )
  }

  return (
    <div>
      <div className="relative aspect-[4/4.35] overflow-hidden rounded-3xl bg-[#fbf7ee] shadow-sm ring-1 ring-forest/10 md:aspect-square">
        <Image
          key={activeImage}
          src={activeImage}
          alt={name}
          fill
          priority
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 48vw"
        />

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-forest shadow-sm transition-colors hover:bg-burgundy hover:text-cream"
              aria-label="Imaginea anterioară"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-forest shadow-sm transition-colors hover:bg-burgundy hover:text-cream"
              aria-label="Imaginea următoare"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {images.slice(1).map((thumbnail, index) => {
            const thumbnailIndex = index + 1
            const isActive = activeIndex === thumbnailIndex

            return (
              <button
                key={thumbnail}
                type="button"
                onClick={() => setActiveIndex(thumbnailIndex)}
                className={`relative aspect-square overflow-hidden rounded-2xl bg-[#fbf7ee] shadow-sm transition-all ring-1 ${
                  isActive
                    ? 'ring-2 ring-burgundy'
                    : 'ring-forest/10 hover:ring-burgundy/50'
                }`}
                aria-label={`Afișează imaginea ${thumbnailIndex + 1}`}
              >
                <Image
                  src={thumbnail}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 24vw"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
