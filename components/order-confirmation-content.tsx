'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ShoppingBag } from 'lucide-react'
import { formatCartPrice } from '@/lib/cart'
import { getOrder, type RemoteOrder } from '@/lib/orders'

export function OrderConfirmationContent() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState<RemoteOrder | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const currentOrderNumber = params.get('order') ?? ''
    const paymentToken = params.get('token') ?? undefined
    setOrderNumber(currentOrderNumber)

    if (!currentOrderNumber) {
      return
    }

    let isMounted = true
    setIsLoading(true)

    getOrder(currentOrderNumber, paymentToken)
      .then((data) => {
        if (isMounted) {
          setOrder(data.order)
        }
      })
      .catch(() => {
        if (isMounted) {
          setOrder(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      router.push('/')
    }, 15000)

    return () => window.clearTimeout(redirectTimer)
  }, [router])

  return (
    <section className="container mx-auto max-w-5xl px-4 pb-16 pt-32 md:px-6 md:pt-40 lg:px-12">
      <div className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-6 text-center shadow-sm md:p-10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
          <CheckCircle2 size={30} />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-wide text-brown">
          Comandă primită
        </p>
        <h1 className="mt-2 font-serif text-5xl font-bold leading-[0.98] text-forest md:text-7xl">
          Îți mulțumim pentru comandă!
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-forest/75 md:text-xl">
          Comanda ta a fost primită și urmează să fie procesată.
        </p>

        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-forest/10 bg-cream p-5 text-left">
          <div className="flex items-center justify-between gap-4 border-b border-forest/10 pb-4">
            <span className="text-xs font-bold uppercase tracking-wide text-forest/70">
              Numărul comenzii
            </span>
            <span className="font-serif text-2xl font-bold text-burgundy">
              {orderNumber || 'Indisponibil'}
            </span>
          </div>

          {isLoading ? (
            <p className="mt-4 text-sm font-semibold text-forest/65">
              Se încarcă detaliile comenzii...
            </p>
          ) : order ? (
            <div className="mt-4 space-y-3 text-sm text-forest/75">
              <div className="flex justify-between gap-4">
                <span>Status</span>
                <span className="font-semibold text-forest">{order.statusLabel}</span>
              </div>
              {order.awb ? (
                <div className="flex justify-between gap-4">
                  <span>AWB</span>
                  <span className="font-semibold text-burgundy">{order.awb}</span>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <span>Metodă de plată</span>
                <span className="font-semibold text-forest">
                  {order.paymentMethod === 'card' ? 'Plată online' : 'Numerar la livrare'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Total</span>
                <span className="font-semibold text-burgundy">{formatCartPrice(order.totalAmount)} lei</span>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-forest/65">
              Comanda a fost salvată. Dacă ești autentificat, o vei vedea și în secțiunea Comenzile mele.
            </p>
          )}
        </div>

        <p className="mt-6 text-sm font-semibold text-forest/65">
          Vei fi redirecționat automat către pagina principală în 15 secunde.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/comenzile-mele"
            className="inline-flex items-center gap-3 rounded-sm bg-burgundy px-6 py-3 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest"
          >
            <ShoppingBag size={15} />
            Vezi comenzile mele
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-sm border border-forest/20 px-6 py-3 text-xs font-bold uppercase tracking-wide text-forest transition-colors hover:border-burgundy hover:text-burgundy"
          >
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    </section>
  )
}
