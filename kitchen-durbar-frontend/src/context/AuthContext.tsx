import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, clearTokens, getAccessToken, setTokens } from '../api/client'
import type { OTPPurpose, User } from '../types'

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
  requestOtp: (email: string, purpose: OTPPurpose) => Promise<void>
  verifySignupOtp: (email: string, code: string) => Promise<void>
  verifyResetOtp: (email: string, code: string) => Promise<void>
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>
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
    // Registering also emails a signup-verification OTP server-side.
    await api.post('/register', payload)
  }

  async function requestOtp(email: string, purpose: OTPPurpose) {
    await api.post('/otp/request', { email, purpose })
  }

  async function verifySignupOtp(email: string, code: string) {
    // Signup OTPs authenticate on success, same shape as login().
    const { data } = await api.post('/otp/verify', { email, code, purpose: 'signup' })
    setTokens(data.access, data.refresh)
    setUser(data.user)
  }

  async function verifyResetOtp(email: string, code: string) {
    // Reset OTPs only get checked here (not consumed) so the forgot-password
    // page can validate the code before asking for a new password.
    await api.post('/otp/verify', { email, code, purpose: 'reset' })
  }

  async function resetPassword(email: string, code: string, newPassword: string) {
    await api.post('/password-reset/confirm', { email, code, new_password: newPassword })
  }

  function logout() {
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginWithGoogle, register, requestOtp, verifySignupOtp, verifyResetOtp, resetPassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
