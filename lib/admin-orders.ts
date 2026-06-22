import { apiUrl } from '@/lib/api-url'
import type { RemoteOrder } from '@/lib/orders'

export type AdminOrderCategory = 'received' | 'shipped'

export type AdminOrdersPagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

async function parseApiResponse<T>(response: Response) {
  const data = (await response.json()) as T & { error?: string }

  if (!response.ok) {
    throw new Error(data.error || 'A apărut o eroare.')
  }

  return data
}

export async function getAdminOrders(category: AdminOrderCategory, page = 1, limit = 10) {
  const response = await fetch(apiUrl(`/api/admin/orders?category=${category}&page=${page}&limit=${limit}`), {
    credentials: 'include',
  })

  return parseApiResponse<{ orders: RemoteOrder[]; pagination: AdminOrdersPagination }>(response)
}

export async function markAdminOrderAsShipped(orderId: number, awb: string) {
  const response = await fetch(apiUrl(`/api/admin/orders/${orderId}/ship`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ awb }),
  })

  return parseApiResponse<{ order: RemoteOrder }>(response)
}
