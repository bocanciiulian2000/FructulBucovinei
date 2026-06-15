'use client'

import { useState } from 'react'
import type { AdoptPackage } from '@/lib/adopt-packages'
import { addPackageToCart } from '@/lib/cart'

export function AddToCartButton({
  pkg,
  className,
}: {
  pkg: AdoptPackage
  className: string
}) {
  const [wasAdded, setWasAdded] = useState(false)

  const handleAddToCart = () => {
    addPackageToCart(pkg)
    setWasAdded(true)
    window.setTimeout(() => setWasAdded(false), 1800)
  }

  return (
    <button type="button" onClick={handleAddToCart} className={className}>
      {wasAdded ? 'Adăugat în coș' : 'Adaugă în coș'}
    </button>
  )
}
