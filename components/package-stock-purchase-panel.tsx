'use client'

import { useEffect, useState } from 'react'
import type { AdoptPackage } from '@/lib/adopt-packages'
import { getPublicProduct } from '@/lib/public-products'
import { PackagePurchaseControls } from '@/components/package-purchase-controls'
import { TreePurposeField } from '@/components/tree-purpose-field'

type PackageStockPurchasePanelProps = {
  pkg: AdoptPackage
  formId: string
}

export function PackageStockPurchasePanel({ pkg, formId }: PackageStockPurchasePanelProps) {
  const [stockQuantity, setStockQuantity] = useState<number | null>(null)
  const [isCheckingStock, setIsCheckingStock] = useState(true)

  useEffect(() => {
    let isMounted = true

    getPublicProduct(pkg.slug)
      .then(({ product }) => {
        if (isMounted) {
          setStockQuantity(product.status === 'active' ? product.stockQuantity : 0)
        }
      })
      .catch(() => {
        if (isMounted) {
          setStockQuantity(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingStock(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [pkg.slug])

  const isOutOfStock = stockQuantity === 0

  return (
    <div className="mt-8 space-y-5">
      <div>
        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="text-2xl font-bold text-forest md:text-4xl">
            Preț: <span>{pkg.price}</span>
          </p>
          <p className={'font-serif text-lg font-bold italic md:text-xl ' + (isOutOfStock ? 'text-burgundy' : 'text-forest')}>
            {isCheckingStock ? 'Se verifică stocul' : isOutOfStock ? 'Produsul nu este pe stoc' : 'În stoc'}
          </p>
        </div>
        <p className="mt-2 text-xs text-forest/70 md:text-base">
          (TVA inclus, transport inclus).
        </p>
      </div>

      {isOutOfStock ? (
        <div className="rounded-2xl border border-burgundy/20 bg-burgundy/5 px-4 py-4 text-sm font-semibold leading-relaxed text-burgundy">
          Produsul nu este pe stoc momentan. Revino mai târziu sau alege un alt pachet disponibil.
        </div>
      ) : (
        <div>
          <h2 className="text-sm font-bold text-forest md:text-lg">
            Completează detaliile pentru certificatul de adopție:
          </h2>

          <form id={formId} className="mt-4 space-y-4">
            <div>
              <label htmlFor="certificate-name" className="text-xs font-semibold text-forest md:text-sm">
                Cum vrei să apară numele pe certificatul de adopție?
              </label>
              <input
                id="certificate-name"
                name="certificate-name"
                type="text"
                placeholder="Popescu Andrei"
                required
                className="mt-2 h-12 w-full rounded-xl border border-forest/20 bg-cream px-4 text-sm text-forest outline-none transition-colors focus:border-burgundy md:text-base"
              />
            </div>

            <div>
              <label htmlFor="tree-name" className="text-xs font-semibold text-forest md:text-sm">
                Cum se va numi pomul tău?
              </label>
              <input
                id="tree-name"
                name="tree-name"
                type="text"
                placeholder="Dobi"
                required
                className="mt-2 h-12 w-full rounded-xl border border-forest/20 bg-cream px-4 text-sm text-forest outline-none transition-colors focus:border-burgundy md:text-base"
              />
            </div>

            <TreePurposeField />

            <div>
              <label htmlFor="tree-message" className="text-xs font-semibold text-forest md:text-sm">
                Lasă un gând care să crească odată cu el (maxim 150 de caractere)
              </label>
              <textarea
                id="tree-message"
                name="tree-message"
                placeholder="Acest mesaj va fi asociat pomului adoptat și va spune povestea lui."
                rows={4}
                maxLength={150}
                required
                className="mt-2 w-full resize-none rounded-xl border border-forest/20 bg-cream px-4 py-3 text-sm leading-relaxed text-forest outline-none transition-colors focus:border-burgundy md:text-base"
              />
            </div>
          </form>
        </div>
      )}

      <PackagePurchaseControls pkg={pkg} formId={isOutOfStock ? undefined : formId} isOutOfStock={isOutOfStock} />
    </div>
  )
}
