import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../../api/client'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useToast } from '../../context/ToastContext'
import type { Advertisement } from '../../types'

const emptyForm = {
  title: '',
  link_url: '',
  is_active: true,
  start_date: '',
  end_date: '',
  priority: '0',
}

// <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm" in local time;
// the API gives/wants full ISO 8601 UTC strings - these two just bridge that.
function toInputValue(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fromInputValue(local: string): string | null {
  if (!local) return null
  return new Date(local).toISOString()
}

export default function AdminAds() {
  const toast = useToast()
  const [ads, setAds] = useState<Advertisement[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Advertisement | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function load() {
    api
      .get<Advertisement[]>('/promotions')
      .then((res) => setAds(res.data))
      .catch((err) => {
        setAds([])
        toast(apiErrorMessage(err, 'Could not load ads.'))
      })
  }

  useEffect(load, [])

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setImageFile(null)
    setImagePreview('')
    setModalOpen(true)
  }

  function openEdit(ad: Advertisement) {
    setEditing(ad)
    setForm({
      title: ad.title,
      link_url: ad.link_url,
      is_active: ad.is_active,
      start_date: toInputValue(ad.start_date),
      end_date: toInputValue(ad.end_date),
      priority: String(ad.priority),
    })
    setImageFile(null)
    setImagePreview(ad.image || '')
    setModalOpen(true)
  }

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setImageFile(file)
    setImagePreview(file ? URL.createObjectURL(file) : editing?.image || '')
  }

  async function save() {
    if (!form.title.trim()) {
      toast('Please enter a title')
      return
    }
    if (!editing && !imageFile) {
      toast('Please choose an image')
      return
    }
    setSaving(true)
    try {
      const startDate = fromInputValue(form.start_date)
      const endDate = fromInputValue(form.end_date)
      // Only switch to multipart when a new image was actually picked - a
      // plain JSON PATCH leaves the existing image untouched on edit.
      let body: FormData | Record<string, unknown>
      if (imageFile) {
        body = new FormData()
        body.append('title', form.title.trim())
        body.append('link_url', form.link_url.trim())
        body.append('is_active', String(form.is_active))
        if (startDate) body.append('start_date', startDate)
        if (endDate) body.append('end_date', endDate)
        body.append('priority', form.priority || '0')
        body.append('image', imageFile)
      } else {
        body = {
          title: form.title.trim(),
          link_url: form.link_url.trim(),
          is_active: form.is_active,
          start_date: startDate,
          end_date: endDate,
          priority: Number(form.priority || 0),
        }
      }
      if (editing) {
        await api.patch(`/promotions/${editing.id}`, body)
      } else {
        await api.post('/promotions', body)
      }
      setModalOpen(false)
      load()
      toast('Ad saved!')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not save ad'))
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!deleteId) return
    try {
      await api.delete(`/promotions/${deleteId}`)
      load()
      toast('Ad deleted')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not delete ad'))
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Ad Management</h2>
        <button className="kd-btn kd-btn-p" style={{ padding: '10px 20px', fontSize: 14 }} onClick={openAdd}>
          + Add Ad
        </button>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ktm)', marginTop: -12, marginBottom: 20 }}>
        The top 4 active ads (by priority, lowest first) show above the homepage hero - as a 2x2 grid on
        desktop/tablet, one at a time on mobile.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table className="kd-tb2">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Priority</th>
              <th>Window</th>
              <th>Active</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad.id}>
                <td>
                  <img src={ad.image} alt={ad.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                </td>
                <td style={{ fontWeight: 600 }}>{ad.title}</td>
                <td>{ad.priority}</td>
                <td style={{ fontSize: 12, color: 'var(--ktm)' }}>
                  {ad.start_date ? new Date(ad.start_date).toLocaleDateString() : 'Any time'}
                  {' → '}
                  {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : 'No expiry'}
                </td>
                <td>{ad.is_active && <span className="kd-bg kd-bgs">Active</span>}</td>
                <td>
                  <button className="kd-btn kd-btn-o" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => openEdit(ad)}>
                    Edit
                  </button>{' '}
                  <button className="kd-btn kd-btn-d" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => setDeleteId(ad.id)}>
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
          <h3>{editing ? 'Edit Ad' : 'Add Ad'}</h3>
          <div className="kd-fg">
            <label>Title (short promotional message)</label>
            <input
              type="text"
              placeholder="e.g. Summer Sale - 20% Off Sinks"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="kd-fg">
            <label>Link URL (optional)</label>
            <input
              type="text"
              placeholder="https://..."
              value={form.link_url}
              onChange={(e) => setForm({ ...form, link_url: e.target.value })}
            />
          </div>
          <div className="kd-fg">
            <label>Priority (lower shows first / earlier in the grid)</label>
            <input
              type="number"
              placeholder="0"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="kd-fg">
              <label>Starts (optional)</label>
              <input
                type="datetime-local"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div className="kd-fg">
              <label>Ends (optional)</label>
              <input
                type="datetime-local"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>
          <div className="kd-fg">
            <label>Ad Image (banner - shown at its own natural aspect ratio, not cropped)</label>
            <input type="file" accept="image/*" onChange={onPickImage} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ marginTop: 10, maxWidth: 260, maxHeight: 140, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--kbd)' }}
              />
            )}
          </div>
          <div className="kd-fg">
            <label className="kd-chk">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Active (shown on the homepage)
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="kd-btn kd-btn-o" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="kd-btn kd-btn-p" style={{ padding: '10px 24px', fontSize: 14 }} onClick={save} disabled={saving}>
              {saving ? 'Saving...' : 'Save Ad'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete ad"
        message="Are you sure you want to delete this ad? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
