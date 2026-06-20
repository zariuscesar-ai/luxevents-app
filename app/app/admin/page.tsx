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
      const revenue = (rev ?? []).reduce((s: number, b: { total_amount: number }) => s + b.total_amount, 0)
      setStats({ providers: providers ?? 0, bookings: bookings ?? 0, users: users ?? 0, revenue })
    }
    load()
  }, [supabase])

  const cards = [
    { label: 'Total Providers', value: stats.providers, icon: '👤', href: '/admin/providers', color: 'from-blue-500/20 to-blue-600/10' },
    { label: 'Total Bookings', value: stats.bookings, icon: '📅', href: '/admin/bookings', color: 'from-purple-500/20 to-purple-600/10' },
    { label: 'Total Users', value: stats.users, icon: '🧑', href: '/admin/users', color: 'from-green-500/20 to-green-600/10' },
    { label: 'Revenue (completed)', value: `$${stats.revenue.toLocaleString()}`, icon: '💰', href: '/admin/bookings', color: 'from-yellow-500/20 to-yellow-600/10' },
  ]

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-8">Welcome back, Admin</p>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <Link key={c.label} href={c.href}
            className={`bg-gradient-to-br ${c.color} border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition-colors`}>
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className="text-2xl font-bold">{c.value}</div>
            <div className="text-gray-400 text-sm mt-0.5">{c.label}</div>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { href: '/admin/providers', icon: '➕', label: 'Add Provider', desc: 'Add a new event vendor' },
          { href: '/admin/providers', icon: '✅', label: 'Verify Providers', desc: 'Review & verify listings' },
          { href: '/admin/bookings', icon: '📋', label: 'Manage Bookings', desc: 'View all bookings' },
          { href: '/admin/users', icon: '🔑', label: 'Manage Users', desc: 'Change roles & access' },
        ].map(a => (
          <Link key={a.href + a.label} href={a.href}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-colors flex items-center gap-3">
            <span className="text-2xl">{a.icon}</span>
            <div>
              <div className="font-medium text-sm">{a.label}</div>
              <div className="text-gray-500 text-xs">{a.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}