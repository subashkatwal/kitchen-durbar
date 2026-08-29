import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import type { Advertisement } from '../types'

const SEEN_KEY = 'kd_ad_popup_seen'

/**
 * Shows the first active ad (by `order`) as a dismissible popup once per
 * browser session - reuses the existing .kd-mo/.kd-md modal markup (same one
 * ConfirmDialog and the admin edit dialogs use) plus a small close (×)
 * button. `ads` is passed in from Home.tsx's single /ads fetch, same as
 * AdRail - no extra network call here.
 */
export default function AdPopup({ ads }: { ads: Advertisement[] }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const ad = ads[0]

  useEffect(() => {
    if (!ad) return
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return
    } catch {
      // sessionStorage unavailable - fall through and show the popup anyway
      // rather than silently never showing it.
    }
    setOpen(true)
  }, [ad])

  function close() {
    setOpen(false)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      // Not persisted this time; worst case the popup shows again next load.
    }
  }

  if (!ad) return null

  return (
    <div className={`kd-mo${open ? ' active' : ''}`} onClick={close}>
      <div className="kd-md kd-ad-popup" onClick={(e) => e.stopPropagation()}>
        <button className="kd-mo-close" aria-label={t('ad.close')} onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {ad.link_url ? (
          <a href={ad.link_url} target="_blank" rel="noreferrer">
            <img src={ad.image} alt={ad.title} />
          </a>
        ) : (
          <img src={ad.image} alt={ad.title} />
        )}
      </div>
    </div>
  )
}
