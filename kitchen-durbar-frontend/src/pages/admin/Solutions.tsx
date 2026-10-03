import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../../api/client'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useCms } from '../../context/CmsContext'
import { useToast } from '../../context/ToastContext'
import type { CmsSolution } from '../../types'

const emptyForm = { title: '', title_ne: '', description: '', description_ne: '', display_order: '0', is_active: true }

/** The "Solutions for every service environment" cards on the homepage and /solutions. */
export default function AdminSolutions() {
  const toast = useToast()
  const { refresh } = useCms()
  const [items, setItems] = useState<CmsSolution[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CmsSolution | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function load() {
    api
      .get<CmsSolution[]>('/solutions')
      .then((res) => setItems(res.data))
      .catch((err) => {
        setItems([])
        toast(apiErrorMessage(err, 'Could not load solutions.'))
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

  function openEdit(item: CmsSolution) {
    setEditing(item)
    setForm({
      title: item.title,
      title_ne: item.title_ne,
      description: item.description,
      description_ne: item.description_ne,
      display_order: String(item.display_order),
      is_active: item.is_active,
    })
    setModalOpen(true)
  }

  async function save() {
    if (!form.title.trim() || !form.description.trim()) {
      toast('Please enter a title and description')
      return
    }
    setSaving(true)
    try {
      const body = {
        title: form.title.trim(),
        title_ne: form.title_ne.trim(),
        description: form.description.trim(),
        description_ne: form.description_ne.trim(),
        display_order: Math.max(0, Number(form.display_order) || 0),
        is_active: form.is_active,
      }
      if (editing) await api.patch(`/solutions/${editing.id}`, body)
      else await api.post('/solutions', body)
      setModalOpen(false)
      afterChange()
      toast('Solution saved!')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not save solution'))
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!deleteId) return
    try {
      await api.delete(`/solutions/${deleteId}`)
      afterChange()
      toast('Solution deleted')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not delete solution'))
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <h2>Solutions</h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 15, marginTop: 6 }}>
            The “Solutions for every service environment” cards on the homepage and the Solutions page.
          </p>
        </div>
        <button className="kd-btn kd-btn-p" onClick={openAdd}>
          + Add Solution
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="kd-tb2">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Order</th>
              <th>Status</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 24 }}>
                  No solutions yet
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <b>{item.title}</b>
                </td>
                <td style={{ maxWidth: 420 }}>{item.description}</td>
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
          <h3>{editing ? 'Edit Solution' : 'Add Solution'}</h3>
          <div className="kd-fg">
            <label>Title</label>
            <input
              type="text"
              placeholder="e.g. Cloud Kitchen"
              maxLength={100}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="kd-fg">
            <label>Title in Nepali (optional)</label>
            <input type="text" maxLength={100} value={form.title_ne} onChange={(e) => setForm({ ...form, title_ne: e.target.value })} />
          </div>
          <div className="kd-fg">
            <label>Description</label>
            <textarea rows={3} maxLength={300} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="kd-fg">
            <label>Description in Nepali (optional)</label>
            <textarea
              rows={3}
              maxLength={300}
              value={form.description_ne}
              onChange={(e) => setForm({ ...form, description_ne: e.target.value })}
            />
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
              {saving ? 'Saving...' : 'Save Solution'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete solution"
        message="Are you sure you want to delete this solution card? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
