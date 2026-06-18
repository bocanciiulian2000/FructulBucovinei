'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { CheckCircle2, Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react'
import { apiUrl } from '@/lib/api-url'
import {
  LOCAL_DEMO_EMAIL,
  loginLocalDemoUser,
} from '@/lib/local-demo-auth'
import { useAuthSession, type AuthUser } from '@/components/auth-session-provider'

type AuthMode = 'login' | 'register'

type AuthPanelProps = {
  defaultMode?: AuthMode
  compact?: boolean
  redirectOnSuccess?: boolean
  onSuccess?: () => void
}

export function AuthPanel({
  defaultMode = 'login',
  compact = false,
  redirectOnSuccess = true,
  onSuccess,
}: AuthPanelProps) {
  const { setUser, refreshSession } = useAuthSession()
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerEmailConfirm, setRegisterEmailConfirm] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error' | null>(null)
  const [error, setError] = useState('')

  const handleAuthSuccess = (user: AuthUser, successMessage: string) => {
    setUser(user)
    setFeedback(successMessage)
    setFeedbackTone('success')
    setError('')
    onSuccess?.()
  }

  const redirectHome = () => {
    window.setTimeout(() => {
      window.location.assign('/')
    }, 1000)
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback('')
    setFeedbackTone(null)
    setError('')

    try {
      const localDemoUser = loginLocalDemoUser(loginEmail, loginPassword)

      if (localDemoUser) {
        handleAuthSuccess(localDemoUser, 'Te-ai autentificat cu succes pe contul demo local.')
        if (redirectOnSuccess) {
          redirectHome()
        }
        return
      }

      if (loginEmail.trim().toLowerCase() === LOCAL_DEMO_EMAIL) {
        throw new Error('Datele de autentificare pentru contul demo sunt incorecte.')
      }

      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      })

      const data = (await response.json()) as {
        user?: AuthUser
        error?: string
      }

      if (!response.ok || !data.user) {
        throw new Error(data.error ?? 'Nu s-a putut realiza autentificarea.')
      }

      handleAuthSuccess(data.user, 'Te-ai autentificat cu succes.')
      void refreshSession()
      if (redirectOnSuccess) {
        redirectHome()
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'A apărut o eroare.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback('')
    setFeedbackTone(null)
    setError('')

    try {
      const response = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName,
          lastName,
          email: registerEmail,
          emailConfirm: registerEmailConfirm,
          password: registerPassword,
          passwordConfirm: registerPasswordConfirm,
          termsAccepted,
        }),
      })

      const data = (await response.json()) as {
        user?: AuthUser
        error?: string
      }

      if (!response.ok || !data.user) {
        throw new Error(data.error ?? 'Nu s-a putut crea contul.')
      }

      handleAuthSuccess(
        data.user,
        'Contul tău a fost înregistrat cu succes!'
      )
      void refreshSession()
      if (redirectOnSuccess) {
        redirectHome()
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'A apărut o eroare.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brown">
            Contul tău
          </p>
          <h2
            className={`mt-2 font-serif font-bold leading-none text-forest ${
              compact ? 'text-3xl sm:text-4xl' : 'text-4xl'
            }`}
          >
            {mode === 'login' ? (
              'Autentificare'
            ) : (
              <span className="text-burgundy">Creare cont</span>
            )}
          </h2>
        </div>

        <div className="inline-flex rounded-full border border-forest/10 bg-cream p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
              mode === 'login'
                ? 'bg-burgundy text-cream'
                : 'text-forest hover:text-burgundy'
            }`}
          >
            Autentificare
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
              mode === 'register'
                ? 'bg-burgundy text-cream'
                : 'text-forest hover:text-burgundy'
            }`}
          >
            Creare cont
          </button>
        </div>
      </div>

      {feedback && feedbackTone === 'success' ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={18} />
            <p className="font-semibold">
              {feedback}
            </p>
          </div>
          <p className="mt-2 text-sm text-emerald-900/70">
            Poți continua cumpărăturile și navigarea pe site.
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-2xl border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-sm font-semibold text-burgundy">
          {error}
        </p>
      ) : null}

      <div className="mt-6">
        {mode === 'login' ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <AuthField
              label="Adresă email"
              icon={<Mail size={15} />}
              type="email"
              value={loginEmail}
              onChange={setLoginEmail}
              placeholder="nume@exemplu.ro"
              required
            />
            <AuthField
              label="Parolă"
              icon={<Lock size={15} />}
              type={showPassword ? 'text' : 'password'}
              value={loginPassword}
              onChange={setLoginPassword}
              placeholder="Parola ta"
              required
              action={
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="text-brown/60 transition-colors hover:text-burgundy"
                  aria-label="Arată sau ascunde parola"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-sm bg-burgundy px-5 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60"
            >
              Autentifică-te
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid gap-4 md:grid-cols-2">
              <AuthField
                label="Nume"
                icon={<UserRound size={15} />}
                value={firstName}
                onChange={setFirstName}
                placeholder="Numele tău"
                required
              />
              <AuthField
                label="Prenume"
                icon={<UserRound size={15} />}
                value={lastName}
                onChange={setLastName}
                placeholder="Prenumele tău"
                required
              />
            </div>

            <AuthField
              label="Adresă email"
              icon={<Mail size={15} />}
              type="email"
              value={registerEmail}
              onChange={setRegisterEmail}
              placeholder="nume@exemplu.ro"
              required
            />
            <AuthField
              label="Confirmă adresa de email"
              icon={<Mail size={15} />}
              type="email"
              value={registerEmailConfirm}
              onChange={setRegisterEmailConfirm}
              placeholder="Repetă adresa de email"
              required
            />

            <div className="grid gap-4 md:grid-cols-2">
              <AuthField
                label="Parolă"
                icon={<Lock size={15} />}
                type={showPassword ? 'text' : 'password'}
                value={registerPassword}
                onChange={setRegisterPassword}
                placeholder="Parola ta"
                required
                action={
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-brown/60 transition-colors hover:text-burgundy"
                    aria-label="Arată sau ascunde parola"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
              <AuthField
                label="Confirmă parola"
                icon={<Lock size={15} />}
                type={showConfirmPassword ? 'text' : 'password'}
                value={registerPasswordConfirm}
                onChange={setRegisterPasswordConfirm}
                placeholder="Repetă parola"
                required
                action={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="text-brown/60 transition-colors hover:text-burgundy"
                    aria-label="Arată sau ascunde confirmarea parolei"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-forest/10 bg-cream px-4 py-4 text-sm text-forest">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
                className="mt-1 size-4 rounded border-forest/30 text-burgundy focus:ring-burgundy"
                required
              />
              <span className="leading-relaxed">
                Sunt de acord cu{' '}
                <Link
                  href="/termeni-si-conditii"
                  className="font-semibold text-burgundy underline-offset-4 hover:underline"
                >
                  Termenii și Condițiile
                </Link>{' '}
                și{' '}
                <Link
                  href="/politica-de-confidentialitate"
                  className="font-semibold text-burgundy underline-offset-4 hover:underline"
                >
                  Politica de Confidențialitate
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-sm bg-burgundy px-5 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60"
            >
              Creează cont
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function AuthField({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
  icon,
  action,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  required?: boolean
  type?: string
  icon?: ReactNode
  action?: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wide text-brown">
        <span className="flex items-center gap-2">
          {icon}
          {label}
          {required ? <span className="text-burgundy">*</span> : null}
        </span>
        {action}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-full border border-forest/20 bg-cream px-4 text-sm text-forest outline-none placeholder:text-forest/40 focus:border-burgundy"
        required={required}
      />
    </label>
  )
}
