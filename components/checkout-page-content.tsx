'use client'

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  X,
} from 'lucide-react'
import {
  CART_UPDATED_EVENT,
  formatCartPrice,
  getCartSubtotal,
  readCart,
  writeCart,
  type CartItem,
} from '@/lib/cart'
import { AuthPanel } from '@/components/auth-panel'
import { useAuthSession } from '@/components/auth-session-provider'
import { createOrder, type OrderAddress } from '@/lib/orders'
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


function getFormValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? '').trim()
}

function getAddressFromForm(formData: FormData, prefix: string): OrderAddress {
  return {
    firstName: getFormValue(formData, `${prefix}_firstName`),
    lastName: getFormValue(formData, `${prefix}_lastName`),
    company: getFormValue(formData, `${prefix}_company`),
    country: getFormValue(formData, `${prefix}_country`) || 'România',
    phone: getFormValue(formData, `${prefix}_phone`),
    streetAddress: getFormValue(formData, `${prefix}_streetAddress`),
    addressExtra: getFormValue(formData, `${prefix}_addressExtra`),
    county: getFormValue(formData, `${prefix}_county`),
    city: getFormValue(formData, `${prefix}_city`),
    postalCode: getFormValue(formData, `${prefix}_postalCode`),
  }
}

export function CheckoutPageContent() {
  const router = useRouter()
  const { user } = useAuthSession()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false)
  const [email, setEmail] = useState('')
  const [useAccountEmail, setUseAccountEmail] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

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

  useEffect(() => {
    if (useAccountEmail && user?.email) {
      setEmail(user.email)
    }
  }, [useAccountEmail, user?.email])

  const subtotal = useMemo(() => getCartSubtotal(cartItems), [cartItems])
  const discountPercent = getPromoDiscountPercent(appliedCoupon)
  const discountAmount = getPromoDiscountAmount(subtotal, appliedCoupon)
  const total = subtotal - discountAmount

  const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setOrderError('')

    const availableCartItems = await reconcileCartWithInventory(cartItems)

    if (availableCartItems.length === 0) {
      setOrderError('Coșul este gol sau produsele nu mai sunt în stoc.')
      setCartItems(availableCartItems)
      return
    }

    if (availableCartItems.length !== cartItems.length) {
      setOrderError('Unele produse nu mai sunt în stoc și au fost eliminate din coș.')
      setCartItems(availableCartItems)
      return
    }

    if (!acceptTerms) {
      setOrderError('Trebuie să accepți termenii și condițiile.')
      return
    }

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setIsPlacingOrder(true)

    try {
      const formData = new FormData(form)
      const billingAddress = getAddressFromForm(formData, 'billing')
      const shippingAddress = shipToDifferentAddress
        ? getAddressFromForm(formData, 'shipping')
        : billingAddress
      const { order } = await createOrder({
        customerEmail: email,
        paymentMethod,
        items: availableCartItems,
        billingAddress,
        shippingAddress,
        customerNote: getFormValue(formData, 'customerNote'),
        discountCode: appliedCoupon || undefined,
        discountPercent,
        termsAccepted: acceptTerms,
      })

      writeCart([])
      router.push(`/comanda-primita?order=${encodeURIComponent(order.orderNumber)}`)
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Comanda nu a putut fi plasată.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const applyCoupon = () => {
    const normalizedCode = normalizePromoCode(couponCode)

    if (!normalizedCode) {
      setCouponMessage('Introdu un cod promoțional.')
      return
    }

    const appliedCode = writeAppliedPromoCode(normalizedCode)

    if (!appliedCode) {
      setCouponMessage('Codul introdus nu este valid.')
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
    <>
      <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-10">
        <div className="space-y-8">
          <section className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-sm md:p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brown">
                  Informații
                </p>
                <h2 className="mt-2 font-serif text-4xl font-bold leading-none text-forest">
                  Datele tale
                </h2>
              </div>

              <Link
                href="/cos"
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-burgundy transition-colors hover:text-forest"
              >
                <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
                Revino la coșul de cumpărături
              </Link>
            </div>

            <div className="mt-6 space-y-5">
              <Field
                icon={<Mail size={16} />}
                label="Adresă email"
                required
                type="email"
                value={email}
                onChange={setEmail}
                disabled={useAccountEmail}
                placeholder="nume@exemplu.ro"
              />

              {user && (
                <label className="flex items-start gap-3 rounded-2xl border border-forest/10 bg-cream px-4 py-4 text-sm font-semibold text-forest">
                  <input
                    type="checkbox"
                    checked={useAccountEmail}
                    onChange={(event) => {
                      const isChecked = event.target.checked
                      setUseAccountEmail(isChecked)
                      setEmail(isChecked ? user.email : '')
                    }}
                    className="mt-1 size-4 rounded border-forest/30 text-burgundy focus:ring-burgundy"
                  />
                  Folosește adresa de email asociată cu contul meu.
                </label>
              )}

              {!user && (
                <p className="text-sm text-forest/65">
                  Ai deja cont?{' '}
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="font-semibold text-burgundy underline-offset-4 hover:underline"
                  >
                    Autentifică-te aici.
                  </button>
                </p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-sm md:p-7">
            <p className="text-xs font-bold uppercase tracking-wide text-brown">
              Detalii pentru facturare
            </p>
            <h2 className="mt-2 font-serif text-4xl font-bold leading-none text-forest">
              Informații de facturare
            </h2>

            <div className="mt-6 space-y-6">
              <CheckoutAddressFields prefix="billing" />
            </div>
          </section>

          <section className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-sm md:p-7">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-burgundy" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brown">
                  Adresă de livrare
                </p>
                <h2 className="mt-1 font-serif text-3xl font-bold leading-none text-forest">
                  Unde trimitem comanda
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <label className="flex items-center gap-3 text-sm font-semibold text-forest">
                <input
                  type="checkbox"
                  checked={shipToDifferentAddress}
                  onChange={(event) => setShipToDifferentAddress(event.target.checked)}
                  className="size-4 rounded border-forest/30 text-burgundy focus:ring-burgundy"
                />
                Livrezi la o altă adresă?
              </label>
              <p className="max-w-2xl text-sm leading-relaxed text-forest/65">
                Dacă adresa de livrare diferă de cea de facturare, o poți completa
                mai jos.
              </p>

              {shipToDifferentAddress && (
                <div className="rounded-2xl border border-forest/10 bg-cream/70 p-4 md:p-5">
                  <CheckoutAddressFields prefix="shipping" />
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-sm md:p-7">
            <p className="text-xs font-bold uppercase tracking-wide text-brown">
              Notă comandă (opțional)
            </p>
            <textarea
              name="customerNote"
              rows={4}
              placeholder="Note referitoare la comandă, de exemplu: anunță-mă înainte de livrare."
              className="mt-3 w-full resize-none rounded-3xl border border-forest/20 bg-cream px-4 py-3 text-sm leading-relaxed text-forest outline-none transition-colors placeholder:text-forest/40 focus:border-burgundy"
            />
          </section>
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-sm md:p-7">
            <div className="flex items-center justify-between gap-4 border-b border-forest/10 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brown">
                  Comanda ta
                </p>
                <h2 className="mt-2 font-serif text-4xl font-bold leading-none text-forest">
                  Total <span className="text-burgundy">coș</span>
                </h2>
              </div>
              <span className="rounded-full bg-burgundy/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-burgundy">
                {cartItems.length} produse
              </span>
            </div>

            <div className="py-5">
              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <p className="text-sm leading-relaxed text-forest/65">
                    Coșul este gol. Adaugă produse înainte de a finaliza comanda.
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.slug}
                      className="grid grid-cols-[4rem_1fr_auto] gap-4 rounded-2xl border border-forest/10 bg-cream p-3"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#fbf7ee]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-serif text-2xl font-bold leading-none text-forest">
                          {item.name}
                        </h3>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-brown">
                          Cantitate: {item.quantity}
                        </p>
                      </div>

                      <p className="self-start font-bold text-burgundy">
                        {item.price}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 space-y-4 border-t border-forest/10 pt-5">
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
                    className="h-12 rounded-sm bg-burgundy px-5 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest"
                  >
                    Aplică
                  </button>
                </div>
                {couponMessage && (
                  <p className="text-xs font-semibold text-burgundy">
                    {couponMessage}
                  </p>
                )}

                {appliedCoupon && discountPercent > 0 ? (
                  <div className="rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm text-forest">
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

                <div className="space-y-4 pt-2">
                  <SummaryRow
                    label="Sub-total"
                    value={`${formatCartPrice(subtotal)} lei`}
                  />
                  <SummaryRow label="Livrare" value="Livrare la domiciliu" />
                  {discountPercent > 0 && (
                    <SummaryRow
                      label={`Reducere ${appliedCoupon}`}
                      value={`-${formatCartPrice(discountAmount)} lei`}
                    />
                  )}
                  <SummaryRow
                    label="Total"
                    value={`${formatCartPrice(total)} lei`}
                    strong
                  />
                </div>

                <div className="border-t border-forest/10 pt-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-brown">
                    Metodă de plată
                  </p>
                  <h3 className="mt-2 flex items-center gap-3 font-serif text-3xl font-bold leading-none text-forest">
                    <CreditCard size={18} className="text-burgundy" />
                    Cum plătești
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-forest/65">
                    Toate tranzacțiile sunt sigure și criptate.
                  </p>

                  <div className="mt-5 space-y-3">
                    <RadioCard
                      name="payment-method"
                      label="Numerar la livrare"
                      description="Plătești când ajunge coletul."
                      defaultChecked
                      active={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                    />
                    <RadioCard
                      name="payment-method"
                      label="Plata online"
                      description="Powered by Stripe"
                      active={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-forest/70">
                    Datele personale vor fi folosite pentru a procesa comanda, pentru a-ți susține experiența pe acest site web și pentru alte scopuri descrise în{' '}
                    <Link
                      href="/politica-de-confidentialitate"
                      className="font-semibold text-burgundy underline-offset-4 hover:underline"
                    >
                      politica de confidențialitate
                    </Link>
                    .
                  </p>

                  <label className="mt-5 flex items-start gap-3 text-sm font-semibold text-forest">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(event) => setAcceptTerms(event.target.checked)}
                      className="mt-1 size-4 rounded border-forest/30 text-burgundy focus:ring-burgundy"
                    />
                    <span>
                      Am citit și sunt de acord cu{' '}
                      <Link
                        href="/termeni-si-conditii"
                        className="text-burgundy underline-offset-4 hover:underline"
                      >
                        termenii și condițiile site-ului web
                      </Link>
                      <span className="text-burgundy"> *</span>
                    </span>
                  </label>

                  {orderError ? (
                    <p className="mt-4 rounded-2xl border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-sm font-semibold text-burgundy">
                      {orderError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={!acceptTerms || cartItems.length === 0 || isPlacingOrder}
                    className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-sm bg-forest px-6 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-burgundy disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Lock size={15} />
                    {isPlacingOrder ? 'Se plasează comanda...' : 'Plasează comanda'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </form>

      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-forest/35 backdrop-blur-[2px]"
            aria-label="Închide autentificarea"
            onClick={() => setIsAuthModalOpen(false)}
          />
          <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-[39rem] overflow-y-auto rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="flex size-10 items-center justify-center rounded-full border border-forest/15 text-forest transition-colors hover:border-burgundy hover:text-burgundy"
                aria-label="Închide fereastra de autentificare"
              >
                <X size={20} />
              </button>
            </div>
            <AuthPanel
              defaultMode="login"
              compact
              redirectOnSuccess={false}
              onSuccess={() => window.setTimeout(() => setIsAuthModalOpen(false), 700)}
            />
          </div>
        </div>
      )}
    </>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  type = 'text',
  icon,
  inputMode,
  pattern,
  title,
  maxLength,
}: {
  label: string
  name?: string
  value?: string
  onChange?: (value: string) => void
  placeholder: string
  required?: boolean
  disabled?: boolean
  type?: string
  icon?: ReactNode
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  pattern?: string
  title?: string
  maxLength?: number
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brown">
        {icon}
        {label}
        {required ? <span className="text-burgundy">*</span> : null}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        inputMode={inputMode}
        pattern={pattern}
        title={title}
        maxLength={maxLength}
        onInput={(event) => {
          const input = event.currentTarget

          if (name?.toLowerCase().includes('postalcode')) {
            input.value = input.value.replace(/\D/g, '').slice(0, maxLength || 10)
            return
          }

          if (type === 'tel') {
            const hasLeadingPlus = input.value.trimStart().startsWith('+')
            const cleanedValue = input.value.replace(/[^0-9+\s().-]/g, '').replace(/(?!^)\+/g, '')
            input.value = hasLeadingPlus ? '+' + cleanedValue.replace(/\+/g, '') : cleanedValue.replace(/\+/g, '')
          }
        }}
        className="h-12 w-full rounded-full border border-forest/20 bg-cream px-4 text-sm text-forest outline-none placeholder:text-forest/40 focus:border-burgundy disabled:cursor-not-allowed disabled:bg-forest/5 disabled:text-forest/65"
      />
    </label>
  )
}

function CheckoutAddressFields({ prefix }: { prefix: string }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name={`${prefix}_firstName`} label="Prenume" required placeholder="Prenumele tău" />
        <Field name={`${prefix}_lastName`} label="Nume" required placeholder="Numele tău" />
      </div>

      <Field name={`${prefix}_company`} label="Nume companie" placeholder="Opțional" />

      <div className="grid gap-4 sm:grid-cols-[1.25fr_1fr]">
        <Field name={`${prefix}_country`} label="Țară / Regiune" required placeholder="România" />
        <Field
          name={`${prefix}_phone`}
          label="Telefon"
          required
          type="tel"
          inputMode="tel"
          pattern="^\\+?[0-9\\s().-]{7,20}$"
          title="Introdu un număr de telefon valid, format din cifre. Poți folosi +40, spații, puncte sau paranteze."
          placeholder="+40 712 345 678"
        />
      </div>

      <Field
        name={`${prefix}_streetAddress`}
        label="Stradă"
        required
        placeholder="Adresă, nume stradă, număr etc."
      />
      <Field
        name={`${prefix}_addressExtra`}
        label="Apartament, complex, unitate etc."
        placeholder="Opțional"
      />

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_0.85fr]">
        <Field name={`${prefix}_county`} label="Județ" required placeholder="Județul tău" />
        <Field name={`${prefix}_city`} label="Municipiu / Localitate" required placeholder="Oraș / comună" />
        <Field
          name={`${prefix}_postalCode`}
          label="Cod poștal"
          required
          type="text"
          inputMode="numeric"
          pattern="[0-9]{4,10}"
          maxLength={10}
          title="Codul poștal trebuie să conțină doar cifre."
          placeholder="000000"
        />
      </div>
    </div>
  )
}

function RadioCard({
  name,
  label,
  description,
  defaultChecked,
  active,
  onChange,
}: {
  name: string
  label: string
  description: string
  defaultChecked?: boolean
  active?: boolean
  onChange?: () => void
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
        active ? 'border-burgundy bg-burgundy/5' : 'border-forest/10 bg-cream'
      }`}
    >
      <input
        type="radio"
        name={name}
        defaultChecked={defaultChecked}
        onChange={onChange}
        className="mt-1 size-4 text-burgundy focus:ring-burgundy"
      />
      <span className="block">
        <span className="block font-semibold text-forest">{label}</span>
        <span className="mt-1 block text-sm text-forest/65">{description}</span>
      </span>
    </label>
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
    <div className="flex items-center justify-between gap-4 border-b border-forest/10 pb-4 last:border-b-0">
      <span className="text-xs font-bold uppercase tracking-wide text-forest">
        {label}
      </span>
      <span className={strong ? 'font-bold text-burgundy' : 'font-semibold text-forest'}>
        {value}
      </span>
    </div>
  )
}
