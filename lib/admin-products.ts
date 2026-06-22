import { apiUrl } from '@/lib/api-url'

export type AdminProduct = {
  id: number
  slug: string
  name: string
  description: string | null
  image: string | null
  price: number
  stockQuantity: number
  status: 'active' | 'inactive' | string
  createdAt: string | null
  updatedAt: string | null
}

async function parseApiResponse<T>(response: Response) {
  const data = (await response.json()) as T & { error?: string }

  if (!response.ok) {
    throw new Error(data.error || 'A apărut o eroare.')
  }

  return data
}

export async function getAdminProducts() {
  const response = await fetch(apiUrl('/api/admin/products'), {
    credentials: 'include',
  })

  return parseApiResponse<{ products: AdminProduct[] }>(response)
}

export async function updateAdminProductStock(productId: number, stockQuantity: number) {
  const response = await fetch(apiUrl(`/api/admin/products/${productId}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ stockQuantity }),
  })

  return parseApiResponse<{ product: AdminProduct }>(response)
}
