import Link from 'next/link'
import { Star, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <span className="text-xl font-serif font-bold text-white">LuxEvents</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              The premier marketplace for event professionals. Connect with top vendors, book with confidence.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/providers" className="hover:text-yellow-500 transition-colors">Browse Vendors</Link></li>
              <li><Link href="/categories" className="hover:text-yellow-500 transition-colors">Explore Categories</Link></li>
              <li><Link href="/signup?role=client" className="hover:text-yellow-500 transition-colors">Create Account</Link></li>
              <li><Link href="/client/bookings" className="hover:text-yellow-500 transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Vendors</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/signup?role=provider" className="hover:text-yellow-500 transition-colors">List Your Business</Link></li>
              <li><Link href="/dashboard" className="hover:text-yellow-500 transition-colors">Vendor Dashboard</Link></li>
              <li><Link href="/dashboard/subscription" className="hover:text-yellow-500 transition-colors">Pricing Plans</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-yellow-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-500 transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="hover:text-yellow-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-yellow-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} LuxEvents. All rights reserved. · Built for exceptional events.
        </div>
      </div>
    </footer>
  )
}
