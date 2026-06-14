import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { Calendar, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  disputed: 'bg-orange-100 text-orange-700',
}

export default async function BookingsDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: provider } = await supabase.from('providers').select('id').eq('user_id', user.id).single()
  if (!provider) redirect('/dashboard/profile')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, client:profiles(full_name, phone), service:services(name)')
    .eq('provider_id', provider.id)
    .order('event_date', { ascending: false })

  const pending = bookings?.filter(b => b.status === 'pending') ?? []
  const upcoming = bookings?.filter(b => b.status === 'confirmed') ?? []
  const completed = bookings?.filter(b => b.status === 'completed') ?? []

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Bookings</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending', value: pending.length, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Confirmed', value: upcoming.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', value: completed.length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Revenue', value: `$${completed.reduce((s, b) => s + b.provider_amount, 0).toLocaleString()}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-4.5 h-4.5 ${color}`} style={{ width: '1.1rem', height: '1.1rem' }} />
            </div>
            <div className="text-xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <p className="text-sm font-semibold text-yellow-800">⚠️ {pending.length} booking{pending.length > 1 ? 's' : ''} awaiting your confirmation</p>
        </div>
      )}

      {!bookings || bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No bookings yet</p>
          <p className="text-gray-400 text-sm mt-1">Bookings from clients will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Service</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 text-sm">{b.client?.full_name ?? 'Client'}</div>
                    {b.event_type && <div className="text-xs text-gray-400">{b.event_type}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(b.event_date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.service?.name ?? 'Custom'}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">${b.provider_amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">after fees</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {b.status === 'pending' && (
                      <form action={`/api/bookings/${b.id}/confirm`} method="POST">
                        <button type="submit" className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">
                          Confirm
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
