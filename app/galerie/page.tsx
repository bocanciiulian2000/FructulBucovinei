'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

const galleryImages = [
  {
    src: '/images/gallery-6.jpg',
    alt: 'Livada Fructul Bucovinei văzută de sus',
    aspectClass: 'aspect-[4/5]',
  },
  {
    src: '/images/gallery-3.jpg',
    alt: 'Coș cu mere proaspete',
    aspectClass: 'aspect-[4/3]',
  },
  {
    src: '/images/gallery-4.jpg',
    alt: 'Flori de măr în livadă',
    aspectClass: 'aspect-[3/4]',
  },
  {
    src: '/images/event-picnic.jpg',
    alt: 'Oameni la picnic în livadă',
    aspectClass: 'aspect-[5/4]',
  },
  {
    src: '/images/gallery-1.jpg',
    alt: 'Livada Fructul Bucovinei la răsărit',
    aspectClass: 'aspect-[4/3]',
  },
  {
    src: '/images/gallery-2.jpg',
    alt: 'Mere culese manual',
    aspectClass: 'aspect-[3/4]',
  },
  {
    src: '/images/event-tasting.jpg',
    alt: 'Degustare de fructe în livadă',
    aspectClass: 'aspect-[5/3]',
  },
  {
    src: '/images/story-orchard.jpg',
    alt: 'Povestea livezii Fructul Bucovinei',
    aspectClass: 'aspect-[4/3]',
  },
  {
    src: '/images/event-festival.jpg',
    alt: 'Festival în livadă',
    aspectClass: 'aspect-[4/5]',
  },
  {
    src: '/images/event-workshop.jpg',
    alt: 'Atelier creativ în livadă',
    aspectClass: 'aspect-[4/3]',
  },
  {
    src: '/images/gallery-5.jpg',
    alt: 'Familie în livada Fructul Bucovinei',
    aspectClass: 'aspect-[3/4]',
  },
  {
    src: '/images/blog-1.jpg',
    alt: 'Detaliu din livada Fructul Bucovinei',
    aspectClass: 'aspect-[5/4]',
  },
]

export default function GaleriePage() {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
  const activeImage =
    activeImageIndex === null ? null : galleryImages[activeImageIndex]

  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) => {
      if (currentIndex === null) {
        return null
      }

      return currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1
    })
  }

  const showNextImage = () => {
    setActiveImageIndex((currentIndex) => {
      if (currentIndex === null) {
        return null
      }

      return currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1
    })
  }

  useEffect(() => {
    if (activeImageIndex === null) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImageIndex(null)
      }

      if (event.key === 'ArrowLeft') {
        showPreviousImage()
      }

      if (event.key === 'ArrowRight') {
        showNextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeImageIndex])

  return (
    <main className="relative overflow-hidden bg-cream text-forest">
      <Navbar />

      <section className="relative h-[52vh] min-h-[380px] overflow-hidden md:min-h-[440px]">
        <div className="absolute inset-0">
          <Image
            src="/imagini_galerie/galerie_fructulbucovinei/fructulbucovinei_hero.jpg"
            alt="Livada Fructul Bucovinei"
            fill
            priority
            className="object-cover object-[center_60%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/40 via-forest/20 to-forest/60" />
        </div>

      </section>

      <section className="relative overflow-visible px-6 py-16 md:py-24 lg:px-12">
        <div className="pointer-events-none absolute -right-[clamp(10rem,42vw,14rem)] -top-20 z-10 h-[clamp(21rem,88vw,30rem)] w-[clamp(21rem,88vw,30rem)] rotate-[10deg] overflow-visible md:left-auto md:-right-[clamp(18rem,24vw,29rem)] md:-top-44 md:h-[clamp(36rem,49vw,58rem)] md:w-[clamp(36rem,49vw,58rem)] 2xl:right-[-26rem] 2xl:-top-56 2xl:h-[52rem] 2xl:w-[52rem]">
          <Image
            src="/imagini_galerie/props_decor/fructulbucovinei_soaredecor.png"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 68vw, 32vw"
          />
        </div>

        <div className="pointer-events-none absolute -right-[clamp(18rem,70vw,28rem)] top-[48%] z-10 h-[clamp(36rem,140vw,56rem)] w-[clamp(36rem,140vw,56rem)] -translate-y-1/2 overflow-visible md:-right-[clamp(28rem,34vw,42rem)] md:h-[clamp(56rem,68vw,84rem)] md:w-[clamp(56rem,68vw,84rem)]">
          <Image
            src="/imagini_galerie/props_decor/fructulbucovinei_galerie.png"
            alt=""
            fill
            className="scale-x-[-1] object-contain object-right"
            sizes="(max-width: 768px) 70vw, 34vw"
          />
        </div>

        <div className="container relative z-30 mx-auto">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div className="relative overflow-visible">
              <div className="pointer-events-none absolute -left-10 -top-28 z-0 h-[clamp(14rem,58vw,22rem)] w-[clamp(18rem,74vw,30rem)] md:-left-16 md:-top-44 md:h-[clamp(20rem,28vw,34rem)] md:w-[clamp(28rem,42vw,46rem)]">
                <Image
                  src="/imagini_galerie/props_decor/fructulbucovinei_patacrem.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 74vw, 42vw"
                />
              </div>
              <h2 className="relative z-10 font-serif text-5xl font-bold leading-[0.98] text-forest text-balance md:text-7xl lg:text-8xl">
                Din livadă,{' '}
                <span className="text-burgundy">în fiecare anotimp</span>
              </h2>
            </div>
            <p className="max-w-3xl text-lg leading-relaxed text-forest/80 md:text-xl lg:ml-auto">
              Am păstrat aici cadre care spun povestea livezii: dimineți liniștite, flori de primăvară,
              mere culese cu grijă și întâlniri cu oamenii care vin să se bucure de natură.
            </p>
          </div>

          <div className="mt-12 columns-2 gap-3 md:columns-2 md:gap-4 lg:mt-16 lg:columns-3 lg:gap-5">
            {galleryImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-3xl bg-[#fbf7ee] shadow-sm ring-1 ring-forest/10 cursor-zoom-in md:mb-4 lg:mb-5 md:rounded-[2rem] ${image.aspectClass}`}
                aria-label="Mărește fotografia"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeImage && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-forest/90 px-5 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveImageIndex(null)}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setActiveImageIndex(null)
            }}
            className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full bg-cream text-forest transition-colors hover:bg-burgundy hover:text-cream"
            aria-label="Închide galeria"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              showPreviousImage()
            }}
            className="absolute left-4 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-forest transition-colors hover:bg-burgundy hover:text-cream md:left-8"
            aria-label="Imaginea anterioară"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            className="relative h-[78vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              showNextImage()
            }}
            className="absolute right-4 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-forest transition-colors hover:bg-burgundy hover:text-cream md:right-8"
            aria-label="Imaginea următoare"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      <Footer />
    </main>
  )
}
