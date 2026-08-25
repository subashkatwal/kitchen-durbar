import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

export const api = axios.create({ baseURL: API_URL })

const ACCESS_KEY = 'kd_access'
const REFRESH_KEY = 'kd_refresh'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function setTokens(access: string, refresh?: string) {
  localStorage.setItem(ACCESS_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken()
  if (!refresh) return null
  try {
    const { data } = await axios.post(`${API_URL}/refresh`, { refresh })
    setTokens(data.access)
    return data.access as string
  } catch {
    clearTokens()
    return null
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    if (error.response?.status === 401 && original && !original._retry && getRefreshToken()) {
      original._retry = true
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }
      const newToken = await refreshPromise
      if (newToken) {
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      }
    }
    return Promise.reject(error)
  },
)

export function apiErrorMessage(err: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data
    if (typeof data === 'string') return data
    if (data && typeof data === 'object') {
      const firstKey = Object.keys(data)[0]
      const value = (data as Record<string, unknown>)[firstKey]
      if (Array.isArray(value)) return String(value[0])
      if (typeof value === 'string') return value
      if (data.detail) return String(data.detail)
    }
  }
  return fallback
}
