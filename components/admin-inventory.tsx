'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Minus, Package, Plus, RefreshCcw, Save } from 'lucide-react'
import { ADMIN_DASHBOARD_PATH } from '@/lib/admin-path'
import { getAdminProducts, updateAdminProductStock, type AdminProduct } from '@/lib/admin-products'
import { useAuthSession } from '@/components/auth-session-provider'

function formatPrice(value: number) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    minimumFractionDigits: 2,
  }).format(value)
}

function ProductInventoryRow({
  product,
  draftStock,
  isSaving,
  onDraftChange,
  onSave,
}: {
  product: AdminProduct
  draftStock: number
  isSaving: boolean
  onDraftChange: (value: number) => void
  onSave: () => void
}) {
  const hasChanges = draftStock !== product.stockQuantity

  const updateDraft = (value: number) => {
    onDraftChange(Math.max(0, Math.floor(value) || 0))
  }

  return (
    <article className="grid gap-5 rounded-3xl border border-forest/10 bg-[#fbf7ee] p-4 shadow-sm md:grid-cols-[6rem_1fr_auto] md:items-center md:p-5">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brown">
            <Package size={28} />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-wide text-brown">{product.slug}</p>
          <span className={`rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide ${
            product.status === 'active' ? 'bg-forest/10 text-forest' : 'bg-burgundy/10 text-burgundy'
          }`}>
            {product.status === 'active' ? 'Activ' : product.status}
          </span>
        </div>
        <h2 className="mt-2 font-serif text-3xl font-bold leading-none text-forest md:text-4xl">
          {product.name}
        </h2>
        <p className="mt-2 text-sm font-semibold text-burgundy">{formatPrice(product.price)}</p>
        {product.description ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-forest/65">{product.description}</p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-forest/10 bg-cream p-3 md:min-w-64">
        <p className="text-xs font-bold uppercase tracking-wide text-brown">Cantitate în stoc</p>
        <div className="mt-3 grid grid-cols-[2.75rem_1fr_2.75rem] overflow-hidden rounded-full border border-forest/20 bg-[#fbf7ee]">
          <button
            type="button"
            onClick={() => updateDraft(draftStock - 1)}
            className="flex h-11 items-center justify-center text-forest transition-colors hover:bg-burgundy hover:text-cream"
            aria-label="Scade cantitatea"
          >
            <Minus size={15} />
          </button>
          <input
            type="number"
            min={0}
            value={draftStock}
            onChange={(event) => updateDraft(Number(event.target.value))}
            className="h-11 border-x border-forest/10 bg-transparent text-center text-sm font-bold text-forest outline-none"
          />
          <button
            type="button"
            onClick={() => updateDraft(draftStock + 1)}
            className="flex h-11 items-center justify-center text-forest transition-colors hover:bg-burgundy hover:text-cream"
            aria-label="Crește cantitatea"
          >
            <Plus size={15} />
          </button>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={!hasChanges || isSaving}
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-burgundy px-4 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isSaving ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
          {isSaving ? 'Se salvează' : 'Salvează'}
        </button>
      </div>
    </article>
  )
}

export function AdminInventory() {
  const { user, loading } = useAuthSession()
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [draftStocks, setDraftStocks] = useState<Record<number, number>>({})
  const [savingProductId, setSavingProductId] = useState<number | null>(null)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isAdmin = user?.role === 'admin'

  const sortedProducts = useMemo(
    () => [...products].sort((first, second) => first.id - second.id),
    [products]
  )

  const loadProducts = async () => {
    setIsLoadingProducts(true)
    setError('')
    setMessage('')

    try {
      const data = await getAdminProducts()
      setProducts(data.products)
      setDraftStocks(
        Object.fromEntries(data.products.map((product) => [product.id, product.stockQuantity]))
      )
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Produsele nu au putut fi încărcate.')
    } finally {
      setIsLoadingProducts(false)
    }
  }

  useEffect(() => {
    if (!loading && isAdmin) {
      void loadProducts()
    }
  }, [loading, isAdmin])

  const saveStock = async (productId: number) => {
    setSavingProductId(productId)
    setError('')
    setMessage('')

    try {
      const nextStock = draftStocks[productId] ?? 0
      const data = await updateAdminProductStock(productId, nextStock)
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === productId ? data.product : product
        )
      )
      setDraftStocks((currentDrafts) => ({
        ...currentDrafts,
        [productId]: data.product.stockQuantity,
      }))
      setMessage('Stocul a fost actualizat.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Stocul nu a putut fi actualizat.')
    } finally {
      setSavingProductId(null)
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
    return (
      <section className="mx-auto flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-32 text-center md:px-6">
        <h1 className="font-serif text-5xl font-bold leading-none tracking-tight text-burgundy md:text-7xl">
          403 Forbidden
        </h1>
      </section>
    )
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
            Inventar <span className="text-burgundy">produse</span>
          </h1>
        </div>

        <button
          type="button"
          onClick={() => void loadProducts()}
          disabled={isLoadingProducts}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-forest/20 px-5 text-xs font-bold uppercase tracking-wide text-forest transition-colors hover:border-burgundy hover:text-burgundy disabled:opacity-50"
        >
          <RefreshCcw size={14} className={isLoadingProducts ? 'animate-spin' : ''} />
          Reîncarcă
        </button>
      </div>

      {message ? (
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-forest/10 bg-forest/5 px-4 py-3 text-sm font-semibold text-forest">
          <CheckCircle2 size={18} />
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-2xl border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-sm font-semibold text-burgundy">
          {error}
        </div>
      ) : null}

      <div className="mt-10 space-y-5">
        {isLoadingProducts && sortedProducts.length === 0 ? (
          <p className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-6 text-center text-sm font-semibold text-forest/70">
            Se încarcă produsele...
          </p>
        ) : null}

        {!isLoadingProducts && sortedProducts.length === 0 && !error ? (
          <p className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-6 text-center text-sm font-semibold text-forest/70">
            Nu există produse în baza de date.
          </p>
        ) : null}

        {sortedProducts.map((product) => (
          <ProductInventoryRow
            key={product.id}
            product={product}
            draftStock={draftStocks[product.id] ?? product.stockQuantity}
            isSaving={savingProductId === product.id}
            onDraftChange={(value) =>
              setDraftStocks((currentDrafts) => ({
                ...currentDrafts,
                [product.id]: value,
              }))
            }
            onSave={() => void saveStock(product.id)}
          />
        ))}
      </div>
    </section>
  )
}
