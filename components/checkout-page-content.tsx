'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronDown,
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
  type CartItem,
} from '@/lib/cart'
import { AuthPanel } from '@/components/auth-panel'

const promoCodes: Record<string, number> = {
  BUCOVINA10: 10,
  FRUCTUL10: 10,
  LIVADA15: 15,
}

export function CheckoutPageContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false)

  useEffect(() => {
    const syncCart = () => setCartItems(readCart())

    syncCart()
    window.addEventListener(CART_UPDATED_EVENT, syncCart)
    window.addEventListener('storage', syncCart)

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart)
      window.removeEventListener('storage', syncCart)
    }
  }, [])

  const subtotal = useMemo(() => getCartSubtotal(cartItems), [cartItems])
  const discountPercent = appliedCoupon ? promoCodes[appliedCoupon] : 0
  const total = subtotal * (1 - discountPercent / 100)

  const applyCoupon = () => {
    const normalizedCode = couponCode.trim().toUpperCase()

    if (!normalizedCode) {
      setAppliedCoupon('')
      setCouponMessage('Introdu un cod promoțional.')
      return
    }

    if (!promoCodes[normalizedCode]) {
      setAppliedCoupon('')
      setCouponMessage('Codul introdus nu este valid.')
      return
    }

    setAppliedCoupon(normalizedCode)
    setCouponCode(normalizedCode)
    setCouponMessage(`Reducere de ${promoCodes[normalizedCode]}% aplicată.`)
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-10">
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
              placeholder="nume@exemplu.ro"
            />

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
            <CheckoutAddressFields />
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
                <CheckoutAddressFields />
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-sm md:p-7">
          <p className="text-xs font-bold uppercase tracking-wide text-brown">
            Notă comandă (opțional)
          </p>
          <textarea
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

          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto py-5">
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

              <div className="space-y-4 pt-2">
                <SummaryRow
                  label="Sub-total"
                  value={`${formatCartPrice(subtotal)} lei`}
                />
                <SummaryRow label="Livrare" value="Livrare la domiciliu" />
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
                    label="Netopia Payments"
                    description="Plată online cu cardul"
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
                  Am citit și sunt de acord cu termenii și condițiile site-ului web
                  <span className="text-burgundy"> *</span>
                </label>

                <button
                  type="button"
                  disabled={!acceptTerms}
                  className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-sm bg-forest px-6 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-burgundy disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Lock size={15} />
                  Plasează comanda
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
      </div>
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
  placeholder,
  required,
  type = 'text',
  icon,
}: {
  label: string
  placeholder: string
  required?: boolean
  type?: string
  icon?: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brown">
        {icon}
        {label}
        {required ? <span className="text-burgundy">*</span> : null}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-full border border-forest/20 bg-cream px-4 text-sm text-forest outline-none placeholder:text-forest/40 focus:border-burgundy"
      />
    </label>
  )
}

function CheckoutAddressFields() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prenume" required placeholder="Prenumele tău" />
        <Field label="Nume" required placeholder="Numele tău" />
      </div>

      <Field label="Nume companie" placeholder="Opțional" />

      <div className="grid gap-4 sm:grid-cols-[1.25fr_1fr]">
        <SelectField label="Țară / Regiune" required defaultValue="România">
          <option>România</option>
          <option>Republica Moldova</option>
        </SelectField>
        <Field label="Telefon" required type="tel" placeholder="+40 712 345 678" />
      </div>

      <Field
        label="Stradă"
        required
        placeholder="Adresă, nume stradă, număr etc."
      />
      <Field
        label="Apartament, complex, unitate etc."
        placeholder="Opțional"
      />

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_0.85fr]">
        <Field label="Județ" required placeholder="Județul tău" />
        <Field label="Municipiu / Localitate" required placeholder="Oraș / comună" />
        <Field label="Cod poștal" required placeholder="000000" />
      </div>
    </div>
  )
}

function SelectField({
  label,
  required,
  defaultValue,
  children,
}: {
  label: string
  required?: boolean
  defaultValue: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brown">
        {label}
        {required ? <span className="text-burgundy">*</span> : null}
      </span>
      <div className="relative">
        <select
          defaultValue={defaultValue}
          required={required}
          className="h-12 w-full appearance-none rounded-sm border border-forest/20 bg-cream px-4 text-sm text-forest outline-none focus:border-burgundy"
        >
          {children}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-forest/45"
        />
      </div>
    </label>
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
