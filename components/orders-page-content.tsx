'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { AuthPanel } from '@/components/auth-panel'
import { useAuthSession } from '@/components/auth-session-provider'
import { LocalOrdersList } from '@/components/local-orders-list'

export function OrdersPageContent() {
  const { user, loading } = useAuthSession()

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-36 lg:px-12 lg:pt-40">
        <div className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-6 shadow-sm md:p-8">
          Se încarcă comenzile...
        </div>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-36 lg:px-12 lg:pt-40">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wide text-brown">
              Comenzile mele
            </p>
            <h1 className="font-serif text-5xl font-bold leading-none text-forest">
              Autentifică-te pentru a-ți vedea comenzile
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-forest/75">
              După autentificare vei vedea aici comenzile tale, detaliile și
              starea lor.
            </p>
          </div>

          <div className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-sm md:p-7">
            <AuthPanel defaultMode="login" compact />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pb-20 pt-36 lg:px-12 lg:pt-40">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brown">
            Comenzile mele
          </p>
          <h1 className="mt-2 font-serif text-5xl font-bold leading-none text-forest">
            Bun venit, {user.firstName}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-forest/75">
            Aici vor apărea comenzile tale, pe măsură ce le plasezi.
          </p>
        </div>

        <Link
          href="/adopta-un-pom"
          className="group inline-flex items-center gap-3 rounded-sm bg-burgundy px-5 py-3 text-xs font-bold uppercase tracking-wide text-cream transition-all duration-300 hover:gap-4 hover:bg-forest"
        >
          <span>Vezi pachetele</span>
          <ShoppingBag size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-10 rounded-3xl border border-forest/10 bg-[#fbf7ee] p-6 shadow-sm md:p-8">
        <LocalOrdersList />
      </div>
    </section>
  )
}
