"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

type ConsentChoice = 'accepted' | 'rejected' | 'custom'

type StoredConsent = {
  choice: ConsentChoice
  analytics: boolean
  savedAt: string
}

type GtagWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

const CONSENT_KEY = 'fructul-bucovinei-cookie-consent'

function updateGoogleConsent(analytics: boolean) {
  if (typeof window === 'undefined') {
    return
  }

  const gtagWindow = window as GtagWindow

  gtagWindow.gtag?.('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })

  if (analytics) {
    gtagWindow.gtag?.('config', 'G-RYDSYCNL3F', {
      page_path: window.location.pathname + window.location.search,
    })
  }
}

function readConsent(): StoredConsent | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawConsent = window.localStorage.getItem(CONSENT_KEY)
    return rawConsent ? (JSON.parse(rawConsent) as StoredConsent) : null
  } catch {
    return null
  }
}

function saveConsent(choice: ConsentChoice, analytics: boolean) {
  const consent: StoredConsent = {
    choice,
    analytics,
    savedAt: new Date().toISOString(),
  }

  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
  updateGoogleConsent(analytics)
}

export function CookieConsentBanner() {
  const [isReady, setIsReady] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  useEffect(() => {
    const storedConsent = readConsent()

    if (storedConsent) {
      setAnalyticsEnabled(storedConsent.analytics)
      updateGoogleConsent(storedConsent.analytics)
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }

    setIsReady(true)
  }, [])

  if (!isReady) {
    return null
  }

  const acceptAll = () => {
    saveConsent('accepted', true)
    setAnalyticsEnabled(true)
    setShowSettings(false)
    setIsVisible(false)
  }

  const rejectAll = () => {
    saveConsent('rejected', false)
    setAnalyticsEnabled(false)
    setShowSettings(false)
    setIsVisible(false)
  }

  const saveCustom = () => {
    saveConsent('custom', analyticsEnabled)
    setShowSettings(false)
    setIsVisible(false)
  }

  return (
    <>
      {isVisible ? (
        <div className="fixed inset-x-0 bottom-0 z-[120] px-4 pb-4 sm:px-6 sm:pb-6">
          <section
            aria-label="Setări cookie"
            className="mx-auto max-w-5xl rounded-2xl border border-forest/15 bg-[#fbf7ee] p-4 text-forest shadow-2xl md:p-5"
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brown">
                  Confidențialitate și cookie-uri
                </p>
                <h2 className="mt-2 font-serif text-2xl font-bold leading-none text-forest md:text-3xl">
                  Alegerea ta contează
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-forest/75 md:text-base">
                  Folosim cookie-uri strict necesare pentru funcționarea site-ului. Cookie-urile de analiză, inclusiv Google Analytics, sunt folosite doar dacă îți dai acordul. Poți modifica sau retrage consimțământul oricând.
                </p>
                <Link
                  href="/politica-de-confidentialitate"
                  className="mt-2 inline-flex text-sm font-semibold text-burgundy underline-offset-4 hover:underline"
                >
                  Citește politica de confidențialitate
                </Link>

                {showSettings ? (
                  <div className="mt-4 rounded-xl border border-forest/10 bg-cream p-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked
                        disabled
                        className="mt-1 size-4 rounded border-forest/30 text-burgundy"
                      />
                      <span>
                        <span className="block text-sm font-bold text-forest">Cookie-uri necesare</span>
                        <span className="mt-1 block text-sm leading-relaxed text-forest/65">
                          Necesare pentru funcționarea site-ului, coșului și sesiunii de autentificare.
                        </span>
                      </span>
                    </label>

                    <label className="mt-4 flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={analyticsEnabled}
                        onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                        className="mt-1 size-4 rounded border-forest/30 text-burgundy focus:ring-burgundy"
                      />
                      <span>
                        <span className="block text-sm font-bold text-forest">Cookie-uri de analiză</span>
                        <span className="mt-1 block text-sm leading-relaxed text-forest/65">
                          Ne ajută să înțelegem cum este folosit site-ul, prin Google Analytics.
                        </span>
                      </span>
                    </label>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row lg:min-w-80 lg:flex-col">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="rounded-sm bg-burgundy px-5 py-3 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest"
                >
                  Accept toate
                </button>
                {showSettings ? (
                  <button
                    type="button"
                    onClick={saveCustom}
                    className="rounded-sm border border-forest/25 px-5 py-3 text-xs font-bold uppercase tracking-wide text-forest transition-colors hover:border-burgundy hover:text-burgundy"
                  >
                    Salvează opțiunile
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSettings(true)}
                    className="rounded-sm border border-forest/25 px-5 py-3 text-xs font-bold uppercase tracking-wide text-forest transition-colors hover:border-burgundy hover:text-burgundy"
                  >
                    Setări cookie
                  </button>
                )}
                <button
                  type="button"
                  onClick={rejectAll}
                  className="rounded-sm px-5 py-3 text-xs font-bold uppercase tracking-wide text-forest/75 transition-colors hover:text-burgundy"
                >
                  Refuz
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            const storedConsent = readConsent()
            setAnalyticsEnabled(storedConsent?.analytics ?? false)
            setShowSettings(true)
            setIsVisible(true)
          }}
          className="fixed bottom-4 left-4 z-[110] rounded-full border border-forest/15 bg-[#fbf7ee] px-4 py-2 text-xs font-bold uppercase tracking-wide text-forest shadow-lg transition-colors hover:border-burgundy hover:text-burgundy"
        >
          Cookie-uri
        </button>
      )}
    </>
  )
}
