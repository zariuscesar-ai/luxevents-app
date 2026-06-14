// Client-safe Stripe config — no server-side Stripe SDK imported here

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 39,
    commissionRate: 0.10,
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
