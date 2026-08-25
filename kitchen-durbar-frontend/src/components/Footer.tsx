import { Link, useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  function goCategory(category: string) {
    navigate(`/products?category=${encodeURIComponent(category)}`)
  }

  return (
    <div className="kd-ft">
      <div className="kd-ft-in">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#e94560" />
              <path d="M8 16 L20 10 L32 16 L20 22 Z" stroke="white" strokeWidth="2.5" fill="none" />
              <path d="M8 24 L20 18 L32 24 L20 30 Z" stroke="white" strokeWidth="2.5" fill="none" />
            </svg>
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>Kitchen Durbar</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)' }}>
            Premium commercial kitchen appliances made to order in Nepal. Stainless steel equipment built for
            professional kitchens.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/login">Login</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div>
          <h4>Categories</h4>
          <a onClick={() => goCategory('Burner')}>Burners</a>
          <a onClick={() => goCategory('Table')}>Tables</a>
          <a onClick={() => goCategory('Chiller')}>Chillers</a>
          <a onClick={() => goCategory('Sink')}>Sinks</a>
        </div>
        <div>
          <h4>Contact</h4>
          <a>Kathmandu, Nepal</a>
          <a>WhatsApp: +977 9769400796</a>
          <a>info@kitchendurbar.com</a>
        </div>
      </div>
      <div className="kd-ft-bt">&copy; 2026 Kitchen Durbar Solution. All rights reserved.</div>
    </div>
  )
}
