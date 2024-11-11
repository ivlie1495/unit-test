import { it, expect, describe } from 'vitest'

import { calculateDiscount } from '../src/main'

describe('calculateDiscount', () => {
  it('should return the discounted price', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9)
    expect(calculateDiscount(10, 'SAVE20')).toBe(8)
  })

  it('should handle negative prices', () => {
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i)
  })

  it('should handle invalid discount codes', () => {
    expect(calculateDiscount(10, 'INVALID')).toBe(10)
  })
})
