'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, Mail, MapPin, Package, Phone, RefreshCcw, Send, User } from 'lucide-react'
import { ADMIN_DASHBOARD_PATH } from '@/lib/admin-path'
import { getAdminOrders, markAdminOrderAsShipped, type AdminOrderCategory, type AdminOrdersPagination } from '@/lib/admin-orders'
import { formatCartPrice } from '@/lib/cart'
import type { RemoteOrder } from '@/lib/orders'
import { useAuthSession } from '@/components/auth-session-provider'

const PAGE_LIMIT = 10

function ForbiddenAdminAccess() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-32 text-center md:px-6">
      <h1 className="font-serif text-5xl font-bold leading-none tracking-tight text-burgundy md:text-7xl">
        403 Forbidden
      </h1>
    </section>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function getOrderCustomerName(order: RemoteOrder) {
  const billingAddress = order.addresses.find((address) => address.type === 'billing')

  if (!billingAddress) {
    return order.customerEmail
  }

  return [billingAddress.firstName, billingAddress.lastName].filter(Boolean).join(' ') || order.customerEmail
}

function OrderCard({
  order,
  category,
  awbDraft,
  isSaving,
  onAwbChange,
  onShip,
}: {
  order: RemoteOrder
  category: AdminOrderCategory
  awbDraft: string
  isSaving: boolean
  onAwbChange: (value: string) => void
  onShip: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const canShip = awbDraft.trim().length > 0 && !isSaving
  const billingAddress = order.addresses.find((address) => address.type === 'billing')
  const shippingAddress = order.addresses.find((address) => address.type === 'shipping')
  const primaryAddress = shippingAddress || billingAddress
  const customerName = getOrderCustomerName(order)

  const formatAddress = (address: RemoteOrder['addresses'][number] | undefined) => {
    if (!address) {
      return '-'
    }

    return [
      address.streetAddress,
      address.addressExtra,
      address.city,
      address.county,
      address.postalCode,
      address.country,
    ]
      .filter(Boolean)
      .join(', ')
  }

  const customerInfo = [
    {
      label: 'Client',
      value: customerName,
      icon: <User size={15} />,
    },
    {
      label: 'Email',
      value: order.customerEmail,
      icon: <Mail size={15} />,
    },
    {
      label: 'Telefon',
      value: primaryAddress?.phone || billingAddress?.phone || '-',
      icon: <Phone size={15} />,
    },
    {
      label: 'Adresă livrare',
      value: formatAddress(shippingAddress),
      icon: <MapPin size={15} />,
      wide: true,
    },
    {
      label: 'Adresă facturare',
      value: formatAddress(billingAddress),
      icon: <MapPin size={15} />,
      wide: true,
    },
    {
      label: 'Metodă plată',
      value: order.paymentMethod === 'card' ? 'Plată online' : 'Numerar la livrare',
      icon: <Package size={15} />,
    },
    {
      label: 'Notă client',
      value: order.customerNote || '-',
      icon: <Package size={15} />,
      wide: true,
    },
  ]

  return (
    <article className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-sm transition-all duration-300">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-serif text-3xl font-bold leading-none text-forest">{order.orderNumber}</p>
            <span className="rounded-full bg-burgundy/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-burgundy">
              {order.statusLabel}
            </span>
          </div>

          <dl className="mt-5 grid gap-4 text-sm md:grid-cols-4">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-brown">Client</dt>
              <dd className="mt-1 font-semibold text-forest">{customerName}</dd>
              <dd className="mt-1 break-words text-forest/65">{order.customerEmail}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-brown">Data</dt>
              <dd className="mt-1 font-semibold text-forest">{formatDate(order.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-brown">Produse</dt>
              <dd className="mt-1 font-semibold text-forest">
                {order.items.reduce((total, item) => total + item.quantity, 0)} buc.
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-brown">Total</dt>
              <dd className="mt-1 font-bold text-burgundy">{formatCartPrice(order.totalAmount)} lei</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            {order.items.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-2 rounded-full border border-forest/10 bg-cream px-3 py-1.5 text-xs font-semibold text-forest"
              >
                <Package size={13} />
                {item.quantity} x {item.productName}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((currentValue) => !currentValue)}
            className="mt-5 inline-flex items-center gap-2 rounded-sm border border-forest/20 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-forest transition-colors hover:border-burgundy hover:text-burgundy"
          >
            Mai multe informații
            <ChevronDown
              size={15}
              className={'transition-transform duration-300 ' + (isExpanded ? 'rotate-180' : '')}
            />
          </button>

          {order.awb ? (
            <p className="mt-5 text-sm font-semibold text-forest">
              AWB: <span className="text-burgundy">{order.awb}</span>
            </p>
          ) : null}
        </div>

        {category === 'received' ? (
          <div className="rounded-2xl border border-forest/10 bg-cream p-4 lg:w-72">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-brown">AWB comandă</span>
              <input
                value={awbDraft}
                onChange={(event) => onAwbChange(event.target.value)}
                placeholder="Introdu AWB-ul"
                className="mt-3 h-11 w-full rounded-full border border-forest/20 bg-[#fbf7ee] px-4 text-sm font-semibold text-forest outline-none placeholder:text-forest/40 focus:border-burgundy"
              />
            </label>
            <button
              type="button"
              onClick={onShip}
              disabled={!canShip}
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-burgundy px-4 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSaving ? <RefreshCcw size={14} className="animate-spin" /> : <Send size={14} />}
              Trimisă
            </button>
          </div>
        ) : null}
      </div>

      {isExpanded ? (
        <div className="mt-6 border-t border-forest/10 pt-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {customerInfo.map((info) => (
              <div
                key={info.label}
                className={'rounded-2xl border border-forest/10 bg-cream p-4 ' + (info.wide ? 'md:col-span-2 xl:col-span-3' : '')}
              >
                <div className="flex items-center gap-2 text-brown">
                  {info.icon}
                  <p className="text-xs font-bold uppercase tracking-wide">{info.label}</p>
                </div>
                <p className="mt-2 break-words text-sm font-semibold leading-relaxed text-forest">
                  {info.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  )
}

export function AdminOrders() {
  const { user, loading } = useAuthSession()
  const [category, setCategory] = useState<AdminOrderCategory>('received')
  const [page, setPage] = useState(1)
  const [orders, setOrders] = useState<RemoteOrder[]>([])
  const [pagination, setPagination] = useState<AdminOrdersPagination>({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  })
  const [awbDrafts, setAwbDrafts] = useState<Record<number, string>>({})
  const [savingOrderId, setSavingOrderId] = useState<number | null>(null)
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isAdmin = user?.role === 'admin'

  const categoryTitle = useMemo(
    () => (category === 'received' ? 'Comenzi primite' : 'Comenzi trimise'),
    [category]
  )

  const loadOrders = async (nextCategory = category, nextPage = page) => {
    setIsLoadingOrders(true)
    setError('')
    setMessage('')

    try {
      const data = await getAdminOrders(nextCategory, nextPage, PAGE_LIMIT)
      setOrders(data.orders)
      setPagination(data.pagination)
      setAwbDrafts(
        Object.fromEntries(data.orders.map((order) => [order.id, order.awb ?? '']))
      )
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Comenzile nu au putut fi încărcate.')
    } finally {
      setIsLoadingOrders(false)
    }
  }

  useEffect(() => {
    if (!loading && isAdmin) {
      void loadOrders(category, page)
    }
  }, [loading, isAdmin, category, page])

  const changeCategory = (nextCategory: AdminOrderCategory) => {
    setCategory(nextCategory)
    setPage(1)
  }

  const shipOrder = async (orderId: number) => {
    const awb = (awbDrafts[orderId] || '').trim()

    if (!awb) {
      return
    }

    setSavingOrderId(orderId)
    setError('')
    setMessage('')

    try {
      await markAdminOrderAsShipped(orderId, awb)
      setMessage('Comanda a fost marcată ca trimisă.')
      await loadOrders(category, page)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Comanda nu a putut fi actualizată.')
    } finally {
      setSavingOrderId(null)
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-32 text-center md:px-6">
        <p className="font-serif text-4xl font-bold text-forest">Se verifică sesiunea...</p>
      </section>
    )
  }

  if (!isAdmin) {
    return <ForbiddenAdminAccess />
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-32 md:px-6 lg:py-36">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            href={ADMIN_DASHBOARD_PATH}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-burgundy transition-colors hover:text-forest"
          >
            <ArrowLeft size={14} />
            Dashboard admin
          </Link>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-[0.95] tracking-tight text-forest md:text-7xl">
            {categoryTitle.split(' ')[0]} <span className="text-burgundy">{categoryTitle.split(' ').slice(1).join(' ')}</span>
          </h1>
        </div>

        <button
          type="button"
          onClick={() => void loadOrders(category, page)}
          disabled={isLoadingOrders}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-forest/20 px-5 text-xs font-bold uppercase tracking-wide text-forest transition-colors hover:border-burgundy hover:text-burgundy disabled:opacity-50"
        >
          <RefreshCcw size={14} className={isLoadingOrders ? 'animate-spin' : ''} />
          Reîncarcă
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => changeCategory('received')}
          className={`rounded-sm px-5 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
            category === 'received' ? 'bg-burgundy text-cream' : 'border border-forest/20 text-forest hover:border-burgundy hover:text-burgundy'
          }`}
        >
          Comenzi primite
        </button>
        <button
          type="button"
          onClick={() => changeCategory('shipped')}
          className={`rounded-sm px-5 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
            category === 'shipped' ? 'bg-burgundy text-cream' : 'border border-forest/20 text-forest hover:border-burgundy hover:text-burgundy'
          }`}
        >
          Comenzi trimise
        </button>
      </div>

      {message ? (
        <div className="mt-8 rounded-2xl border border-forest/10 bg-forest/5 px-4 py-3 text-sm font-semibold text-forest">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-2xl border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-sm font-semibold text-burgundy">
          {error}
        </div>
      ) : null}

      <div className="mt-10 space-y-5">
        {isLoadingOrders && orders.length === 0 ? (
          <p className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-6 text-center text-sm font-semibold text-forest/70">
            Se încarcă comenzile...
          </p>
        ) : null}

        {!isLoadingOrders && orders.length === 0 && !error ? (
          <p className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-6 text-center text-sm font-semibold text-forest/70">
            Nu există comenzi în această categorie.
          </p>
        ) : null}

        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            category={category}
            awbDraft={awbDrafts[order.id] ?? ''}
            isSaving={savingOrderId === order.id}
            onAwbChange={(value) =>
              setAwbDrafts((currentDrafts) => ({
                ...currentDrafts,
                [order.id]: value,
              }))
            }
            onShip={() => void shipOrder(order.id)}
          />
        ))}
      </div>

      {pagination.totalPages > 1 ? (
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-forest/10 bg-[#fbf7ee] px-4 py-4 sm:flex-row">
          <p className="text-sm font-semibold text-forest/70">
            Pagina {pagination.page} din {pagination.totalPages} · {pagination.total} comenzi
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              disabled={pagination.page <= 1 || isLoadingOrders}
              className="inline-flex h-10 items-center gap-2 rounded-sm border border-forest/20 px-4 text-xs font-bold uppercase tracking-wide text-forest transition-colors hover:border-burgundy hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronLeft size={14} />
              Înapoi
            </button>
            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.min(pagination.totalPages, currentPage + 1))}
              disabled={pagination.page >= pagination.totalPages || isLoadingOrders}
              className="inline-flex h-10 items-center gap-2 rounded-sm border border-forest/20 px-4 text-xs font-bold uppercase tracking-wide text-forest transition-colors hover:border-burgundy hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-45"
            >
              Înainte
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
