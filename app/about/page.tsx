import Link from 'next/link'
import { Star, Users, Heart, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'About LuxEvents | Premium Event Provider Marketplace',
  description: 'Learn about LuxEvents — the marketplace connecting clients with top-rated event professionals for unforgettable experiences.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gray-900 py-24 pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-yellow-400 text-sm font-medium tracking-widest uppercase">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Elevating Every Event, <br />One Booking at a Time
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            LuxEvents was built on a simple idea: finding exceptional event professionals should be as elegant as the events they help create.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                LuxEvents is a curated marketplace connecting clients with premium event service professionals — photographers, caterers, DJs, florists, decorators, venues, and more. We believe every milestone deserves to be celebrated with excellence.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We built LuxEvents to give talented event professionals a platform to showcase their work and grow their business, while giving clients a trusted, streamlined way to discover and book the right vendors for their vision.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every provider on our platform is reviewed for quality, and every booking is backed by secure payment processing through Stripe and our transparent refund policy.
              </p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 text-center">
              <div className="text-5xl font-serif font-bold text-yellow-400 mb-2">100+</div>
              <div className="text-gray-300 text-sm mb-6">Verified Providers</div>
              <div className="text-5xl font-serif font-bold text-yellow-400 mb-2">500+</div>
              <div className="text-gray-300 text-sm mb-6">Events Powered</div>
              <div className="text-5xl font-serif font-bold text-yellow-400 mb-2">4.9★</div>
              <div className="text-gray-300 text-sm">Average Provider Rating</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">What We Stand For</h2>
            <p className="text-gray-600 max-w-xl mx-auto">The principles that guide everything we build.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600 leading-relaxed">
                Every provider is reviewed. We maintain high standards so clients can book with confidence, knowing every professional on LuxEvents has earned their place.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600 leading-relaxed">
                We&apos;re building a community of creators and celebrators. Event professionals deserve a platform that values their craft and helps them build lasting client relationships.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">Trust &amp; Transparency</h3>
              <p className="text-gray-600 leading-relaxed">
                Clear pricing, honest reviews, and a straightforward cancellation policy. We believe transparency is the foundation of every great event.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">Seamless Experience</h3>
              <p className="text-gray-600 leading-relaxed">
                From discovery to booking to day-of, we handle the logistics so you can focus on what matters: creating unforgettable memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to Create Something Special?</h2>
          <p className="text-gray-300 mb-8">Explore our curated marketplace of premium event professionals.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-8 py-3 rounded-xl transition-colors">
              Find a Provider
            </Link>
            <Link href="/contact" className="border border-gray-600 hover:border-gray-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
