import type { Metadata } from 'next'
import { AdminInventory } from '@/components/admin-inventory'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Inventar produse | Dashboard admin',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminInventoryPage() {
  return (
    <main className="min-h-screen bg-cream text-forest">
      <Navbar solid />
      <AdminInventory />
    </main>
  )
}
