'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLANS } from '@/lib/stripe'
import { CheckCircle, Zap } from 'lucide-react'

export default function SubscriptionPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubscribe = async (planKey: string) => {
    setLoading(planKey)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const res = await fetch('/api/stripe/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planKey, userId: user.id }),
    })
    const json = await res.json()
    if (json.url) {
      window.location.href = json.url
    } else {
      setError(json.error || 'Something went wrong')
      setLoading(null)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Subscription Plans</h1>
        <p className="text-gray-500 mt-1">
          Two simple plans. No hidden fees. Your commission rate drops when you go Pro — so the upgrade pays for itself.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        {Object.entries(PLANS).map(([key, plan]) => {
          const isPro = key === 'professional'
          return (
            <div
              key={key}
              className={`bg-white rounded-2xl p-6 border-2 shadow-sm flex flex-col ${isPro ? 'border-yellow-400 ring-4 ring-yellow-100 relative' : 'border-gray-100'}`}
            >
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                  BEST VALUE
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
                {isPro && (
                  <p className="text-xs text-yellow-700 mt-1 font-medium">
                    Save 3% on every booking — pays for itself at $2,000/mo in bookings
                  </p>
                )}
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isPro ? 'text-yellow-500' : 'text-green-500'}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(key)}
                disabled={loading === key}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 ${
                  isPro
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {loading === key ? 'Redirecting...' : (
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" /> Start with {plan.name}
                  </span>
                )}
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">14-day free trial · Cancel anytime</p>
            </div>
          )
        })}
      </div>

      <div className="mt-10 bg-gray-50 rounded-2xl p-6 border border-gray-100 max-w-2xl">
        <h3 className="font-semibold text-gray-900 mb-3">How commissions work</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          LuxEvents charges a platform fee only when you earn. Starter plan vendors pay <strong className="text-gray-700">10%</strong> per booking; Professional vendors pay <strong className="text-gray-700">7%</strong>. This covers secure payment processing, fraud protection, and platform support. Your subscription gets you listed — commissions only apply when clients book through us.
        </p>
      </div>
    </div>
  )
}
