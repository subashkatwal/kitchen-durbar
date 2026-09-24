import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../../api/client'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useCms } from '../../context/CmsContext'
import { useToast } from '../../context/ToastContext'
import type { CmsTestimonial } from '../../types'

const emptyForm = { quote: '', quote_ne: '', source: '', source_ne: '', display_order: '0', is_active: true }

export default function AdminTestimonials() {
  const toast = useToast()
  const { refresh } = useCms()
  const [items, setItems] = useState<CmsTestimonial[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CmsTestimonial | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function load() {
    api
      .get<CmsTestimonial[]>('/testimonials')
      .then((res) => setItems(res.data))
      .catch((err) => {
        setItems([])
        toast(apiErrorMessage(err, 'Could not load testimonials.'))
      })
  }

  useEffect(load, [])

  function afterChange() {
    load()
    refresh()
  }

  function openAdd() {
    setEditing(null)
    setForm({ ...emptyForm, display_order: String(items.length) })
    setModalOpen(true)
  }

  function openEdit(item: CmsTestimonial) {
    setEditing(item)
    setForm({
      quote: item.quote,
      quote_ne: item.quote_ne,
      source: item.source,
      source_ne: item.source_ne,
      display_order: String(item.display_order),
      is_active: item.is_active,
    })
    setModalOpen(true)
  }

  async function save() {
    if (!form.quote.trim() || !form.source.trim()) {
      toast('Please enter the quote and who it is from')
      return
    }
    setSaving(true)
    try {
      const body = {
        quote: form.quote.trim(),
        quote_ne: form.quote_ne.trim(),
        source: form.source.trim(),
        source_ne: form.source_ne.trim(),
        display_order: Math.max(0, Number(form.display_order) || 0),
        is_active: form.is_active,
      }
      if (editing) await api.patch(`/testimonials/${editing.id}`, body)
      else await api.post('/testimonials', body)
      setModalOpen(false)
      afterChange()
      toast('Testimonial saved!')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not save testimonial'))
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!deleteId) return
    try {
      await api.delete(`/testimonials/${deleteId}`)
      afterChange()
      toast('Testimonial deleted')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not delete testimonial'))
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <h2>Testimonials</h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 15, marginTop: 6 }}>
            Client quotes for the homepage “Client perspective” section. It stays hidden until at least one is visible.
          </p>
        </div>
        <button className="kd-btn kd-btn-p" onClick={openAdd}>
          + Add Testimonial
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="kd-tb2">
          <thead>
            <tr>
              <th>Quote</th>
              <th>From</th>
              <th>Order</th>
              <th>Status</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 24 }}>
                  No testimonials yet
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ maxWidth: 420 }}>“{item.quote}”</td>
                <td>{item.source}</td>
                <td>{item.display_order}</td>
                <td>
                  <span className={`kd-bg ${item.is_active ? 'kd-bgs' : 'kd-bgd'}`}>{item.is_active ? 'Visible' : 'Hidden'}</span>
                </td>
                <td>
                  <button className="kd-btn kd-btn-o" style={{ padding: '6px 12px' }} onClick={() => openEdit(item)}>
                    Edit
                  </button>{' '}
                  <button className="kd-btn kd-btn-d" style={{ padding: '6px 12px' }} onClick={() => setDeleteId(item.id)}>
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
          <h3>{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
          <div className="kd-fg">
            <label>Quote</label>
            <textarea rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
          </div>
          <div className="kd-fg">
            <label>Quote in Nepali (optional)</label>
            <textarea rows={3} value={form.quote_ne} onChange={(e) => setForm({ ...form, quote_ne: e.target.value })} />
          </div>
          <div className="kd-fg">
            <label>From</label>
            <input
              type="text"
              placeholder="e.g. Hotel client · Kathmandu"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />
          </div>
          <div className="kd-fg">
            <label>From (Nepali, optional)</label>
            <input type="text" value={form.source_ne} onChange={(e) => setForm({ ...form, source_ne: e.target.value })} />
          </div>
          <div className="kd-fg">
            <label>Display order (lower first)</label>
            <input type="number" min={0} value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} />
          </div>
          <div className="kd-fg">
            <label className="kd-chk">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              Visible on the website
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="kd-btn kd-btn-o" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="kd-btn kd-btn-p" onClick={save} disabled={saving}>
              {saving ? 'Saving...' : 'Save Testimonial'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete testimonial"
        message="Are you sure you want to delete this testimonial? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
