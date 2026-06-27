'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { apiUrl } from '@/lib/api-url'
import {
  clearLocalDemoUser,
  getLocalDemoUser,
  isLocalDemoUser,
} from '@/lib/local-demo-auth'

export type AuthUser = {
  id: number | string
  firstName: string
  lastName: string
  email: string
  role?: 'customer' | 'admin'
  twoFactorEnabled?: boolean
}

type AuthSessionContextValue = {
  user: AuthUser | null
  loading: boolean
  refreshSession: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  logout: () => Promise<void>
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null)
const AUTH_SESSION_MARKER_KEY = 'fructul-bucovinei-has-auth-session'

function hasAuthSessionMarker() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(AUTH_SESSION_MARKER_KEY) === '1'
}

function setAuthSessionMarker() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_SESSION_MARKER_KEY, '1')
}

function clearAuthSessionMarker() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_SESSION_MARKER_KEY)
}

function redirectHomeWithDelay() {
  window.setTimeout(() => {
    window.location.assign('/')
  }, 1000)
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const updateUser = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser)

    if (nextUser) {
      setAuthSessionMarker()
      return
    }

    clearAuthSessionMarker()
  }, [])

  const refreshSession = useCallback(async () => {
    setLoading(true)

    try {
      const localDemoUser = getLocalDemoUser()

      if (localDemoUser) {
        updateUser(localDemoUser)
        return
      }

      if (!hasAuthSessionMarker()) {
        setUser(null)
        return
      }

      const response = await fetch(apiUrl('/api/auth/me'), {
        credentials: 'include',
      })

      if (!response.ok) {
        updateUser(null)
        return
      }

      const data = (await response.json()) as { user?: AuthUser }
      updateUser(data.user ?? null)
    } catch {
      updateUser(null)
    } finally {
      setLoading(false)
    }
  }, [updateUser])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  const logout = useCallback(async () => {
    if (isLocalDemoUser(user) || getLocalDemoUser()) {
      clearLocalDemoUser()
      updateUser(null)
      redirectHomeWithDelay()
      return
    }

    try {
      await fetch(apiUrl('/api/auth/logout'), {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      updateUser(null)
      redirectHomeWithDelay()
    }
  }, [updateUser, user])

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshSession,
      setUser: updateUser,
      logout,
    }),
    [loading, logout, refreshSession, updateUser, user]
  )

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  )
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext)

  if (!context) {
    throw new Error('useAuthSession must be used within AuthSessionProvider.')
  }

  return context
}
