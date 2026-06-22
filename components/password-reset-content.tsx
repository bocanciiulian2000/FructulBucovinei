'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Eye, EyeOff, Lock, XCircle } from 'lucide-react'
import { apiUrl } from '@/lib/api-url'

export function PasswordResetContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState(token ? '' : 'Linkul de resetare este invalid.')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage('')
    setError('')

    try {
      const response = await fetch(apiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          token,
          password,
          passwordConfirm,
        }),
      })
      const data = (await response.json()) as {
        message?: string
        error?: string
      }

      if (!response.ok) {
        throw new Error(data.error ?? 'Parola nu a putut fi resetată.')
      }

      setSuccessMessage(data.message ?? 'Parola a fost resetată cu succes. Te poți autentifica.')
      setPassword('')
      setPasswordConfirm('')
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'A apărut o eroare.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen bg-site px-4 py-28 text-forest">
      <div className="mx-auto flex min-h-[55vh] w-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-[28px] border border-forest/10 bg-cream/80 p-8 shadow-sm md:p-12">
          <p className="text-xs font-bold uppercase tracking-wide text-brown">
            Contul tău
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-forest md:text-6xl">
            Resetare <span className="text-burgundy">parolă</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-forest/75">
            Introdu noua parolă pentru contul tău. Linkul de resetare este valabil 30 de minute.
          </p>

          {successMessage ? (
            <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-600" size={18} />
                <p className="font-semibold">{successMessage}</p>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="mt-7 rounded-2xl border border-burgundy/20 bg-burgundy/5 p-5 text-burgundy">
              <div className="flex items-center gap-3">
                <XCircle size={18} />
                <p className="font-semibold">{error}</p>
              </div>
            </div>
          ) : null}

          {!successMessage ? (
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <PasswordField
                label="Parolă nouă"
                value={password}
                onChange={setPassword}
                show={showPassword}
                onToggle={() => setShowPassword((current) => !current)}
                placeholder="Parola nouă"
              />
              <PasswordField
                label="Confirmă parola nouă"
                value={passwordConfirm}
                onChange={setPasswordConfirm}
                show={showPasswordConfirm}
                onToggle={() => setShowPasswordConfirm((current) => !current)}
                placeholder="Repetă parola nouă"
              />

              <button
                type="submit"
                disabled={isSubmitting || !token}
                className="flex h-12 w-full items-center justify-center rounded-sm bg-burgundy px-5 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60"
              >
                Resetează parola
              </button>
            </form>
          ) : null}

          <div className="mt-6">
            <Link
              href="/contul-meu"
              className="text-sm font-semibold text-burgundy underline-offset-4 transition-colors hover:text-forest hover:underline"
            >
              Înapoi la autentificare
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  show: boolean
  onToggle: () => void
  placeholder: string
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wide text-brown">
        <span className="flex items-center gap-2">
          <Lock size={15} />
          {label}
          <span className="text-burgundy">*</span>
        </span>
      </span>
      <span className="flex h-12 items-center gap-3 rounded-full border border-forest/15 bg-site px-4 transition-colors focus-within:border-burgundy">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required
          className="min-w-0 flex-1 bg-transparent text-sm text-forest outline-none placeholder:text-forest/35"
        />
        <button
          type="button"
          onClick={onToggle}
          className="text-brown/60 transition-colors hover:text-burgundy"
          aria-label="Arată sau ascunde parola"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </span>
    </label>
  )
}
