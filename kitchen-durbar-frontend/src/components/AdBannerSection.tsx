import { useEffect, useState } from 'react'
import type { Advertisement } from '../types'

/**
 * One reusable ad row. Home.tsx renders this twice - once with the first two
 * ads directly above the main content, once with the next two directly below
 * it - so each instance shows up to 2 ads side by side, not a 2x2 grid.
 * Takes its ads as a prop (already fetched once by Home.tsx) rather than
 * fetching them itself - no duplicate network calls.
 *
 * Desktop/tablet: up to 2 ads side by side (equal-width columns). Each image
 * keeps its own natural aspect ratio - no cropping, no forced square/box, so
 * arbitrary banner shapes never distort. A lone ad (e.g. only 1 of the 2
 * slots filled) spans the full row instead of leaving an empty column.
 * Mobile: the page only ever shows a single banner total, directly above the
 * content - the top row becomes a one-at-a-time auto-rotating carousel via
 * `hideOnMobile=false` (the default), while the bottom row is hidden
 * entirely on mobile via `hideOnMobile=true` (see index.css).
 *
 * Renders nothing at all when there are no ads - no placeholder box, so
 * neighboring content never has empty space reserved around it. An ad whose
 * image URL 404s/fails to load is dropped from the layout the moment that
 * happens (see `failedIds`), so a broken image never sits there as an empty
 * bordered box either - and if every ad in this row fails, the whole row
 * collapses just like the no-ads case.
 */
export default function AdBannerSection({
  ads,
  hideOnMobile = false,
}: {
  ads: Advertisement[]
  /** Hide this row entirely on mobile instead of showing it as a carousel -
   * used for the row below the content, since mobile shows only one banner
   * total (above the content). */
  hideOnMobile?: boolean
}) {
  const [active, setActive] = useState(0)
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set())

  const visibleAds = ads.filter((ad) => !failedIds.has(ad.id))

  useEffect(() => {
    if (visibleAds.length <= 1) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % visibleAds.length), 5000)
    return () => window.clearInterval(id)
  }, [visibleAds.length])

  if (!visibleAds.length) return null

  // A lone ad (odd count out of this row's up-to-2 slots) spans both
  // columns instead of leaving a visibly empty cell next to it.
  const lastIsAlone = visibleAds.length % 2 === 1
  // Clamp in case ads failed since the last render and shrank the list.
  const safeActive = active % visibleAds.length

  function renderBanner(ad: Advertisement, spanFull = false) {
    const Tag = ad.link_url ? 'a' : 'div'
    return (
      <Tag
        key={ad.id}
        className={`kd-promo-banner-item${spanFull ? ' span-2' : ''}`}
        {...(ad.link_url ? { href: ad.link_url, target: '_blank', rel: 'noreferrer' } : {})}
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
    <div className={`kd-promo-banner-section${hideOnMobile ? ' kd-promo-banner-section--desktop-only' : ''}`}>
      <div className="kd-promo-banner-grid">
        {visibleAds.map((ad, i) => renderBanner(ad, lastIsAlone && i === visibleAds.length - 1))}
      </div>
      {!hideOnMobile && <div className="kd-promo-banner-carousel">{renderBanner(visibleAds[safeActive])}</div>}
    </div>
  )
}
