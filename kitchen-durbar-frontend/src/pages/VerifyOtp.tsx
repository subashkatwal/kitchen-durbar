import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { apiErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import type { OTPPurpose } from '../types'

const RESEND_COOLDOWN = 60

export default function VerifyOtp() {
  const { verifySignupOtp, verifyResetOtp, resetPassword, requestOtp } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()

  const email = searchParams.get('email') || ''
  const purpose: OTPPurpose = searchParams.get('purpose') === 'reset' ? 'reset' : 'signup'

  const [code, setCode] = useState('')
  const [step, setStep] = useState<'code' | 'password'>('code')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [cooldown])

  if (!email) {
    return (
      <div className="kd-pg active">
        <div className="kd-a">
          <h2>{t('verifyOtp.invalidTitle')}</h2>
          <p className="kd-a-sub">{t('verifyOtp.invalidSubtitle')}</p>
          <div className="kd-as">
            <Link to={purpose === 'reset' ? '/forgot-password' : '/register'}>{t('verifyOtp.goBack')}</Link>
          </div>
        </div>
      </div>
    )
  }

  async function handleVerifyCode(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (code.trim().length !== 6) {
      setError(t('verifyOtp.codeRequired'))
      return
    }

    setBusy(true)
    try {
      if (purpose === 'signup') {
        await verifySignupOtp(email, code.trim())
        toast(t('verifyOtp.signupSuccess'))
        navigate('/')
      } else {
        await verifyResetOtp(email, code.trim())
        setStep('password')
      }
    } catch (err) {
      setError(apiErrorMessage(err, t('verifyOtp.codeInvalid')))
    } finally {
      setBusy(false)
    }
  }

  async function handleSetNewPassword(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError(t('auth.passwordTooShort'))
      return
    }
    if (newPassword !== confirmPassword) {
      setError(t('verifyOtp.passwordsMismatch'))
      return
    }

    setBusy(true)
    try {
      await resetPassword(email, code.trim(), newPassword)
      toast(t('verifyOtp.resetSuccess'))
      navigate('/login')
    } catch (err) {
      setError(apiErrorMessage(err, t('verifyOtp.resetError')))
    } finally {
      setBusy(false)
    }
  }

  async function handleResend() {
    if (cooldown > 0 || busy) return
    setError('')
    setBusy(true)
    try {
      await requestOtp(email, purpose)
      toast(t('verifyOtp.resent'))
      setCooldown(RESEND_COOLDOWN)
    } catch (err) {
      setError(apiErrorMessage(err, t('verifyOtp.resendError')))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="kd-pg active">
      <form className="kd-a" onSubmit={step === 'code' ? handleVerifyCode : handleSetNewPassword}>
        <h2>{purpose === 'signup' ? t('verifyOtp.signupTitle') : t('verifyOtp.resetTitle')}</h2>
        <p className="kd-a-sub">
          {step === 'code' ? (
            <>
              {t('verifyOtp.codeSentPrefix')} <strong>{email}</strong>. {t('verifyOtp.enterBelowTo')}{' '}
              {purpose === 'signup' ? t('verifyOtp.activateAccount') : t('verifyOtp.continueReset')}
            </>
          ) : (
            t('verifyOtp.codeVerified')
          )}
        </p>
        {error && <div className="kd-err">{error}</div>}

        {step === 'code' ? (
          <>
            <div className="kd-fg">
              <label>{t('verifyOtp.code')}</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                className="kd-otp-input"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                autoFocus
              />
            </div>
            <button className="kd-abtn" type="submit" disabled={busy}>
              {busy ? t('verifyOtp.verifying') : t('verifyOtp.verify')}
            </button>
            <div className="kd-as">
              {t('verifyOtp.noCode')}{' '}
              <button type="button" className="kd-resend" onClick={handleResend} disabled={cooldown > 0 || busy}>
                {cooldown > 0 ? t('verifyOtp.resendIn', { n: cooldown }) : t('verifyOtp.resend')}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="kd-fg">
              <label>{t('verifyOtp.newPassword')}</label>
              <input
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
                autoFocus
              />
            </div>
            <div className="kd-fg">
              <label>{t('verifyOtp.confirmNewPassword')}</label>
              <input
                type="password"
                placeholder={t('verifyOtp.confirmPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <button className="kd-abtn" type="submit" disabled={busy}>
              {busy ? t('verifyOtp.updating') : t('verifyOtp.updatePassword')}
            </button>
          </>
        )}

        <div className="kd-as">
          <Link to="/login">{t('verifyOtp.backToSignIn')}</Link>
        </div>
      </form>
    </div>
  )
}
