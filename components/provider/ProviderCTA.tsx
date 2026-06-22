'use client'
import Link from 'next/link'
import { Calendar, Mail, Phone, Globe, CheckCircle } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface ProviderCTAProps {
  providerId: string
  bookingEnabled: boolean
  minPrice: number | null
  maxPrice: number | null
  contactEmail: string | null
  contactPhone: string | null
  website: string | null
  subscriptionPlan: string
}

export default function ProviderCTA({
  providerId, bookingEnabled, minPrice, maxPrice,
  contactEmail, contactPhone, website, subscriptionPlan,
}: ProviderCTAProps) {
  function fmt(min: number | null, max: number | null) {
    if (!min && !max) return 'Contact for pricing'
    if (min && max) return '$' + min.toLocaleString() + ' – $' + max.toLocaleString()
    if (min) return 'From $' + min.toLocaleString()
    return 'Up to $' + max!.toLocaleString()
  }
  const isPro = subscriptionPlan === 'professional'
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
      {isPro && (
        <div className="flex items-center gap-1.5 mb-3 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5">
          <span className="text-yellow-600 text-xs font-semibold">⭐ Pro Vendor</span>
        </div>
      )}
      <div className="text-center mb-4">
        <p className="text-2xl font-bold text-gray-900">{fmt(minPrice, maxPrice)}</p>
      </div>      {bookingEnabled ? (
        <>
          <Link href={'/book/' + providerId}
            onClick={() => trackEvent(providerId, 'book_click')}
            className="block w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3.5 rounded-xl text-center transition-colors">
            <Calendar className="w-4 h-4 inline mr-2" />
            Check Availability &amp; Book
          </Link>
          <p className="text-center text-xs text-gray-400 mt-2">Secure booking · Deposit protected</p>
        </>
      ) : (
        <div className="space-y-3">
          <p className="text-center text-sm text-gray-500 mb-3">Contact this vendor directly to discuss your event</p>
          {contactEmail && (
            <a href={'mailto:' + contactEmail} onClick={() => trackEvent(providerId, 'contact_click')}
              className="flex items-center justify-center gap-2 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition-colors">
              <Mail className="w-4 h-4" /> Send Message
            </a>
          )}
          {contactPhone && (
            <a href={'tel:' + contactPhone} onClick={() => trackEvent(providerId, 'phone_click')}
              className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 hover:border-yellow-400 text-gray-700 font-semibold py-3 rounded-xl transition-colors">
              <Phone className="w-4 h-4" /> {contactPhone}
            </a>
          )}
        </div>
      )}
      <div className="mt-6 space-y-2 text-sm text-gray-500">
        <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> Verified vendor profiles</div>
        <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> Reviewed by real clients</div>
        {bookingEnabled && <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> Deposit held until event day</div>}
      </div>
    </div>
  )
}
