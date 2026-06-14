import { stripe, PLANS } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { planKey, userId } = await req.json()
    const plan = PLANS[planKey as keyof typeof PLANS]
    if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Get or create Stripe customer
    const { data: provider } = await supabase
      .from('providers')
      .select('id, stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = provider?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { userId: user.id, providerId: provider?.id ?? '' },
      })
      customerId = customer.id
      if (provider?.id) {
        await supabase.from('providers').update({ stripe_customer_id: customerId }).eq('id', provider.id)
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`,
      subscription_data: {
        trial_period_days: 14,
        metadata: { planKey, providerId: provider?.id ?? '' },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe subscription error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
