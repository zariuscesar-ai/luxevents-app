import Link from 'next/link'
import { Star, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <span className="text-xl font-serif font-bold">LuxEvents</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Connecting clients with premium event professionals for unforgettable experiences.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/luxevents.app" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com/luxeventsapp" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-9 h-9 bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/luxeventsapp" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                className="w-9 h-9 bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">Explore</h3>
            <ul className="space-y-3">
              <li><Link href="/categories" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Browse Categories</Link></li>
              <li><Link href="/providers" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">All Providers</Link></li>
              <li><Link href="/dashboard" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Provider Dashboard</Link></li>
              <li><Link href="/client/bookings" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Refund Policy</Link></li>
              <li><Link href="/cookie-policy" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Cookie Policy</Link></li>
              <li><Link href="/disclaimer" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} LuxEvents. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Payments secured by{' '}
            <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">Stripe</a>
            {' · '}Powered by{' '}
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">Supabase</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
