import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'

export default function ForgotPassword() {
  const { requestOtp } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const trimmed = email.trim()
    if (!trimmed) {
      setError(t('forgotPassword.emailRequired'))
      return
    }

    setBusy(true)
    try {
      await requestOtp(trimmed, 'reset')
      toast(t('forgotPassword.success'))
      navigate(`/verify-otp?email=${encodeURIComponent(trimmed)}&purpose=reset`)
    } catch (err) {
      setError(apiErrorMessage(err, t('forgotPassword.error')))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="kd-pg active">
      <form className="kd-a" onSubmit={handleSubmit}>
        <h2>{t('forgotPassword.title')}</h2>
        <p className="kd-a-sub">{t('forgotPassword.subtitle')}</p>
        {error && <div className="kd-err">{error}</div>}
        <div className="kd-fg">
          <label>{t('auth.email')}</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="kd-abtn" type="submit" disabled={busy}>
          {busy ? t('forgotPassword.sending') : t('forgotPassword.submit')}
        </button>
        <div className="kd-as">
          {t('forgotPassword.remembered')} <Link to="/login">{t('forgotPassword.signIn')}</Link>
        </div>
      </form>
    </div>
  )
}
