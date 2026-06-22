'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import type { AdoptPackage } from '@/lib/adopt-packages'
import { addPackageToCart, type AdoptionDetails } from '@/lib/cart'

type PackagePurchaseControlsProps = {
  pkg: AdoptPackage
  formId?: string
  isOutOfStock?: boolean
}

export function PackagePurchaseControls({ pkg, formId, isOutOfStock = false }: PackagePurchaseControlsProps) {
  const [quantity, setQuantity] = useState(1)
  const [wasAdded, setWasAdded] = useState(false)

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))
  }

  const increaseQuantity = () => {
    setQuantity((currentQuantity) => currentQuantity + 1)
  }

  const getAdoptionDetails = (): AdoptionDetails | null | undefined => {
    if (!formId) {
      return undefined
    }

    const form = document.getElementById(formId) as HTMLFormElement | null

    if (!form) {
      return undefined
    }

    if (!form.checkValidity()) {
      form.reportValidity()
      return null
    }

    const formData = new FormData(form)
    const treePurpose = String(formData.get('tree-purpose') ?? '')

    return {
      certificateName: String(formData.get('certificate-name') ?? '').trim(),
      treeName: String(formData.get('tree-name') ?? '').trim(),
      treePurpose,
      treePurposeOther: String(formData.get('tree-purpose-other') ?? '').trim() || undefined,
      treeMessage: String(formData.get('tree-message') ?? '').trim(),
    }
  }

  const handleAddToCart = () => {
    if (isOutOfStock) {
      return
    }

    const adoptionDetails = getAdoptionDetails()

    if (adoptionDetails === null) {
      return
    }

    addPackageToCart(pkg, quantity, adoptionDetails)
    setWasAdded(true)
    window.setTimeout(() => setWasAdded(false), 1800)
  }

  return (
    <div className={isOutOfStock ? 'grid gap-4 pt-2' : 'grid gap-4 pt-2 sm:grid-cols-[8rem_1fr]'}>
      {!isOutOfStock ? (
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
      ) : null}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className="h-14 rounded-xl bg-burgundy px-6 text-sm font-bold text-cream transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:bg-forest/35 disabled:text-cream/80 md:text-base"
      >
        {isOutOfStock ? 'Produsul nu este pe stoc' : wasAdded ? 'Adăugat în coș' : 'Adaugă în coș'}
      </button>
    </div>
  )
}