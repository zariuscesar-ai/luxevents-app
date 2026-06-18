import Link from 'next/link'
import { Cookie } from 'lucide-react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Cookie Policy | LuxEvents',
  description: 'Learn about how LuxEvents uses cookies and similar technologies.',
}

export default function CookiePolicyPage() {
  const lastUpdated = 'June 18, 2025'

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gray-900 py-16 pt-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cookie className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium tracking-widest uppercase">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-gray-400">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-10">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Short version:</strong> LuxEvents uses only essential cookies required for secure login and platform functionality. We do not use advertising cookies, tracking pixels, or third-party analytics cookies.
            </p>
          </div>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">1. What Are Cookies?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Cookies are small text files placed on your device by websites you visit. They are widely used to make websites function properly. Cookies can be &quot;session cookies&quot; (deleted when you close your browser) or &quot;persistent cookies&quot; (remain until they expire or you delete them).
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">2. How LuxEvents Uses Cookies</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            LuxEvents uses only <strong>strictly necessary cookies</strong> essential for the platform to function. These do not require your consent under applicable privacy laws.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left p-3 font-semibold">Cookie Name</th>
                  <th className="text-left p-3 font-semibold">Purpose</th>
                  <th className="text-left p-3 font-semibold">Provider</th>
                  <th className="text-left p-3 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-mono text-xs text-gray-700">sb-auth-token</td>
                  <td className="p-3 text-gray-600">Keeps you logged in</td>
                  <td className="p-3 text-gray-600">Supabase</td>
                  <td className="p-3 text-gray-600">Session / 7 days</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-mono text-xs text-gray-700">sb-refresh-token</td>
                  <td className="p-3 text-gray-600">Refreshes your auth session</td>
                  <td className="p-3 text-gray-600">Supabase</td>
                  <td className="p-3 text-gray-600">30 days</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-mono text-xs text-gray-700">__stripe_mid</td>
                  <td className="p-3 text-gray-600">Fraud prevention during payment</td>
                  <td className="p-3 text-gray-600">Stripe</td>
                  <td className="p-3 text-gray-600">1 year</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 font-mono text-xs text-gray-700">__stripe_sid</td>
                  <td className="p-3 text-gray-600">Fraud prevention during payment session</td>
                  <td className="p-3 text-gray-600">Stripe</td>
                  <td className="p-3 text-gray-600">30 minutes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">3. What We Do NOT Use</h2>
          <p className="text-gray-600 leading-relaxed mb-4">LuxEvents does <strong>not</strong> use:</p>
          <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-6">
            <li>Advertising or retargeting cookies (e.g., Facebook Pixel, Google Ads)</li>
            <li>Third-party analytics cookies (e.g., Google Analytics, Mixpanel)</li>
            <li>Social media tracking pixels</li>
            <li>Behavioral profiling cookies</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">4. Managing Cookies</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Because we only use strictly necessary cookies, disabling them will affect platform functionality — you will not be able to stay logged in. You can manage cookies through your browser settings:
          </p>
          <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-6">
            <li><a href="https://support.google.com/chrome/answer/95647" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">5. Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We will update this Cookie Policy if we introduce new technologies that use cookies or similar tracking. Changes will be posted here with an updated date.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">6. Contact</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-700 font-semibold mb-1">LuxEvents Privacy Team</p>
            <p className="text-gray-600 text-sm">Email: <a href="mailto:privacy@luxevents.app" className="text-yellow-600 hover:underline">privacy@luxevents.app</a></p>
            <p className="text-gray-600 text-sm">More: <Link href="/privacy" className="text-yellow-600 hover:underline">Privacy Policy</Link></p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
