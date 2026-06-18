import Link from 'next/link'
import { FileText } from 'lucide-react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service | LuxEvents',
  description: 'Read the Terms of Service governing your use of the LuxEvents platform.',
}

export default function TermsOfServicePage() {
  const lastUpdated = 'June 18, 2025'

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gray-900 py-16 pt-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium tracking-widest uppercase">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-10">
            <p className="text-gray-700 text-sm leading-relaxed">
              Please read these Terms of Service carefully before using the LuxEvents platform. By creating an account or using our services, you agree to be bound by these terms.
            </p>
          </div>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you and LuxEvents governing your access to and use of the LuxEvents platform at luxevents.app (&quot;Platform&quot;). By accessing or using the Platform, you confirm that you are at least 18 years old and have the legal capacity to enter into binding contracts.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">2. Platform Description</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            LuxEvents is a two-sided marketplace that connects clients seeking event services with independent event service providers (&quot;Providers&quot;). LuxEvents is a technology platform only — we are not a party to any service agreement between clients and Providers. We do not employ Providers, and Providers are independent contractors solely responsible for the services they offer.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">3. User Accounts</h2>
          <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-6">
            <li>You must provide accurate, complete, and current account information.</li>
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>You must notify us immediately of any unauthorized use at <a href="mailto:support@luxevents.app" className="text-yellow-600 hover:underline">support@luxevents.app</a>.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">4. Bookings and Payments</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            All payments are processed securely through <strong>Stripe, Inc.</strong> When you book a Provider, you authorize LuxEvents to charge your payment method for the agreed service fee plus any applicable platform fee. Bookings are confirmed only after payment is successfully processed.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">5. Provider Responsibilities</h2>
          <p className="text-gray-600 leading-relaxed mb-4">If you register as a Provider, you agree to:</p>
          <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-6">
            <li>Provide accurate descriptions of your services, availability, and pricing</li>
            <li>Fulfill all confirmed bookings in a professional and timely manner</li>
            <li>Maintain any licenses, permits, or insurance required in your jurisdiction</li>
            <li>Not engage in price manipulation, fake reviews, or fraudulent activity</li>
            <li>Comply with all applicable laws regarding your services</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">6. Client Responsibilities</h2>
          <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-6">
            <li>Provide accurate event information when making bookings</li>
            <li>Pay for services as agreed at the time of booking</li>
            <li>Treat Providers with respect and professionalism</li>
            <li>Not make fraudulent bookings or chargebacks without legitimate grounds</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">7. Cancellations and Refunds</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Cancellations and refunds are governed by our <Link href="/refund-policy" className="text-yellow-600 hover:underline">Refund &amp; Cancellation Policy</Link>.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">8. Prohibited Conduct</h2>
          <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-6">
            <li>Use the Platform for any unlawful purpose</li>
            <li>Circumvent the Platform to transact with Providers outside of LuxEvents (fee circumvention)</li>
            <li>Post false, misleading, or defamatory reviews or content</li>
            <li>Attempt to reverse-engineer, hack, or disrupt the Platform</li>
            <li>Impersonate another person or entity</li>
            <li>Scrape, harvest, or collect user data without authorization</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">9. Intellectual Property</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The LuxEvents name, logo, and platform design are our intellectual property. Content you upload remains yours; you grant LuxEvents a non-exclusive license to display it on the Platform.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">10. Disclaimer of Warranties</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            THE PLATFORM IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. LUXEVENTS DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED OR ERROR-FREE, OR THAT PROVIDERS WILL DELIVER SATISFACTORY SERVICES.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">11. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            TO THE FULLEST EXTENT PERMITTED BY LAW, LUXEVENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED FEES PAID TO LUXEVENTS IN THE THREE MONTHS PRECEDING THE CLAIM.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">12. Indemnification</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            You agree to indemnify and hold harmless LuxEvents and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Platform or violation of these Terms.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">13. Governing Law</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            These Terms shall be governed by the laws of the State of Texas. Disputes shall be resolved through binding arbitration per AAA rules, except either party may seek injunctive relief in court.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">14. Changes to Terms</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We may update these Terms from time to time. We will provide at least 14 days&apos; notice of material changes via email or prominent Platform notice.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">15. Contact</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-700 font-semibold mb-1">LuxEvents Legal</p>
            <p className="text-gray-600 text-sm">Email: <a href="mailto:legal@luxevents.app" className="text-yellow-600 hover:underline">legal@luxevents.app</a></p>
            <p className="text-gray-600 text-sm">Website: <Link href="/contact" className="text-yellow-600 hover:underline">luxevents.app/contact</Link></p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
