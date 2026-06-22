'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const CATS: Record<string,string> = {
  photography:'Photography',videography:'Videography',catering:'Catering',
  venue:'Venue',music:'Music & Entertainment',floral:'Floral & Decor',
  planning:'Event Planning',beauty:'Beauty & Makeup',
  transportation:'Transportation',other:'Other',
}
type Provider = {
  id:string;business_name:string;category:string;city:string;state:string
  min_price:number;max_price:number;is_featured:boolean;is_verified:boolean
  is_active:boolean;description:string;contact_email:string
  contact_phone:string;website_url:string;image_url:string
}
const EMPTY:Omit<Provider,'id'>={business_name:'',category:'photography',city:'',state:'',
  min_price:0,max_price:0,is_featured:false,is_verified:false,is_active:true,
  description:'',contact_email:'',contact_phone:'',website_url:'',image_url:''}
function Toggle({value,onChange}:{value:boolean;onChange:(v:boolean)=>void}){
  return<button onClick={()=>onChange(!value)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full ${value?'bg-yellow-400':'bg-gray-600'}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value?'translate-x-6':'translate-x-1'}`}/>
  </button>
}export default function AdminProviders(){
  const supabase=createClient()
  const [providers,setProviders]=useState<Provider[]>([])
  const [loading,setLoading]=useState(true)
  const [showModal,setShowModal]=useState(false)
  const [editing,setEditing]=useState<Provider|null>(null)
  const [form,setForm]=useState<Omit<Provider,'id'>>(EMPTY)
  const [deleteId,setDeleteId]=useState<string|null>(null)
  const [saving,setSaving]=useState(false)
  async function load(){
    setLoading(true)
    const{data}=await supabase.from('providers').select('*').order('created_at',{ascending:false})
    setProviders(data??[]);setLoading(false)
  }
  useEffect(()=>{load()},[supabase])
  function openAdd(){setEditing(null);setForm(EMPTY);setShowModal(true)}
  function openEdit(p:Provider){setEditing(p);const{id,...rest}=p;setForm(rest);setShowModal(true)}
  async function save(){
    setSaving(true)
    if(editing){await supabase.from('providers').update(form).eq('id',editing.id)}
    else{await supabase.from('providers').insert(form)}
    setSaving(false);setShowModal(false);load()
  }
  async function del(){
    if(!deleteId)return
    await supabase.from('providers').delete().eq('id',deleteId)
    setDeleteId(null);load()
  }
  async function tog(id:string,f:'is_featured'|'is_verified'|'is_active',v:boolean){
    await supabase.from('providers').update({[f]:v}).eq('id',id)
    setProviders(ps=>ps.map(p=>p.id===id?{...p,[f]:v}:p))
  }
  function set(k:keyof typeof EMPTY,v:any){setForm(f=>({...f,[k]:v}))}  return(<div className="p-8">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-white">Providers</h1>
      <button onClick={openAdd} className="bg-yellow-400 text-gray-950 px-4 py-2 rounded-lg font-medium text-sm">+ Add Provider</button>
    </div>
    {loading?<p className="text-gray-400">Loading...</p>:(
    <div className="overflow-x-auto"><table className="w-full text-sm">
      <thead><tr className="border-b border-gray-800 text-gray-400 text-left">
        {['Business','Category','Location','Price','Featured','Verified','Active','Actions'].map(h=>(
          <th key={h} className="pb-3 pr-4">{h}</th>))}
      </tr></thead>
      <tbody>{providers.map(p=>(
        <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
          <td className="py-3 pr-4 text-white">{p.business_name}</td>
          <td className="py-3 pr-4 text-gray-300">{CATS[p.category]??p.category}</td>
          <td className="py-3 pr-4 text-gray-300">{p.city},{p.state}</td>
          <td className="py-3 pr-4 text-gray-300">{p.min_price}-{p.max_price}</td>
          <td className="py-3 pr-4"><Toggle value={p.is_featured} onChange={v=>tog(p.id,'is_featured',v)}/></td>
          <td className="py-3 pr-4"><Toggle value={p.is_verified} onChange={v=>tog(p.id,'is_verified',v)}/></td>
          <td className="py-3 pr-4"><Toggle value={p.is_active} onChange={v=>tog(p.id,'is_active',v)}/></td>
          <td className="py-3">
            <button onClick={()=>openEdit(p)} className="text-blue-400 text-xs mr-2">Edit</button>
            <button onClick={()=>setDeleteId(p.id)} className="text-red-400 text-xs">Delete</button>
          </td></tr>))}</tbody></table>
    {providers.length===0&&<p className="text-gray-500 text-center py-12">No providers yet.</p>}
    </div>)}    {showModal&&(<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">{editing?'Edit Provider':'Add Provider'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['business_name','contact_email','contact_phone','website_url','city','state'] as const).map(k=>(
            <div key={k}><label className="block text-xs text-gray-400 mb-1">{k.replace(/_/g,' ')}</label>
            <input value={(form as any)[k]} onChange={e=>set(k as any,e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none"/></div>))}
          <div><label className="block text-xs text-gray-400 mb-1">Min Price</label>
            <input type="number" value={form.min_price} onChange={e=>set('min_price',Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none"/></div>
          <div><label className="block text-xs text-gray-400 mb-1">Max Price</label>
            <input type="number" value={form.max_price} onChange={e=>set('max_price',Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none"/></div>
          <div><label className="block text-xs text-gray-400 mb-1">Category</label>
            <select value={form.category} onChange={e=>set('category',e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm">
              {Object.entries(CATS).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>          <div className="sm:col-span-2"><label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none"/></div>
          <div className="flex gap-6 sm:col-span-2">
            {(['is_featured','is_verified','is_active'] as const).map(k=>(
              <label key={k} className="flex items-center gap-2 text-sm text-gray-300">
                <Toggle value={form[k]} onChange={v=>set(k,v)}/>
                {k==='is_featured'?'Featured':k==='is_verified'?'Verified':'Active'}</label>))}
          </div></div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={()=>setShowModal(false)} className="px-4 py-2 text-sm text-gray-400">Cancel</button>
          <button onClick={save} disabled={saving} className="bg-yellow-400 text-gray-950 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
            {saving?'Saving...':'Save'}</button></div>
      </div></div>)}
    {deleteId&&(<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-80 border border-gray-700">
        <h2 className="text-white font-bold mb-2">Delete Provider?</h2>
        <p className="text-gray-400 text-sm mb-6">This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={()=>setDeleteId(null)} className="px-4 py-2 text-sm text-gray-400">Cancel</button>
          <button onClick={del} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm">Delete</button>
        </div></div></div>)}
  </div>)}
}
