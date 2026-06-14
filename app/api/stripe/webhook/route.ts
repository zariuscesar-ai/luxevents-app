import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode === 'subscription') {
        const providerId = session.subscription_data?.metadata?.providerId
        if (providerId && session.subscription) {
          await supabase.from('providers').update({
            stripe_subscription_id: session.subscription as string,
            subscription_status: 'active',
            subscription_plan: session.subscription_data?.metadata?.planKey ?? 'basic',
          }).eq('id', providerId)
        }
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const providerId = sub.metadata?.providerId
      if (providerId) {
        await supabase.from('providers').update({
          subscription_status: sub.status as any,
        }).eq('id', providerId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const providerId = sub.metadata?.providerId
      if (providerId) {
        await supabase.from('providers').update({
          subscription_status: 'cancelled',
        }).eq('id', providerId)
      }
      break
    }

    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      await supabase.from('bookings').update({ status: 'confirmed' })
        .eq('stripe_payment_intent_id', pi.id)
      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      await supabase.from('bookings').update({ status: 'cancelled' })
        .eq('stripe_payment_intent_id', pi.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
