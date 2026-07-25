import { apiUrl } from '@/lib/api-url'
import type { CartItem } from '@/lib/cart'

export type OrderAddress = {
  firstName: string
  lastName: string
  company?: string
  country: string
  phone: string
  streetAddress: string
  addressExtra?: string
  county: string
  city: string
  postalCode: string
}

export type RemoteOrderItem = {
  id: number
  productId: number | null
  productSlug: string
  productName: string
  productImage: string | null
  unitPrice: number
  quantity: number
  lineTotal: number
  productSnapshot: CartItem | null
}

export type RemoteOrder = {
  id: number
  orderNumber: string
  userId: number | null
  customerEmail: string
  status: string
  statusLabel: string
  awb: string | null
  paymentMethod: 'cash' | 'card'
  paymentStatus: string
  currency: string
  subtotalAmount: number
  discountCode: string | null
  discountPercent: number
  discountAmount: number
  shippingAmount: number
  totalAmount: number
  customerNote: string | null
  createdAt: string
  updatedAt: string
  items: RemoteOrderItem[]
  addresses: Array<OrderAddress & { id: number; type: 'billing' | 'shipping' }>
}

export type CreateOrderPayload = {
  customerEmail: string
  paymentMethod: 'cash' | 'card'
  items: CartItem[]
  billingAddress: OrderAddress
  shippingAddress?: OrderAddress
  customerNote?: string
  discountCode?: string
  discountPercent?: number
  termsAccepted: boolean
}

export type NetopiaPayment = {
  endpoint: string
  fields: {
    env_key: string
    data: string
    cipher: string
    iv: string
  }
}

async function parseApiResponse<T>(response: Response) {
  const data = (await response.json()) as T & { error?: string }

  if (!response.ok) {
    throw new Error(data.error || 'A apărut o eroare.')
  }

  return data
}

export async function createOrder(payload: CreateOrderPayload) {
  const response = await fetch(apiUrl('/api/orders'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  return parseApiResponse<{
    order: RemoteOrder
    payment?: NetopiaPayment
    paymentReturnToken?: string
  }>(response)
}

export async function getOrders(page = 1, limit = 5) {
  const response = await fetch(apiUrl(`/api/orders?page=${page}&limit=${limit}`), {
    credentials: 'include',
  })

  return parseApiResponse<{
    orders: RemoteOrder[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }>(response)
}

export async function getOrder(orderNumber: string, paymentToken?: string) {
  const query = paymentToken ? `?paymentToken=${encodeURIComponent(paymentToken)}` : ''
  const response = await fetch(apiUrl(`/api/orders/${encodeURIComponent(orderNumber)}${query}`), {
    credentials: 'include',
  })

  return parseApiResponse<{ order: RemoteOrder }>(response)
}
