import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { Provider, Review } from '@/types/database'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/database'
import { formatPriceRange, formatDate } from '@/lib/utils'
import {
  Star, MapPin, Globe, Instagram, CheckCircle,
  Calendar, Users, Clock, MessageCircle, Phone
} from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data } = await supabase.from('providers').select('business_name, description').eq('slug', params.slug).single()
  if (!data) return { title: 'Vendor Not Found' }
  return {
    title: `${data.business_name} — LuxEvents`,
    description: data.description?.slice(0, 160),
  }
}

export default async function ProviderProfilePage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: provider } = await supabase
    .from('providers')
    .select('*, provider_media(*), services(*)')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!provider) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, client:profiles(full_name, avatar_url)')
    .eq('provider_id', provider.id)
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .limit(10)

  const images = provider.provider_media?.filter((m: any) => m.type === 'image') ?? []
  const p = provider as Provider

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <div className="relative h-72 md:h-96 bg-gray-800">
          {p.cover_image_url ? (
            <Image src={p.cover_image_url} alt={p.business_name} fill className="object-cover" />
          ) : images[0] ? (
            <Image src={(images[0] as any).url} alt={p.business_name} fill className="object-cover" />
          ) : (
            <div className="h-full flex items-center justify-center text-8xl bg-gradient-to-br from-gray-800 to-gray-700">
              {CATEGORY_ICONS[p.category]}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 mb-6 flex flex-col md:flex-row md:items-end gap-4">
            <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0">
              {p.logo_url ? (
                <Image src={p.logo_url} alt="logo" width={112} height={112} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-yellow-50">
                  {CATEGORY_ICONS[p.category]}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-serif font-bold text-gray-900">{p.business_name}</h1>
                    {p.is_verified && <CheckCircle className="w-6 h-6 text-blue-500 fill-white" />}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium text-xs">
                      {CATEGORY_ICONS[p.category]} {CATEGORY_LABELS[p.category]}
                    </span>
                    {p.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {p.city}, {p.state}
                      </span>
                    )}
                    {p.review_count > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        {p.rating.toFixed(1)} ({p.review_count} reviews)
                      </span>
                    )}
                  </div>
                </div>
                <div className="md:ml-auto flex gap-2 flex-wrap">
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:border-yellow-400 hover:text-yellow-600 px-3 py-1.5 rounded-lg text-sm transition-colors">
                      <Globe className="w-4 h-4" /> Website
                    </a>
                  )}
                  {p.instagram && (
                    <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:border-yellow-400 hover:text-yellow-600 px-3 py-1.5 rounded-lg text-sm transition-colors">
                      <Instagram className="w-4 h-4" /> Instagram
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            <div className="lg:col-span-2 space-y-8">
              {p.description && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">About</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{p.description}</p>
                </div>
              )}
              {images.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {images.map((img: any, i: number) => (
                      <div key={img.id} className={`relative rounded-xl overflow-hidden ${i === 0 ? 'col-span-2 row-span-2 h-64' : 'h-32'}`}>
                        <Image src={img.url} alt={img.caption || p.business_name} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {p.services && (p.services as any[]).length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Services & Packages</h2>
                  <div className="space-y-3">
                    {(p.services as any[]).filter((s) => s.is_active).map((service) => (
                      <div key={service.id} className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:border-yellow-200 hover:bg-yellow-50/30 transition-colors">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          {service.description && <p className="text-sm text-gray-500 mt-1">{service.description}</p>}
                          <div className="flex gap-4 mt-2 text-xs text-gray-400">
                            {service.duration_hrs && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.duration_hrs}h</span>}
                            {service.max_guests && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Up to {service.max_guests} guests</span>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          {service.price ? (
                            <span className="font-bold text-gray-900">${service.price.toLocaleString()}</span>
                          ) : (
                            <span className="text-sm text-gray-400">Quote on request</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-serif font-bold text-gray-900">Reviews</h2>
                  {p.review_count > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-gray-900">{p.rating.toFixed(1)}</span>
                      <span className="text-gray-400 text-sm">/ 5 ({p.review_count})</span>
                    </div>
                  )}
                </div>
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-sm font-medium text-yellow-700">
                              {review.client?.full_name?.[0] ?? 'C'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{review.client?.full_name ?? 'Client'}</div>
                              <div className="flex items-center gap-0.5 mt-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        {review.body && <p className="text-sm text-gray-500 mt-2 leading-relaxed">{review.body}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm py-4 text-center">No reviews yet.</p>
                )}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-gray-900">{formatPriceRange(p.min_price, p.max_price)}</p>
                </div>
                <Link
                  href={`/book/${p.id}`}
                  className="block w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3.5 rounded-xl text-center transition-colors"
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Check Availability &amp; Book
                </Link>
                <div className="mt-6 space-y-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> Secure payment via Stripe</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> Verified vendor profiles</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> Money protected until event day</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
