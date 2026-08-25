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

export function apiErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(err)) {
    // No response at all: the request never reached the server (offline,
    // DNS failure, backend down, CORS, etc.) - distinct from a handled
    // error response, and worth telling the user about explicitly.
    if (!err.response) {
      return err.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : 'Network error. Please check your connection and try again.'
    }

    const status = err.response.status
    const data = err.response.data

    if (typeof data === 'string' && data.trim()) return data

    if (data && typeof data === 'object') {
      const firstKey = Object.keys(data)[0]
      const value = (data as Record<string, unknown>)[firstKey]
      if (Array.isArray(value) && value.length) return String(value[0])
      if (typeof value === 'string' && value) return value
      const detail = (data as Record<string, unknown>).detail
      if (typeof detail === 'string' && detail) return detail
    }

    if (status === 401) return 'Your session has expired. Please sign in again.'
    if (status === 403) return "You don't have permission to do that."
    if (status === 404) return 'Not found.'
    if (status === 429) return 'Too many requests. Please wait a moment and try again.'
    if (status >= 500) return "Something went wrong on our end. Please try again in a moment."
  }
  return fallback
}
