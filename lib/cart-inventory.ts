import { getCartBaseSlug, readCart, writeCart, type CartItem } from '@/lib/cart'
import { getPublicProductsBySlugs } from '@/lib/public-products'

export async function reconcileCartWithInventory(cart: CartItem[] = readCart()) {
  const baseSlugs = cart.map((item) => getCartBaseSlug(item.slug))

  if (baseSlugs.length === 0) {
    return cart
  }

  try {
    const { products } = await getPublicProductsBySlugs(baseSlugs)
    const productMap = new Map(products.map((product) => [product.slug, product]))
    const nextCart = cart
      .filter((item) => {
        const product = productMap.get(getCartBaseSlug(item.slug))
        return Boolean(product && product.status === 'active' && product.stockQuantity > 0)
      })
      .map((item) => {
        const product = productMap.get(getCartBaseSlug(item.slug))

        if (!product) {
          return item
        }

        return {
          ...item,
          quantity: Math.min(item.quantity, product.stockQuantity),
        }
      })

    if (nextCart.length !== cart.length || nextCart.some((item, index) => item.quantity !== cart[index]?.quantity)) {
      writeCart(nextCart)
    }

    return nextCart
  } catch {
    return cart
  }
}
