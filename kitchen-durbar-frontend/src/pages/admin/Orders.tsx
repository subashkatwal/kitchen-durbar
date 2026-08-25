import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../../api/client'
import { useToast } from '../../context/ToastContext'
import { ORDER_STATUSES, type Order, type OrderStatus } from '../../types'

export default function AdminOrders() {
  const toast = useToast()
  const [orders, setOrders] = useState<Order[]>([])

  function load() {
    api
      .get<Order[]>('/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => {
        setOrders([])
        toast(apiErrorMessage(err, 'Could not load orders.'))
      })
  }

  useEffect(load, [])

  async function updateStatus(order: Order, status: OrderStatus) {
    try {
      await api.patch(`/orders/${order.id}`, { status })
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)))
      toast('Order status updated')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not update order'))
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Order Management</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="kd-tb2">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--ktm)', padding: 20 }}>
                  No orders yet
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>#{o.id.slice(0, 8)}</td>
                <td>{o.user_name || o.user_email}</td>
                <td>{o.items.length} items</td>
                <td style={{ fontWeight: 700 }}>NPR {Number(o.total).toLocaleString()}</td>
                <td>
                  <select className="kd-stsel" value={o.status} onChange={(e) => updateStatus(o, e.target.value as OrderStatus)}>
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
