'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { apiUrl } from '@/lib/api-url'

type ConfirmationState = 'loading' | 'success' | 'error'

export function EmailConfirmationContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [state, setState] = useState<ConfirmationState>('loading')
  const [message, setMessage] = useState('Confirmăm adresa ta de email...')

  useEffect(() => {
    let isMounted = true

    async function confirmEmail() {
      if (!token) {
        setState('error')
        setMessage('Linkul de confirmare este invalid.')
        return
      }

      try {
        const response = await fetch(apiUrl('/api/auth/verify-email'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ token }),
        })
        const data = (await response.json()) as {
          message?: string
          error?: string
        }

        if (!isMounted) {
          return
        }

        if (!response.ok) {
          throw new Error(data.error ?? 'Linkul de confirmare este invalid sau a expirat.')
        }

        setState('success')
        setMessage(data.message ?? 'Adresa de email a fost confirmată. Te poți autentifica.')
      } catch (error) {
        if (!isMounted) {
          return
        }

        setState('error')
        setMessage(error instanceof Error ? error.message : 'Nu am putut confirma adresa de email.')
      }
    }

    void confirmEmail()

    return () => {
      isMounted = false
    }
  }, [token])

  const Icon = state === 'loading' ? Loader2 : state === 'success' ? CheckCircle2 : XCircle

  return (
    <section className="min-h-screen bg-site px-4 py-28 text-forest">
      <div className="mx-auto flex min-h-[55vh] w-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-[28px] border border-forest/10 bg-cream/80 p-8 text-center shadow-sm md:p-12">
          <div className={`mx-auto flex size-14 items-center justify-center rounded-full ${
            state === 'success'
              ? 'bg-emerald-100 text-emerald-700'
              : state === 'error'
                ? 'bg-burgundy/10 text-burgundy'
                : 'bg-forest/10 text-forest'
          }`}>
            <Icon className={state === 'loading' ? 'animate-spin' : ''} size={26} />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-wide text-brown">
            Confirmare email
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-forest md:text-6xl">
            {state === 'success' ? (
              <>
                Email <span className="text-burgundy">confirmat</span>
              </>
            ) : state === 'error' ? (
              <>
                Link <span className="text-burgundy">invalid</span>
              </>
            ) : (
              <>
                Se verifică <span className="text-burgundy">emailul</span>
              </>
            )}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-forest/75">
            {message}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-sm border border-forest/15 px-6 text-xs font-bold uppercase tracking-wide text-forest transition-colors hover:border-burgundy hover:text-burgundy"
            >
              Înapoi pe site
            </Link>
            {state === 'success' ? (
              <Link
                href="/contul-meu"
                className="inline-flex h-12 items-center justify-center rounded-sm bg-burgundy px-6 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest"
              >
                Autentificare
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
