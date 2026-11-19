// Demo allocation of the catalogue total, not a jeweller quote or live rate.
// Work in paise so the displayed components always reconcile exactly.
export function priceBreakdown(price: number, weight: string, stoneCharges = 0) {
  const total = Math.round(price * 100)
  const subtotal = Math.round(total / 1.03)
  const stone = Math.round(stoneCharges * 100)
  if (!Number.isFinite(stone) || stone < 0 || stone > subtotal) throw new RangeError('Stone charges must be between zero and the pre-tax subtotal')
  const metal = Math.round((subtotal - stone) / 1.15)
  const making = subtotal - stone - metal
  const gst = total - subtotal
  const grams = Number(weight)
  return {
    metal: metal / 100,
    making: making / 100,
    stone: stone / 100,
    discount: 0,
    subtotal: subtotal / 100,
    gst: gst / 100,
    total: total / 100,
    rate: Number.isFinite(grams) && grams > 0 ? metal / 100 / grams : undefined,
  }
}
