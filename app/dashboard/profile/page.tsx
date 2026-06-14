'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/types/database'
import type { ProviderCategory } from '@/types/database'
import { Save, Plus, Trash2 } from 'lucide-react'

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [provider, setProvider] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [form, setForm] = useState({
    business_name: '', category: 'venue', description: '', tagline: '',
    city: '', state: 'TX', zip: '', website: '', instagram: '',
    years_in_business: '', min_price: '', max_price: '',
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: p } = await supabase
        .from('providers')
        .select('*, services(*)')
        .eq('user_id', user.id)
        .single()
      if (p) {
        setProvider(p)
        setForm({
          business_name: p.business_name || '',
          category: p.category || 'venue',
          description: p.description || '',
          tagline: p.tagline || '',
          city: p.city || '',
          state: p.state || 'TX',
          zip: p.zip || '',
          website: p.website || '',
          instagram: p.instagram || '',
          years_in_business: p.years_in_business?.toString() || '',
          min_price: p.min_price?.toString() || '',
          max_price: p.max_price?.toString() || '',
        })
        setServices(p.services || [])
      }
    }
    load()
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const slug = provider?.slug || slugify(form.business_name)
    const payload = {
      ...form,
      slug,
      user_id: user.id,
      years_in_business: form.years_in_business ? parseInt(form.years_in_business) : null,
      min_price: form.min_price ? parseFloat(form.min_price) : null,
      max_price: form.max_price ? parseFloat(form.max_price) : null,
    }

    if (provider?.id) {
      const { error: err } = await supabase.from('providers').update(payload).eq('id', provider.id)
      if (err) { setError(err.message); setLoading(false); return }
    } else {
      const { data: newP, error: err } = await supabase.from('providers').insert(payload).select().single()
      if (err) { setError(err.message); setLoading(false); return }
      setProvider(newP)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setLoading(false)
  }

  const addService = () => setServices([...services, { id: Date.now(), name: '', description: '', price: '', price_type: 'fixed', is_active: true, is_new: true }])

  const saveService = async (svc: any) => {
    if (!provider?.id) return
    const payload = {
      provider_id: provider.id,
      name: svc.name,
      description: svc.description || null,
      price: svc.price ? parseFloat(svc.price) : null,
      price_type: svc.price_type || 'fixed',
      is_active: true,
    }
    if (svc.is_new) {
      const { data } = await supabase.from('services').insert(payload).select().single()
      setServices(services.map(s => s.id === svc.id ? { ...data } : s))
    } else {
      await supabase.from('services').update(payload).eq('id', svc.id)
    }
  }

  const deleteService = async (svc: any) => {
    if (!svc.is_new) await supabase.from('services').delete().eq('id', svc.id)
    setServices(services.filter(s => s.id !== svc.id))
  }

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5"

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Edit Profile</h1>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">{error}</div>}

      <form onSubmit={save} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Business Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelCls}>Business Name *</label>
              <input className={inputCls} required value={form.business_name} onChange={f("business_name")} placeholder="Your Business Name" />
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <select className={inputCls} value={form.category} onChange={f("category")}>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Years in Business</label>
              <input type="number" className={inputCls} value={form.years_in_business} onChange={f("years_in_business")} placeholder="5" />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Tagline</label>
              <input className={inputCls} value={form.tagline} onChange={f("tagline")} placeholder="Your memorable one-liner" />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea rows={5} className={inputCls} value={form.description} onChange={f("description")} placeholder="Tell clients about your business, your style, and what makes you special..." />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Location & Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className={labelCls}>City *</label>
              <input className={inputCls} required value={form.city} onChange={f("city")} placeholder="Dallas" />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input className={inputCls} value={form.state} onChange={f("state")} placeholder="TX" />
            </div>
            <div>
              <label className={labelCls}>Website</label>
              <input type="url" className={inputCls} value={form.website} onChange={f("website")} placeholder="https://yourbusiness.com" />
            </div>
            <div>
              <label className={labelCls}>Instagram handle</label>
              <input className={inputCls} value={form.instagram} onChange={f("instagram")} placeholder="@yourbusiness" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Starting Price ($)</label>
              <input type="number" className={inputCls} value={form.min_price} onChange={f("min_price")} placeholder="500" />
            </div>
            <div>
              <label className={labelCls}>Max Price ($)</label>
              <input type="number" className={inputCls} value={form.max_price} onChange={f("max_price")} placeholder="5000" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-semibold px-6 py-2.5 rounded-xl transition-colors">
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>

      {/* Services */}
      <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Services & Packages</h2>
          <button type="button" onClick={addService} disabled={!provider?.id} className="flex items-center gap-1.5 text-sm text-yellow-600 font-medium hover:text-yellow-700 disabled:opacity-40">
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>
        {!provider?.id && <p className="text-sm text-gray-400">Save your profile first to add services.</p>}
        <div className="space-y-4">
          {services.map((svc) => (
            <div key={svc.id} className="border border-gray-100 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Service Name</label>
                  <input className={inputCls} value={svc.name} onChange={(e) => setServices(services.map(s => s.id === svc.id ? { ...s, name: e.target.value } : s))} placeholder="Wedding Package" />
                </div>
                <div>
                  <label className={labelCls}>Price ($)</label>
                  <input type="number" className={inputCls} value={svc.price || ''} onChange={(e) => setServices(services.map(s => s.id === svc.id ? { ...s, price: e.target.value } : s))} placeholder="2500" />
                </div>
                <div>
                  <label className={labelCls}>Price Type</label>
                  <select className={inputCls} value={svc.price_type || 'fixed'} onChange={(e) => setServices(services.map(s => s.id === svc.id ? { ...s, price_type: e.target.value } : s))}>
                    <option value="fixed">Fixed</option>
                    <option value="starting_from">Starting From</option>
                    <option value="per_hour">Per Hour</option>
                    <option value="per_person">Per Person</option>
                    <option value="custom_quote">Custom Quote</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className={labelCls}>Description</label>
                  <input className={inputCls} value={svc.description || ''} onChange={(e) => setServices(services.map(s => s.id === svc.id ? { ...s, description: e.target.value } : s))} placeholder="What's included..." />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => deleteService(svc)} className="text-red-400 hover:text-red-500 p-1.5"><Trash2 className="w-4 h-4" /></button>
                <button type="button" onClick={() => saveService(svc)} className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">Save</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
