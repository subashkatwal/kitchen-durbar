import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../../api/client'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useToast } from '../../context/ToastContext'
import type { TeamMember } from '../../types'

const emptyForm = { name: '', role: '', bio: '', display_order: '0', is_active: true }

export default function AdminTeam() {
  const toast = useToast()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function load() {
    api
      .get<TeamMember[]>('/team')
      .then((res) => setMembers(res.data))
      .catch((err) => {
        setMembers([])
        toast(apiErrorMessage(err, 'Could not load team members.'))
      })
  }

  useEffect(load, [])

  function openAdd() {
    setEditing(null)
    setForm({ ...emptyForm, display_order: String(members.length) })
    setPhotoFile(null)
    setPhotoPreview('')
    setModalOpen(true)
  }

  function openEdit(m: TeamMember) {
    setEditing(m)
    setForm({ name: m.name, role: m.role, bio: m.bio, display_order: String(m.display_order), is_active: m.is_active })
    setPhotoFile(null)
    setPhotoPreview(m.photo || '')
    setModalOpen(true)
  }

  function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setPhotoFile(file)
    setPhotoPreview(file ? URL.createObjectURL(file) : editing?.photo || '')
  }

  async function save() {
    if (!form.name.trim() || !form.role.trim()) {
      toast('Please enter a name and role')
      return
    }
    const order = Number(form.display_order)
    if (Number.isNaN(order) || order < 0) {
      toast('Display order must be 0 or greater')
      return
    }
    setSaving(true)
    try {
      // Only switch to multipart when a new photo was actually picked - a
      // plain JSON PATCH leaves the existing photo untouched on edit.
      const fields = {
        name: form.name.trim(),
        role: form.role.trim(),
        bio: form.bio.trim(),
        display_order: order,
        is_active: form.is_active,
      }
      let body: FormData | typeof fields
      if (photoFile) {
        body = new FormData()
        for (const [k, v] of Object.entries(fields)) body.append(k, String(v))
        body.append('photo', photoFile)
      } else {
        body = fields
      }
      if (editing) {
        await api.patch(`/team/${editing.id}`, body)
      } else {
        await api.post('/team', body)
      }
      setModalOpen(false)
      load()
      toast('Team member saved!')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not save team member'))
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!deleteId) return
    try {
      await api.delete(`/team/${deleteId}`)
      setMembers((prev) => prev.filter((m) => m.id !== deleteId))
      toast('Team member removed')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not remove team member'))
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <h2>Team</h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 14, marginTop: 6 }}>
            Shown in the “Our team” section on the homepage and About page. Inactive members are hidden from the site.
          </p>
        </div>
        <button className="kd-btn kd-btn-p" onClick={openAdd}>
          + Add Member
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="kd-tb2">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Role</th>
              <th>Order</th>
              <th>Status</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 24 }}>
                  No team members yet
                </td>
              </tr>
            )}
            {members.map((m) => (
              <tr key={m.id}>
                <td>
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} style={{ width: 44, height: 44, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 44, height: 44, background: 'var(--muted)' }} />
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>{m.name}</td>
                <td>{m.role}</td>
                <td>{m.display_order}</td>
                <td>
                  <span className={`kd-bg ${m.is_active ? 'kd-bgs' : 'kd-bgd'}`}>{m.is_active ? 'Visible' : 'Hidden'}</span>
                </td>
                <td>
                  <button className="kd-btn kd-btn-o" style={{ padding: '6px 12px' }} onClick={() => openEdit(m)}>
                    Edit
                  </button>{' '}
                  <button className="kd-btn kd-btn-d" style={{ padding: '6px 12px' }} onClick={() => setDeleteId(m.id)}>
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
          <h3>{editing ? 'Edit Team Member' : 'Add Team Member'}</h3>
          <div className="kd-fg">
            <label>Name</label>
            <input type="text" placeholder="e.g. Ram Bahadur Thapa" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="kd-fg">
            <label>Role</label>
            <input type="text" placeholder="e.g. Kitchen Planner" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </div>
          <div className="kd-fg">
            <label>Short bio (optional)</label>
            <textarea
              rows={3}
              placeholder="One or two lines about their experience..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <div className="kd-fg">
            <label>Display order</label>
            <input
              type="number"
              min={0}
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: e.target.value })}
            />
          </div>
          <div className="kd-fg">
            <label>Photo</label>
            <input type="file" accept="image/*" onChange={onPickPhoto} />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                style={{ marginTop: 10, width: 96, height: 120, objectFit: 'cover', border: '1px solid var(--border)' }}
              />
            )}
          </div>
          <div className="kd-fg">
            <label className="kd-chk">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              Show on the website
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="kd-btn kd-btn-o" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="kd-btn kd-btn-p" onClick={save} disabled={saving}>
              {saving ? 'Saving...' : 'Save Member'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Remove team member"
        message="Are you sure you want to remove this team member? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
