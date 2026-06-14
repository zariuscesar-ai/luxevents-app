import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/database'
import type { ProviderCategory } from '@/types/database'

export const metadata = {
  title: 'Browse by Category — LuxEvents',
  description: 'Find event vendors by category: venues, caterers, photographers, DJs, florists, and more.',
}

export default async function CategoriesPage() {
  const supabase = await createClient()

  // Get count per category
  const { data: counts } = await supabase
    .from('providers')
    .select('category')
    .eq('is_active', true)

  const countMap: Record<string, number> = {}
  counts?.forEach((p) => { countMap[p.category] = (countMap[p.category] ?? 0) + 1 })

  const categories = Object.entries(CATEGORY_LABELS) as [ProviderCategory, string][]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">All Categories</h1>
            <p className="text-gray-500 text-lg">Find exactly what you need for your event</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map(([slug, label]) => (
              <Link
                key={slug}
                href={`/providers?category=${slug}`}
                className="group bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 hover:border-yellow-300 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{CATEGORY_ICONS[slug]}</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-yellow-600 transition-colors">{label}</div>
                {countMap[slug] > 0 && (
                  <div className="text-xs text-gray-400 mt-1">{countMap[slug]} vendor{countMap[slug] !== 1 ? 's' : ''}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
