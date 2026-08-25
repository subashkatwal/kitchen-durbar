import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import ProductCard from '../components/ProductCard'
import { Icon } from '../components/icons'
import { CATEGORIES, type Product } from '../types'

export default function Home() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    api
      .get<Product[]>('/products', { params: { ordering: '-created_at' } })
      .then((res) => setFeatured(res.data.slice(0, 6)))
      .catch(() => setFeatured([]))
  }, [])

  return (
    <div className="kd-pg active">
      <div className="kd-hr">
        <h1>Commercial Kitchen Appliances</h1>
        <p>Premium stainless steel equipment custom-made to your specifications. Built to order, built to last.</p>
        <div className="kd-hr-btns">
          <button className="kd-btn kd-btn-p" onClick={() => navigate('/products')}>
            Browse Products
          </button>
          <button className="kd-btn kd-btn-s" onClick={() => navigate('/register')}>
            Get Started
          </button>
        </div>
      </div>
      <div className="kd-b">
        <div className="kd-st">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Browse by Category
        </div>
        <div className="kd-cg">
          {CATEGORIES.map((c) => (
            <div key={c} className="kd-ccard" onClick={() => navigate(`/products?category=${c}`)}>
              <div style={{ color: 'var(--ka)' }}>
                <Icon name={c.toLowerCase()} />
              </div>
              <span>{c}</span>
            </div>
          ))}
        </div>
        <div className="kd-st">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Featured Products
        </div>
        <div className="kd-pg2">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
