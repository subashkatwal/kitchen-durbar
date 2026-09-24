import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, apiErrorMessage } from '../api/client'
import { Icon } from '../components/icons'
import { buttonClass, CONTAINER, formatNpr, PageHeader } from '../components/ui'
import { useSiteContent } from '../content/site'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import { buildOrderWhatsAppLink } from '../lib/whatsapp'
import type { Order } from '../types'

export default function Cart() {
  const { items, subtotal, discount, discountRate, shipping, total, updateQty, removeItem, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const { t } = useLanguage()
  const site = useSiteContent()
  const [placing, setPlacing] = useState(false)

  async function checkout() {
    if (!user) {
      toast(t('cart.loginFirst'))
      navigate('/login')
      return
    }
    if (!items.length) {
      toast(t('cart.empty'))
      return
    }
    setPlacing(true)
    try {
      const payload = { items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })) }
      const { data: order } = await api.post<Order>('/orders', payload)
      clear()
      // Open WhatsApp immediately with the order + the customer's registered
      // name/phone pre-filled - no extra click needed. The confirmation page
      // still shows the same link as a fallback in case this popup was blocked.
      window.open(buildOrderWhatsAppLink(order, user, t), '_blank', 'noopener,noreferrer')
      navigate('/checkout/confirmation', { state: { order } })
    } catch (err) {
      toast(apiErrorMessage(err, t('cart.checkoutError')))
    } finally {
      setPlacing(false)
    }
  }

  const qtyButton =
    'flex h-9 w-9 items-center justify-center transition-colors hover:bg-accent disabled:opacity-40 [&_svg]:size-3.5'

  return (
    <>
      <PageHeader eyebrow={t('cart.eyebrow')} title={t('cart.title')} />
      <section className={`py-10 md:py-16 ${CONTAINER}`}>
        {!items.length ? (
          <div className="border border-border bg-card px-6 py-20 text-center">
            <ShoppingCart className="mx-auto size-12 text-muted-foreground/50" />
            <p className="mt-5 font-display text-3xl">{t('cart.empty')}</p>
            <Link to="/products" className={buttonClass('brass', 'lg', 'mt-8')}>
              {t('cart.browseProducts')} <ArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
            <div className="border-t border-border">
              {items.map((i) => (
                <div key={i.id} className="flex gap-3 border-b border-border py-6 min-[420px]:gap-4 sm:gap-6">
                  <Link
                    to={`/products/${i.id}`}
                    className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden bg-muted text-muted-foreground/50 min-[420px]:h-24 min-[420px]:w-24 sm:h-28 sm:w-28 [&_svg]:size-10"
                  >
                    {i.image ? <img src={i.image} alt={i.name} className="h-full w-full object-cover" /> : <Icon name={i.icon} />}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-col gap-1 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between min-[420px]:gap-4">
                      <div className="min-w-0">
                        {i.category && (
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                            {site.categoryLabels[i.category] ?? i.category}
                          </p>
                        )}
                        <Link to={`/products/${i.id}`} className="mt-1 block font-display text-2xl leading-tight hover:text-primary">
                          {i.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatNpr(i.price)} {t('cart.each')}
                        </p>
                      </div>
                      <p className="shrink-0 font-semibold min-[420px]:text-right">{formatNpr(i.price * i.quantity)}</p>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                      <div className="flex items-center border border-border bg-card">
                        <button type="button" className={qtyButton} onClick={() => updateQty(i.id, -1)} aria-label={t('cart.decrease')}>
                          <Minus />
                        </button>
                        <span className="min-w-8 text-center text-sm font-bold">{i.quantity}</span>
                        <button type="button" className={qtyButton} onClick={() => updateQty(i.id, 1)} aria-label={t('cart.increase')}>
                          <Plus />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(i.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" /> {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <Link
                to="/products"
                className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] hover:text-primary"
              >
                <ArrowLeft className="size-4" /> {t('cart.continueShopping')}
              </Link>
            </div>

            <aside className="border border-border bg-card p-6 lg:sticky lg:top-28 md:p-8">
              <h2 className="text-3xl">{t('cart.orderSummary')}</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <dt>{t('cart.subtotal')}</dt>
                  <dd>{formatNpr(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <dt>{t('cart.discountWithRate', { rate: Math.round(discountRate * 100) })}</dt>
                    <dd className="font-semibold text-success">-{formatNpr(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <dt>{t('cart.shipping')}</dt>
                  <dd>{shipping === 0 ? t('common.free') : formatNpr(shipping)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-border pt-4">
                  <dt className="text-xs font-bold uppercase tracking-[0.12em]">{t('cart.total')}</dt>
                  <dd className="font-display text-3xl">{formatNpr(total)}</dd>
                </div>
              </dl>
              <button type="button" className={buttonClass('brass', 'lg', 'mt-6 w-full')} onClick={checkout} disabled={placing}>
                {placing ? t('cart.placingOrder') : t('cart.proceedToPayment')} {!placing && <ArrowRight />}
              </button>
              <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">{t('cart.madeToOrderNote')}</p>
              <p className="mt-2 text-center text-xs leading-5 text-muted-foreground">{t('cart.whatsappNote')}</p>
            </aside>
          </div>
        )}
      </section>
    </>
  )
}
