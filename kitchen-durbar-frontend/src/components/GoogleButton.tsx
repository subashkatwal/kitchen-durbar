import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
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

/**
 * Renders Google's own "Sign in with Google" button via Google Identity
 * Services (loaded in index.html). The button hands us a signed ID token,
 * which we forward as-is to POST /api/v1/google for server-side verification -
 * we never see or handle the user's Google password.
 *
 * Until VITE_GOOGLE_CLIENT_ID is set (real credentials uploaded later), this
 * renders a quiet placeholder instead of a broken button.
 */
export default function GoogleButton() {
  const { loginWithGoogle } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!CLIENT_ID) return
    let cancelled = false
    let pollId: number | undefined

    async function handleCredential(res: GoogleCredentialResponse) {
      try {
        await loginWithGoogle(res.credential)
        toast('Signed in with Google')
        navigate('/')
      } catch (err) {
        toast(apiErrorMessage(err, 'Google sign-in failed. Please try again.'))
      }
    }

    function render() {
      if (cancelled || !window.google || !containerRef.current) return
      window.google.accounts.id.initialize({ client_id: CLIENT_ID as string, callback: handleCredential })
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        width: 320,
      })
    }

    if (window.google) {
      render()
    } else {
      pollId = window.setInterval(() => {
        if (window.google) {
          window.clearInterval(pollId)
          render()
        }
      }, 100)
    }

    return () => {
      cancelled = true
      if (pollId) window.clearInterval(pollId)
    }
  }, [loginWithGoogle, navigate, toast])

  if (!CLIENT_ID) {
    return (
      <div className="kd-gsi-placeholder">
        Google sign-in isn't configured yet - set <code>VITE_GOOGLE_CLIENT_ID</code> and{' '}
        <code>GOOGLE_CLIENT_ID</code> in <code>.env</code> to enable it.
      </div>
    )
  }

  return (
    <div className="kd-gsi">
      <div ref={containerRef} />
    </div>
  )
}
