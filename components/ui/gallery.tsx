'use client'

import { Ref, forwardRef, useEffect, useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

type Direction = 'left' | 'right'

const photos = [
  {
    id: 1,
    order: 0,
    x: '-610px',
    mobileX: '-210px',
    y: '38px',
    mobileY: '26px',
    zIndex: 70,
    direction: 'right' as Direction,
    src: '/optimized/home-gallery/poza1.webp',
    alt: 'Livada Fructul Bucovinei',
  },
  {
    id: 2,
    order: 1,
    x: '-460px',
    mobileX: '-172px',
    y: '22px',
    mobileY: '10px',
    zIndex: 60,
    direction: 'left' as Direction,
    src: '/optimized/home-gallery/poza3.webp',
    alt: 'Copii în livada Fructul Bucovinei',
  },
  {
    id: 3,
    order: 2,
    x: '-230px',
    mobileX: '-86px',
    y: '42px',
    mobileY: '42px',
    zIndex: 50,
    direction: 'left' as Direction,
    src: '/optimized/home-gallery/actfamilii1.webp',
    alt: 'Activități pentru familii în livadă',
  },
  {
    id: 4,
    order: 3,
    x: '0px',
    mobileX: '0px',
    y: '8px',
    mobileY: '0px',
    zIndex: 40,
    direction: 'right' as Direction,
    src: '/optimized/home-gallery/poza5.webp',
    alt: 'Mere din galeria Fructul Bucovinei',
  },
  {
    id: 5,
    order: 4,
    x: '230px',
    mobileX: '86px',
    y: '30px',
    mobileY: '40px',
    zIndex: 30,
    direction: 'right' as Direction,
    src: '/optimized/home-gallery/echipa2.webp',
    alt: 'Echipa livezii Fructul Bucovinei',
  },
  {
    id: 6,
    order: 5,
    x: '460px',
    mobileX: '172px',
    y: '56px',
    mobileY: '14px',
    zIndex: 20,
    direction: 'left' as Direction,
    src: '/optimized/home-gallery/atelierdesuc.webp',
    alt: 'Atelier de suc de mere',
  },
  {
    id: 7,
    order: 6,
    x: '610px',
    mobileX: '210px',
    y: '34px',
    mobileY: '28px',
    zIndex: 10,
    direction: 'right' as Direction,
    src: '/optimized/home-gallery/poza8.webp',
    alt: 'Moment din livada Fructul Bucovinei',
  },
]

const mobilePhotos = [
  {
    ...photos[2],
    order: 0,
    mobileX: '-84px',
    mobileY: '28px',
    zIndex: 30,
  },
  {
    ...photos[3],
    order: 1,
    mobileX: '0px',
    mobileY: '0px',
    zIndex: 50,
  },
  {
    ...photos[4],
    order: 2,
    mobileX: '84px',
    mobileY: '32px',
    zIndex: 20,
  },
]

export const PhotoGallery = ({
  animationDelay = 0.2,
}: {
  animationDelay?: number
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activePhotoId, setActivePhotoId] = useState<number | null>(null)

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 768)

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true)
    }, animationDelay * 1000)

    const animationTimer = setTimeout(() => {
      setIsLoaded(true)
    }, (animationDelay + 0.4) * 1000)

    return () => {
      clearTimeout(visibilityTimer)
      clearTimeout(animationTimer)
    }
  }, [animationDelay])

  const displayedPhotos = isMobile ? mobilePhotos : photos
  const photoSize = isMobile ? 150 : 310

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const photoVariants = {
    hidden: () => ({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    }),
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15,
      },
    }),
  }

  return (
    <div className="relative overflow-hidden pb-0 pt-6 md:overflow-visible md:pb-4 md:pt-18">
      <div className="relative h-[230px] w-full items-center justify-center md:mb-10 md:h-[500px] md:block lg:flex">
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? 'visible' : 'hidden'}
          >
            <div
              className="relative"
              style={{ height: photoSize, width: photoSize }}
            >
              {[...displayedPhotos].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{
                    zIndex: activePhotoId === photo.id ? 100 : photo.zIndex,
                  }}
                  variants={photoVariants}
                  custom={{
                    x: isMobile ? photo.mobileX : photo.x,
                    y: isMobile ? photo.mobileY : photo.y,
                    order: photo.order,
                  }}
                  onHoverStart={() => setActivePhotoId(photo.id)}
                  onHoverEnd={() => setActivePhotoId(null)}
                  onFocus={() => setActivePhotoId(photo.id)}
                  onBlur={() => setActivePhotoId(null)}
                >
                  <Photo
                    width={photoSize}
                    height={photoSize}
                    src={photo.src}
                    alt={photo.alt}
                    direction={photo.direction}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function getRandomNumberInRange(min: number, max: number): number {
  if (min >= max) {
    throw new Error('Min value should be less than max value')
  }

  return Math.random() * (max - min) + min
}

const MotionImage = motion.create(
  forwardRef(function MotionImage(
    props: ImageProps,
    ref: Ref<HTMLImageElement>
  ) {
    return <Image ref={ref} {...props} />
  })
)

export const Photo = ({
  src,
  alt,
  className,
  direction,
  width,
  height,
  ...props
}: {
  src: string
  alt: string
  className?: string
  direction?: Direction
  width: number
  height: number
}) => {
  const [rotation, setRotation] = useState<number>(0)

  useEffect(() => {
    const randomRotation =
      getRandomNumberInRange(1, 4) * (direction === 'left' ? -1 : 1)
    setRotation(randomRotation)
  }, [direction])

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.12, zIndex: 9999 }}
      whileHover={{
        scale: 1.08,
        rotateZ: 2 * (direction === 'left' ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{
        scale: 1.08,
        zIndex: 9999,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        transform: 'rotate(0deg) rotateX(0deg) rotateY(0deg)',
        zIndex: 1,
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        touchAction: 'none',
      }}
      className={cn(
        className,
        'relative mx-auto shrink-0 cursor-grab transform-gpu will-change-transform active:cursor-grabbing'
      )}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl shadow-md ring-1 ring-forest/10 md:rounded-2xl">
        <MotionImage
          className="rounded-xl object-cover md:rounded-2xl"
          fill
          src={src}
          alt={alt}
          sizes="(max-width: 768px) 150px, 310px"
          loading="lazy"
          decoding="async"
          {...props}
          draggable={false}
        />
      </div>
    </motion.div>
  )
}
