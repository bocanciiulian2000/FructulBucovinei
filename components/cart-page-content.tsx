'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import {
  CART_UPDATED_EVENT,
  formatCartPrice,
  getCartSubtotal,
  parseCartPrice,
  readCart,
  removeCartItem,
  setCartItemQuantity,
  type CartItem,
} from '@/lib/cart'
import { reconcileCartWithInventory } from '@/lib/cart-inventory'
import {
  clearAppliedPromoCode,
  getPromoDiscountAmount,
  getPromoDiscountPercent,
  normalizePromoCode,
  PROMO_UPDATED_EVENT,
  readAppliedPromoCode,
  writeAppliedPromoCode,
} from '@/lib/promotions'


export function CartPageContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [giftCardCode, setGiftCardCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [couponMessage, setCouponMessage] = useState('')

  useEffect(() => {
    const syncCart = () => {
      const currentCart = readCart()
      setCartItems(currentCart)
      void reconcileCartWithInventory(currentCart).then(setCartItems)
    }

    syncCart()
    window.addEventListener(CART_UPDATED_EVENT, syncCart)
    window.addEventListener('storage', syncCart)

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart)
      window.removeEventListener('storage', syncCart)
    }
  }, [])

  useEffect(() => {
    const syncPromoCode = () => {
      const code = readAppliedPromoCode()
      setAppliedCoupon(code)
      setCouponCode(code)
    }

    syncPromoCode()
    window.addEventListener(PROMO_UPDATED_EVENT, syncPromoCode)
    window.addEventListener('storage', syncPromoCode)

    return () => {
      window.removeEventListener(PROMO_UPDATED_EVENT, syncPromoCode)
      window.removeEventListener('storage', syncPromoCode)
    }
  }, [])

  const subtotal = useMemo(() => getCartSubtotal(cartItems), [cartItems])
  const discountPercent = getPromoDiscountPercent(appliedCoupon)
  const discountAmount = getPromoDiscountAmount(subtotal, appliedCoupon)
  const total = subtotal - discountAmount

  const updateQuantity = (slug: string, quantity: number) => {
    setCartItems(setCartItemQuantity(slug, quantity))
  }

  const removeItem = (slug: string) => {
    setCartItems(removeCartItem(slug))
  }

  const applyCoupon = () => {
    const normalizedCode = normalizePromoCode(couponCode)

    if (!normalizedCode) {
      setCouponMessage('Introdu un cod promoțional.')
      return
    }

    const appliedCode = writeAppliedPromoCode(normalizedCode)

    if (!appliedCode) {
      setCouponMessage('Codul promoțional nu este valid.')
      return
    }

    setAppliedCoupon(appliedCode)
    setCouponCode(appliedCode)
    setCouponMessage(`Reducere de ${getPromoDiscountPercent(appliedCode)}% aplicată.`)
  }

  const removeCoupon = () => {
    clearAppliedPromoCode()
    setAppliedCoupon('')
    setCouponCode('')
    setCouponMessage('Codul promoțional a fost eliminat.')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.55fr_0.85fr] lg:items-start">
      <section className="overflow-hidden rounded-2xl border border-forest/10 bg-[#fbf7ee] shadow-sm">
        <div className="hidden grid-cols-[1fr_8rem_10rem_8rem] border-b border-forest/10 px-6 py-5 text-xs font-bold uppercase tracking-wide text-forest md:grid">
          <span>Produs</span>
          <span className="text-right">Preț</span>
          <span className="text-center">Cantitate</span>
          <span className="text-right">Sub-total</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-serif text-4xl font-bold text-forest">
              Coșul este gol
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-forest/65">
              Adaugă pachete din pagina Adoptă un pom, apoi revino aici pentru a
              finaliza comanda.
            </p>
            <Link
              href="/adopta-un-pom"
              className="mt-7 inline-flex rounded-sm bg-burgundy px-6 py-3 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest"
            >
              Vezi pachetele
            </Link>
          </div>
        ) : (
          cartItems.map((item) => {
            const itemTotal = parseCartPrice(item.price) * item.quantity

            return (
              <article
                key={item.slug}
                className="grid gap-5 border-b border-forest/10 px-5 py-6 last:border-b-0 md:grid-cols-[1fr_8rem_10rem_8rem] md:items-center md:px-6 md:py-8"
              >
                <div className="grid grid-cols-[5.5rem_1fr] items-center gap-5">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-cream">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="90px"
                    />
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl font-bold leading-none text-forest md:text-3xl">
                      {item.name}
                    </h2>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-burgundy transition-colors hover:text-forest"
                      >
                        <Trash2 size={13} />
                        Șterge produsul
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-bold text-forest md:text-right">
                  <span className="mr-2 font-semibold text-brown md:hidden">
                    Preț:
                  </span>
                  {item.price}
                </p>

                <div className="flex items-center md:justify-center">
                  <div className="grid h-11 w-28 grid-cols-3 overflow-hidden rounded-full border border-forest/15 bg-cream text-forest">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="flex items-center justify-center transition-colors hover:bg-burgundy hover:text-cream disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-forest"
                      aria-label="Scade cantitatea"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.slug, Number(event.target.value))
                      }
                      aria-label={`Cantitate pentru ${item.name}`}
                      className="min-w-0 bg-transparent text-center text-sm font-bold text-forest outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                      className="flex items-center justify-center transition-colors hover:bg-burgundy hover:text-cream"
                      aria-label="Crește cantitatea"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <p className="font-bold text-burgundy md:text-right">
                  <span className="mr-2 font-semibold text-brown md:hidden">
                    Sub-total:
                  </span>
                  {formatCartPrice(itemTotal)} lei
                </p>
              </article>
            )
          })
        )}
      </section>

      <aside className="rounded-2xl border border-forest/10 bg-[#fbf7ee] p-6 shadow-sm lg:sticky lg:top-28">
        <h2 className="font-serif text-3xl font-bold leading-none text-forest">
          Total <span className="text-burgundy">coș</span>
        </h2>

        <div className="mt-7 space-y-5 text-sm">
          <SummaryRow label="Sub-total" value={`${formatCartPrice(subtotal)} lei`} />
          <SummaryRow label="Livrare estimată" value="3 zile" />

          <p className="border-y border-forest/10 py-5 text-right text-sm font-semibold italic text-forest">
            Taxele și livrarea finală se calculează la checkout.
          </p>

          {discountPercent > 0 && (
            <SummaryRow
              label={`Reducere ${appliedCoupon}`}
              value={`-${discountPercent}%`}
            />
          )}

          <SummaryRow
            label="Total"
            value={`${formatCartPrice(total)} lei`}
            strong
          />
        </div>

        <div className="mt-7 space-y-4">
          <div>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <input
                value={couponCode}
                onChange={(event) => {
                  setCouponCode(event.target.value)
                  setCouponMessage('')
                }}
                placeholder="Cod cupon"
                className="h-12 rounded-full border border-forest/20 bg-cream px-5 text-sm font-semibold uppercase text-forest outline-none placeholder:normal-case placeholder:text-forest/40 focus:border-burgundy"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="h-12 rounded-sm bg-forest px-5 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-burgundy"
              >
                Aplică
              </button>
            </div>
            {couponMessage && (
              <p className="mt-2 text-xs font-semibold text-burgundy">
                {couponMessage}
              </p>
            )}
            {appliedCoupon && discountPercent > 0 ? (
              <div className="mt-3 rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm text-forest">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">
                    Cod aplicat: <span className="text-burgundy">{appliedCoupon}</span>
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs font-bold uppercase tracking-wide text-burgundy transition-colors hover:text-forest"
                  >
                    Scoate
                  </button>
                </div>
                <p className="mt-1 text-xs font-semibold text-forest/65">
                  Reducere: -{formatCartPrice(discountAmount)} lei
                </p>
              </div>
            ) : null}
          </div>

          <div>
            <p className="mb-3 text-base font-medium text-forest">
              Ai un card cadou?
            </p>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <input
                value={giftCardCode}
                onChange={(event) => setGiftCardCode(event.target.value)}
                placeholder="Număr card cadou"
                className="h-12 rounded-full border border-forest/20 bg-cream px-5 text-sm text-forest outline-none placeholder:text-forest/40 focus:border-burgundy"
              />
              <button
                type="button"
                className="h-12 rounded-sm bg-forest/10 px-5 text-xs font-bold uppercase tracking-wide text-forest transition-colors hover:bg-forest hover:text-cream"
              >
                Aplică
              </button>
            </div>
          </div>

          <Link
            href="/checkout"
            className="flex h-14 w-full items-center justify-center rounded-sm bg-burgundy px-6 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest"
          >
            Continuă cu finalizarea comenzii
          </Link>
        </div>
      </aside>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-forest/10 pb-5 last:border-b-0">
      <span className="text-xs font-bold uppercase tracking-wide text-forest">
        {label}
      </span>
      <span className={strong ? 'font-bold text-burgundy' : 'font-semibold text-forest'}>
        {value}
      </span>
    </div>
  )
}
