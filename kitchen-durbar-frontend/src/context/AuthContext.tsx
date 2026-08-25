import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, clearTokens, getAccessToken, setTokens } from '../api/client'
import type { User } from '../types'

interface RegisterPayload {
  full_name: string
  email: string
  phone: string
  password: string
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: (credential: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getAccessToken()) {
      setLoading(false)
      return
    }
    api
      .get<User>('/me')
      .then((res) => setUser(res.data))
      .catch(() => clearTokens())
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const { data } = await api.post('/login', { email, password })
    setTokens(data.access, data.refresh)
    setUser(data.user)
  }

  async function loginWithGoogle(credential: string) {
    // Google sign-in authenticates directly (unlike email/password registration) -
    // there's no separate "account already exists" step to walk through first.
    const { data } = await api.post('/google', { credential })
    setTokens(data.access, data.refresh)
    setUser(data.user)
  }

  async function register(payload: RegisterPayload) {
    // Create the account only - do NOT authenticate here. The user is only
    // considered signed in after an explicit login (see login() above).
    await api.post('/register', payload)
  }

  function logout() {
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
