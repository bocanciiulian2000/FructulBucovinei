export const PROMO_STORAGE_KEY = 'fructul-bucovinei-promo-code'
export const PROMO_UPDATED_EVENT = 'fructul-bucovinei-promo-updated'

export const promoCodes: Record<string, number> = {}

export function normalizePromoCode(code: string) {
  return String(code || '').trim().toUpperCase()
}

export function getPromoDiscountPercent(code: string) {
  return promoCodes[normalizePromoCode(code)] || 0
}

export function getPromoDiscountAmount(subtotal: number, code: string) {
  return subtotal * (getPromoDiscountPercent(code) / 100)
}

export function readAppliedPromoCode() {
  if (typeof window === 'undefined') {
    return ''
  }

  const code = normalizePromoCode(window.localStorage.getItem(PROMO_STORAGE_KEY) || '')

  if (!code || !promoCodes[code]) {
    window.localStorage.removeItem(PROMO_STORAGE_KEY)
    return ''
  }

  return code
}

export function writeAppliedPromoCode(code: string) {
  if (typeof window === 'undefined') {
    return ''
  }

  const normalizedCode = normalizePromoCode(code)

  if (!normalizedCode || !promoCodes[normalizedCode]) {
    return ''
  }

  window.localStorage.setItem(PROMO_STORAGE_KEY, normalizedCode)
  window.dispatchEvent(new CustomEvent(PROMO_UPDATED_EVENT, { detail: normalizedCode }))
  return normalizedCode
}

export function clearAppliedPromoCode() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(PROMO_STORAGE_KEY)
  window.dispatchEvent(new CustomEvent(PROMO_UPDATED_EVENT, { detail: '' }))
}
