'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

interface SmoothScrollProviderProps {
  children: ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const hash = window.location.hash

      if (hash) {
        const target = document.querySelector(hash)

        if (target) {
          lenisRef.current?.scrollTo(target, { immediate: true })
          return
        }
      }

      lenisRef.current?.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return <>{children}</>
}
