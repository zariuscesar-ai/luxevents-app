import { stripe, calculateFees } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { providerId, serviceId, eventDate, eventType, guestCount, totalAmount, notes } = body

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: provider } = await supabase
      .from('providers')
      .select('commission_rate, stripe_customer_id, business_name')
      .eq('id', providerId)
      .single()

    if (!provider) return NextResponse.json({ error: 'Provider not found' }, { status: 404 })

    const { platformFee, providerAmount } = calculateFees(totalAmount, provider.commission_rate)

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'usd',
      metadata: {
        providerId,
        serviceId: serviceId ?? '',
        clientId: user.id,
        eventDate,
      },
      description: `LuxEvents booking — ${provider.business_name}`,
    })

    // Save booking record
    const { data: booking } = await supabase.from('bookings').insert({
      client_id: user.id,
      provider_id: providerId,
      service_id: serviceId || null,
      event_date: eventDate,
      event_type: eventType || null,
      guest_count: guestCount || null,
      total_amount: totalAmount,
      platform_fee: platformFee,
      provider_amount: providerAmount,
      status: 'pending',
      stripe_payment_intent_id: paymentIntent.id,
      client_notes: notes || null,
    }).select().single()

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      bookingId: booking?.id,
    })
  } catch (err: any) {
    console.error('Booking payment error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
