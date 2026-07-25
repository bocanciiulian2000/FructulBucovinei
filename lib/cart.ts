import type { AdoptPackage } from '@/lib/adopt-packages'

export const CART_STORAGE_KEY = 'fructul-bucovinei-cart'
export const CART_UPDATED_EVENT = 'fructul-bucovinei-cart-updated'
export const CART_ITEM_ADDED_EVENT = 'fructul-bucovinei-cart-item-added'

export type AdoptionDetails = {
  certificateName: string
  treeName: string
  treePurpose: string
  treePurposeOther?: string
  treeMessage: string
}

export type CartItem = {
  id: number
  slug: string
  name: string
  price: string
  image: string
  quantity: number
  adoptionDetails?: AdoptionDetails
}

export type CartAddAnimationPayload = {
  id: string
  image: string
  name: string
  quantity: number
  sourceRect: {
    left: number
    top: number
    width: number
    height: number
  }
}

export function emitCartItemAdded(pkg: AdoptPackage, sourceElement: HTMLElement | null, quantity = 1) {
  if (typeof window === 'undefined' || !sourceElement) {
    return
  }

  const rect = sourceElement.getBoundingClientRect()
  const payload: CartAddAnimationPayload = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    image: pkg.image,
    name: pkg.name,
    quantity,
    sourceRect: {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    },
  }

  window.dispatchEvent(new CustomEvent<CartAddAnimationPayload>(CART_ITEM_ADDED_EVENT, {
    detail: payload,
  }))
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
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: cart }))
}

export function addPackageToCart(
  pkg: AdoptPackage,
  quantity = 1,
  adoptionDetails?: AdoptionDetails
) {
  const cart = readCart()
  const normalizedQuantity = Math.max(1, Math.floor(quantity) || 1)
  const itemSlug = adoptionDetails ? `${pkg.slug}-${Date.now()}` : pkg.slug
  const existingItem = adoptionDetails
    ? undefined
    : cart.find((item) => item.slug === pkg.slug)

  const nextCart = existingItem
    ? cart.map((item) =>
        item.slug === pkg.slug
          ? { ...item, quantity: item.quantity + normalizedQuantity }
          : item
      )
    : [
        ...cart,
        {
          id: pkg.id,
          slug: itemSlug,
          name: pkg.name,
          price: pkg.price,
          image: pkg.image,
          quantity: normalizedQuantity,
          adoptionDetails,
        },
      ]

  writeCart(nextCart)
  return nextCart
}

export function setCartItemQuantity(slug: string, quantity: number) {
  const cart = readCart()
  const normalizedQuantity = Math.max(1, Math.floor(quantity) || 1)
  const nextCart = cart.map((item) =>
    item.slug === slug
      ? { ...item, quantity: normalizedQuantity }
      : item
  )

  writeCart(nextCart)
  return nextCart
}

export function removeCartItem(slug: string) {
  const nextCart = readCart().filter((item) => item.slug !== slug)

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


export function getCartBaseSlug(slug: string) {
  return String(slug || '').replace(/-\d{8,}$/, '')
}
