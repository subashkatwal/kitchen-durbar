import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../../api/client'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useCms } from '../../context/CmsContext'
import { useToast } from '../../context/ToastContext'
import type { CmsProject } from '../../types'

const emptyForm = {
  title: '',
  title_ne: '',
  sector: '',
  sector_ne: '',
  display_order: '0',
  show_on_home: true,
  is_active: true,
}

export default function AdminProjects() {
  const toast = useToast()
  const { refresh } = useCms()
  const [projects, setProjects] = useState<CmsProject[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CmsProject | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function load() {
    api
      .get<CmsProject[]>('/projects')
      .then((res) => setProjects(res.data))
      .catch((err) => {
        setProjects([])
        toast(apiErrorMessage(err, 'Could not load projects.'))
      })
  }

  useEffect(load, [])

  function afterChange() {
    load()
    refresh() // storefront picks the change up without a reload
  }

  function openAdd() {
    setEditing(null)
    setForm({ ...emptyForm, display_order: String(projects.length) })
    setImageFile(null)
    setImagePreview('')
    setModalOpen(true)
  }

  function openEdit(p: CmsProject) {
    setEditing(p)
    setForm({
      title: p.title,
      title_ne: p.title_ne,
      sector: p.sector,
      sector_ne: p.sector_ne,
      display_order: String(p.display_order),
      show_on_home: p.show_on_home,
      is_active: p.is_active,
    })
    setImageFile(null)
    setImagePreview(p.image)
    setModalOpen(true)
  }

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setImageFile(file)
    setImagePreview(file ? URL.createObjectURL(file) : editing?.image || '')
  }

  async function save() {
    if (!form.title.trim() || !form.sector.trim()) {
      toast('Please enter a title and sector')
      return
    }
    if (!editing && !imageFile) {
      toast('Please choose a project photo')
      return
    }
    setSaving(true)
    try {
      const fields = {
        title: form.title.trim(),
        title_ne: form.title_ne.trim(),
        sector: form.sector.trim(),
        sector_ne: form.sector_ne.trim(),
        display_order: Math.max(0, Number(form.display_order) || 0),
        show_on_home: form.show_on_home,
        is_active: form.is_active,
      }
      // Multipart only when a new photo was picked - a JSON PATCH keeps the old one.
      let body: FormData | typeof fields
      if (imageFile) {
        body = new FormData()
        for (const [k, v] of Object.entries(fields)) body.append(k, String(v))
        body.append('image', imageFile)
      } else {
        body = fields
      }
      if (editing) await api.patch(`/projects/${editing.id}`, body)
      else await api.post('/projects', body)
      setModalOpen(false)
      afterChange()
      toast('Project saved!')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not save project'))
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!deleteId) return
    try {
      await api.delete(`/projects/${deleteId}`)
      afterChange()
      toast('Project deleted')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not delete project'))
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <h2>Projects</h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 15, marginTop: 6 }}>
            Completed kitchens shown on the Projects page. The first 4 marked “Homepage” also appear on the homepage.
          </p>
        </div>
        <button className="kd-btn kd-btn-p" onClick={openAdd}>
          + Add Project
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="kd-tb2">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Sector</th>
              <th>Order</th>
              <th>Homepage</th>
              <th>Status</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 24 }}>
                  No projects yet - add your first completed kitchen.
                </td>
              </tr>
            )}
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.image} alt={p.title} style={{ width: 72, height: 46, objectFit: 'cover' }} />
                </td>
                <td style={{ fontWeight: 600 }}>{p.title}</td>
                <td>{p.sector}</td>
                <td>{p.display_order}</td>
                <td>{p.show_on_home && <span className="kd-bg kd-bgs">Yes</span>}</td>
                <td>
                  <span className={`kd-bg ${p.is_active ? 'kd-bgs' : 'kd-bgd'}`}>{p.is_active ? 'Visible' : 'Hidden'}</span>
                </td>
                <td>
                  <button className="kd-btn kd-btn-o" style={{ padding: '6px 12px' }} onClick={() => openEdit(p)}>
                    Edit
                  </button>{' '}
                  <button className="kd-btn kd-btn-d" style={{ padding: '6px 12px' }} onClick={() => setDeleteId(p.id)}>
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
          <h3>{editing ? 'Edit Project' : 'Add Project'}</h3>
          <div className="kd-fg">
            <label>Title</label>
            <input type="text" placeholder="e.g. Luxury Hotel Kitchen" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="kd-fg">
            <label>Title in Nepali (optional)</label>
            <input type="text" value={form.title_ne} onChange={(e) => setForm({ ...form, title_ne: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="kd-fg">
              <label>Sector</label>
              <input type="text" placeholder="e.g. Hotel" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} />
            </div>
            <div className="kd-fg">
              <label>Sector (Nepali)</label>
              <input type="text" placeholder="e.g. होटल" value={form.sector_ne} onChange={(e) => setForm({ ...form, sector_ne: e.target.value })} />
            </div>
          </div>
          <div className="kd-fg">
            <label>Display order (lower first)</label>
            <input type="number" min={0} value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} />
          </div>
          <div className="kd-fg">
            <label>Photo</label>
            <input type="file" accept="image/*" onChange={onPickImage} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" style={{ marginTop: 10, width: 200, aspectRatio: '16 / 9', objectFit: 'cover', border: '1px solid var(--border)' }} />
            )}
          </div>
          <div className="kd-fg">
            <label className="kd-chk">
              <input type="checkbox" checked={form.show_on_home} onChange={(e) => setForm({ ...form, show_on_home: e.target.checked })} />
              Show on the homepage
            </label>
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
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete project"
        message="Are you sure you want to delete this project? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
