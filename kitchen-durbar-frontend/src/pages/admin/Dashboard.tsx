import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import type { Enquiry, Order, Product, User } from '../../types'

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])

  useEffect(() => {
    api.get<Product[]>('/products').then((res) => setProducts(res.data)).catch(() => setProducts([]))
    api.get<User[]>('/users').then((res) => setUsers(res.data)).catch(() => setUsers([]))
    api.get<Order[]>('/orders').then((res) => setOrders(res.data)).catch(() => setOrders([]))
    api.get<Enquiry[]>('/enquiries').then((res) => setEnquiries(res.data)).catch(() => setEnquiries([]))
  }, [])

  const revenue = orders.reduce((s, o) => s + Number(o.total), 0)
  const recent = [...orders].slice(0, 5)

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard Overview</h2>
      <div className="kd-sg">
        <div className="kd-sc">
          <h4>Total Products</h4>
          <div className="v">{products.length}</div>
        </div>
        <div className="kd-sc">
          <h4>Total Users</h4>
          <div className="v">{users.length}</div>
        </div>
        <div className="kd-sc">
          <h4>Total Orders</h4>
          <div className="v">{orders.length}</div>
        </div>
        <div className="kd-sc">
          <h4>Revenue (NPR)</h4>
          <div className="v">{revenue.toLocaleString()}</div>
        </div>
        <div className="kd-sc">
          <h4>New Enquiries</h4>
          <div className="v">{enquiries.filter((e) => !e.is_handled).length}</div>
        </div>
      </div>
      <div className="kd-panel">
        <h3 style={{ marginBottom: 16, fontSize: 28 }}>Recent Orders</h3>
        {recent.length ? (
          recent.map((o) => (
            <div
              key={o.id}
              style={{
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{ fontWeight: 600, flex: 1 }}>{o.user_name || o.user_email}</span>
              <span>NPR {Number(o.total).toLocaleString()}</span>
              <span className="kd-bg kd-bgw">{o.status}</span>
              <span style={{ color: 'var(--muted-foreground)', fontSize: 13 }}>{new Date(o.created_at).toLocaleDateString()}</span>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>No orders yet.</p>
        )}
      </div>
    </div>
  )
}
