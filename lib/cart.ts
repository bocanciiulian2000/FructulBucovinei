import type { AdoptPackage } from '@/lib/adopt-packages'

export const CART_STORAGE_KEY = 'fructul-bucovinei-cart'
export const CART_UPDATED_EVENT = 'fructul-bucovinei-cart-updated'

export type CartItem = {
  id: number
  slug: string
  name: string
  price: string
  image: string
  quantity: number
}

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)
    return storedCart ? JSON.parse(storedCart) : []
  } catch {
    return []
  }
}

export function writeCart(cart: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: cart }))
}

export function addPackageToCart(pkg: AdoptPackage) {
  const cart = readCart()
  const existingItem = cart.find((item) => item.slug === pkg.slug)

  const nextCart = existingItem
    ? cart.map((item) =>
        item.slug === pkg.slug
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    : [
        ...cart,
        {
          id: pkg.id,
          slug: pkg.slug,
          name: pkg.name,
          price: pkg.price,
          image: pkg.image,
          quantity: 1,
        },
      ]

  writeCart(nextCart)
  return nextCart
}

export function getCartQuantity(cart: CartItem[]) {
  return cart.reduce((total, item) => total + item.quantity, 0)
}

export function parseCartPrice(price: string) {
  const normalizedPrice = price
    .replace(/[^\d,.-]/g, '')
    .replace('.', '')
    .replace(',', '.')

  return Number.parseFloat(normalizedPrice) || 0
}

export function formatCartPrice(value: number) {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function getCartSubtotal(cart: CartItem[]) {
  return cart.reduce(
    (total, item) => total + parseCartPrice(item.price) * item.quantity,
    0
  )
}
