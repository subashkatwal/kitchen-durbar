import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import type { User } from '../../types'

export default function AdminUsers() {
  const { user: me } = useAuth()
  const toast = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)

  function load() {
    api.get<User[]>('/users').then((res) => setUsers(res.data)).catch(() => setUsers([]))
  }

  useEffect(load, [])

  async function toggleStaff(u: User) {
    setBusyId(u.id)
    try {
      const { data } = await api.patch<User>(`/users/${u.id}`, { is_staff: !u.is_staff })
      setUsers((prev) => prev.map((x) => (x.id === u.id ? data : x)))
      toast(data.is_staff ? `${data.full_name} is now an admin` : `${data.full_name} is no longer an admin`)
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not update role'))
    } finally {
      setBusyId(null)
    }
  }

  async function toggleActive(u: User) {
    setBusyId(u.id)
    try {
      const { data } = await api.patch<User>(`/users/${u.id}`, { is_active: !u.is_active })
      setUsers((prev) => prev.map((x) => (x.id === u.id ? data : x)))
      toast(data.is_active ? `${data.full_name} reactivated` : `${data.full_name} deactivated`)
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not update account status'))
    } finally {
      setBusyId(null)
    }
  }

  async function remove(u: User) {
    if (!confirm(`Delete ${u.full_name} (${u.email})? This cannot be undone.`)) return
    setBusyId(u.id)
    try {
      await api.delete(`/users/${u.id}`)
      setUsers((prev) => prev.filter((x) => x.id !== u.id))
      toast('User deleted')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not delete user'))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>User Management</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="kd-tb2">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th style={{ width: 260 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === me?.id
              const busy = busyId === u.id
              return (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '-'}</td>
                  <td>
                    <span className={`kd-bg ${u.role === 'admin' ? 'kd-bgs' : 'kd-bgw'}`}>{u.role}</span>
                  </td>
                  <td>
                    <span className={`kd-bg ${u.is_active ? 'kd-bgs' : 'kd-bgd'}`}>
                      {u.is_active ? 'active' : 'disabled'}
                    </span>
                  </td>
                  <td>{new Date(u.date_joined).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="kd-btn kd-btn-o"
                      style={{ padding: '5px 10px', fontSize: 12 }}
                      disabled={isSelf || busy}
                      title={isSelf ? "You can't change your own role" : undefined}
                      onClick={() => toggleStaff(u)}
                    >
                      {u.is_staff ? 'Revoke admin' : 'Make admin'}
                    </button>{' '}
                    <button
                      className="kd-btn kd-btn-o"
                      style={{ padding: '5px 10px', fontSize: 12 }}
                      disabled={isSelf || busy}
                      title={isSelf ? "You can't deactivate your own account" : undefined}
                      onClick={() => toggleActive(u)}
                    >
                      {u.is_active ? 'Deactivate' : 'Reactivate'}
                    </button>{' '}
                    <button
                      className="kd-btn kd-btn-d"
                      style={{ padding: '5px 10px', fontSize: 12 }}
                      disabled={isSelf || busy}
                      title={isSelf ? "You can't delete your own account" : undefined}
                      onClick={() => remove(u)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
