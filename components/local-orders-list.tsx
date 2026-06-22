'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ShoppingBag, X } from 'lucide-react'
import { formatCartPrice, type CartItem } from '@/lib/cart'
import { getOrders, type RemoteOrder, type RemoteOrderItem } from '@/lib/orders'

type LocalOrdersListProps = {
  emptyTitle?: string
  emptyText?: string
}

export function LocalOrdersList({
  emptyTitle = 'Nu ai comenzi încă',
  emptyText = 'După ce finalizezi o comandă, vei vedea aici istoricul ei și detaliile asociate.',
}: LocalOrdersListProps) {
  const [orders, setOrders] = useState<RemoteOrder[]>([])
  const [selectedOrder, setSelectedOrder] = useState<RemoteOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadOrders() {
      setIsLoading(true)
      setError('')

      try {
        const data = await getOrders()

        if (isMounted) {
          setOrders(data.orders)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Comenzile nu au putut fi încărcate.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadOrders()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-forest/10 bg-cream p-5 text-sm font-semibold text-forest/70">
        Se încarcă comenzile...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-burgundy/20 bg-burgundy/5 p-5 text-sm font-semibold text-burgundy">
        {error}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-forest/10 bg-cream p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#fbf7ee] text-burgundy">
            <Package size={20} />
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-forest">
              {emptyTitle}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-forest/70">
              {emptyText}
            </p>
            <Link
              href="/adopta-un-pom"
              className="mt-5 inline-flex items-center gap-3 rounded-sm bg-burgundy px-5 py-3 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest"
            >
              <span>Vezi pachetele</span>
              <ShoppingBag size={15} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-2xl border border-forest/10 bg-cream p-5"
          >
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
              <OrderSummaryCell label="Numărul comenzii" value={order.orderNumber} strong />
              <OrderSummaryCell
                label="Data comenzii"
                value={new Intl.DateTimeFormat('ro-RO', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(order.createdAt))}
              />
              <OrderSummaryCell
                label="Total de plată"
                value={`${formatCartPrice(order.totalAmount)} lei`}
                strong
              />
              <button
                type="button"
                onClick={() => setSelectedOrder(order)}
                className="h-11 rounded-sm bg-burgundy px-5 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest"
              >
                Mai multe detalii
              </button>
            </div>
          </article>
        ))}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  )
}

function OrderSummaryCell({
  label,
  value,
  strong = false,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-brown">
        {label}
      </p>
      <p className={`mt-1 text-base ${strong ? 'font-bold text-burgundy' : 'font-semibold text-forest'}`}>
        {value}
      </p>
    </div>
  )
}

function OrderDetailsModal({
  order,
  onClose,
}: {
  order: RemoteOrder
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-forest/40 backdrop-blur-[2px]"
        aria-label="Închide detaliile comenzii"
        onClick={onClose}
      />
      <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-2xl md:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-forest/15 bg-cream text-forest transition-colors hover:border-burgundy hover:text-burgundy"
          aria-label="Închide popup-ul"
        >
          <X size={20} />
        </button>

        <div className="pr-12">
          <p className="text-xs font-bold uppercase tracking-wide text-brown">
            Detalii comandă
          </p>
          <h3 className="mt-2 font-serif text-4xl font-bold leading-none text-forest">
            {order.orderNumber}
          </h3>
          <p className="mt-3 text-sm font-semibold text-burgundy">
            Total: {formatCartPrice(order.totalAmount)} lei
          </p>
          <p className="mt-2 text-sm font-semibold text-forest/65">
            Status: {order.statusLabel}
          </p>
          {order.awb ? (
            <p className="mt-2 text-sm font-semibold text-forest/65">
              AWB: <span className="text-burgundy">{order.awb}</span>
            </p>
          ) : null}
        </div>

        <div className="mt-7 space-y-5">
          {order.items.map((item) => (
            <OrderedItemDetails key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function OrderedItemDetails({ item }: { item: RemoteOrderItem }) {
  const snapshot = item.productSnapshot as CartItem | null
  const details = snapshot?.adoptionDetails
  const purpose = details?.treePurpose === 'Altceva' && details.treePurposeOther
    ? details.treePurposeOther
    : details?.treePurpose

  return (
    <article className="rounded-2xl border border-forest/10 bg-cream p-5">
      <div className="flex flex-col gap-2 border-b border-forest/10 pb-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brown">
            Produs comandat
          </p>
          <h4 className="mt-1 font-serif text-3xl font-bold leading-none text-forest">
            {item.productName}
          </h4>
        </div>
        <p className="text-sm font-bold text-burgundy">
          {item.quantity} x {formatCartPrice(item.unitPrice)} lei
        </p>
      </div>

      {details ? (
        <dl className="mt-5 grid gap-4 text-sm md:grid-cols-2">
          <DetailRow label="Numele de pe certificat" value={details.certificateName} />
          <DetailRow label="Cum se va numi pomul" value={details.treeName} />
          <DetailRow label="Ce reprezintă pomul" value={purpose ?? '-'} />
          <DetailRow label="Mesaj pentru pom" value={details.treeMessage} wide />
        </dl>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-forest/65">
          Pentru această comandă nu au fost salvate detalii personalizate.
        </p>
      )}
    </article>
  )
}

function DetailRow({
  label,
  value,
  wide = false,
}: {
  label: string
  value: string
  wide?: boolean
}) {
  return (
    <div className={wide ? 'md:col-span-2' : ''}>
      <dt className="text-xs font-bold uppercase tracking-wide text-brown">
        {label}
      </dt>
      <dd className="mt-1 break-words font-semibold leading-relaxed text-forest">
        {value}
      </dd>
    </div>
  )
}
