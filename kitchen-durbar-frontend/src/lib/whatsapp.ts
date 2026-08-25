import type { Order, User } from '../types'

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '+9779769400796').replace(/\D/g, '')

/**
 * Builds a wa.me deep link pre-filled with the order details and the
 * customer's registered name/phone, so the store has everything it needs
 * the moment the chat opens — no back-and-forth needed to identify the order.
 */
export function buildOrderWhatsAppLink(order: Order, user: User | null): string {
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

  lines.push(`Total: NPR ${Number(order.total).toLocaleString()}`)
  lines.push('Please confirm my order details.')

  const message = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}
