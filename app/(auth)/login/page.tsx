'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Star, Eye, EyeOff } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(redirect)
      router.refresh()
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
        <span className="text-xl font-serif font-bold text-gray-900">LuxEvents</span>
      </Link>

      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Welcome back</h1>
      <p className="text-gray-500 mb-8">Sign in to your account</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all pr-10"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-yellow-600 hover:text-yellow-700">Forgot password?</Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-yellow-600 font-medium hover:text-yellow-700">Create one</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left: form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 bg-white">
        <Suspense fallback={<div className="mx-auto w-full max-w-sm animate-pulse"><div className="h-8 bg-gray-200 rounded mb-4" /></div>}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Right: image */}
      <div className="hidden lg:block flex-1 relative bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80"
          alt="Elegant event"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <blockquote className="text-white text-center">
            <p className="text-2xl font-serif italic mb-4">"LuxEvents connected us with the perfect vendors for our wedding. Absolutely seamless."</p>
            <footer className="text-gray-300 text-sm">— Sarah M., Client</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
