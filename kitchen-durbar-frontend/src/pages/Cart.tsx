import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, apiErrorMessage } from '../api/client'
import { Icon } from '../components/icons'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { buildOrderWhatsAppLink } from '../lib/whatsapp'
import type { Order } from '../types'

export default function Cart() {
  const { items, subtotal, shipping, total, updateQty, removeItem, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [placing, setPlacing] = useState(false)

  async function checkout() {
    if (!user) {
      toast('Please login first')
      navigate('/login')
      return
    }
    if (!items.length) {
      toast('Your cart is empty')
      return
    }
    setPlacing(true)
    try {
      const payload = { items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })) }
      const { data: order } = await api.post<Order>('/orders', payload)
      clear()
      // Open WhatsApp immediately with the order + the customer's registered
      // name/phone pre-filled — no extra click needed. The confirmation page
      // still shows the same link as a fallback in case this popup was blocked.
      window.open(buildOrderWhatsAppLink(order, user), '_blank', 'noopener,noreferrer')
      navigate('/checkout/confirmation', { state: { order } })
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not place order'))
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="kd-pg active">
      <div className="kd-b">
        <div className="kd-st">Shopping Cart</div>
        {!items.length ? (
          <div className="kd-em">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M6 6L5 3H2" />
            </svg>
            <p>Your cart is empty.</p>
            <button className="kd-btn kd-btn-p" style={{ marginTop: 16 }} onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="kd-cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            <div>
              {items.map((i) => (
                <div className="kd-ci" key={i.id}>
                  <div className="kd-cii">
                    <Icon name={i.icon} />
                  </div>
                  <div className="kd-cin">
                    <div className="kd-cin-name">{i.name}</div>
                    <div className="kd-cin-price">NPR {i.price.toLocaleString()}</div>
                    <div className="kd-qc">
                      <button onClick={() => updateQty(i.id, -1)}>−</button>
                      <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{i.quantity}</span>
                      <button onClick={() => updateQty(i.id, 1)}>+</button>
                    </div>
                  </div>
                  <button className="kd-btn kd-btn-o" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => removeItem(i.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="kd-cs">
              <h3>Order Summary</h3>
              <div className="kd-cr">
                <span>Subtotal</span>
                <span>NPR {subtotal.toLocaleString()}</span>
              </div>
              <div className="kd-cr">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `NPR ${shipping.toLocaleString()}`}</span>
              </div>
              <div className="kd-cr t">
                <span>Total</span>
                <span>NPR {total.toLocaleString()}</span>
              </div>
              <button
                className="kd-btn kd-btn-p"
                style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}
                onClick={checkout}
                disabled={placing}
              >
                {placing ? 'Placing Order...' : 'Proceed to Payment'}
              </button>
              <p style={{ fontSize: 12, color: 'var(--ktm)', marginTop: 12, textAlign: 'center' }}>
                All products are made to order. Delivery in 7-14 days.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
