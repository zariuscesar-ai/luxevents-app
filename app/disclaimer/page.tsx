import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Disclaimer | LuxEvents',
  description: 'Important disclaimers regarding the use of the LuxEvents platform and marketplace.',
}

export default function DisclaimerPage() {
  const lastUpdated = 'June 18, 2025'

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gray-900 py-16 pt-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium tracking-widest uppercase">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Disclaimer</h1>
          <p className="text-gray-400">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-6 mb-4">1. Marketplace Disclaimer</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            LuxEvents is a technology marketplace platform that connects clients with independent event service providers (&quot;Providers&quot;). LuxEvents does <strong>not</strong> employ Providers, does not control how Providers deliver their services, and is not a party to any service agreement entered into between clients and Providers through the platform.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            LuxEvents is not responsible for the acts, omissions, errors, representations, warranties, or negligence of any Provider. The quality, legality, and suitability of services offered by Providers is the sole responsibility of the respective Provider.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">2. No Endorsement of Providers</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Listing a Provider on LuxEvents does not constitute an endorsement, recommendation, or certification of that Provider by LuxEvents. Client reviews reflect individual opinions — LuxEvents does not verify the accuracy of reviews or independently assess Provider quality.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Clients are encouraged to conduct their own due diligence, including reviewing portfolios, requesting references, and verifying licenses and insurance before booking any Provider.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">3. No Professional Advice</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Nothing on the LuxEvents platform constitutes legal, financial, tax, or other professional advice. Information provided is for general informational purposes only. For professional advice, consult a qualified professional in the relevant field.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">4. Accuracy of Information</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            While LuxEvents makes reasonable efforts to ensure the accuracy of information displayed, we do not warrant that provider profiles, pricing, availability, or descriptions are complete, accurate, current, or error-free. Provider information is primarily supplied by Providers themselves.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">5. Third-Party Services</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            LuxEvents integrates with Stripe (payment processing), Supabase (database and authentication), and Vercel (hosting). LuxEvents is not responsible for the availability, accuracy, or performance of these third-party services. The Platform may contain links to external websites for which LuxEvents is not responsible.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, LUXEVENTS DISCLAIMS ALL LIABILITY FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM:
          </p>
          <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-6">
            <li>The performance or non-performance of any Provider&apos;s services</li>
            <li>Reliance on information provided on the platform</li>
            <li>Any interactions or transactions between clients and providers</li>
            <li>Unauthorized access to or alteration of your data</li>
            <li>Platform downtime, errors, or technical failures</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">7. Governing Documents</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            This Disclaimer should be read together with our <Link href="/terms" className="text-yellow-600 hover:underline">Terms of Service</Link>, <Link href="/privacy" className="text-yellow-600 hover:underline">Privacy Policy</Link>, and <Link href="/refund-policy" className="text-yellow-600 hover:underline">Refund Policy</Link>. In the event of a conflict, the Terms of Service prevail.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">8. Contact</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-700 font-semibold mb-1">LuxEvents Legal</p>
            <p className="text-gray-600 text-sm">Email: <a href="mailto:legal@luxevents.app" className="text-yellow-600 hover:underline">legal@luxevents.app</a></p>
            <p className="text-gray-600 text-sm">Contact form: <Link href="/contact" className="text-yellow-600 hover:underline">luxevents.app/contact</Link></p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
