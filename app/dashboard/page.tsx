import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Star, Image, TrendingUp, Plus, AlertCircle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: provider } = await supabase
    .from('providers')
    .select('*, services(*), provider_media(*)')
    .eq('user_id', user.id)
    .single()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('provider_id', provider?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('provider_id', provider?.id)
    .order('created_at', { ascending: false })
    .limit(3)

  if (!provider) {
    return (
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Welcome to LuxEvents!</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">Complete your vendor profile</h3>
            <p className="text-yellow-700 text-sm">Set up your business profile to start appearing in search results and receiving bookings.</p>
            <Link href="/dashboard/profile" className="mt-3 inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
              Create Profile
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalRevenue = (bookings ?? [])
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.provider_amount, 0)

  const pendingBookings = (bookings ?? []).filter(b => b.status === 'pending').length
  const photoCount = provider.provider_media?.length ?? 0
  const serviceCount = provider.services?.filter((s: any) => s.is_active).length ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">{provider.business_name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {provider.subscription_status === 'active' ? (
              <span className="text-green-600 font-medium">● Active — {provider.subscription_plan} plan</span>
            ) : (
              <span className="text-red-500 font-medium">● Subscription inactive — <Link href="/dashboard/subscription" className="underline">upgrade now</Link></span>
            )}
          </p>
        </div>
        <Link href={`/providers/${provider.slug}`} className="text-sm border border-gray-200 hover:border-yellow-400 text-gray-600 hover:text-yellow-600 px-4 py-2 rounded-xl transition-colors">
          View Public Profile →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending Bookings', value: String(pendingBookings), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Photos', value: String(photoCount), icon: Image, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Rating', value: provider.review_count > 0 ? `${provider.rating.toFixed(1)} ★` : '—', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/dashboard/media', label: 'Add Photos', icon: Image },
              { href: '/dashboard/profile', label: 'Edit Profile', icon: Plus },
              { href: '/dashboard/bookings', label: 'View Bookings', icon: Calendar },
              { href: '/dashboard/subscription', label: 'Upgrade Plan', icon: Star },
            ].map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-yellow-300 hover:bg-yellow-50 transition-colors">
                <Icon className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent reviews */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Reviews</h2>
            <Link href="/dashboard/reviews" className="text-xs text-yellow-600 hover:text-yellow-700">See all</Link>
          </div>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((r: any) => (
                <div key={r.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className="flex mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 flex-1">{r.body?.slice(0, 80)}...</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No reviews yet. Bookings will generate reviews!</p>
          )}
        </div>
      </div>

      {/* Setup checklist if incomplete */}
      {(!provider.cover_image_url || !provider.description || serviceCount === 0) && (
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Complete your profile to get more bookings</h3>
          <div className="space-y-2">
            {[
              { done: !!provider.cover_image_url, label: 'Add a cover photo', href: '/dashboard/media' },
              { done: !!provider.description, label: 'Write your business description', href: '/dashboard/profile' },
              { done: serviceCount > 0, label: 'Add at least one service package', href: '/dashboard/profile' },
              { done: provider.subscription_status === 'active', label: 'Activate your subscription', href: '/dashboard/subscription' },
            ].map(({ done, label, href }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-500' : 'bg-white border-2 border-gray-300'}`}>
                  {done && <span className="text-white text-xs">✓</span>}
                </div>
                {done ? (
                  <span className="text-sm text-gray-400 line-through">{label}</span>
                ) : (
                  <Link href={href} className="text-sm text-blue-700 hover:underline">{label}</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
