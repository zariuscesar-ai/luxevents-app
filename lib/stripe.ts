import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export { PLANS } from './stripe-client'

export const COMMISSION_RATE = Number(process.env.PLATFORM_COMMISSION_RATE ?? 0.10)

export function calculateFees(amount: number, commissionRate = COMMISSION_RATE) {
  const platformFee = Math.round(amount * commissionRate * 100) / 100
  const providerAmount = Math.round((amount - platformFee) * 100) / 100
  return { platformFee, providerAmount }
}
