import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { Icon } from '../components/icons'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import type { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const toast = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    api
      .get<Product>(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) {
    return (
      <div className="kd-pg active">
        <div className="kd-em">
          <p>Product not found.</p>
          <Link to="/products" className="kd-btn kd-btn-p" style={{ marginTop: 16, display: 'inline-flex' }}>
            Back to Products
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
          <Icon name={product.icon} />
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
              <strong>Material:</strong> Stainless Steel 304 Grade
            </span>
            <span>
              <strong>Delivery:</strong> 7-14 business days (Made to Order)
            </span>
            <span>
              <strong>Warranty:</strong> 1 Year Manufacturer Warranty
            </span>
            <span>
              <strong>Customization:</strong> Available on request
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="kd-btn kd-btn-p"
              onClick={() => {
                addItem(product)
                toast('Added to cart!')
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
                <path d="M6 6L5 3H2" />
              </svg>
              Add to Cart
            </button>
            <button className="kd-btn kd-btn-o" onClick={() => navigate('/products')}>
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
