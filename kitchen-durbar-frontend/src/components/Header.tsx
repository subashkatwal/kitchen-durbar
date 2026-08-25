import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function Header() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  function handleLogout() {
    logout()
    toast('Logged out successfully')
    navigate('/')
  }

  return (
    <div className="kd-h">
      <Link to="/" className="kd-l">
        <img src={logo} alt="Kitchen Durbar" className="kd-logo-img" />
        Kitchen Durbar
      </Link>

      <div className="kd-h-actions">
        <nav className={`kd-n${menuOpen ? ' open' : ''}`}>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/products">Products</NavLink>
          {user?.is_staff && <NavLink to="/admin">Admin</NavLink>}
          {user ? <a onClick={handleLogout}>Logout</a> : <NavLink to="/login">Login</NavLink>}
        </nav>

        <button className="kd-cb" onClick={() => navigate('/cart')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6h15l-1.5 9h-12z" />
            <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
            <path d="M6 6L5 3H2" />
          </svg>
          Cart
          <span className="kd-cc">{count}</span>
        </button>

        <button
          className="kd-menu-btn"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && <div className="kd-n-backdrop" onClick={() => setMenuOpen(false)} />}
    </div>
  )
}
