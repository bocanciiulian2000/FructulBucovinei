import { AccountDashboard } from '@/components/account-dashboard'
import { Navbar } from '@/components/navbar'

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-cream text-forest">
      <Navbar solid />
      <AccountDashboard />
    </main>
  )
}