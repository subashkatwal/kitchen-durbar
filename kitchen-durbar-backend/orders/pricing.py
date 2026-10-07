"""
Checkout pricing: tiered discount + shipping based on the cart subtotal.

Single source of truth for the rule (also mirrored in the frontend's
lib/pricing.ts as a client-side preview - see that file's docstring for why
that duplication is intentional and safe). The backend's calculation here is
what's actually persisted on the Order and never trusted from the client.

| Subtotal                    | Discount | Shipping  |
|------------------------------|---------:|----------:|
| < NPR 100,000                |       0% | NPR 1,500 |
| NPR 100,000 - NPR 200,000    |       0% |      Free |
| > NPR 200,000                |       0% |      Free |

Discounts are currently switched off (both rates are 0); the tier structure
is kept so they can be turned back on by changing the rates alone.
"""

from decimal import Decimal

SHIPPING_FEE = Decimal('1500')

DISCOUNT_TIER_1_MIN = Decimal('100000')  # inclusive - 100,000 itself gets free shipping
DISCOUNT_TIER_2_MIN = Decimal('200000')  # inclusive upper bound of tier 1

DISCOUNT_TIER_1_RATE = Decimal('0')
DISCOUNT_TIER_2_RATE = Decimal('0')


def calculate_discount_and_shipping(subtotal: Decimal) -> tuple[Decimal, Decimal]:
    """Returns (discount, shipping) for a given cart subtotal."""
    if subtotal < DISCOUNT_TIER_1_MIN:
        return Decimal('0'), SHIPPING_FEE

    rate = DISCOUNT_TIER_1_RATE if subtotal <= DISCOUNT_TIER_2_MIN else DISCOUNT_TIER_2_RATE
    discount = (subtotal * rate).quantize(Decimal('0.01'))
    return discount, Decimal('0')
