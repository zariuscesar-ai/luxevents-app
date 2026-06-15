'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Star, Eye, EyeOff, Building2, User } from 'lucide-react'

function SignupForm() {
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') as 'client' | 'provider' || 'client'

  const [role, setRole] = useState<'client' | 'provider'>(initialRole)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Check your email</h2>
          <p className="text-gray-500">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
          <Link href="/login" className="mt-6 inline-block text-yellow-600 font-medium hover:text-yellow-700">Back to login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 bg-white">
      <div className="mx-auto w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          <span className="text-xl font-serif font-bold text-gray-900">LuxEvents</span>
        </Link>

        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Create account</h1>
        <p className="text-gray-500 mb-8">Join the LuxEvents community</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { value: 'client', label: "I'm a Client", icon: User, desc: 'Looking for vendors' },
            { value: 'provider', label: "I'm a Vendor", icon: Building2, desc: 'Offering services' },
          ].map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value as 'client' | 'provider')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                role === value ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${role === value ? 'text-yellow-600' : 'text-gray-400'}`} />
              <div className={`text-sm font-medium ${role === value ? 'text-gray-900' : 'text-gray-600'}`}>{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">{error}</div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Jane Smith"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                required minLength={8} placeholder="Min. 8 characters"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent pr-10" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-semibold py-3 rounded-xl transition-colors text-sm mt-2">
            {loading ? 'Creating account...' : `Create ${role === 'provider' ? 'Vendor' : 'Client'} Account`}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          By signing up you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-600">Terms</Link> and{' '}
          <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
        </p>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-yellow-600 font-medium hover:text-yellow-700">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-pulse h-8 w-48 bg-gray-200 rounded" /></div>}>
        <SignupForm />
      </Suspense>
      <div className="hidden lg:block flex-1 relative bg-gray-900">
        <img src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80" alt="Event setup"
          className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 flex items-end justify-center p-12 pb-20">
          <div className="text-center text-white">
            <p className="text-lg font-serif italic mb-2">Join 500+ vendors already growing with LuxEvents</p>
            <p className="text-gray-300 text-sm">14-day free trial · No credit card required</p>
          </div>
        </div>
      </div>
    </div>
  )
}
