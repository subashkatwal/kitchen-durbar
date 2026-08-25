import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiErrorMessage } from '../api/client'
import GoogleButton from '../components/GoogleButton'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError('Please enter your email and password.')
      return
    }

    setBusy(true)
    try {
      await login(trimmedEmail, password)
      toast('Welcome back!')
      navigate('/')
    } catch (err) {
      setError(apiErrorMessage(err, 'Incorrect email or password. Please try again.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="kd-pg active">
      <form className="kd-a" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        {error && <div className="kd-err">{error}</div>}
        <div className="kd-fg">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="kd-fg">
          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="kd-as" style={{ marginTop: -8, marginBottom: 18, textAlign: 'right' }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <button className="kd-abtn" type="submit" disabled={busy}>
          {busy ? 'Signing In...' : 'Sign In'}
        </button>
        <div className="kd-divider">or</div>
        <GoogleButton />
        <div className="kd-as">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  )
}
