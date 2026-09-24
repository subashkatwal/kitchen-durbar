import { useState } from 'react'
import { api, apiErrorMessage } from '../../api/client'
import ConfirmDialog from '../../components/ConfirmDialog'
import { SITE_IMAGE_SLOTS, type SiteImageSlot } from '../../content/site'
import { useCms } from '../../context/CmsContext'
import { useToast } from '../../context/ToastContext'

const SLOTS = Object.entries(SITE_IMAGE_SLOTS) as [SiteImageSlot, (typeof SITE_IMAGE_SLOTS)[SiteImageSlot]][]
const GROUPS = [...new Set(SLOTS.map(([, s]) => s.group))]

/**
 * Every photo on the storefront that isn't a product/project/team/ad image:
 * page heroes, section photos and the homepage category tiles. Uploading
 * replaces the slot's image immediately; "Reset" deletes the upload so the
 * slot falls back to the built-in default photo.
 */
export default function AdminSiteImages() {
  const toast = useToast()
  const { images, refresh } = useCms()
  const [busySlot, setBusySlot] = useState<SiteImageSlot | null>(null)
  const [resetSlot, setResetSlot] = useState<SiteImageSlot | null>(null)

  async function upload(slot: SiteImageSlot, file: File | undefined) {
    if (!file) return
    setBusySlot(slot)
    try {
      const body = new FormData()
      body.append('key', slot)
      body.append('image', file)
      await api.post('/site-images', body)
      refresh()
      toast(`${SITE_IMAGE_SLOTS[slot].label} updated`)
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not upload image'))
    } finally {
      setBusySlot(null)
    }
  }

  async function reset() {
    if (!resetSlot) return
    const slot = resetSlot
    setResetSlot(null)
    setBusySlot(slot)
    try {
      await api.delete(`/site-images/${slot}`)
      refresh()
      toast(`${SITE_IMAGE_SLOTS[slot].label} reset to default`)
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not reset image'))
    } finally {
      setBusySlot(null)
    }
  }

  const customCount = SLOTS.filter(([slot]) => images[slot]).length

  return (
    <div>
      <h2>Site Images</h2>
      <p style={{ color: 'var(--muted-foreground)', fontSize: 15, margin: '6px 0 28px', maxWidth: 760 }}>
        Replace any photo on the website. Slots marked <b>Default</b> still show the built-in sample photo - upload your own
        to replace it. {customCount} of {SLOTS.length} slots use your images. Landscape photos around 1600×1000px work best
        for heroes; tiles are cropped to fit.
      </p>

      {GROUPS.map((group) => (
        <section key={group} style={{ marginBottom: 36 }}>
          <h3 style={{ fontSize: 26, marginBottom: 14 }}>{group}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {SLOTS.filter(([, s]) => s.group === group).map(([slot, meta]) => {
              const custom = images[slot]
              const busy = busySlot === slot
              return (
                <div key={slot} className="kd-panel" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', aspectRatio: '16 / 10', background: 'var(--muted)', overflow: 'hidden' }}>
                    <img
                      src={custom || meta.fallback}
                      alt={meta.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: busy ? 0.4 : 1 }}
                    />
                    <span
                      className={`kd-bg ${custom ? 'kd-bgs' : 'kd-bgw'}`}
                      style={{ position: 'absolute', top: 10, left: 10, background: custom ? undefined : 'var(--card)' }}
                    >
                      {custom ? 'Custom' : 'Default'}
                    </span>
                  </div>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                    <b style={{ fontSize: 15 }}>{meta.label}</b>
                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto', flexWrap: 'wrap' }}>
                      <label className="kd-btn kd-btn-p" style={{ padding: '8px 14px', cursor: busy ? 'wait' : 'pointer' }}>
                        {busy ? 'Saving...' : custom ? 'Replace' : 'Upload'}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          disabled={busy}
                          onChange={(e) => {
                            upload(slot, e.target.files?.[0])
                            e.target.value = ''
                          }}
                        />
                      </label>
                      {custom && (
                        <button className="kd-btn kd-btn-o" style={{ padding: '8px 14px' }} disabled={busy} onClick={() => setResetSlot(slot)}>
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      <ConfirmDialog
        open={resetSlot !== null}
        title="Reset image"
        message="Remove your uploaded image and go back to the built-in default photo for this slot?"
        confirmLabel="Reset"
        onConfirm={reset}
        onCancel={() => setResetSlot(null)}
      />
    </div>
  )
}
