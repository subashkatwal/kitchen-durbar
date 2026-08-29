import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, apiErrorMessage } from '../api/client'
import { Icon } from '../components/icons'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import type { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const toast = useToast()
  const { t } = useLanguage()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setError('')
    api
      .get<Product>(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        const status = axios.isAxiosError(err) ? err.response?.status : undefined
        setError(status === 404 ? t('product.notFound') : apiErrorMessage(err, t('product.loadError')))
      })
  }, [id, t])

  if (error) {
    return (
      <div className="kd-pg active">
        <div className="kd-em">
          <p>{error}</p>
          <Link to="/products" className="kd-btn kd-btn-p" style={{ marginTop: 16, display: 'inline-flex' }}>
            {t('product.backToProducts')}
          </Link>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="kd-pg active">
      <div className="kd-pd">
        <div className="kd-pdi">
          {product.image ? <img src={product.image} alt={product.name} /> : <Icon name={product.icon} />}
        </div>
        <div>
          <div style={{ color: 'var(--ka)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            {product.category}
          </div>
          <div className="kd-pdh">{product.name}</div>
          <div className="kd-pdp">NPR {Number(product.price).toLocaleString()}</div>
          <div className="kd-pdd">{product.description}</div>
          <div className="kd-pmeta">
            <span>
              <strong>{t('product.material')}</strong> {t('product.materialValue')}
            </span>
            <span>
              <strong>{t('product.delivery')}</strong> {t('product.deliveryValue')}
            </span>
            <span>
              <strong>{t('product.warranty')}</strong> {t('product.warrantyValue')}
            </span>
            <span>
              <strong>{t('product.customization')}</strong> {t('product.customizationValue')}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="kd-btn kd-btn-p"
              onClick={() => {
                addItem(product)
                toast(t('product.addedToCart'))
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
                <path d="M6 6L5 3H2" />
              </svg>
              {t('product.addToCart')}
            </button>
            <button className="kd-btn kd-btn-o" onClick={() => navigate('/products')}>
              {t('product.backToProducts')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
