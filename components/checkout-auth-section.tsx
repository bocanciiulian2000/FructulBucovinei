import { AuthPanel } from '@/components/auth-panel'

export function CheckoutAuthSection() {
  return (
    <section
      id="autentificare"
      className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-sm md:p-7"
    >
      <AuthPanel defaultMode="register" />
    </section>
  )
}
