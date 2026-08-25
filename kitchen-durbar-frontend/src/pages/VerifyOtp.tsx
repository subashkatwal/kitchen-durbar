import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { apiErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import type { OTPPurpose } from '../types'

const RESEND_COOLDOWN = 60

export default function VerifyOtp() {
  const { verifySignupOtp, verifyResetOtp, resetPassword, requestOtp } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
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
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => window.clearTimeout(t)
  }, [cooldown])

  if (!email) {
    return (
      <div className="kd-pg active">
        <div className="kd-a">
          <h2>Verification Link Invalid</h2>
          <p className="kd-a-sub">We couldn't find an email to verify. Please start again.</p>
          <div className="kd-as">
            <Link to={purpose === 'reset' ? '/forgot-password' : '/register'}>Go back</Link>
          </div>
        </div>
      </div>
    )
  }

  async function handleVerifyCode(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (code.trim().length !== 6) {
      setError('Please enter the 6-digit code from your email.')
      return
    }

    setBusy(true)
    try {
      if (purpose === 'signup') {
        await verifySignupOtp(email, code.trim())
        toast('Account verified! Welcome to Kitchen Durbar.')
        navigate('/')
      } else {
        await verifyResetOtp(email, code.trim())
        setStep('password')
      }
    } catch (err) {
      setError(apiErrorMessage(err, 'That code is invalid or has expired. Please request a new one.'))
    } finally {
      setBusy(false)
    }
  }

  async function handleSetNewPassword(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setBusy(true)
    try {
      await resetPassword(email, code.trim(), newPassword)
      toast('Password updated! Please sign in.')
      navigate('/login')
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not update your password. Please try again.'))
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
      toast('A new code has been sent to your email.')
      setCooldown(RESEND_COOLDOWN)
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not resend the code. Please try again shortly.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="kd-pg active">
      <form className="kd-a" onSubmit={step === 'code' ? handleVerifyCode : handleSetNewPassword}>
        <h2>{purpose === 'signup' ? 'Verify Your Email' : 'Reset Your Password'}</h2>
        <p className="kd-a-sub">
          {step === 'code' ? (
            <>
              We sent a 6-digit code to <strong>{email}</strong>. Enter it below to{' '}
              {purpose === 'signup' ? 'activate your account.' : 'continue resetting your password.'}
            </>
          ) : (
            'Code verified. Choose a new password below.'
          )}
        </p>
        {error && <div className="kd-err">{error}</div>}

        {step === 'code' ? (
          <>
            <div className="kd-fg">
              <label>Verification Code</label>
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
              {busy ? 'Verifying...' : 'Verify Code'}
            </button>
            <div className="kd-as">
              Didn't get a code?{' '}
              <button type="button" className="kd-resend" onClick={handleResend} disabled={cooldown > 0 || busy}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="kd-fg">
              <label>New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
                autoFocus
              />
            </div>
            <div className="kd-fg">
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <button className="kd-abtn" type="submit" disabled={busy}>
              {busy ? 'Updating...' : 'Update Password'}
            </button>
          </>
        )}

        <div className="kd-as">
          <Link to="/login">Back to Sign In</Link>
        </div>
      </form>
    </div>
  )
}
