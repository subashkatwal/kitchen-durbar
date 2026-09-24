import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import type { Advertisement } from '../types'

/**
 * One ad placement (Admin → Ads → "Placement"). Pages pass in the ads for
 * their placement, already filtered and ordered by priority.
 *
 * Desktop/tablet: two per row. Each image keeps its own natural aspect ratio
 * (no cropping); an odd one out spans the full row instead of leaving an
 * empty column. Phones: one at a time, auto-rotating every 5s, with dots.
 *
 * Renders nothing at all when there are no ads - no placeholder box. An ad
 * whose image fails to load is dropped the moment that happens, so a broken
 * image never sits there as an empty bordered box either.
 */
export default function AdBannerSection({ ads }: { ads: Advertisement[] }) {
  const { t } = useLanguage()
  const [active, setActive] = useState(0)
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set())

  const visibleAds = ads.filter((ad) => !failedIds.has(ad.id))

  useEffect(() => {
    if (visibleAds.length <= 1) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % visibleAds.length), 5000)
    return () => window.clearInterval(id)
  }, [visibleAds.length])

  if (!visibleAds.length) return null

  const lastIsAlone = visibleAds.length % 2 === 1
  const safeActive = active % visibleAds.length

  function renderBanner(ad: Advertisement, spanFull = false) {
    const Tag = ad.link_url ? 'a' : 'div'
    return (
      <Tag
        key={ad.id}
        className={`kd-promo-banner-item${spanFull ? ' span-2' : ''}`}
        {...(ad.link_url ? { href: ad.link_url, target: '_blank', rel: 'noreferrer sponsored' } : {})}
      >
        <img
          src={ad.image}
          alt={ad.title}
          loading="lazy"
          onError={() => setFailedIds((prev) => new Set(prev).add(ad.id))}
        />
      </Tag>
    )
  }

  return (
    <aside className="kd-promo-banner-section" aria-label={t('ad.label')}>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{t('ad.label')}</p>
      <div className="kd-promo-banner-grid">
        {visibleAds.map((ad, i) => renderBanner(ad, lastIsAlone && i === visibleAds.length - 1))}
      </div>
      <div className="kd-promo-banner-carousel">
        {renderBanner(visibleAds[safeActive])}
        {visibleAds.length > 1 && (
          <div className="mt-3 flex justify-center gap-2">
            {visibleAds.map((ad, i) => (
              <button
                key={ad.id}
                type="button"
                aria-label={`${i + 1} / ${visibleAds.length}`}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${i === safeActive ? 'w-6 bg-primary' : 'w-2 bg-border'}`}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
