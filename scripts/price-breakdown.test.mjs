import { test } from 'node:test'
import assert from 'node:assert/strict'
import { priceBreakdown } from '../src/data/price-breakdown.ts'

test('breakdown reconciles to listed prices to the paise', () => {
  for (const price of [0, 0.01, 1, 1800, 18500, 28600, 42850, 68400, 99999.99]) {
    const result = priceBreakdown(price, '5.24')
    const paise = value => Math.round(value * 100)
    assert.equal(paise(result.metal) + paise(result.making) + paise(result.stone) - paise(result.discount), paise(result.subtotal))
    assert.equal(paise(result.subtotal) + paise(result.gst), paise(price))
    assert.equal(result.total, price)
    assert.ok(result.making >= 0 && result.gst >= 0)
  }
})

test('derived rate uses listed weight and handles missing or invalid weights', () => {
  const result = priceBreakdown(1800, '10.00')
  assert.equal(result.rate, result.metal / 10)
  for (const weight of ['0', '', 'unknown', '-1']) assert.equal(priceBreakdown(1800, weight).rate, undefined)
})

test('stone charges are included once and preserve the catalogue total', () => {
  for (const [price, weight, stone] of [[28600, '2.86', 4800], [35200, '3.12', 7200], [18500, '2.18', 1500]]) {
    const result = priceBreakdown(price, weight, stone)
    const paise = value => Math.round(value * 100)
    assert.equal(result.stone, stone)
    assert.equal(paise(result.metal) + paise(result.making) + paise(result.stone), paise(result.subtotal))
    assert.equal(paise(result.subtotal) + paise(result.gst), paise(price))
    assert.equal(result.total, price)
    assert.ok(result.metal < priceBreakdown(price, weight).metal)
  }
})

test('rejects invalid stone charges', () => {
  for (const stone of [-1, NaN, Infinity, 30000]) assert.throws(() => priceBreakdown(18500, '2.18', stone), RangeError)
})
