import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const navigate = useNavigate()
  const { t } = useLanguage()

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
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)' }}>{t('footer.tagline')}</p>
        </div>
        <div>
          <h4>{t('footer.quickLinks')}</h4>
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/products">{t('nav.products')}</Link>
          <Link to="/login">{t('nav.login')}</Link>
          <Link to="/cart">{t('nav.cart')}</Link>
        </div>
        <div>
          <h4>{t('footer.categories')}</h4>
          <a onClick={() => goCategory('Burner')}>{t('footer.burners')}</a>
          <a onClick={() => goCategory('Table')}>{t('footer.tables')}</a>
          <a onClick={() => goCategory('Chiller')}>{t('footer.chillers')}</a>
          <a onClick={() => goCategory('Sink')}>{t('footer.sinks')}</a>
        </div>
        <div>
          <h4>{t('footer.contact')}</h4>
          <a>{t('footer.address')}</a>
          <a>{t('footer.whatsapp')}</a>
          <a>info@kitchendurbar.com</a>
        </div>
      </div>
      <div className="kd-ft-bt">{t('footer.copyright')}</div>
    </div>
  )
}
