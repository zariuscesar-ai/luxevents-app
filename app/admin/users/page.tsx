'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Profile = { id:string; full_name:string; email:string; role:string; created_at:string }
const ROLES = ['client','provider','admin']
const ROLE_COLORS:Record<string,string> = {
  admin:'bg-yellow-400/20 text-yellow-400',
  provider:'bg-blue-400/20 text-blue-400',
  client:'bg-gray-600/40 text-gray-300',
}

export default function AdminUsers(){
  const supabase = createClient()
  const [users,setUsers] = useState<Profile[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      setLoading(true)
      const {data} = await supabase.from('profiles').select('*').order('created_at',{ascending:false})
      setUsers(data??[])
      setLoading(false)
    }
    load()
  },[supabase])

  async function changeRole(id:string, role:string){
    await supabase.from('profiles').update({role}).eq('id',id)
    setUsers(us=>us.map(u=>u.id===id?{...u,role}:u))
  }  return(
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Users</h1>
      {loading?<p className="text-gray-400">Loading...</p>:(
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-left">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Role</th>
              <th className="pb-3 pr-4">Joined</th>
              <th className="pb-3">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="py-3 pr-4 text-white">{u.full_name||'—'}</td>
                <td className="py-3 pr-4 text-gray-300">{u.email}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${ROLE_COLORS[u.role]||''}`}>{u.role}</span>
                </td>
                <td className="py-3 pr-4 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="py-3">
                  <select value={u.role} onChange={e=>changeRole(u.id,e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-xs outline-none">
                    {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length===0&&<p className="text-gray-500 text-center py-12">No users found.</p>}
      </div>)}
    </div>
  )
}
