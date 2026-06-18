'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import type { AdoptPackage } from '@/lib/adopt-packages'
import { addPackageToCart } from '@/lib/cart'

export function PackagePurchaseControls({ pkg }: { pkg: AdoptPackage }) {
  const [quantity, setQuantity] = useState(1)
  const [wasAdded, setWasAdded] = useState(false)

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))
  }

  const increaseQuantity = () => {
    setQuantity((currentQuantity) => currentQuantity + 1)
  }

  const handleAddToCart = () => {
    addPackageToCart(pkg, quantity)
    setWasAdded(true)
    window.setTimeout(() => setWasAdded(false), 1800)
  }

  return (
    <div className="grid gap-4 pt-2 sm:grid-cols-[8rem_1fr]">
      <div className="grid h-14 grid-cols-3 overflow-hidden rounded-xl border border-brown/45 bg-cream text-forest">
        <button
          type="button"
          onClick={decreaseQuantity}
          className="flex items-center justify-center transition-colors hover:bg-burgundy hover:text-cream"
          aria-label="Scade cantitatea"
        >
          <Minus size={16} />
        </button>
        <span className="flex items-center justify-center text-sm font-bold">
          {quantity}
        </span>
        <button
          type="button"
          onClick={increaseQuantity}
          className="flex items-center justify-center transition-colors hover:bg-burgundy hover:text-cream"
          aria-label="Crește cantitatea"
        >
          <Plus size={16} />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="h-14 rounded-xl bg-burgundy px-6 text-sm font-bold text-cream transition-colors hover:bg-forest md:text-base"
      >
        {wasAdded ? 'Adăugat în coș' : 'Adaugă în coș'}
      </button>
    </div>
  )
}
