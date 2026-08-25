import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../../api/client'
import Select from '../../components/Select'
import { useToast } from '../../context/ToastContext'
import { CATEGORIES, type Category, type Product } from '../../types'

const emptyForm = { name: '', category: 'Burner' as Category, price: '', description: '' }

export default function AdminProducts() {
  const toast = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  function load() {
    api.get<Product[]>('/products').then((res) => setProducts(res.data)).catch(() => setProducts([]))
  }

  useEffect(load, [])

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({ name: p.name, category: p.category, price: String(p.price), description: p.description })
    setModalOpen(true)
  }

  async function save() {
    if (!form.name.trim() || !form.price) {
      toast('Please fill required fields')
      return
    }
    setSaving(true)
    try {
      const payload = { name: form.name.trim(), category: form.category, price: form.price, description: form.description.trim() }
      if (editing) {
        await api.patch(`/products/${editing.id}`, payload)
      } else {
        await api.post('/products', payload)
      }
      setModalOpen(false)
      load()
      toast('Product saved!')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not save product'))
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      load()
      toast('Product deleted')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not delete product'))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Product Management</h2>
        <button className="kd-btn kd-btn-p" style={{ padding: '10px 20px', fontSize: 14 }} onClick={openAdd}>
          + Add Product
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="kd-tb2">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price (NPR)</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>
                  <span className="kd-bg kd-bgs">{p.category}</span>
                </td>
                <td style={{ fontWeight: 700 }}>NPR {Number(p.price).toLocaleString()}</td>
                <td>
                  <button className="kd-btn kd-btn-o" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => openEdit(p)}>
                    Edit
                  </button>{' '}
                  <button className="kd-btn kd-btn-d" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => remove(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`kd-mo${modalOpen ? ' active' : ''}`}>
        <div className="kd-md">
          <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
          <div className="kd-fg">
            <label>Product Name</label>
            <input
              type="text"
              placeholder="e.g. 4-Burner Gas Range"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="kd-fg">
            <label>Category</label>
            <Select
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v as Category })}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>
          <div className="kd-fg">
            <label>Price (NPR)</label>
            <input type="number" placeholder="45000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className="kd-fg">
            <label>Description</label>
            <input
              type="text"
              placeholder="Short product description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="kd-btn kd-btn-o" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="kd-btn kd-btn-p" style={{ padding: '10px 24px', fontSize: 14 }} onClick={save} disabled={saving}>
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
