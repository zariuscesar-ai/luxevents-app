'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Provider, ProviderCategory } from '@/types/database'
import { CATEGORY_LABELS } from '@/types/database'

const EMPTY: Partial<Provider> = {
  business_name: '', category: 'venue', city: '', state: '',
  description: '', tagline: '', website: '', instagram: '',
  min_price: undefined, max_price: undefined,
  is_featured: false, is_verified: false, is_active: true,
  subscription_plan: 'free', commission_rate: 10,
}

export default function AdminProvidersPage() {
  const supabase = createClient()
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<string>('all')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState<Partial<Provider>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('providers').select('*').order('created_at', { ascending: false })
    setProviders(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const filtered = providers.filter(p => {
    const q = search.toLowerCase()
    const matchQ = !q || p.business_name.toLowerCase().includes(q) || (p.city ?? '').toLowerCase().includes(q)
    const matchCat = filterCat === 'all' || p.category === filterCat
    return matchQ && matchCat
  })

  function openAdd() { setForm(EMPTY); setModal('add') }
  function openEdit(p: Provider) { setForm(p); setModal('edit') }
  function closeModal() { setModal(null); setForm(EMPTY) }

  async function save() {
    setSaving(true)
    if (modal === 'add') {
      const slug = (form.business_name ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)
      const { error } = await supabase.from('providers').insert({ ...form, slug, user_id: (await supabase.auth.getUser()).data.user!.id })
      if (error) showToast('Error: ' + error.message)
      else { showToast('Provider added!'); closeModal(); load() }
    } else {
      const { id, created_at, updated_at, user_id, slug, provider_media, services, reviews, ...rest } = form as Provider
      const { error } = await supabase.from('providers').update(rest).eq('id', id)
      if (error) showToast('Error: ' + error.message)
      else { showToast('Saved!'); closeModal(); load() }
    }
    setSaving(false)
  }

  async function confirmDelete() {
    if (!deleteId) return
    const { error } = await supabase.from('providers').delete().eq('id', deleteId)
    if (error) showToast('Error: ' + error.message)
    else { showToast('Deleted'); load() }
    setDeleteId(null)
  }

  async function toggle(id: string, field: 'is_featured' | 'is_verified' | 'is_active', val: boolean) {
    await supabase.from('providers').update({ [field]: val }).eq('id', id)
    setProviders(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p))
  }

  const set = (k: keyof Provider, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="p-6 text-white min-h-screen">
      {toast && <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Providers</h1>
          <p className="text-gray-400 text-sm">{providers.length} total</p>
        </div>
        <button onClick={openAdd} className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors">+ Add Provider</button>
      </div>

      <div className="flex gap-3 mb-5">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or city…"
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 w-64 focus:outline-none focus:border-yellow-500" />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500">
          <option value="all">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? <div className="text-gray-400 py-12 text-center">Loading…</div> :
       filtered.length === 0 ? <div className="text-gray-500 py-12 text-center">No providers found</div> : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Business</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-center">Featured</th>
                <th className="px-4 py-3 text-center">Verified</th>
                <th className="px-4 py-3 text-center">Active</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{p.business_name}</td>
                  <td className="px-4 py-3 text-gray-400">{CATEGORY_LABELS[p.category]}</td>
                  <td className="px-4 py-3 text-gray-400">{[p.city, p.state].filter(Boolean).join(', ') || '—'}</td>
                  <td className="px-4 py-3 text-center"><Toggle val={p.is_featured} onChange={v => toggle(p.id, 'is_featured', v)} /></td>
                  <td className="px-4 py-3 text-center"><Toggle val={p.is_verified} onChange={v => toggle(p.id, 'is_verified', v)} /></td>
                  <td className="px-4 py-3 text-center"><Toggle val={p.is_active} onChange={v => toggle(p.id, 'is_active', v)} /></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.subscription_plan === 'professional' ? 'bg-yellow-500/20 text-yellow-400' : p.subscription_plan === 'starter' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>{p.subscription_plan}</span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(p)} className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded hover:bg-blue-500/10">Edit</button>
                    <button onClick={() => setDeleteId(p.id)} className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-500/10">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4" onClick={closeModal}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold">{modal === 'add' ? 'Add Provider' : 'Edit Provider'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Business Name *"><input value={form.business_name ?? ''} onChange={e => set('business_name', e.target.value)} className={inp} placeholder="e.g. Luxe Photography" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category *">
                  <select value={form.category ?? 'venue'} onChange={e => set('category', e.target.value as ProviderCategory)} className={inp}>
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Plan">
                  <select value={form.subscription_plan ?? 'free'} onChange={e => set('subscription_plan', e.target.value)} className={inp}>
                    <option value="free">Free</option>
                    <option value="starter">Starter ($39)</option>
                    <option value="professional">Professional ($99)</option>
                  </select>
                </Field>
              </div>
              <Field label="Tagline"><input value={form.tagline ?? ''} onChange={e => set('tagline', e.target.value)} className={inp} placeholder="Short catchy line" /></Field>
              <Field label="Description"><textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)} className={inp + ' h-24 resize-none'} placeholder="Full description…" /></Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="City"><input value={form.city ?? ''} onChange={e => set('city', e.target.value)} className={inp} /></Field>
                <Field label="State"><input value={form.state ?? ''} onChange={e => set('state', e.target.value)} className={inp} placeholder="TX" /></Field>
                <Field label="Zip"><input value={form.zip ?? ''} onChange={e => set('zip', e.target.value)} className={inp} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Min Price ($)"><input type="number" value={form.min_price ?? ''} onChange={e => set('min_price', Number(e.target.value))} className={inp} placeholder="500" /></Field>
                <Field label="Max Price ($)"><input type="number" value={form.max_price ?? ''} onChange={e => set('max_price', Number(e.target.value))} className={inp} placeholder="5000" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Website"><input value={form.website ?? ''} onChange={e => set('website', e.target.value)} className={inp} placeholder="https://…" /></Field>
                <Field label="Instagram"><input value={form.instagram ?? ''} onChange={e => set('instagram', e.target.value)} className={inp} placeholder="@handle" /></Field>
              </div>
              <Field label="Cover Image URL"><input value={form.cover_image_url ?? ''} onChange={e => set('cover_image_url', e.target.value)} className={inp} placeholder="https://…" /></Field>
              <div className="flex gap-6 pt-2">
                {(['is_featured', 'is_verified', 'is_active'] as const).map(k => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!(form as Record<string, unknown>)[k]} onChange={e => set(k, e.target.checked)} className="w-4 h-4 accent-yellow-500" />
                    <span className="text-sm text-gray-300 capitalize">{k.replace('is_', '')}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={save} disabled={saving || !form.business_name} className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
                {saving ? 'Saving…' : modal === 'add' ? 'Add Provider' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-80 text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-bold text-lg mb-2">Delete provider?</h3>
            <p className="text-gray-400 text-sm mb-5">This cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={confirmDelete} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Toggle({ val, onChange }: { val: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!val)} className={`w-10 h-5 rounded-full transition-colors relative ${val ? 'bg-green-500' : 'bg-gray-600'}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow ${val ? 'left-5' : 'left-0.5'}`} />
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs text-gray-400 mb-1 font-medium">{label}</label>{children}</div>
}

const inp = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500'