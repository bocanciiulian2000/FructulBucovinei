'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import {
  CheckCircle2,
  Lock,
  Mail,
  ShieldCheck,
  Smartphone,
  UserRound,
} from 'lucide-react'
import { AuthPanel } from '@/components/auth-panel'
import { LocalOrdersList } from '@/components/local-orders-list'
import { useAuthSession, type AuthUser } from '@/components/auth-session-provider'
import { apiUrl } from '@/lib/api-url'

type AccountSection = 'details' | 'settings' | 'orders'

type TwoFactorSetupData = {
  qrCodeDataUrl: string
  manualKey: string
  otpAuthUrl: string
}

export function AccountDashboard() {
  const { user, loading, setUser, logout } = useAuthSession()
  const [activeSection, setActiveSection] = useState<AccountSection>('details')
  const [email, setEmail] = useState('')
  const [emailConfirm, setEmailConfirm] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordCurrent, setPasswordCurrent] = useState('')
  const [emailFeedback, setEmailFeedback] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordFeedback, setPasswordFeedback] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [twoFactorPassword, setTwoFactorPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [twoFactorSetup, setTwoFactorSetup] = useState<TwoFactorSetupData | null>(null)
  const [twoFactorFeedback, setTwoFactorFeedback] = useState('')
  const [twoFactorError, setTwoFactorError] = useState('')
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false)
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
  const [isTwoFactorSubmitting, setIsTwoFactorSubmitting] = useState(false)

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-36 lg:px-12 lg:pt-40">
        <div className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-6 shadow-sm md:p-8">
          Se încarcă contul...
        </div>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-36 lg:px-12 lg:pt-40">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wide text-brown">
              Contul meu
            </p>
            <h1 className="font-serif text-5xl font-bold leading-none text-forest">
              Autentifică-te pentru a-ți vedea contul
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-forest/75">
              După autentificare vei vedea datele contului tău, setările de
              securitate și comenzile salvate.
            </p>
          </div>

          <div className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-sm md:p-7">
            <AuthPanel defaultMode="login" compact />
          </div>
        </div>
      </section>
    )
  }

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsEmailSubmitting(true)
    setEmailFeedback('')
    setEmailError('')

    try {
      const response = await fetch(apiUrl('/api/auth/me'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: emailPassword,
          email,
          emailConfirm,
        }),
      })

      const data = (await response.json()) as {
        user?: AuthUser
        message?: string
        error?: string
      }

      if (!response.ok || !data.user) {
        throw new Error(data.error ?? 'Nu s-a putut actualiza emailul.')
      }

      setUser(data.user)
      setEmailFeedback(data.message ?? 'Emailul a fost actualizat cu succes.')
      setEmail('')
      setEmailConfirm('')
      setEmailPassword('')
    } catch (updateError) {
      setEmailError(
        updateError instanceof Error ? updateError.message : 'A apărut o eroare.'
      )
    } finally {
      setIsEmailSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPasswordSubmitting(true)
    setPasswordFeedback('')
    setPasswordError('')

    try {
      const response = await fetch(apiUrl('/api/auth/me'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordCurrent,
          password,
          passwordConfirm,
        }),
      })

      const data = (await response.json()) as {
        user?: AuthUser
        message?: string
        error?: string
      }

      if (!response.ok || !data.user) {
        throw new Error(data.error ?? 'Nu s-a putut actualiza parola.')
      }

      setUser(data.user)
      setPasswordFeedback(data.message ?? 'Parola a fost actualizată cu succes.')
      setPassword('')
      setPasswordConfirm('')
      setPasswordCurrent('')
    } catch (updateError) {
      setPasswordError(
        updateError instanceof Error ? updateError.message : 'A apărut o eroare.'
      )
    } finally {
      setIsPasswordSubmitting(false)
    }
  }

  const handleTwoFactorSetup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsTwoFactorSubmitting(true)
    setTwoFactorFeedback('')
    setTwoFactorError('')

    try {
      const response = await fetch(apiUrl('/api/auth/2fa/setup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: twoFactorPassword,
        }),
      })
      const data = (await response.json()) as TwoFactorSetupData & { error?: string }

      if (!response.ok || !data.qrCodeDataUrl) {
        throw new Error(data.error ?? 'Nu s-a putut porni configurarea 2FA.')
      }

      setTwoFactorSetup(data)
      setTwoFactorFeedback('Scanează codul QR și introdu codul generat pentru confirmare.')
    } catch (setupError) {
      setTwoFactorError(setupError instanceof Error ? setupError.message : 'A apărut o eroare.')
    } finally {
      setIsTwoFactorSubmitting(false)
    }
  }

  const handleTwoFactorVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsTwoFactorSubmitting(true)
    setTwoFactorFeedback('')
    setTwoFactorError('')

    try {
      const response = await fetch(apiUrl('/api/auth/2fa/verify'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          code: twoFactorCode,
        }),
      })
      const data = (await response.json()) as {
        user?: AuthUser
        message?: string
        error?: string
      }

      if (!response.ok || !data.user) {
        throw new Error(data.error ?? 'Codul nu a putut fi verificat.')
      }

      setUser(data.user)
      setTwoFactorSetup(null)
      setTwoFactorPassword('')
      setTwoFactorCode('')
      setTwoFactorFeedback(data.message ?? 'Autentificarea în 2 pași a fost activată.')
    } catch (verifyError) {
      setTwoFactorError(verifyError instanceof Error ? verifyError.message : 'A apărut o eroare.')
    } finally {
      setIsTwoFactorSubmitting(false)
    }
  }

  const handleTwoFactorDisable = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsTwoFactorSubmitting(true)
    setTwoFactorFeedback('')
    setTwoFactorError('')

    try {
      const response = await fetch(apiUrl('/api/auth/2fa/disable'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: twoFactorPassword,
          code: twoFactorCode,
        }),
      })
      const data = (await response.json()) as {
        user?: AuthUser
        message?: string
        error?: string
      }

      if (!response.ok || !data.user) {
        throw new Error(data.error ?? '2FA nu a putut fi dezactivat.')
      }

      setUser(data.user)
      setTwoFactorPassword('')
      setTwoFactorCode('')
      setTwoFactorSetup(null)
      setTwoFactorFeedback(data.message ?? 'Autentificarea în 2 pași a fost dezactivată.')
    } catch (disableError) {
      setTwoFactorError(disableError instanceof Error ? disableError.message : 'A apărut o eroare.')
    } finally {
      setIsTwoFactorSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-36 lg:px-12 lg:pt-40">
      <div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brown">
            Contul meu
          </p>
          <h1 className="mt-2 font-serif text-5xl font-bold leading-none text-forest">
            Bun venit, {user.firstName}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-forest/75">
            Aici găsești datele contului tău și setările pe care le poți
            actualiza oricând.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <aside className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-4 shadow-sm lg:sticky lg:top-28">
          <div className="border-b border-forest/10 px-3 pb-4">
            <p className="font-serif text-2xl font-bold leading-tight text-forest">
              {user.firstName} {user.lastName}
            </p>
            <p className="mt-1 break-all text-sm text-forest/65">{user.email}</p>
          </div>

          <nav className="mt-3 divide-y divide-forest/10">
            <AccountMenuItem
              active={activeSection === 'details'}
              onClick={() => setActiveSection('details')}
            >
              Datele contului
            </AccountMenuItem>
            <AccountMenuItem
              active={activeSection === 'settings'}
              onClick={() => setActiveSection('settings')}
            >
              Setările contului
            </AccountMenuItem>
            <AccountMenuItem
              active={activeSection === 'orders'}
              onClick={() => setActiveSection('orders')}
            >
              Comenzile mele
            </AccountMenuItem>
          </nav>

          <button
            type="button"
            onClick={() => void logout()}
            className="mt-4 flex w-full items-center justify-between rounded-sm border border-forest/15 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-forest transition-colors hover:border-burgundy hover:text-burgundy"
          >
            Delogare
            <span aria-hidden="true">→</span>
          </button>
        </aside>

        <div>
          {activeSection === 'details' ? (
            <section className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-6 shadow-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-wide text-brown">
                Datele contului
              </p>
              <h2 className="mt-2 font-serif text-4xl font-bold leading-none text-forest">
                Datele tale
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <InfoRow icon={<UserRound size={16} />} label="Nume" value={user.firstName} />
                <InfoRow icon={<UserRound size={16} />} label="Prenume" value={user.lastName} />
                <InfoRow
                  className="md:col-span-2"
                  icon={<Mail size={16} />}
                  label="Adresă email"
                  value={user.email}
                />
              </div>

              <div className="mt-8 rounded-2xl border border-forest/10 bg-cream p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brown">
                      <ShieldCheck size={15} />
                      Autentificare în 2 pași
                    </p>
                    <h3 className="mt-2 font-serif text-3xl font-bold leading-none text-forest">
                      {user.twoFactorEnabled ? 'Protecție activă' : 'Protejează-ți contul'}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-forest/70">
                      Folosește Google Authenticator pentru a activa autentificarea în 2 pași.
                    </p>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                    user.twoFactorEnabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-burgundy/10 text-burgundy'
                  }`}>
                    {user.twoFactorEnabled ? 'Activ' : 'Inactiv'}
                  </span>
                </div>

                {twoFactorFeedback ? (
                  <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-950">
                    <CheckCircle2 size={16} className="mr-2 inline-block align-[-2px] text-emerald-600" />
                    {twoFactorFeedback}
                  </p>
                ) : null}
                {twoFactorError ? (
                  <p className="mt-5 rounded-2xl border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-sm font-semibold text-burgundy">
                    {twoFactorError}
                  </p>
                ) : null}

                {!user.twoFactorEnabled && !twoFactorSetup ? (
                  <form className="mt-5 space-y-4" onSubmit={handleTwoFactorSetup}>
                    <Field
                      icon={<Lock size={15} />}
                      label="Parola actuală"
                      type="password"
                      value={twoFactorPassword}
                      onChange={setTwoFactorPassword}
                      placeholder="Parola actuală"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isTwoFactorSubmitting}
                      className="flex h-12 w-full items-center justify-center rounded-sm bg-burgundy px-5 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                    >
                      Configurează 2FA
                    </button>
                  </form>
                ) : null}

                {!user.twoFactorEnabled && twoFactorSetup ? (
                  <form className="mt-5 grid gap-5 lg:grid-cols-[260px_1fr]" onSubmit={handleTwoFactorVerify}>
                    <div className="rounded-2xl border border-forest/10 bg-[#fbf7ee] p-4 text-center">
                      <img
                        src={twoFactorSetup.qrCodeDataUrl}
                        alt="Cod QR pentru autentificare în 2 pași"
                        className="mx-auto h-56 w-56 rounded-xl bg-white p-2"
                      />
                      <p className="mt-3 break-all text-xs font-semibold text-forest/65">
                        Cheie manuală: {twoFactorSetup.manualKey}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <p className="flex items-center gap-2 text-sm leading-relaxed text-forest/75">
                        <Smartphone size={16} className="text-burgundy" />
                        Scanează codul QR, apoi introdu codul de 6 cifre afișat în aplicație.
                      </p>
                      <Field
                        icon={<Lock size={15} />}
                        label="Cod authenticator"
                        value={twoFactorCode}
                        onChange={(value) => setTwoFactorCode(value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isTwoFactorSubmitting || twoFactorCode.length !== 6}
                        className="flex h-12 w-full items-center justify-center rounded-sm bg-burgundy px-5 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                      >
                        Activează 2FA
                      </button>
                    </div>
                  </form>
                ) : null}

                {user.twoFactorEnabled ? (
                  <form className="mt-5 space-y-4" onSubmit={handleTwoFactorDisable}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field
                        icon={<Lock size={15} />}
                        label="Parola actuală"
                        type="password"
                        value={twoFactorPassword}
                        onChange={setTwoFactorPassword}
                        placeholder="Parola actuală"
                        required
                      />
                      <Field
                        icon={<Lock size={15} />}
                        label="Cod authenticator"
                        value={twoFactorCode}
                        onChange={(value) => setTwoFactorCode(value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isTwoFactorSubmitting || twoFactorCode.length !== 6}
                      className="flex h-12 w-full items-center justify-center rounded-sm border border-burgundy px-5 text-xs font-bold uppercase tracking-wide text-burgundy transition-colors hover:bg-burgundy hover:text-cream disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                    >
                      Dezactivează 2FA
                    </button>
                  </form>
                ) : null}
              </div>
            </section>
          ) : null}

          {activeSection === 'settings' ? (
            <section className="space-y-6 rounded-3xl border border-forest/10 bg-[#fbf7ee] p-6 shadow-sm md:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brown">
                  Setările contului
                </p>
                <h2 className="mt-2 font-serif text-4xl font-bold leading-none text-forest">
                  Schimbă datele
                </h2>
              </div>

              <form className="space-y-4 rounded-2xl border border-forest/10 bg-cream p-5" onSubmit={handleEmailSubmit}>
                <p className="text-sm font-semibold uppercase tracking-wide text-brown">
                  Schimbă adresa de email
                </p>

                <Field
                  icon={<Lock size={15} />}
                  label="Parola actuală"
                  type="password"
                  value={emailPassword}
                  onChange={setEmailPassword}
                  placeholder="Parola actuală"
                  required
                />
                <Field
                  icon={<Mail size={15} />}
                  label="Noua adresă de email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="nume@exemplu.ro"
                  required
                />
                <Field
                  icon={<Mail size={15} />}
                  label="Confirmă noul email"
                  type="email"
                  value={emailConfirm}
                  onChange={setEmailConfirm}
                  placeholder="Repetă adresa de email"
                  required
                />

                {emailFeedback ? (
                  <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-950">
                    <CheckCircle2 size={16} className="mr-2 inline-block align-[-2px] text-emerald-600" />
                    {emailFeedback}
                  </p>
                ) : null}
                {emailError ? (
                  <p className="rounded-2xl border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-sm font-semibold text-burgundy">
                    {emailError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isEmailSubmitting}
                  className="flex h-12 w-full items-center justify-center rounded-sm bg-burgundy px-5 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Actualizează emailul
                </button>
              </form>

              <form className="space-y-4 rounded-2xl border border-forest/10 bg-cream p-5" onSubmit={handlePasswordSubmit}>
                <p className="text-sm font-semibold uppercase tracking-wide text-brown">
                  Schimbă parola
                </p>

                <Field
                  icon={<Lock size={15} />}
                  label="Parola actuală"
                  type="password"
                  value={passwordCurrent}
                  onChange={setPasswordCurrent}
                  placeholder="Parola actuală"
                  required
                />
                <Field
                  icon={<Lock size={15} />}
                  label="Parolă nouă"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Parola nouă"
                  required
                />
                <Field
                  icon={<Lock size={15} />}
                  label="Confirmă parola nouă"
                  type="password"
                  value={passwordConfirm}
                  onChange={setPasswordConfirm}
                  placeholder="Repetă parola nouă"
                  required
                />

                {passwordFeedback ? (
                  <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-950">
                    <CheckCircle2 size={16} className="mr-2 inline-block align-[-2px] text-emerald-600" />
                    {passwordFeedback}
                  </p>
                ) : null}
                {passwordError ? (
                  <p className="rounded-2xl border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-sm font-semibold text-burgundy">
                    {passwordError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isPasswordSubmitting}
                  className="flex h-12 w-full items-center justify-center rounded-sm bg-burgundy px-5 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Actualizează parola
                </button>
              </form>
            </section>
          ) : null}

          {activeSection === 'orders' ? (
            <section className="rounded-3xl border border-forest/10 bg-[#fbf7ee] p-6 shadow-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-wide text-brown">
                Comenzile mele
              </p>
              <h2 className="mt-2 font-serif text-4xl font-bold leading-none text-forest">
                Istoricul comenzilor
              </h2>

              <div className="mt-6">
                <LocalOrdersList
                  emptyText="După ce finalizezi o comandă, vei vedea aici pachetele, statusul și detaliile livrării."
                />
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function AccountMenuItem({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between px-3 py-4 text-left text-sm font-bold uppercase tracking-wide transition-colors ${
        active
          ? 'text-burgundy'
          : 'text-forest hover:text-burgundy'
      }`}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={`transition-transform ${active ? 'translate-x-1' : ''}`}
      >
        →
      </span>
    </button>
  )
}

function InfoRow({
  className = '',
  icon,
  label,
  value,
}: {
  className?: string
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className={`min-w-0 flex items-start gap-3 rounded-2xl border border-forest/10 bg-cream px-4 py-4 ${className}`}>
      <span className="mt-0.5 text-brown">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-brown">{label}</p>
        <p className="mt-1 break-words text-base font-semibold text-forest [overflow-wrap:anywhere]">
          {value}
        </p>
      </div>
    </div>
  )
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
}: {
  icon: ReactNode
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  required?: boolean
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brown">
        <span className="text-brown">{icon}</span>
        {label}
        {required ? <span className="text-burgundy">*</span> : null}
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
