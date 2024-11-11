import { vi, it, expect, describe } from 'vitest'

import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from '../src/mocking'
import { getExchangeRate } from '../src/libs/currency'
import { getShippingQuote } from '../src/libs/shipping'
import { trackPageView } from '../src/libs/analytics'
import { charge } from '../src/libs/payment'
import { sendEmail } from '../src/libs/email'
import security from '../src/libs/security'

vi.mock('../src/libs/currency')
vi.mock('../src/libs/shipping')
vi.mock('../src/libs/analytics')
vi.mock('../src/libs/payment')
vi.mock('../src/libs/email', async (original) => {
  const modules = await original()
  return {
    ...modules,
    sendEmail: vi.fn(),
  }
})

describe('test suite', () => {
  it('test case', () => {
    const sendText = vi.fn()
    sendText.mockReturnValue('ok')

    sendText('message')
    expect(sendText).toHaveBeenCalledWith('message')
    expect(sendText).toHaveReturnedWith('ok')
  })
})

describe('getPriceInCurrency', () => {
  it('returns the price in the given currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5)

    const price = getPriceInCurrency(10, 'USD')
    expect(price).toBe(15)
  })
})

describe('getShippingInfo', () => {
  it('returns the shipping cost', () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 })

    const shippingInfo = getShippingInfo('New York')
    expect(shippingInfo).toMatch(/shipping cost: \$10 \(2 days\)/i)
  })

  it('returns "Shipping Unavailable" if there is no shipping quote', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null)

    const shippingInfo = getShippingInfo('New York')
    expect(shippingInfo).toMatch(/Unavailable/i)
  })
})

describe('renderPage', () => {
  it('returns the rendered page content', async () => {
    const result = await renderPage()
    expect(result).toMatch(/content/i)
  })

  it('should call trackPageView', async () => {
    await renderPage()
    expect(trackPageView).toHaveBeenCalledWith('/home')
  })
})

describe('submitOrder', () => {
  const order = { totalAmount: 10 }
  const creditCard = { creditCardNumber: '123456' }

  it('should charge the credit card', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' })

    await submitOrder(order, creditCard)
    expect(charge).toBeCalledWith(creditCard, order.totalAmount)
  })

  it('should return success when payment is successful', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' })

    const result = await submitOrder(order, creditCard)
    expect(result).toEqual({ success: true })
  })

  it('should return error when payment fails', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'failed' })

    const result = await submitOrder(order, creditCard)
    expect(result).toEqual({ success: false, error: 'payment_error' })
  })
})

describe('signUp', () => {
  const email = 'test@example.com'

  it('should return false if email is invalid', async () => {
    const result = await signUp('invalid_email')
    expect(result).toBe(false)
  })

  it('should return true if email is valid', async () => {
    const result = await signUp(email)
    expect(result).toBe(true)
  })

  it('should send an email', async () => {
    await signUp(email)

    expect(sendEmail).toHaveBeenCalledOnce()
    const args = vi.mocked(sendEmail).mock.calls[0]

    expect(args[0]).toBe(email)
    expect(args[1]).toMatch(/welcome/i)
  })
})

describe('login', () => {
  it('should send an email with the code', async () => {
    const spy = vi.spyOn(security, 'generateCode')

    await login('test@example.com')

    expect(sendEmail).toHaveBeenCalled()

    const securityCode = spy.mock.results[0].value.toString()
    expect(sendEmail).toHaveBeenCalledWith('test@example.com', securityCode)
  })
})

describe('isOnline', () => {
  it('should return false if the current hour is outside opening and closing hours', () => {
    vi.setSystemTime('2024-01-01 07:59')
    expect(isOnline()).toBe(false)

    vi.setSystemTime('2024-01-01 20:01')
    expect(isOnline()).toBe(false)
  })

  it('should return true if the current hour is within opening and closing hours', () => {
    vi.setSystemTime('2024-01-01 08:00')
    expect(isOnline()).toBe(true)

    vi.setSystemTime('2024-01-01 19:59')
    expect(isOnline()).toBe(true)
  })
})

describe('getDiscount', () => {
  it('should return 0.2 if on christmas day', () => {
    vi.setSystemTime('2024-12-25 00:01')
    expect(getDiscount()).toBe(0.2)

    vi.setSystemTime('2024-12-25 23:59')
    expect(getDiscount()).toBe(0.2)
  })

  it('should return 0 if outside of christmas day', () => {
    vi.setSystemTime('2024-12-24 23:59')
    expect(getDiscount()).toBe(0)

    vi.setSystemTime('2024-12-26 00:01')
    expect(getDiscount()).toBe(0)
  })
})
