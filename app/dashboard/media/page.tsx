'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Upload, Trash2, Star, Loader2 } from 'lucide-react'

export default function MediaPage() {
  const supabase = createClient()
  const router = useRouter()
  const [providerId, setProviderId] = useState<string | null>(null)
  const [media, setMedia] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: p } = await supabase.from('providers').select('id, provider_media(*)').eq('user_id', user.id).single()
      if (p) {
        setProviderId(p.id)
        setMedia((p as any).provider_media || [])
      }
    }
    load()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !providerId) return
    setUploading(true)
    setError('')

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const fileName = `${providerId}/${Date.now()}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('provider-media')
        .upload(fileName, file, { upsert: false })

      if (uploadError) { setError(uploadError.message); continue }

      const { data: { publicUrl } } = supabase.storage.from('provider-media').getPublicUrl(fileName)

      const { data: mediaRow } = await supabase.from('provider_media').insert({
        provider_id: providerId,
        url: publicUrl,
        type: file.type.startsWith('video') ? 'video' : 'image',
        sort_order: media.length,
      }).select().single()

      if (mediaRow) setMedia(prev => [...prev, mediaRow])
    }
    setUploading(false)
  }

  const setCover = async (mediaItem: any) => {
    await supabase.from('provider_media').update({ is_cover: false }).eq('provider_id', providerId!)
    await supabase.from('provider_media').update({ is_cover: true }).eq('id', mediaItem.id)
    await supabase.from('providers').update({ cover_image_url: mediaItem.url }).eq('id', providerId!)
    setMedia(media.map(m => ({ ...m, is_cover: m.id === mediaItem.id })))
  }

  const deleteMedia = async (item: any) => {
    const path = item.url.split('/provider-media/')[1]
    await supabase.storage.from('provider-media').remove([path])
    await supabase.from('provider_media').delete().eq('id', item.id)
    setMedia(media.filter(m => m.id !== item.id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Photos & Media</h1>
          <p className="text-gray-500 text-sm mt-1">{media.length} photos uploaded</p>
        </div>
        <label className={`flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2.5 rounded-xl cursor-pointer transition-colors ${!providerId ? 'opacity-40 pointer-events-none' : ''}`}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Upload Photos'}
          <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleUpload} disabled={uploading || !providerId} />
        </label>
      </div>

      {!providerId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700 mb-6">
          Please save your profile first before uploading photos.
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}

      {media.length === 0 && !uploading ? (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No photos yet</p>
          <p className="text-gray-400 text-sm mt-1">Upload photos to showcase your work and attract more clients</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              {item.type === 'image' ? (
                <Image src={item.url} alt="Media" fill className="object-cover" />
              ) : (
                <video src={item.url} className="w-full h-full object-cover" />
              )}
              {item.is_cover && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  COVER
                </div>
              )}
              {/* Actions on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => setCover(item)} title="Set as cover" className="p-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full transition-colors">
                  <Star className="w-4 h-4" />
                </button>
                <button onClick={() => deleteMedia(item)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4">
        Tip: Click the ★ star on any photo to set it as your cover image (shown in search results).
        Supported formats: JPG, PNG, WebP, MP4.
      </p>
    </div>
  )
}
