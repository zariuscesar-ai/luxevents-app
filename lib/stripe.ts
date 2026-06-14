import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 39,
    commissionRate: 0.10,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: [
      'Listed in the directory',
      'Up to 10 photos',
      'Unlimited service packages',
      'Review collection',
      'Booking management',
      '10% commission on bookings',
    ],
  },
  professional: {
    name: 'Professional',
    price: 99,
    commissionRate: 0.07,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Priority placement in search',
      'Unlimited photos',
      'Unlimited service packages',
      'Review collection & responses',
      'Analytics dashboard',
      'Posts & tips content feature',
      '7% commission on bookings',
    ],
  },
}

export const COMMISSION_RATE = Number(process.env.PLATFORM_COMMISSION_RATE ?? 0.10)

export function calculateFees(amount: number, commissionRate = COMMISSION_RATE) {
  const platformFee = Math.round(amount * commissionRate * 100) / 100
  const providerAmount = Math.round((amount - platformFee) * 100) / 100
  return { platformFee, providerAmount }
}
