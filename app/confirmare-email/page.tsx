import { Suspense } from 'react'
import { EmailConfirmationContent } from '@/components/email-confirmation-content'

export const metadata = {
  title: 'Confirmare email | Fructul Bucovinei',
  description: 'Confirmă adresa de email pentru contul tău Fructul Bucovinei.',
}

export default function ConfirmareEmailPage() {
  return (
    <Suspense fallback={null}>
      <EmailConfirmationContent />
    </Suspense>
  )
}
