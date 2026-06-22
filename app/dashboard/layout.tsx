'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Image, Calendar, Star,
  CreditCard, User, LogOut, Menu, ChevronRight, Settings
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/media', label: 'Photos & Media', icon: Image },
  { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/dashboard/booking-settings', label: 'Booking Settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [providerName, setProviderName] = useState('My Business')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const { data: provider } = await supabase
        .from('providers')
        .select('business_name')
        .eq('user_id', data.user.id)
        .single()
      if (provider) setProviderName(provider.business_name)
    })
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={'fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 lg:translate-x-0 ' + (sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-lg font-serif font-bold text-white">LuxEvents</span>
            </Link>
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Vendor Dashboard</p>
              <p className="text-sm font-semibold text-white truncate">{providerName}</p>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {NAV.map(({ href, label, icon: Icon, exact }) => (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ' + (
                  isActive(href, exact) ? 'bg-yellow-500 text-black' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {isActive(href, exact) && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-800">
            <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              View Live Site
            </Link>
            <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-1">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center gap-4 sticky top-0 z-30">
          <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <Link href="/signup?role=provider" className="text-sm text-yellow-600 font-medium hover:text-yellow-700 hidden sm:block">
            Upgrade Plan →
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
