import { Suspense } from 'react'
import { PasswordResetContent } from '@/components/password-reset-content'

export const metadata = {
  title: 'Resetare parolă | Fructul Bucovinei',
  description: 'Resetează parola contului tău Fructul Bucovinei.',
}

export default function ResetareParolaPage() {
  return (
    <Suspense fallback={null}>
      <PasswordResetContent />
    </Suspense>
  )
}
