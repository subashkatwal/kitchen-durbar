import { ArrowRight, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../content/site'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import type { Product } from '../types'
import { Icon } from './icons'
import { buttonClass, formatNpr } from './ui'

/** Product photo, or the category's line icon on a muted tile when there's no photo yet. */
export function ProductImage({ product, className = '' }: { product: Product; className?: string }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} loading="lazy" className={`w-full object-cover ${className}`} />
  }
  return (
    <div className={`flex w-full items-center justify-center bg-muted text-muted-foreground/50 [&_svg]:size-20 ${className}`}>
      <Icon name={product.icon} />
    </div>
  )
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const toast = useToast()
  const { t } = useLanguage()
  const site = useSiteContent()
  const href = `/products/${product.id}`

  function handleAdd() {
    addItem(product)
    toast(t('product.addedToCart'))
  }

  return (
    <article className="group flex flex-col border border-border bg-card">
      <Link to={href} className="block overflow-hidden bg-muted">
        <ProductImage
          product={product}
          className="aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          {site.categoryLabels[product.category] ?? product.category}
        </p>
        <h3 className="mt-2 text-2xl leading-tight">
          <Link to={href} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="mt-3 text-lg font-semibold">
          {formatNpr(product.price)}{' '}
          <span className="text-xs font-normal text-muted-foreground">{t('product.madeToOrder')}</span>
        </p>
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <Link to={href} className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em]">
              {t('product.viewDetails')}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button type="button" onClick={handleAdd} className={buttonClass('brass', 'sm')} aria-label={t('product.addToCart')}>
              <ShoppingCart /> <span className="hidden sm:inline">{t('product.addToCart')}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
