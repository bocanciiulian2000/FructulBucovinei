import type { Metadata } from 'next'
import { AdminOrders } from '@/components/admin-orders'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Comenzi | Dashboard admin',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminOrdersPage() {
  return (
    <main className="min-h-screen bg-cream text-forest">
      <Navbar solid />
      <AdminOrders />
    </main>
  )
}
