import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { formatDate } from '@/lib/utils'
import { Calendar, CheckCircle } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default async function ClientBookingsPage({ searchParams }: { searchParams: { success?: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, provider:providers(business_name, slug, cover_image_url, category), service:services(name)')
    .eq('client_id', user.id)
    .order('event_date', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
        {searchParams.success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-green-700 font-medium">Booking confirmed! We'll notify the vendor and send you a confirmation email.</p>
          </div>
        )}

        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">My Bookings</h1>

        {!bookings || bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No bookings yet</p>
            <p className="text-gray-400 text-sm mt-1">Find the perfect vendor for your event</p>
            <Link href="/providers" className="mt-4 inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
              Browse Vendors
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b: any) => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-yellow-50 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                  {b.provider?.cover_image_url ? (
                    <img src={b.provider.cover_image_url} alt="" className="w-full h-full object-cover" />
                  ) : '🎉'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/providers/${b.provider?.slug}`} className="font-semibold text-gray-900 hover:text-yellow-600 transition-colors">
                        {b.provider?.business_name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-0.5">{b.service?.name ?? b.event_type ?? 'Custom booking'}</p>
                    </div>
                    <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(b.event_date)}</span>
                    <span className="font-semibold text-gray-700">${b.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
