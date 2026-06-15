import Stripe from 'stripe'

export { PLANS } from './stripe-client'

export const COMMISSION_RATE = Number(process.env.PLATFORM_COMMISSION_RATE ?? 0.10)

// Lazy initialization — safe to import in SSG pages without STRIPE_SECRET_KEY set
function createStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return new Proxy({} as Stripe, {
      get() {
        throw new Error('STRIPE_SECRET_KEY environment variable is not configured')
      },
    })
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-11-20.acacia',
  })
}

export const stripe = createStripeClient()

export function calculateFees(amount: number, commissionRate = COMMISSION_RATE) {
  const platformFee = Math.round(amount * commissionRate * 100) / 100
  const providerAmount = Math.round((amount - platformFee) * 100) / 100
  return { platformFee, providerAmount }
}
