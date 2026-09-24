import axios from 'axios'
import { ArrowLeft, ArrowRight, Check, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, apiErrorMessage } from '../api/client'
import ProductCard, { ProductImage } from '../components/ProductCard'
import { CtaBand } from '../components/sections'
import { buttonClass, CONTAINER, formatNpr } from '../components/ui'
import { useSiteContent } from '../content/site'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import type { TranslationKey } from '../i18n/en'
import type { Product } from '../types'

const SPEC_ROWS: [TranslationKey, TranslationKey][] = [
  ['product.material', 'product.materialValue'],
  ['product.delivery', 'product.deliveryValue'],
  ['product.warranty', 'product.warrantyValue'],
  ['product.customization', 'product.customizationValue'],
]

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const toast = useToast()
  const { t } = useLanguage()
  const site = useSiteContent()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setError('')
    setProduct(null)
    setRelated([])
    api
      .get<Product>(`/products/${id}`)
      .then((res) => {
        setProduct(res.data)
        // Best-effort: a failure here just leaves the "related" row out.
        api
          .get<Product[]>('/products', { params: { category: res.data.category } })
          .then((rel) => setRelated(rel.data.filter((p) => p.id !== id).slice(0, 3)))
          .catch(() => setRelated([]))
      })
      .catch((err) => {
        const status = axios.isAxiosError(err) ? err.response?.status : undefined
        setError(status === 404 ? t('product.notFound') : apiErrorMessage(err, t('product.loadError')))
      })
  }, [id, t])

  if (error) {
    return (
      <section className={`py-32 text-center ${CONTAINER}`}>
        <p className="font-display text-4xl">{error}</p>
        <Link to="/products" className={buttonClass('brass', 'lg', 'mt-8')}>
          <ArrowLeft /> {t('product.backToProducts')}
        </Link>
      </section>
    )
  }

  if (!product) return <div className="min-h-[60vh]" />

  return (
    <>
      <section className={`grid gap-10 py-10 md:py-16 lg:grid-cols-2 lg:gap-12 ${CONTAINER}`}>
        <div>
          <Link
            to="/products"
            className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" /> {t('product.backToProducts')}
          </Link>
          <div className="overflow-hidden border border-border bg-card">
            <ProductImage product={product} className="aspect-square" />
          </div>
        </div>
        <div className="lg:py-16">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">
            {site.categoryLabels[product.category] ?? product.category}
          </p>
          <h1 className="mt-4 text-4xl leading-none sm:text-5xl md:text-7xl">{product.name}</h1>
          <p className="mt-6 font-display text-4xl text-primary">{formatNpr(product.price)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('product.madeToOrder')}</p>
          <p className="mt-8 whitespace-pre-line border-y border-border py-6 leading-7 text-muted-foreground">
            {product.description || t('product.noDescription')}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              className={buttonClass('brass')}
              onClick={() => {
                addItem(product)
                toast(t('product.addedToCart'))
              }}
            >
              <ShoppingCart /> {t('product.addToCart')}
            </button>
            <Link to="/contact" className={buttonClass('outline')}>
              {t('product.requestQuote')} <ArrowRight />
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl">{site.product.specifications}</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {SPEC_ROWS.map(([label, value]) => (
                  <li key={label} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      <strong className="font-semibold text-foreground">{t(label)}</strong> {t(value)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl">{site.product.applications}</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {site.product.applicationItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-card py-16 md:py-24">
          <div className={CONTAINER}>
            <h2 className="mb-8 text-4xl md:mb-10 md:text-5xl">{site.product.related}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  )
}
