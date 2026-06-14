'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { Menu, X, ChevronDown, Star } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => { subscription.unsubscribe(); window.removeEventListener('scroll', onScroll) }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <span className={`text-xl font-serif font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              LuxEvents
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/providers" className={`text-sm font-medium hover:text-yellow-500 transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}>
              Find Vendors
            </Link>
            <Link href="/categories" className={`text-sm font-medium hover:text-yellow-500 transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}>
              Categories
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors">
                  Dashboard
                </Link>
                <button onClick={signOut} className={`text-sm font-medium hover:text-yellow-500 transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className={`text-sm font-medium hover:text-yellow-500 transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                  Log In
                </Link>
                <Link href="/signup" className="bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                  Join as Vendor
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen
              ? <X className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
              : <Menu className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link href="/providers" className="block text-sm font-medium text-gray-700 hover:text-yellow-600" onClick={() => setMenuOpen(false)}>Find Vendors</Link>
            <Link href="/categories" className="block text-sm font-medium text-gray-700 hover:text-yellow-600" onClick={() => setMenuOpen(false)}>Categories</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block text-sm font-medium text-yellow-600" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={signOut} className="block text-sm font-medium text-gray-700">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Log In</Link>
                <Link href="/signup" className="block bg-yellow-500 text-black text-sm font-semibold px-4 py-2 rounded-full text-center" onClick={() => setMenuOpen(false)}>Join as Vendor</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
