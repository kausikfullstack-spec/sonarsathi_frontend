import type { Product } from '../data/catalogue'
import { priceBreakdown } from '../data/price-breakdown'
import './price-breakdown.css'

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const amount = (value: number) => currency.format(value)

export default function PriceBreakdown({ product }: { product: Product }) {
  const breakdown = priceBreakdown(product.price, product.weight, product.stoneCharges)
  const metal = product.metal ?? 'Gold'
  return <section className="price-breakdown" aria-label="Transparent price breakdown">
    <div className="price-breakdown-heading">
      <h2>Transparent Price Breakdown</h2>
    </div>
    <div className="price-breakdown-scroll" role="region" aria-label="Price breakdown table, scroll horizontally on smaller screens" tabIndex={0}>
      <table>
        <caption className="price-breakdown-caption">Estimated components of {product.name}'s listed price</caption>
        <thead><tr><th scope="col">Product details</th><th scope="col">{metal} rate</th><th scope="col">Weight</th><th scope="col">Discount</th><th scope="col">Value</th></tr></thead>
        <tbody>
          <tr><th scope="row">{product.purity} {metal}</th><td>{breakdown.rate === undefined ? '—' : `${amount(breakdown.rate)}/g`}<small>Derived estimate</small></td><td>{product.weight} g<small>Listed weight</small></td><td>—</td><td>{amount(breakdown.metal)}</td></tr>
          <tr><th scope="row">Making charges (15%)</th><td>—</td><td>—</td><td>—</td><td>{amount(breakdown.making)}</td></tr>
          <tr><th scope="row">Stone charges</th><td>—</td><td>—</td><td>—</td><td>{amount(breakdown.stone)}</td></tr>
          <tr><th scope="row">Breakdown discount</th><td>—</td><td>—</td><td>None applied</td><td>{amount(breakdown.discount)}</td></tr>
          <tr className="price-breakdown-subtotal"><th scope="row">Sub total</th><td>—</td><td>{product.weight} g</td><td>—</td><td>{amount(breakdown.subtotal)}</td></tr>
          <tr><th scope="row">GST (3% estimate)</th><td>—</td><td>—</td><td>—</td><td>{amount(breakdown.gst)}</td></tr>
        </tbody>
        <tfoot><tr><th scope="row" colSpan={4}>Grand total</th><td>{amount(breakdown.total)}</td></tr></tfoot>
      </table>
    </div>
    <div className="price-breakdown-footer"><span>Pricing mode<strong>Sample catalogue price</strong></span><span>Listed price<strong>{amount(product.price)}</strong></span><span>Selling discount<strong>None applied</strong></span></div>
  </section>
}
