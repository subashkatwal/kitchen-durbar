import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'

interface GoogleCredentialResponse {
  credential: string
}

interface GoogleAccountsId {
  initialize: (config: { client_id: string; callback: (res: GoogleCredentialResponse) => void }) => void
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } }
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
const SCRIPT_ID = 'kd-google-gsi-script'

/**
 * Renders Google's own "Sign in with Google" button via Google Identity
 * Services. The button hands us a signed ID token, which we forward as-is to
 * POST /api/v1/google for server-side verification - we never see or handle
 * the user's Google password.
 *
 * The GSI script is loaded here (not as a static <script> in index.html)
 * with an explicit hl=<language> query param, and reloaded whenever the
 * selected site language changes - Google's client otherwise renders the
 * button's own text (e.g. "Sign in with Google") using the browser's locale,
 * which can silently disagree with the language the user picked on the site.
 *
 * Until VITE_GOOGLE_CLIENT_ID is set (real credentials uploaded later), this
 * renders a quiet placeholder instead of a broken button.
 */
export default function GoogleButton() {
  const { loginWithGoogle } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!CLIENT_ID) return
    let cancelled = false
    let pollId: number | undefined

    async function handleCredential(res: GoogleCredentialResponse) {
      try {
        await loginWithGoogle(res.credential)
        toast(t('google.success'))
        navigate('/')
      } catch (err) {
        toast(apiErrorMessage(err, t('google.error')))
      }
    }

    function render() {
      if (cancelled || !window.google || !containerRef.current) return
      containerRef.current.innerHTML = ''
      window.google.accounts.id.initialize({ client_id: CLIENT_ID as string, callback: handleCredential })
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        width: 320,
        locale: language,
      })
    }

    function loadScriptAndRender() {
      // Force a fresh load with the current language's hl= param - Google
      // picks the button's locale at load time, so an already-loaded script
      // won't relocalize just because we call initialize/renderButton again.
      const existing = document.getElementById(SCRIPT_ID)
      existing?.remove()
      delete window.google

      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = `https://accounts.google.com/gsi/client?hl=${language}`
      script.async = true
      script.defer = true
      script.onload = () => {
        if (!cancelled) render()
      }
      document.head.appendChild(script)
    }

    loadScriptAndRender()

    return () => {
      cancelled = true
      if (pollId) window.clearInterval(pollId)
    }
  }, [language, loginWithGoogle, navigate, t, toast])

  if (!CLIENT_ID) {
    return (
      <div className="kd-gsi-placeholder">
        {t('google.notConfigured')
          .split(/(VITE_GOOGLE_CLIENT_ID|GOOGLE_CLIENT_ID|\.env)/)
          .map((part, i) =>
            part === 'VITE_GOOGLE_CLIENT_ID' || part === 'GOOGLE_CLIENT_ID' || part === '.env' ? (
              <code key={i}>{part}</code>
            ) : (
              part
            ),
          )}
      </div>
    )
  }

  return (
    <div className="kd-gsi">
      <div ref={containerRef} />
    </div>
  )
}
