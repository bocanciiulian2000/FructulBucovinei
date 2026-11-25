'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { CheckCircle2, Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react'
import { apiUrl } from '@/lib/api-url'
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
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [twoFactorChallengeToken, setTwoFactorChallengeToken] = useState('')
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

  const switchMode = (nextMode: AuthMode) => {
    if (nextMode === mode) {
      return
    }

    setMode(nextMode)
    setFeedback('')
    setFeedbackTone(null)
    setError('')
    setTwoFactorCode('')
    setTwoFactorChallengeToken('')
    setIsForgotPasswordOpen(false)
    setForgotPasswordEmail('')
  }

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
        requiresTwoFactor?: boolean
        challengeToken?: string
        message?: string
        error?: string
      }

      if (response.ok && data.requiresTwoFactor && data.challengeToken) {
        setTwoFactorChallengeToken(data.challengeToken)
        setFeedback(data.message ?? 'Introdu codul din aplicația de autentificare.')
        setFeedbackTone(null)
        return
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

  const handleTwoFactorLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(apiUrl('/api/auth/login/2fa'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          challengeToken: twoFactorChallengeToken,
          code: twoFactorCode,
        }),
      })

      const data = (await response.json()) as {
        user?: AuthUser
        error?: string
      }

      if (!response.ok || !data.user) {
        throw new Error(data.error ?? 'Codul nu a putut fi verificat.')
      }

      handleAuthSuccess(data.user, 'Te-ai autentificat cu succes.')
      setTwoFactorCode('')
      setTwoFactorChallengeToken('')
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
        message?: string
        error?: string
      }

      if (!response.ok) {
        throw new Error(data.error ?? 'Nu s-a putut crea contul.')
      }

      setFeedback(data.message ?? 'Ți-am trimis un email de confirmare. Verifică inbox-ul pentru a activa contul.')
      setFeedbackTone('success')
      setFirstName('')
      setLastName('')
      setRegisterEmail('')
      setRegisterEmailConfirm('')
      setRegisterPassword('')
      setRegisterPasswordConfirm('')
      setTermsAccepted(false)
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'A apărut o eroare.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async () => {
    setIsSubmitting(true)
    setFeedback('')
    setFeedbackTone(null)
    setError('')

    try {
      const response = await fetch(apiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: forgotPasswordEmail,
        }),
      })

      const data = (await response.json()) as {
        message?: string
        error?: string
      }

      if (!response.ok) {
        throw new Error(data.error ?? 'Nu am putut trimite cererea de resetare.')
      }

      setFeedback(data.message ?? 'Dacă adresa de email este găsită la noi în sistem, vei primi un link de resetare pe email.')
      setFeedbackTone('success')
      setForgotPasswordEmail('')
      setIsForgotPasswordOpen(false)
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
            onClick={() => switchMode('login')}
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
            onClick={() => switchMode('register')}
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
            Verifică inbox-ul pentru pașii următori.
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-2xl border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-sm font-semibold text-burgundy">
          {error}
        </p>
      ) : null}

      <div className="mt-6">
        {mode === 'login' && twoFactorChallengeToken ? (
          <form className="space-y-4" onSubmit={handleTwoFactorLogin}>
            <div className="rounded-2xl border border-forest/10 bg-cream px-4 py-4 text-sm leading-relaxed text-forest/75">
              Contul are autentificare în 2 pași activă. Introdu codul de 6 cifre din aplicația Authenticator.
            </div>
            <AuthField
              label="Cod authenticator"
              icon={<Lock size={15} />}
              type="text"
              value={twoFactorCode}
              onChange={(value) => setTwoFactorCode(value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              required
            />

            <button
              type="submit"
              disabled={isSubmitting || twoFactorCode.length !== 6}
              className="flex h-12 w-full items-center justify-center rounded-sm bg-burgundy px-5 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60"
            >
              Verifică și autentifică-te
            </button>
            <button
              type="button"
              onClick={() => {
                setTwoFactorChallengeToken('')
                setTwoFactorCode('')
                setFeedback('')
                setError('')
              }}
              className="flex h-12 w-full items-center justify-center rounded-sm border border-forest/15 px-5 text-xs font-bold uppercase tracking-wide text-forest transition-colors hover:border-burgundy hover:text-burgundy"
            >
              Înapoi la autentificare
            </button>
          </form>
        ) : mode === 'login' ? (
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

            <div className="-mt-1 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordOpen((current) => !current)
                  setForgotPasswordEmail(loginEmail)
                  setFeedback('')
                  setFeedbackTone(null)
                  setError('')
                }}
                className="text-sm font-semibold text-burgundy underline-offset-4 transition-colors hover:text-forest hover:underline"
              >
                Am uitat parola
              </button>
            </div>

            {isForgotPasswordOpen ? (
              <div className="rounded-2xl border border-forest/10 bg-cream px-4 py-4">
                <p className="text-sm leading-relaxed text-forest/75">
                  Introdu adresa de email asociată contului și îți trimitem un link de resetare valabil 30 de minute.
                </p>
                <div className="mt-4 space-y-4">
                  <AuthField
                    label="Adresă email"
                    icon={<Mail size={15} />}
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={setForgotPasswordEmail}
                    placeholder="nume@exemplu.ro"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isSubmitting}
                    className="flex h-11 w-full items-center justify-center rounded-sm border border-burgundy bg-burgundy px-5 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Trimite linkul de resetare
                  </button>
                </div>
              </div>
            ) : null}

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
