import type { TranslationKey } from '../i18n/en'
import type { Order, User } from '../types'

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '+9779769400796').replace(/\D/g, '')

type Translate = (key: TranslationKey) => string

/**
 * Builds a wa.me deep link pre-filled with the order details and the
 * customer's registered name/phone, so the store has everything it needs
 * the moment the chat opens — no back-and-forth needed to identify the order.
 *
 * `t` is optional (defaults to English) so this can still be called from
 * anywhere that doesn't have LanguageContext in scope.
 */
export function buildOrderWhatsAppLink(order: Order, user: User | null, t: Translate = (k) => k): string {
  const lines = ['Hello Kitchen Durbar! I just placed an order on your website.', `Order ID: #${order.id.slice(0, 8)}`]

  if (user) {
    lines.push(`Name: ${user.full_name}`)
    if (user.phone) lines.push(`Phone: ${user.phone}`)
  }

  if (order.items?.length) {
    lines.push('Items:')
    for (const item of order.items) {
      lines.push(`- ${item.quantity}x ${item.product_name}`)
    }
  }

  lines.push(`Subtotal: NPR ${Number(order.subtotal).toLocaleString()}`)
  const discount = Number(order.discount || 0)
  if (discount > 0) {
    lines.push(`${t('cart.discount')}: -NPR ${discount.toLocaleString()}`)
  }
  const shipping = Number(order.shipping)
  lines.push(`${t('cart.shipping')}: ${shipping === 0 ? t('common.free') : `NPR ${shipping.toLocaleString()}`}`)
  lines.push(`Total: NPR ${Number(order.total).toLocaleString()}`)
  lines.push('Please confirm my order details.')

  const message = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}
