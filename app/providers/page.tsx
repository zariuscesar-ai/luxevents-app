import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProviderCard from '@/components/providers/ProviderCard'
import type { Provider, ProviderCategory } from '@/types/database'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/database'
import { SlidersHorizontal } from 'lucide-react'

interface SearchParams {
  category?: string
  city?: string
  sort?: string
  featured?: string
  q?: string
}

export default async function ProvidersPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()

  let query = supabase
    .from('providers')
    .select('*, provider_media(*)')
    .eq('is_active', true)

  if (searchParams.category) query = query.eq('category', searchParams.category)
  if (searchParams.city) query = query.ilike('city', `%${searchParams.city}%`)
  if (searchParams.featured === 'true') query = query.eq('is_featured', true)
  if (searchParams.q) query = query.ilike('business_name', `%${searchParams.q}%`)

  if (searchParams.sort === 'price_asc') query = query.order('min_price', { ascending: true })
  else if (searchParams.sort === 'price_desc') query = query.order('min_price', { ascending: false })
  else query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false })

  const { data: providers } = await query.limit(48)

  const categories = Object.entries(CATEGORY_LABELS) as [ProviderCategory, string][]
  const activeCategory = searchParams.category as ProviderCategory | undefined

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        {/* Hero bar */}
        <div className="bg-gray-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-serif font-bold mb-2">
              {activeCategory ? `${CATEGORY_ICONS[activeCategory]} ${CATEGORY_LABELS[activeCategory]}` : 'All Event Vendors'}
            </h1>
            <p className="text-gray-400">{providers?.length ?? 0} vendors found</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar filters */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-900 text-sm">Categories</h3>
                </div>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="/providers"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${!activeCategory ? 'bg-yellow-50 text-yellow-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      ⭐ All Categories
                    </a>
                  </li>
                  {categories.map(([slug, label]) => (
                    <li key={slug}>
                      <a
                        href={`/providers?category=${slug}`}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === slug ? 'bg-yellow-50 text-yellow-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {CATEGORY_ICONS[slug]} {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1">
              {/* Sort bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
                  {categories.slice(0, 5).map(([slug, label]) => (
                    <a
                      key={slug}
                      href={`/providers?category=${slug}`}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCategory === slug ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-gray-200 text-gray-600 bg-white'}`}
                    >
                      {CATEGORY_ICONS[slug]} {label}
                    </a>
                  ))}
                </div>
                <select
                  className="ml-auto border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  defaultValue={searchParams.sort || 'default'}
                  onChange={(e) => {
                    const url = new URL(window.location.href)
                    url.searchParams.set('sort', e.target.value)
                    window.location.href = url.toString()
                  }}
                >
                  <option value="default">Top Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              {providers && providers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {providers.map((p) => (
                    <ProviderCard key={p.id} provider={p as Provider} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-4xl mb-4">🔍</p>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No vendors found</h3>
                  <p className="text-gray-400">Try a different category or search term</p>
                  <a href="/providers" className="mt-4 inline-block text-yellow-600 font-medium hover:text-yellow-700">Clear filters</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
