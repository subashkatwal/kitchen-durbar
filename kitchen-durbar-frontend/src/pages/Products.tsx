import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, apiErrorMessage } from '../api/client'
import ProductCard from '../components/ProductCard'
import Select from '../components/Select'
import { useLanguage } from '../context/LanguageContext'
import { CATEGORIES, type Product } from '../types'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { t } = useLanguage()

  const CATEGORY_OPTIONS = [{ value: '', label: t('products.allCategories') }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]
  const SORT_OPTIONS = [
    { value: '', label: t('products.sortBy') },
    { value: 'pl', label: t('products.priceLowHigh') },
    { value: 'ph', label: t('products.priceHighLow') },
    { value: 'nm', label: t('products.nameAZ') },
  ]

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
    setSearchParams(next)
  }

  return (
    <div className="kd-pg active">
      <div className="kd-b">
        <div className="kd-st">{t('products.title')}</div>
        <div className="kd-tb">
          <div className="kd-s">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={t('products.searchPlaceholder')}
              value={search}
              onChange={(e) => update('search', e.target.value)}
            />
          </div>
          <Select value={category} onChange={(v) => update('category', v)} options={CATEGORY_OPTIONS} />
          <Select value={sort} onChange={(v) => update('sort', v)} options={SORT_OPTIONS} />
        </div>
        {error && <div className="kd-err">{error}</div>}
        {!loading && !error && products.length === 0 ? (
          <div className="kd-em">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <path d="M3.27 6.96L12 12.01l8.73-5.05" />
              <path d="M12 22.08V12" />
            </svg>
            <p>{t('products.notFound')}</p>
          </div>
        ) : (
          <div className="kd-pg2">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
