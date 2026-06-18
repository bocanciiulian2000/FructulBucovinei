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
}

type AuthSessionContextValue = {
  user: AuthUser | null
  loading: boolean
  refreshSession: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  logout: () => Promise<void>
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null)

function redirectHomeWithDelay() {
  window.setTimeout(() => {
    window.location.assign('/')
  }, 1000)
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    setLoading(true)

    try {
      const localDemoUser = getLocalDemoUser()

      if (localDemoUser) {
        setUser(localDemoUser)
        return
      }

      const response = await fetch(apiUrl('/api/auth/me'), {
        credentials: 'include',
      })

      if (!response.ok) {
        setUser(null)
        return
      }

      const data = (await response.json()) as { user?: AuthUser }
      setUser(data.user ?? null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  const logout = useCallback(async () => {
    if (isLocalDemoUser(user) || getLocalDemoUser()) {
      clearLocalDemoUser()
      setUser(null)
      redirectHomeWithDelay()
      return
    }

    try {
      await fetch(apiUrl('/api/auth/logout'), {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setUser(null)
      redirectHomeWithDelay()
    }
  }, [user])

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshSession,
      setUser,
      logout,
    }),
    [loading, logout, refreshSession, user]
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
