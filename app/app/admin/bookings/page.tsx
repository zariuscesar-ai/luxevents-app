'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminBookingsPage() {
  const supabase = createClient()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('bookings').select('*, provider:providers(business_name), client:profiles(full_name)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setBookings(data ?? []); setLoading(false) })
  }, [supabase])

  const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    confirmed: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
    disputed: 'bg-orange-500/20 text-orange-400',
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-1">Bookings</h1>
      <p className="text-gray-400 text-sm mb-6">{bookings.length} total</p>
      {loading ? <div className="text-gray-400">Loading…</div> : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Provider</th>
                <th className="px-4 py-3 text-left">Event Date</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {bookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-gray-800/50">
                  <td className="px-4 py-3">{b.client?.full_name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{b.provider?.business_name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{b.event_date ? new Date(b.event_date).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">${Number(b.total_amount).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[b.status] ?? 'bg-gray-700 text-gray-400'}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-500">No bookings yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}