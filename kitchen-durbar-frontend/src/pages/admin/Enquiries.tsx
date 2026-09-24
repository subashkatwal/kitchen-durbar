import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../../api/client'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useToast } from '../../context/ToastContext'
import type { Enquiry } from '../../types'

export default function AdminEnquiries() {
  const toast = useToast()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<Enquiry[]>('/enquiries')
      .then((res) => setEnquiries(res.data))
      .catch((err) => {
        setEnquiries([])
        toast(apiErrorMessage(err, 'Could not load enquiries.'))
      })
  }, [toast])

  async function toggleHandled(enquiry: Enquiry) {
    try {
      const { data } = await api.patch<Enquiry>(`/enquiries/${enquiry.id}`, { is_handled: !enquiry.is_handled })
      setEnquiries((prev) => prev.map((e) => (e.id === enquiry.id ? data : e)))
      toast(data.is_handled ? 'Marked as handled' : 'Marked as new')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not update enquiry'))
    }
  }

  async function remove() {
    if (!deleteId) return
    try {
      await api.delete(`/enquiries/${deleteId}`)
      setEnquiries((prev) => prev.filter((e) => e.id !== deleteId))
      toast('Enquiry deleted')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not delete enquiry'))
    } finally {
      setDeleteId(null)
    }
  }

  const newCount = enquiries.filter((e) => !e.is_handled).length

  return (
    <div>
      <h2>Enquiries</h2>
      <p style={{ color: 'var(--muted-foreground)', fontSize: 14, margin: '6px 0 20px' }}>
        Quote requests sent from the website's contact form · {newCount} new
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table className="kd-tb2">
          <thead>
            <tr>
              <th>Received</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Project details</th>
              <th>Status</th>
              <th style={{ width: 200 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 24 }}>
                  No enquiries yet
                </td>
              </tr>
            )}
            {enquiries.map((e) => {
              const expanded = openId === e.id
              return (
                <tr key={e.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(e.created_at).toLocaleString()}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{e.name}</div>
                    {e.company && <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{e.company}</div>}
                  </td>
                  <td style={{ fontSize: 13 }}>
                    <a href={`tel:${e.phone}`} style={{ display: 'block' }}>
                      {e.phone}
                    </a>
                    <a href={`mailto:${e.email}`} style={{ color: 'var(--muted-foreground)' }}>
                      {e.email}
                    </a>
                  </td>
                  <td style={{ maxWidth: 380 }}>
                    <p
                      style={{
                        fontSize: 13,
                        whiteSpace: 'pre-line',
                        ...(expanded ? {} : { overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }),
                      }}
                    >
                      {e.message}
                    </p>
                    {e.message.length > 90 && (
                      <button
                        style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginTop: 4 }}
                        onClick={() => setOpenId(expanded ? null : e.id)}
                      >
                        {expanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </td>
                  <td>
                    <span className={`kd-bg ${e.is_handled ? 'kd-bgs' : 'kd-bgw'}`}>{e.is_handled ? 'Handled' : 'New'}</span>
                  </td>
                  <td>
                    <button className="kd-btn kd-btn-o" style={{ padding: '6px 12px' }} onClick={() => toggleHandled(e)}>
                      {e.is_handled ? 'Reopen' : 'Mark handled'}
                    </button>{' '}
                    <button className="kd-btn kd-btn-d" style={{ padding: '6px 12px' }} onClick={() => setDeleteId(e.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete enquiry"
        message="Are you sure you want to delete this enquiry? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
