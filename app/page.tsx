import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProviderCard from '@/components/providers/ProviderCard'
import type { Provider } from '@/types/database'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/database'
import { Search, Star, Shield, CreditCard, ArrowRight } from 'lucide-react'

const FEATURED_CATEGORIES = [
  'venue', 'catering', 'photography', 'dj', 'florist', 'decorator',
] as const

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredProviders } = await supabase
    .from('providers')
    .select('*, provider_media(*)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('rating', { ascending: false })
    .limit(6)

  const { data: topProviders } = await supabase
    .from('providers')
    .select('*, provider_media(*)')
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(8)

  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"
            alt="Luxury event"
            fill
            priority
            className="object-cover"
          />
          <div className="hero-gradient absolute inset-0" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-300 text-sm font-medium tracking-widest uppercase">Premium Event Marketplace</span>
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-white font-bold mb-6 leading-tight">
            Extraordinary Events<br />
            <span className="text-yellow-400">Start Here</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover and book the finest event vendors in your city — from dream venues to world-class caterers, photographers, and entertainment.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="What type of vendor are you looking for?"
                className="w-full text-gray-700 placeholder-gray-400 outline-none text-sm"
              />
            </div>
            <Link
              href="/providers"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
            >
              Search Vendors
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-white">
            {[
              { label: 'Verified Vendors', value: '500+' },
              { label: 'Events Booked', value: '2,000+' },
              { label: 'Cities Covered', value: '15+' },
              { label: 'Client Rating', value: '4.9★' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{stat.value}</div>
                <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-500 text-lg">Everything you need for a perfect event, all in one place</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/providers?category=${cat}`}
                className="group bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:border-yellow-300 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-3">{CATEGORY_ICONS[cat]}</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-yellow-600 transition-colors">
                  {CATEGORY_LABELS[cat]}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/categories" className="inline-flex items-center gap-2 text-yellow-600 font-medium hover:text-yellow-700 transition-colors">
              View all categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PROVIDERS */}
      {featuredProviders && featuredProviders.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-4xl font-serif text-gray-900 mb-2">Featured Vendors</h2>
                <p className="text-gray-500">Handpicked top performers in your area</p>
              </div>
              <Link href="/providers?featured=true" className="hidden md:flex items-center gap-2 text-yellow-600 font-medium hover:text-yellow-700">
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProviders.map((p) => (
                <ProviderCard key={p.id} provider={p as Provider} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TOP PROVIDERS */}
      {topProviders && topProviders.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-4xl font-serif text-gray-900 mb-2">Top Rated</h2>
                <p className="text-gray-500">The vendors clients love most</p>
              </div>
              <Link href="/providers?sort=rating" className="hidden md:flex items-center gap-2 text-yellow-600 font-medium hover:text-yellow-700">
                Browse all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topProviders.map((p) => (
                <ProviderCard key={p.id} provider={p as Provider} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">How LuxEvents Works</h2>
            <p className="text-gray-500 text-lg">Simple, seamless, and secure</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Search, step: '01', title: 'Browse & Discover', desc: 'Explore hundreds of vetted event professionals. Filter by category, location, price, and rating.' },
              { icon: Star, step: '02', title: 'Review & Compare', desc: 'Read verified reviews, view portfolios, and compare packages to find your perfect match.' },
              { icon: CreditCard, step: '03', title: 'Book & Pay Securely', desc: 'Book directly on our platform with secure payment processing. Your money is protected until the event.' },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                    {step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VENDOR CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-medium">For Event Professionals</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Grow Your Event Business<br />on <span className="text-yellow-400">LuxEvents</span>
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of premium vendors already booking clients through our platform. List your services, showcase your work, and receive bookings — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup?role=provider"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-full transition-colors text-lg"
            >
              Start Your Free Trial
            </Link>
            <Link
              href="/dashboard/subscription"
              className="border border-white/30 hover:border-white text-white font-medium px-8 py-4 rounded-full transition-colors text-lg"
            >
              View Pricing Plans
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-6">No setup fees · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
