import { it, expect, describe } from 'vitest'

import { calculateAverage, factorial, fizzBuzz, max } from '../src/intro'

describe('max', () => {
  it('should return the first argument if it is greater', () => {
    expect(max(2, 1)).toBe(2)
  })

  it('should return the second argument if it is greater', () => {
    expect(max(1, 2)).toBe(2)
  })

  it('should return the first argument if it is equal', () => {
    expect(max(1, 1)).toBe(1)
  })
})

describe('fizzBuzz', () => {
  it('should return FizzBuzz for multiples of 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz')
  })

  it('should return Fizz for multiples of 3', () => {
    expect(fizzBuzz(3)).toBe('Fizz')
  })

  it('should return Buzz for multiples of 5', () => {
    expect(fizzBuzz(5)).toBe('Buzz')
  })

  it('should return the number as a string if it is not divisible by 3 or 5', () => {
    expect(fizzBuzz(1)).toBe('1')
  })
})

describe('calculateAverage', () => {
  it('should return 0 if no numbers are provided', () => {
    expect(calculateAverage([])).toBe(0)
  })

  it('should return the average of one number', () => {
    expect(calculateAverage([1])).toBe(1)
  })

  it('should return the average of two numbers', () => {
    expect(calculateAverage([5, 10])).toBe(7.5)
  })

  it('should return the average of three numbers', () => {
    expect(calculateAverage([1, 2, 3])).toBe(2)
  })
})

describe('factorial', () => {
  it('should return 1 for 0', () => {
    expect(factorial(0)).toBe(1)
  })

  it('should return 1 for 1', () => {
    expect(factorial(1)).toBe(1)
  })

  it('should return 2 for 2', () => {
    expect(factorial(2)).toBe(2)
  })

  it('should return 6 for 3', () => {
    expect(factorial(3)).toBe(6)
  })

  it('should return 24 for 4', () => {
    expect(factorial(4)).toBe(24)
  })

  it('should return undefined for negative numbers', () => {
    expect(factorial(-1)).toBeUndefined()
  })

  it('should return NaN for non-integers', () => {
    expect(factorial('test')).toBeNaN()
  })
})
