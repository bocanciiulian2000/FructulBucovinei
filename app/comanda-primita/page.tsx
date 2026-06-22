import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { OrderConfirmationContent } from '@/components/order-confirmation-content'

export default function OrderConfirmationPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-forest">
      <Navbar solid />
      <OrderConfirmationContent />
      <Footer />
    </main>
  )
}