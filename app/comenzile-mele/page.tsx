import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { OrdersPageContent } from '@/components/orders-page-content'

export default function OrdersPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar solid />
      <OrdersPageContent />
      <Footer />
    </main>
  )
}