import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiErrorMessage } from '../api/client'
import GoogleButton from '../components/GoogleButton'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await register({ full_name: fullName, email, phone, password })
      toast('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not create account'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="kd-pg active">
      <form className="kd-a" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        {error && <div className="kd-err">{error}</div>}
        <div className="kd-fg">
          <label>Full Name</label>
          <input type="text" placeholder="Ram Bahadur" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="kd-fg">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="kd-fg">
          <label>Phone</label>
          <input type="tel" placeholder="+977 98XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="kd-fg">
          <label>Password</label>
          <input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
        <button className="kd-abtn" type="submit" disabled={busy}>
          {busy ? 'Creating Account...' : 'Create Account'}
        </button>
        <div className="kd-divider">or</div>
        <GoogleButton />
        <div className="kd-as">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </form>
    </div>
  )
}
