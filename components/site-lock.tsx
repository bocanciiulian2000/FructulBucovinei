'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'

const storageKey = 'fructul-bucovinei-preview-access'

type SiteLockProps = {
  children: ReactNode
}

export function SiteLock({ children }: SiteLockProps) {
  const isLocked = process.env.NEXT_PUBLIC_SITE_LOCKED === 'true'
  const previewKey = process.env.NEXT_PUBLIC_SITE_PREVIEW_KEY
  const [hasAccess, setHasAccess] = useState(!isLocked)

  useEffect(() => {
    if (!isLocked) {
      setHasAccess(true)
      return
    }

    const savedKey = window.localStorage.getItem(storageKey)

    if (previewKey && savedKey === previewKey) {
      setHasAccess(true)
      return
    }

    const searchParams = new URLSearchParams(window.location.search)
    const previewParam = searchParams.get('preview')

    if (previewKey && previewParam === previewKey) {
      window.localStorage.setItem(storageKey, previewKey)
      setHasAccess(true)
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }

    setHasAccess(false)
  }, [isLocked, previewKey])

  if (hasAccess) {
    return <>{children}</>
  }

  return <ComingSoon />
}

function ComingSoon() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-forest text-cream">
      <Image
        src="/imagini_landing-page/poza_fructulbucovinei_hero.jpeg"
        alt="Livada Fructul Bucovinei"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-forest/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-forest/30 via-transparent to-forest/75" />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 py-10 text-center">
        <div className="relative h-36 w-44 md:h-44 md:w-56">
          <Image
            src="/logo&favicon/logofructulbucovinei.png"
            alt="Fructul Bucovinei"
            fill
            priority
            className="object-contain drop-shadow-[0_10px_28px_rgba(0,0,0,0.24)]"
            sizes="224px"
          />
        </div>

        <div className="flex flex-1 items-center">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cream/80 md:text-sm">
              Fructul Bucovinei
            </p>
            <h1 className="mt-5 font-serif text-5xl font-bold leading-[0.92] tracking-tight text-cream md:text-7xl lg:text-8xl">
              Pregătim ceva bun{' '}
              <span className="text-cream/80">pentru tine</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream/85 md:text-xl">
              Lucrăm la o experiență nouă, crescută cu răbdare, grijă și gust de
              Bucovina. Revenim în curând cu roadele poveștii noastre.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
