import Link from 'next/link'
import { RefreshCw } from 'lucide-react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | LuxEvents',
  description: 'Understand how cancellations, refunds, and disputes work on the LuxEvents platform.',
}

export default function RefundPolicyPage() {
  const lastUpdated = 'June 18, 2025'

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gray-900 py-16 pt-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium tracking-widest uppercase">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Refund &amp; Cancellation Policy</h1>
          <p className="text-gray-400">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-10">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Key rule:</strong> Cancellations more than 14 days before the event may receive a full refund minus platform fees. Cancellations within 7 days are subject to Provider terms. All refunds process through Stripe and may take 5–10 business days.
            </p>
          </div>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">1. Cancellation by Client</h2>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left p-3 font-semibold">Time Before Event</th>
                  <th className="text-left p-3 font-semibold">Refund Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 text-gray-700">More than 14 days</td>
                  <td className="p-3 text-green-700 font-medium">100% refund (minus platform fee)</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 text-gray-700">8–14 days</td>
                  <td className="p-3 text-yellow-700 font-medium">50% refund of service fee</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 text-gray-700">7 days or fewer</td>
                  <td className="p-3 text-red-700 font-medium">No refund (subject to Provider discretion)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 text-gray-700">Day of event</td>
                  <td className="p-3 text-red-700 font-medium">No refund</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 leading-relaxed mb-4">
            Platform fees are non-refundable regardless of when cancellation occurs. To cancel, go to your Client Dashboard, select the booking, and click &quot;Cancel Booking.&quot;
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">2. Cancellation by Provider</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If a Provider cancels a confirmed booking, the Client is entitled to a <strong>full refund</strong> of all amounts paid, including platform fees. Providers who frequently cancel may have their accounts suspended or removed.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">3. Provider No-Show</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If a Provider fails to appear without prior notice, clients must report no-shows within <strong>24 hours</strong> by contacting <a href="mailto:support@luxevents.app" className="text-yellow-600 hover:underline">support@luxevents.app</a>. Confirmed no-shows result in a full refund and may result in permanent Provider account removal.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">4. Refund Processing</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            All refunds are processed through <strong>Stripe</strong> back to the original payment method. Processing time is typically <strong>5–10 business days</strong> depending on your bank. Refunds will not be issued to a different payment method than the one used for the original booking.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">5. Disputes and Chargebacks</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We strongly encourage clients and providers to resolve disputes through our support team before initiating a chargeback. Initiating a chargeback without first attempting resolution may result in account suspension.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">6. Force Majeure</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            In the event of circumstances beyond the control of either party — including natural disasters, government restrictions, or public health emergencies — LuxEvents will work with both parties on a case-by-case basis to facilitate rescheduling or partial refunds.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">7. How to Request a Refund</h2>
          <ol className="text-gray-600 space-y-2 mb-4 list-decimal pl-6">
            <li>Log in to your LuxEvents account</li>
            <li>Go to <strong>Client Dashboard &gt; Bookings</strong></li>
            <li>Select the relevant booking and click <strong>&quot;Request Refund&quot;</strong> or <strong>&quot;Cancel Booking&quot;</strong></li>
            <li>If unresolved, contact <a href="mailto:support@luxevents.app" className="text-yellow-600 hover:underline">support@luxevents.app</a></li>
          </ol>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">8. Contact</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-700 font-semibold mb-1">LuxEvents Support</p>
            <p className="text-gray-600 text-sm">Email: <a href="mailto:support@luxevents.app" className="text-yellow-600 hover:underline">support@luxevents.app</a></p>
            <p className="text-gray-600 text-sm">Response time: within 1–2 business days</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
