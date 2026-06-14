'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Calendar, Users, FileText, DollarSign } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ clientSecret, bookingId }: { clientSecret: string; bookingId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setProcessing(true)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/client/bookings?success=true` },
    })
    if (error) { setError(error.message ?? 'Payment failed'); setProcessing(false) }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement className="mb-6" />
      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition-colors"
      >
        {processing ? 'Processing...' : 'Confirm & Pay'}
      </button>
      <p className="text-xs text-gray-400 text-center mt-3">🔒 Secured by Stripe · Your card is never stored on our servers</p>
    </form>
  )
}

export default function BookPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [provider, setProvider] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [selectedService, setSelectedService] = useState<string>('')
  const [eventDate, setEventDate] = useState('')
  const [eventType, setEventType] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [notes, setNotes] = useState('')
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [clientSecret, setClientSecret] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: p } = await supabase.from('providers').select('*, services(*)').eq('id', params.providerId).single()
      if (!p) { router.push('/providers'); return }
      setProvider(p)
      setServices((p as any).services?.filter((s: any) => s.is_active) ?? [])
    }
    load()
  }, [params.providerId])

  const selectedSvc = services.find(s => s.id === selectedService)
  const computedTotal = selectedSvc?.price || total

  const handleProceedToPayment = async () => {
    if (!eventDate || !computedTotal) { setError('Please select a date and service'); return }
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login?redirect=/book/' + params.providerId); return }

    const res = await fetch('/api/stripe/create-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: params.providerId,
        serviceId: selectedService || null,
        eventDate,
        eventType,
        guestCount: guestCount ? parseInt(guestCount) : null,
        totalAmount: computedTotal,
        notes,
      }),
    })
    const json = await res.json()
    if (json.clientSecret) {
      setClientSecret(json.clientSecret)
      setBookingId(json.bookingId)
      setStep('payment')
    } else {
      setError(json.error || 'Error creating booking')
    }
    setLoading(false)
  }

  if (!provider) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full" /></div>

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gray-900 text-white p-6">
            <p className="text-yellow-400 text-sm font-medium mb-1">Booking Request</p>
            <h1 className="text-2xl font-serif font-bold">{provider.business_name}</h1>
          </div>

          <div className="p-6">
            {step === 'details' ? (
              <div className="space-y-5">
                {services.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select a Package</label>
                    <div className="space-y-2">
                      {services.map((svc) => (
                        <label key={svc.id} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors ${selectedService === svc.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 hover:border-gray-200'}`}>
                          <input type="radio" name="service" value={svc.id} className="hidden" checked={selectedService === svc.id} onChange={() => setSelectedService(svc.id)} />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{svc.name}</div>
                            {svc.description && <div className="text-xs text-gray-400 mt-0.5">{svc.description}</div>}
                          </div>
                          {svc.price && <div className="font-bold text-gray-900 ml-4">${svc.price.toLocaleString()}</div>}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5"><Calendar className="w-4 h-4 inline mr-1" />Event Date *</label>
                  <input type="date" value={eventDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setEventDate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Type</label>
                  <input value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="Wedding, Birthday, Corporate..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5"><Users className="w-4 h-4 inline mr-1" />Estimated Guests</label>
                  <input type="number" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} placeholder="150" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>

                {!selectedService && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5"><DollarSign className="w-4 h-4 inline mr-1" />Total Amount ($)</label>
                    <input type="number" value={total || ''} onChange={(e) => setTotal(parseFloat(e.target.value))} placeholder="2500" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5"><FileText className="w-4 h-4 inline mr-1" />Notes</label>
                  <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requirements, theme, details..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>

                {computedTotal > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 text-sm">
                    <div className="flex justify-between text-gray-600"><span>Service total</span><span>${computedTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold text-gray-900 mt-2 pt-2 border-t border-gray-200"><span>Total charged today</span><span>${computedTotal.toLocaleString()}</span></div>
                  </div>
                )}

                {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

                <button onClick={handleProceedToPayment} disabled={loading || !eventDate || !computedTotal} className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition-colors">
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </div>
            ) : (
              clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <CheckoutForm clientSecret={clientSecret} bookingId={bookingId} />
                </Elements>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
