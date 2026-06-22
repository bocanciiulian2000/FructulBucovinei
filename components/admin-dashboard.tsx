'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { Package, ReceiptText } from 'lucide-react'
import { ADMIN_DASHBOARD_PATH } from '@/lib/admin-path'
import { useAuthSession } from '@/components/auth-session-provider'

function DashboardCard({
  icon,
  eyebrow,
  title,
  href,
}: {
  icon: ReactNode
  eyebrow: string
  title: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-burgundy/25 hover:shadow-lg md:p-6"
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-burgundy/10 text-burgundy transition-colors group-hover:bg-burgundy group-hover:text-cream">
        {icon}
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-wide text-brown">{eyebrow}</p>
      <h3 className="mt-2 font-serif text-3xl font-bold leading-none text-forest">{title}</h3>
    </Link>
  )
}

function ForbiddenAdminAccess() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-32 text-center md:px-6">
      <h1 className="font-serif text-5xl font-bold leading-none tracking-tight text-burgundy md:text-7xl">
        403 Forbidden
      </h1>
    </section>
  )
}

export function AdminDashboard() {
  const { user, loading } = useAuthSession()
  const isAdmin = user?.role === 'admin'

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-32 text-center md:px-6">
        <p className="font-serif text-4xl font-bold text-forest">Se verifică sesiunea...</p>
      </section>
    )
  }

  if (!user) {
    return <ForbiddenAdminAccess />
  }

  if (!isAdmin) {
    return <ForbiddenAdminAccess />
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-32 md:px-6 lg:py-36">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-brown">Dashboard admin</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-2">
        <DashboardCard
          icon={<Package size={20} />}
          eyebrow="Inventar"
          title="Produse"
          href={ADMIN_DASHBOARD_PATH + '/inventar'}
        />
        <DashboardCard
          icon={<ReceiptText size={20} />}
          eyebrow="Vânzări"
          title="Comenzi"
          href={ADMIN_DASHBOARD_PATH + '/comenzi'}
        />
      </div>
    </section>
  )
}
