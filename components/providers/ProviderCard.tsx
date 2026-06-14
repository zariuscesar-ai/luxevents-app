import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, CheckCircle } from 'lucide-react'
import type { Provider } from '@/types/database'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/database'
import { formatPriceRange } from '@/lib/utils'

interface Props {
  provider: Provider
}

export default function ProviderCard({ provider }: Props) {
  const stars = Math.round(provider.rating * 2) / 2

  return (
    <Link href={`/providers/${provider.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
        {/* Cover image */}
        <div className="relative h-52 bg-gray-100">
          {provider.cover_image_url ? (
            <Image
              src={provider.cover_image_url}
              alt={provider.business_name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-5xl bg-gradient-to-br from-yellow-50 to-yellow-100">
              {CATEGORY_ICONS[provider.category]}
            </div>
          )}
          {provider.is_featured && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
              FEATURED
            </div>
          )}
          {provider.is_verified && (
            <div className="absolute top-3 right-3">
              <CheckCircle className="w-5 h-5 text-blue-500 fill-white" />
            </div>
          )}
          {/* Logo overlay */}
          {provider.logo_url && (
            <div className="absolute -bottom-6 left-4">
              <div className="w-12 h-12 rounded-xl border-2 border-white shadow-md overflow-hidden bg-white">
                <Image src={provider.logo_url} alt="logo" fill className="object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`p-4 ${provider.logo_url ? 'pt-8' : ''}`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-yellow-600 transition-colors">
                {provider.business_name}
              </h3>
              <span className="inline-block text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full mt-1">
                {CATEGORY_ICONS[provider.category]} {CATEGORY_LABELS[provider.category]}
              </span>
            </div>
          </div>

          {/* Location */}
          {provider.city && (
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{provider.city}, {provider.state}</span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1">
              {provider.review_count > 0 ? (
                <>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">{provider.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({provider.review_count})</span>
                </>
              ) : (
                <span className="text-xs text-gray-400">No reviews yet</span>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {formatPriceRange(provider.min_price, provider.max_price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
