'use client'

const LOCAL_DEMO_STORAGE_KEY = 'fructul-bucovinei-local-demo-user'

export const LOCAL_DEMO_EMAIL = 'demo@fructulbucovinei.ro'
export const LOCAL_DEMO_PASSWORD = 'Demo12345!'

export type LocalDemoUser = {
  id: 'local-demo'
  firstName: string
  lastName: string
  email: string
}

const DEFAULT_LOCAL_DEMO_USER: LocalDemoUser = {
  id: 'local-demo',
  firstName: 'Cont',
  lastName: 'Demo',
  email: LOCAL_DEMO_EMAIL,
}

export function isLocalDemoHost() {
  if (typeof window === 'undefined') {
    return false
  }

  return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
}

export function isLocalDemoUser(user: { id?: unknown } | null | undefined) {
  return user?.id === 'local-demo'
}

export function getLocalDemoUser() {
  if (!isLocalDemoHost()) {
    return null
  }

  const storedUser = window.localStorage.getItem(LOCAL_DEMO_STORAGE_KEY)

  if (!storedUser) {
    return null
  }

  try {
    const parsedUser = JSON.parse(storedUser) as LocalDemoUser

    if (parsedUser.id !== 'local-demo') {
      return null
    }

    return parsedUser
  } catch {
    window.localStorage.removeItem(LOCAL_DEMO_STORAGE_KEY)
    return null
  }
}

export function saveLocalDemoUser(user: LocalDemoUser) {
  if (!isLocalDemoHost()) {
    return
  }

  window.localStorage.setItem(LOCAL_DEMO_STORAGE_KEY, JSON.stringify(user))
}

export function clearLocalDemoUser() {
  if (!isLocalDemoHost()) {
    return
  }

  window.localStorage.removeItem(LOCAL_DEMO_STORAGE_KEY)
}

export function loginLocalDemoUser(email: string, password: string) {
  if (!isLocalDemoHost()) {
    return null
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (normalizedEmail !== LOCAL_DEMO_EMAIL || password !== LOCAL_DEMO_PASSWORD) {
    return null
  }

  saveLocalDemoUser(DEFAULT_LOCAL_DEMO_USER)
  return DEFAULT_LOCAL_DEMO_USER
}
