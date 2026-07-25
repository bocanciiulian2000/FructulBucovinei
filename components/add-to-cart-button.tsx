'use client'

import { useRef, useState } from 'react'
import type { AdoptPackage } from '@/lib/adopt-packages'
import { addPackageToCart, emitCartItemAdded } from '@/lib/cart'

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
    addPackageToCart(pkg)
    emitCartItemAdded(pkg, buttonRef.current)
    setWasAdded(true)
    window.setTimeout(() => setWasAdded(false), 1800)
  }

  return (
    <button ref={buttonRef} type="button" onClick={handleAddToCart} className={className}>
      {wasAdded ? 'Adăugat în coș' : 'Adaugă în coș'}
    </button>
  )
}
