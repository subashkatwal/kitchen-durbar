import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function ForgotPassword() {
  const { requestOtp } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const trimmed = email.trim()
    if (!trimmed) {
      setError('Please enter your email address.')
      return
    }

    setBusy(true)
    try {
      await requestOtp(trimmed, 'reset')
      toast('If an account exists for this email, a code has been sent.')
      navigate(`/verify-otp?email=${encodeURIComponent(trimmed)}&purpose=reset`)
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not send the reset code. Please try again.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="kd-pg active">
      <form className="kd-a" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <p className="kd-a-sub">Enter your account email and we'll send you a code to reset your password.</p>
        {error && <div className="kd-err">{error}</div>}
        <div className="kd-fg">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="kd-abtn" type="submit" disabled={busy}>
          {busy ? 'Sending Code...' : 'Send Reset Code'}
        </button>
        <div className="kd-as">
          Remembered your password? <Link to="/login">Sign In</Link>
        </div>
      </form>
    </div>
  )
}
