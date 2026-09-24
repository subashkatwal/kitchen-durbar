import { CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { buttonClass, CONTAINER, formatNpr } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { buildOrderWhatsAppLink } from '../lib/whatsapp'
import type { Order } from '../types'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function CheckoutConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()
  const order = (location.state as { order?: Order } | null)?.order

  useEffect(() => {
    if (!order) navigate('/', { replace: true })
  }, [order, navigate])

  if (!order) return null

  const waLink = buildOrderWhatsAppLink(order, user, t)

  return (
    <section className={`py-10 md:py-20 ${CONTAINER}`}>
      <div className="mx-auto grid max-w-5xl border border-border bg-card lg:grid-cols-[1.2fr_1fr]">
        <div className="p-6 sm:p-8 md:p-12">
          <CheckCircle2 className="size-12 text-primary" strokeWidth={1.5} />
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">{t('checkout.eyebrow')}</p>
          <h1 className="mt-3 text-4xl leading-none sm:text-5xl md:text-6xl">{t('checkout.received')}</h1>
          <p className="mt-6 text-lg leading-8">
            तपाईंको अर्डर सफलतापूर्वक प्राप्त भयो।
            <br />
            यो अनलाइन गरिएको उत्पादन भएकोले केही समय लाग्नेछ।
            <br />
            कृपया तलको WhatsApp मा सम्पर्क गर्नुहोस्।
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            Your order has been received successfully. We've already opened WhatsApp with your order details - if it didn't
            open (browser popup blocked), use the button below. Since this is a custom-made product, it will take some time
            to prepare.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[#25d366] px-7 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#1fad52] [&_svg]:size-5"
            >
              <WhatsAppIcon /> {t('checkout.contactWhatsapp')}
            </a>
            <Link to="/products" className={buttonClass('outline')}>
              {t('checkout.continueShopping')}
            </Link>
          </div>
        </div>

        <div className="border-t border-border bg-background p-6 sm:p-8 md:p-12 lg:border-l lg:border-t-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {t('checkout.orderId')} #{order.id.slice(0, 8)}
          </p>
          <ul className="mt-6 space-y-3 border-b border-border pb-6 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4">
                <span>
                  {item.quantity} × {item.product_name}
                </span>
                <span className="shrink-0 text-muted-foreground">{formatNpr(Number(item.price) * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>{t('cart.subtotal')}</dt>
              <dd>{formatNpr(order.subtotal)}</dd>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <dt>{t('cart.discount')}</dt>
                <dd className="text-success">-{formatNpr(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <dt>{t('cart.shipping')}</dt>
              <dd>{Number(order.shipping) === 0 ? t('common.free') : formatNpr(order.shipping)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-border pt-4">
              <dt className="text-xs font-bold uppercase tracking-[0.12em]">{t('cart.total')}</dt>
              <dd className="font-display text-3xl">{formatNpr(order.total)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
