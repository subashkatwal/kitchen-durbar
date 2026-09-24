import { PackageOpen, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, apiErrorMessage } from '../api/client'
import AdBannerSection from '../components/AdBannerSection'
import ProductCard from '../components/ProductCard'
import Select from '../components/Select'
import { CtaBand } from '../components/sections'
import { buttonClass, CONTAINER, PageHero, SectionTitle } from '../components/ui'
import { useSiteContent } from '../content/site'
import { useSiteImage } from '../context/CmsContext'
import { useLanguage } from '../context/LanguageContext'
import { CATEGORIES, type Advertisement, type Product } from '../types'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [ads, setAds] = useState<Advertisement[]>([])
  const { t } = useLanguage()
  const site = useSiteContent()
  const heroImage = useSiteImage('products_hero')

  const SORT_OPTIONS = [
    { value: '', label: t('products.sortBy') },
    { value: 'pl', label: t('products.priceLowHigh') },
    { value: 'ph', label: t('products.priceHighLow') },
    { value: 'nm', label: t('products.nameAZ') },
  ]

  useEffect(() => {
    api
      .get<Advertisement[]>('/promotions', { params: { position: 'products' } })
      .then((res) => setAds(res.data))
      .catch(() => setAds([]))
  }, [])

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || ''

  useEffect(() => {
    setLoading(true)
    setError('')
    const ordering = sort === 'pl' ? 'price' : sort === 'ph' ? '-price' : sort === 'nm' ? 'name' : undefined
    api
      .get<Product[]>('/products', { params: { search: search || undefined, category: category || undefined, ordering } })
      .then((res) => setProducts(res.data))
      .catch((err) => {
        setProducts([])
        setError(apiErrorMessage(err, t('products.loadError')))
      })
      .finally(() => setLoading(false))
  }, [search, category, sort, t])

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: key === 'search' })
  }

  return (
    <>
      <PageHero {...site.products.hero} image={heroImage} />
      <AdBannerSection ads={ads} />
      <section className={`py-16 md:py-24 ${CONTAINER}`}>
        <SectionTitle eyebrow={site.products.eyebrow} title={site.products.title} />

        <div className="mb-8 space-y-4 border-y border-border py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                aria-label={t('products.searchLabel')}
                placeholder={t('products.searchPlaceholder')}
                value={search}
                onChange={(e) => update('search', e.target.value)}
                className="h-10 w-full border border-input bg-card pl-10 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-4">
              {!loading && !error && (
                <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {t('products.count', { n: products.length })}
                </span>
              )}
              <Select value={sort} onChange={(v) => update('sort', v)} options={SORT_OPTIONS} />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['', ...CATEGORIES].map((c) => (
              <button
                key={c || 'all'}
                type="button"
                onClick={() => update('category', c)}
                className={buttonClass(category === c ? 'brass' : 'outline', 'sm')}
              >
                {c ? site.categoryLabels[c as keyof typeof site.categoryLabels] : t('products.all')}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="mb-6 border-l-2 border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        {loading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">{t('products.loading')}</p>
        ) : !error && products.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <PackageOpen className="mx-auto mb-4 size-12 opacity-40" />
            <p>{t('products.notFound')}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
      <CtaBand />
    </>
  )
}
