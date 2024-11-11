import { it, expect, describe, beforeEach } from 'vitest'

import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
  validateUserInput,
} from '../src/core'

describe('getCoupons', () => {
  it('should return an array of coupons', () => {
    const coupons = getCoupons()

    expect(coupons).toBeInstanceOf(Array)
    expect(coupons.length).toBeGreaterThan(0)
  })

  it('should return an array of coupons with correct discount codes', () => {
    const coupons = getCoupons()

    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('code')
      expect(typeof coupon.code).toBe('string')
      expect(coupon.code).toBeTruthy()
    })
  })

  it('should return an array of coupons with correct discount values', () => {
    const coupons = getCoupons()

    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('discount')
      expect(typeof coupon.discount).toBe('number')
      expect(coupon.discount).toBeGreaterThan(0)
      expect(coupon.discount).toBeLessThan(1)
    })
  })
})

describe('calculateDiscount', () => {
  it('should return the discounted price', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9)
    expect(calculateDiscount(10, 'SAVE20')).toBe(8)
  })

  it('should handle non-numeric prices', () => {
    expect(calculateDiscount('10', 'SAVE10')).toMatch(/invalid/i)
  })

  it('should handle negative prices', () => {
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i)
  })

  it('should handle non-string discount codes', () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i)
  })

  it('should handle invalid discount codes', () => {
    expect(calculateDiscount(10, 'INVALID')).toBe(10)
  })
})

describe('validateUserInput', () => {
  it('should return success message for valid input', () => {
    expect(validateUserInput('John', 25)).toMatch(/success/i)
  })

  it('should return error message if username is not a string', () => {
    expect(validateUserInput(25, 25)).toMatch(/invalid/i)
  })

  it('should return error message if username is less than 3 characters', () => {
    expect(validateUserInput('J', 25)).toMatch(/invalid/i)
  })

  it('should return error message if username is more than 15 characters', () => {
    expect(validateUserInput('A'.repeat(16), 25)).toMatch(/invalid/i)
  })

  it('should return error message if age is not a number', () => {
    expect(validateUserInput('John', '25')).toMatch(/invalid/i)
  })

  it('should return error message if age is less than 18', () => {
    expect(validateUserInput('John', 17)).toMatch(/invalid/i)
  })

  it('should return error message if age is more than 100', () => {
    expect(validateUserInput('John', 101)).toMatch(/invalid/i)
  })

  it('should return error message if username and age are invalid', () => {
    expect(validateUserInput('', 25)).toMatch(/invalid username/i)
    expect(validateUserInput('John', 0)).toMatch(/invalid age/i)
  })
})

describe('isPriceInRange', () => {
  it.each([
    { scenario: 'price < min', price: -10, expected: false },
    { scenario: 'price > max', price: 40, expected: false },
    { scenario: 'price = min', price: 0, expected: true },
    { scenario: 'price = max', price: 20, expected: true },
    { scenario: 'price between min and max', price: 10, expected: true },
  ])('should return $result for $scenario', ({ price, expected }) => {
    expect(isPriceInRange(price, 0, 20)).toBe(expected)
  })
})

describe('isValidUsername', () => {
  const minLength = 5
  const maxLength = 15

  it('should return true if username is at the min or max length', () => {
    expect(isValidUsername('A'.repeat(minLength))).toBe(true)
    expect(isValidUsername('A'.repeat(maxLength))).toBe(true)
  })

  it('should return false if username is too short', () => {
    expect(isValidUsername('A'.repeat(minLength - 1))).toBe(false)
  })

  it('should return false if username is too long', () => {
    expect(isValidUsername('A'.repeat(maxLength + 1))).toBe(false)
  })

  it('should return true if username is in range', () => {
    expect(isValidUsername('A'.repeat(minLength + 1))).toBe(true)
    expect(isValidUsername('A'.repeat(maxLength - 1))).toBe(true)
  })

  it('should return false if username is invalid', () => {
    expect(isValidUsername(null)).toBe(false)
    expect(isValidUsername('')).toBe(false)
    expect(isValidUsername()).toBe(false)
  })
})

describe('canDrive', () => {
  it('should return error for invalid country code', () => {
    expect(canDrive(20, 'ID')).toMatch(/invalid/i)
  })

  it.each([
    { age: 15, country: 'US', expected: false },
    { age: 16, country: 'US', expected: true },
    { age: 24, country: 'US', expected: true },
    { age: 16, country: 'UK', expected: false },
    { age: 17, country: 'UK', expected: true },
    { age: 24, country: 'UK', expected: true },
  ])(
    'should return $expected for $age in $country',
    ({ age, country, expected }) => {
      expect(canDrive(age, country)).toBe(expected)
    },
  )
})

describe('fetchData', () => {
  it('should return a promise of an array of numbers', async () => {
    try {
      const result = await fetchData()

      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThan(0)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toMatch(/empty/i)
    }
  })
})

describe('stack', () => {
  let stack
  beforeEach(() => {
    stack = new Stack()
  })

  it('push should add an item to the stack', () => {
    stack.push(1)
    expect(stack.size()).toBe(1)
  })

  it('pop should remove an item from the stack', () => {
    stack.push(1)
    stack.push(2)

    const item = stack.pop()
    expect(item).toBe(2)
    expect(stack.size()).toBe(1)
  })

  it('pop should throw an error if the stack is empty', () => {
    expect(() => stack.pop()).toThrowError(/empty/i)
  })

  it('peek should return the last item in the stack', () => {
    stack.push(1)
    stack.push(2)

    const item = stack.peek()
    expect(item).toBe(2)
    expect(stack.size()).toBe(2)
  })

  it('peek should throw an error if the stack is empty', () => {
    expect(() => stack.peek()).toThrowError(/empty/i)
  })

  it('isEmpty should return true if the stack is empty', () => {
    expect(stack.isEmpty()).toBe(true)
  })

  it('isEmpty should return false if the stack is not empty', () => {
    stack.push(1)
    expect(stack.isEmpty()).toBe(false)
  })

  it('size should return the number of items in the stack', () => {
    stack.push(1)
    stack.push(2)

    expect(stack.size()).toBe(2)
  })

  it('clear should remove all items from the stack', () => {
    stack.push(1)
    stack.push(2)

    stack.clear()
    expect(stack.size()).toBe(0)
  })
})
