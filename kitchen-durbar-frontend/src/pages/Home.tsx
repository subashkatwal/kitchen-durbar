import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import AdBannerSection from '../components/AdBannerSection'
// import AdPopup from '../components/AdPopup' // temporarily disabled - see note near its usage below
import ProductCard from '../components/ProductCard'
import { Icon } from '../components/icons'
import { useLanguage } from '../context/LanguageContext'
import { CATEGORIES, type Advertisement, type Product } from '../types'

export default function Home() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [featured, setFeatured] = useState<Product[]>([])
  const [ads, setAds] = useState<Advertisement[]>([])

  useEffect(() => {
    // Featured products are chosen from the backend (Product.is_featured),
    // not hardcoded here - toggle it per-product from the admin dashboard.
    api
      .get<Product[]>('/products', { params: { is_featured: true, ordering: '-created_at' } })
      .then((res) => setFeatured(res.data))
      .catch(() => setFeatured([]))

    // Single fetch shared by the banner section and the popup below - the
    // public /promotions endpoint already only returns active, in-window ads
    // (see AdvertisementViewSet), already ordered by priority. Named
    // "promotions" rather than "ads" so ad-blocker extensions (which
    // generically block any URL/class containing "ad") don't intercept it.
    api
      .get<Advertisement[]>('/promotions')
      .then((res) => setAds(res.data))
      .catch(() => setAds([]))
  }, [])

  // Up to 4 ads total, split into two rows of up to 2: the first row sits
  // directly above the content, the second directly below it - see
  // AdBannerSection.
  const topAds = ads.slice(0, 2)
  const bottomAds = ads.slice(2, 4)

  return (
    <div className="kd-pg active">
      <AdBannerSection ads={topAds} />
      <div className="kd-hr">
        <h1>{t('home.heroTitle')}</h1>
        <p>{t('home.heroSubtitle')}</p>
        <p>{t('home.heroExtra')}</p>
        <div className="kd-hr-btns">
          <button className="kd-btn kd-btn-p" onClick={() => navigate('/products')}>
            {t('cart.browseProducts')}
          </button>
          <button className="kd-btn kd-btn-s" onClick={() => navigate('/register')}>
            {t('home.getStarted')}
          </button>
        </div>
      </div>
      <div className="kd-b">
        <div className="kd-st">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          {t('home.browseByCategory')}
        </div>
        <div className="kd-cg">
          {CATEGORIES.map((c) => (
            <div key={c} className="kd-ccard" onClick={() => navigate(`/products?category=${c}`)}>
              <div style={{ color: 'var(--ka)' }}>
                <Icon name={c.toLowerCase()} />
              </div>
              <span>{c}</span>
            </div>
          ))}
        </div>
        {featured.length > 0 && (
          <>
            <div className="kd-st">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {t('home.featuredProducts')}
            </div>
            <div className="kd-pg2">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
      <AdBannerSection ads={bottomAds} hideOnMobile />
      {/* AdPopup temporarily disabled - not reliably showing its image in
          production (same root cause as ads not showing in the banner rows:
          media isn't actually landing on Cloudinary there - see the fix
          summary in this session). Re-enable by uncommenting this and the
          import above once that's confirmed fixed. */}
      {/* <AdPopup ads={ads} /> */}
    </div>
  )
}
