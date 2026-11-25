'use client'

import { useRef, useState } from 'react'
import type { AdoptPackage } from '@/lib/adopt-packages'
import { addPackageToCart, emitCartItemAdded } from '@/lib/cart'
import { ONLINE_ORDERS_ENABLED } from '@/lib/store-config'

export function AddToCartButton({
  pkg,
  className,
}: {
  pkg: AdoptPackage
  className: string
}) {
  const [wasAdded, setWasAdded] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleAddToCart = () => {
    if (!ONLINE_ORDERS_ENABLED) {
      return
    }

    addPackageToCart(pkg)
    emitCartItemAdded(pkg, buttonRef.current)
    setWasAdded(true)
    window.setTimeout(() => setWasAdded(false), 1800)
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleAddToCart}
      disabled={!ONLINE_ORDERS_ENABLED}
      aria-disabled={!ONLINE_ORDERS_ENABLED}
      className={`${className} ${!ONLINE_ORDERS_ENABLED ? 'cursor-not-allowed opacity-70' : ''}`}
    >
      {!ONLINE_ORDERS_ENABLED ? 'În curând' : wasAdded ? 'Adăugat în coș' : 'Adaugă în coș'}
    </button>
  )
}
