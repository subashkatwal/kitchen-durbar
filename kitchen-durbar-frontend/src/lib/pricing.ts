/**
 * Mirrors the backend's orders/pricing.py tiered discount + shipping rule.
 *
 * This is a client-side PREVIEW only, used by CartContext to show the
 * expected discount/shipping/total before checkout. The backend recomputes
 * and persists the authoritative numbers when the order is actually created
 * (POST /orders) - the frontend never sends pricing to the server, and this
 * copy is never trusted as the source of truth. Kept in sync manually since
 * there's no shared package between the two codebases; if you change one,
 * change the other.
 *
 * | Subtotal                  | Discount | Shipping  |
 * |----------------------------|---------:|----------:|
 * | < NPR 100,000               |       0% | NPR 1,500 |
 * | NPR 100,000 - NPR 200,000   |       3% |      Free |
 * | > NPR 200,000                |       6% |      Free |
 */

export const SHIPPING_FEE = 1500

const DISCOUNT_TIER_1_MIN = 100000 // inclusive
const DISCOUNT_TIER_2_MIN = 200000 // inclusive upper bound of the 3% tier

const DISCOUNT_TIER_1_RATE = 0.03
const DISCOUNT_TIER_2_RATE = 0.06

export function calculateDiscountAndShipping(subtotal: number): { discount: number; shipping: number; rate: number } {
  if (subtotal < DISCOUNT_TIER_1_MIN) {
    return { discount: 0, shipping: subtotal === 0 ? 0 : SHIPPING_FEE, rate: 0 }
  }
  const rate = subtotal <= DISCOUNT_TIER_2_MIN ? DISCOUNT_TIER_1_RATE : DISCOUNT_TIER_2_RATE
  return { discount: Math.round(subtotal * rate * 100) / 100, shipping: 0, rate }
}
