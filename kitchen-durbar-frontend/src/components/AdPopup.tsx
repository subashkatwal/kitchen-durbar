import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useLanguage } from '../context/LanguageContext'
import type { Advertisement } from '../types'

const SEEN_KEY = 'kd_ad_popup_seen'

function alreadySeen() {
  try {
    return Boolean(sessionStorage.getItem(SEEN_KEY))
  } catch {
    // sessionStorage unavailable - show the popup rather than silently never.
    return false
  }
}

/**
 * The highest-priority live ad with placement "Popup" (Admin → Ads), shown
 * once per browser session. Fetches its own placement so pages don't need
 * to know about it. If the image fails to load it closes itself instead of
 * showing an empty modal.
 */
export default function AdPopup() {
  const { t } = useLanguage()
  const [ad, setAd] = useState<Advertisement | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (alreadySeen()) return
    api
      .get<Advertisement[]>('/promotions', { params: { position: 'popup' } })
      .then((res) => setAd(res.data[0] ?? null))
      .catch(() => setAd(null))
  }, [])

  function close() {
    setOpen(false)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      // Not persisted this time; worst case the popup shows again next load.
    }
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!ad) return null

  const image = (
    <img
      src={ad.image}
      alt={ad.title}
      // Only open once the image has actually loaded - never an empty modal.
      onLoad={() => setOpen(true)}
      onError={() => setAd(null)}
    />
  )

  return (
    <div className={`kd-mo${open ? ' active' : ''}`} onClick={close} role="dialog" aria-modal="true" aria-label={ad.title}>
      <div className="kd-md kd-promo-popup" onClick={(e) => e.stopPropagation()}>
        <button className="kd-mo-close" aria-label={t('ad.close')} onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {ad.link_url ? (
          <a href={ad.link_url} target="_blank" rel="noreferrer sponsored" onClick={close}>
            {image}
          </a>
        ) : (
          image
        )}
      </div>
    </div>
  )
}
