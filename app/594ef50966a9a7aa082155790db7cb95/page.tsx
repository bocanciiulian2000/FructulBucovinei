import type { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin-dashboard'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Dashboard admin | Fructul Bucovinei',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-cream text-forest">
      <Navbar solid />
      <AdminDashboard />
    </main>
  )
}
