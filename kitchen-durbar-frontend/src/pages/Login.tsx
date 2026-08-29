import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiErrorMessage } from '../api/client'
import GoogleButton from '../components/GoogleButton'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError(t('auth.emailPasswordRequired'))
      return
    }

    setBusy(true)
    try {
      await login(trimmedEmail, password)
      toast(t('login.welcomeBack'))
      navigate('/')
    } catch (err) {
      setError(apiErrorMessage(err, t('login.error')))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="kd-pg active">
      <form className="kd-a" onSubmit={handleSubmit}>
        <h2>{t('login.title')}</h2>
        {error && <div className="kd-err">{error}</div>}
        <div className="kd-fg">
          <label>{t('auth.email')}</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="kd-fg">
          <label>{t('auth.password')}</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="kd-as" style={{ marginTop: -8, marginBottom: 18, textAlign: 'right' }}>
          <Link to="/forgot-password">{t('login.forgotPassword')}</Link>
        </div>
        <button className="kd-abtn" type="submit" disabled={busy}>
          {busy ? t('login.signingIn') : t('login.signIn')}
        </button>
        <div className="kd-divider">{t('common.or')}</div>
        <GoogleButton />
        <div className="kd-as">
          {t('login.noAccount')} <Link to="/register">{t('login.register')}</Link>
        </div>
      </form>
    </div>
  )
}
