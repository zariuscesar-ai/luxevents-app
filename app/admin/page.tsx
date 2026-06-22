'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState({ providers: 0, bookings: 0, users: 0, revenue: 0 })

  useEffect(() => {
    async function load() {
      const [{ count: providers }, { count: bookings }, { count: users }, { data: rev }] = await Promise.all([
        supabase.from('providers').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('total_amount').eq('status', 'completed'),
      ])
      const revenue = (rev ?? []).reduce((s: number, b: any) => s + (b.total_amount ?? 0), 0)
      setStats({ providers: providers ?? 0, bookings: bookings ?? 0, users: users ?? 0, revenue })
    }
    load()
  }, [])

  const cards = [
    { label: 'Total Providers', value: stats.providers, icon: '👤', href: '/admin/providers' },
    { label: 'Total Bookings', value: stats.bookings, icon: '📅', href: '/admin/bookings' },
    { label: 'Total Users', value: stats.users, icon: '🧑', href: '/admin/users' },
    { label: 'Revenue', value: '$' + stats.revenue.toLocaleString(), icon: '💰', href: '/admin/bookings' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map(card => (
          <Link key={card.label} href={card.href}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-400/50 transition-colors">
            <div className="text-3xl mb-3">{card.icon}</div>
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <div className="text-sm text-gray-400 mt-1">{card.label}</div>
          </Link>
        ))}
      </div>
      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/providers" className="bg-yellow-400 text-gray-950 px-4 py-2 rounded-lg font-medium text-sm hover:bg-yellow-300 transition-colors">
          Manage Providers
        </Link>
        <Link href="/admin/bookings" className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-700 transition-colors">
          View Bookings
        </Link>
        <Link href="/admin/users" className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-700 transition-colors">
          Manage Users
        </Link>
      </div>
    </div>
  )
}
