import Link from 'next/link'
import { Shield } from 'lucide-react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | LuxEvents',
  description: 'Learn how LuxEvents collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'June 18, 2025'

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gray-900 py-16 pt-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium tracking-widest uppercase">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-10">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Summary:</strong> LuxEvents collects information you provide when creating an account or making a booking. We use Supabase for secure data storage and Stripe for PCI-compliant payment processing — we never store your full credit card details. We do not sell your personal data. You can request deletion of your account and data at any time.
            </p>
          </div>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">1. Who We Are</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            LuxEvents (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the LuxEvents marketplace platform accessible at luxevents.app. We connect clients seeking event services with independent event professionals and vendors (&quot;Providers&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">2. Information We Collect</h2>
          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">2.1 Information You Provide</h3>
          <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-6">
            <li><strong>Account information:</strong> name, email address, password (hashed), and role (client or provider)</li>
            <li><strong>Provider profile:</strong> business name, bio, service category, pricing, location, portfolio images</li>
            <li><strong>Booking information:</strong> event date, event type, guest count, special requests</li>
            <li><strong>Communications:</strong> messages sent through the platform between clients and providers</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">2.2 Payment Information</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            All payment processing is handled by <strong>Stripe, Inc.</strong>, a PCI-DSS Level 1 certified payment processor. LuxEvents does not store, transmit, or have access to your full credit card number, CVV, or banking details. Stripe may collect and use payment information in accordance with their own <a href="https://stripe.com/privacy" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">2.3 Automatically Collected Information</h3>
          <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-6">
            <li><strong>Authentication cookies:</strong> session tokens set by Supabase for secure login</li>
            <li><strong>Usage data:</strong> pages visited, search queries, booking activity</li>
            <li><strong>Device/browser data:</strong> IP address, browser type, operating system (for security purposes)</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">3. How We Use Your Information</h2>
          <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-6">
            <li>To create and manage your account</li>
            <li>To facilitate bookings between clients and providers</li>
            <li>To process payments and issue receipts via Stripe</li>
            <li>To send transactional emails (booking confirmations, receipts, account notifications)</li>
            <li>To improve the platform and personalize your experience</li>
            <li>To prevent fraud, abuse, and unauthorized access</li>
            <li>To comply with applicable laws and legal obligations</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">4. Information Sharing</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We do <strong>not sell</strong> your personal information. We share information only in these circumstances:
          </p>
          <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-6">
            <li><strong>With Providers:</strong> when you book a service, your name, event details, and contact info are shared with the provider you booked</li>
            <li><strong>With Clients:</strong> when a provider accepts a booking, limited client contact details are shared</li>
            <li><strong>Service providers:</strong> Supabase (database), Stripe (payments), Vercel (hosting) — all under data processing agreements</li>
            <li><strong>Legal requirements:</strong> if required by law, court order, or to protect the rights and safety of LuxEvents and its users</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">5. Data Storage &amp; Security</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Your data is stored securely using <strong>Supabase</strong>, which provides encrypted databases with row-level security. Data is hosted on infrastructure compliant with SOC 2 Type II standards. We use HTTPS for all data transmission.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            While we implement industry-standard safeguards, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password and to contact us immediately if you suspect unauthorized access.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">6. Cookies</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We use only strictly necessary cookies. See our <Link href="/cookie-policy" className="text-yellow-600 hover:underline">Cookie Policy</Link> for full details.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">7. Your Rights</h2>
          <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-6">
            <li><strong>Access:</strong> request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> update inaccurate or incomplete information via your account settings</li>
            <li><strong>Deletion:</strong> request deletion of your account and associated personal data</li>
            <li><strong>Portability:</strong> receive your data in a structured, machine-readable format</li>
            <li><strong>Opt-out:</strong> unsubscribe from marketing emails at any time</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-4">
            Email: <a href="mailto:privacy@luxevents.app" className="text-yellow-600 hover:underline">privacy@luxevents.app</a>. We respond within 30 days.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">8. Children&apos;s Privacy</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            LuxEvents is not directed to individuals under the age of 18. We do not knowingly collect personal information from minors.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">9. Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We may update this Privacy Policy from time to time. Your continued use of LuxEvents after changes are posted constitutes your acceptance.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">10. Contact Us</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-700 font-semibold mb-1">LuxEvents Privacy Team</p>
            <p className="text-gray-600 text-sm">Email: <a href="mailto:privacy@luxevents.app" className="text-yellow-600 hover:underline">privacy@luxevents.app</a></p>
            <p className="text-gray-600 text-sm">Website: <Link href="/contact" className="text-yellow-600 hover:underline">luxevents.app/contact</Link></p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
