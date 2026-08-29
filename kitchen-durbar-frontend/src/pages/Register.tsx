import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiErrorMessage } from '../api/client'
import GoogleButton from '../components/GoogleButton'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const { t } = useLanguage()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const trimmedName = fullName.trim()
    const trimmedEmail = email.trim()
    if (!trimmedName || !trimmedEmail) {
      setError(t('register.nameEmailRequired'))
      return
    }
    if (password.length < 6) {
      setError(t('auth.passwordTooShort'))
      return
    }

    setBusy(true)
    try {
      await register({ full_name: trimmedName, email: trimmedEmail, phone: phone.trim(), password })
      toast(t('register.success'))
      navigate(`/verify-otp?email=${encodeURIComponent(trimmedEmail)}&purpose=signup`)
    } catch (err) {
      setError(apiErrorMessage(err, t('register.error')))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="kd-pg active">
      <form className="kd-a" onSubmit={handleSubmit}>
        <h2>{t('register.title')}</h2>
        {error && <div className="kd-err">{error}</div>}
        <div className="kd-fg">
          <label>{t('register.fullName')}</label>
          <input type="text" placeholder="Ram Bahadur" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="kd-fg">
          <label>{t('auth.email')}</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="kd-fg">
          <label>{t('register.phone')}</label>
          <input type="tel" placeholder="+977 98XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="kd-fg">
          <label>{t('auth.password')}</label>
          <input
            type="password"
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
        <button className="kd-abtn" type="submit" disabled={busy}>
          {busy ? t('register.creating') : t('register.submit')}
        </button>
        <div className="kd-divider">{t('common.or')}</div>
        <GoogleButton />
        <div className="kd-as">
          {t('register.haveAccount')} <Link to="/login">{t('register.signIn')}</Link>
        </div>
      </form>
    </div>
  )
}
