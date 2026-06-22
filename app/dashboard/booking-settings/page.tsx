'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Calendar, Phone, Mail, Info } from 'lucide-react'
import { PLANS } from '@/lib/stripe-client'

export default function BookingSettingsPage() {
  const supabase = createClient()
  const [provider, setProvider] = useState<any>(null)
  const [bookingEnabled, setBookingEnabled] = useState(false)
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('providers')
        .select('id,subscription_plan,subscription_status,commission_rate,booking_enabled,contact_email,contact_phone')
        .eq('user_id', user.id).single()
      if (data) {
        setProvider(data)
        setBookingEnabled(!!data.booking_enabled)
        setContactEmail(data.contact_email || '')
        setContactPhone(data.contact_phone || '')
      }
    }
    load()
  }, [])

  async function save() {
    if (!provider) return
    setSaving(true)
    await supabase.from('providers').update({
      booking_enabled: bookingEnabled,
      contact_email: contactEmail || null,
      contact_phone: contactPhone || null,
    }).eq('id', provider.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const plan = provider?.subscription_plan === 'professional' ? PLANS.professional : PLANS.starter
  const commission = provider?.commission_rate
    ? (provider.commission_rate * 100).toFixed(0) + '%'
    : plan?.commissionRate ? (plan.commissionRate * 100).toFixed(0) + '%' : '10%'

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Booking Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">Choose how clients connect with you through LuxEvents.</p>
      </div>

      {provider && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-yellow-800">
              {provider.subscription_plan === 'professional' ? '⭐ Professional Plan' : '🔑 Starter Plan'} — {commission} commission
            </p>
            <p className="text-yellow-700 mt-0.5">
              Commission only applies when clients book through LuxEvents. No charge for direct contact leads.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="font-bold text-gray-900 mb-4">How should clients reach you?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => setBookingEnabled(false)}
              className={'rounded-xl border-2 p-4 text-left transition-all ' + (!bookingEnabled ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300')}>
              <Mail className="w-6 h-6 mb-2 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Show &amp; Connect</h3>
              <p className="text-xs text-gray-500 mt-1">Display your info — clients contact you directly. No platform commission.</p>
            </button>
            <button onClick={() => setBookingEnabled(true)}
              className={'rounded-xl border-2 p-4 text-left transition-all ' + (bookingEnabled ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300')}>
              <Calendar className="w-6 h-6 mb-2 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Book Through LuxEvents</h3>
              <p className="text-xs text-gray-500 mt-1">Clients book and pay a deposit online. {commission} commission per booking.</p>
            </button>
          </div>
        </div>

        {!bookingEnabled && (
          <div className="border-t border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Your contact info (shown to clients)</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                  placeholder="hello@yourbusiness.com"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                  placeholder="(214) 555-0000"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={save} disabled={saving}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-black font-bold px-6 py-2.5 rounded-xl transition-colors">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium"><CheckCircle className="w-4 h-4" /> Saved!</span>}
      </div>
    </div>
  )
}
