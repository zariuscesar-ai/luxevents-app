'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Booking = {
  id:string; status:string; event_date:string; total_amount:number; created_at:string
  client_name:string; provider_name:string; event_type:string
}
const STATUS_COLORS:Record<string,string> = {
  pending:'bg-yellow-400/20 text-yellow-400',
  confirmed:'bg-blue-400/20 text-blue-400',
  completed:'bg-green-400/20 text-green-400',
  cancelled:'bg-red-400/20 text-red-400',
}

export default function AdminBookings(){
  const supabase = createClient()
  const [bookings,setBookings] = useState<Booking[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      setLoading(true)
      const {data} = await supabase
        .from('bookings')
        .select(`
          id,status,event_date,total_amount,created_at,event_type,
          profiles!bookings_client_id_fkey(full_name),
          providers(business_name)
        `)
        .order('created_at',{ascending:false})
      setBookings((data??[]).map((b:any)=>({
        ...b,
        client_name: b.profiles?.full_name ?? 'Unknown',
        provider_name: b.providers?.business_name ?? 'Unknown',
      })))
      setLoading(false)
    }
    load()
  },[supabase])  return(
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Bookings</h1>
      {loading?<p className="text-gray-400">Loading...</p>:(
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-left">
              <th className="pb-3 pr-4">Client</th>
              <th className="pb-3 pr-4">Provider</th>
              <th className="pb-3 pr-4">Event Type</th>
              <th className="pb-3 pr-4">Event Date</th>
              <th className="pb-3 pr-4">Amount</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b=>(
              <tr key={b.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="py-3 pr-4 text-white">{b.client_name}</td>
                <td className="py-3 pr-4 text-gray-300">{b.provider_name}</td>
                <td className="py-3 pr-4 text-gray-300">{b.event_type||'—'}</td>
                <td className="py-3 pr-4 text-gray-300">
                  {b.event_date?new Date(b.event_date).toLocaleDateString():'—'}
                </td>
                <td className="py-3 pr-4 text-gray-300">
                  {b.total_amount?'$'+b.total_amount.toLocaleString():'—'}
                </td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[b.status]||'text-gray-400'}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length===0&&<p className="text-gray-500 text-center py-12">No bookings yet.</p>}
      </div>)}
    </div>
  )
}
