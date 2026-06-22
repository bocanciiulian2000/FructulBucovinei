import { apiUrl } from '@/lib/api-url'
import type { AdminProduct } from '@/lib/admin-products'

async function parseApiResponse<T>(response: Response) {
  const data = (await response.json()) as T & { error?: string }

  if (!response.ok) {
    throw new Error(data.error || 'A apărut o eroare.')
  }

  return data
}

export async function getPublicProduct(slug: string) {
  const response = await fetch(apiUrl('/api/products/' + encodeURIComponent(slug)), {
    credentials: 'include',
  })

  return parseApiResponse<{ product: AdminProduct }>(response)
}

export async function getPublicProductsBySlugs(slugs: string[]) {
  const uniqueSlugs = [...new Set(slugs.filter(Boolean))]

  if (uniqueSlugs.length === 0) {
    return { products: [] as AdminProduct[] }
  }

  const response = await fetch(apiUrl('/api/products?slugs=' + encodeURIComponent(uniqueSlugs.join(','))), {
    credentials: 'include',
  })

  return parseApiResponse<{ products: AdminProduct[] }>(response)
}
