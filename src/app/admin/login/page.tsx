'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      console.log('Starting login process...')
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error('Sign in error:', signInError)
        throw signInError
      }

      console.log('Sign in successful, session:', !!data.session)
      
      // Show success message
      setSuccess(true)
      
      // Auto-redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1500)
      
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900">Admin Login</h1>
          <p className="text-amber-700 mt-2">Cravers Joy Cakes</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            ✓ Successful login! Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || success}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50"
              placeholder="admin@craversjoy.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || success}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : success ? 'Redirecting...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/admin/signup"
            className="text-amber-700 hover:text-amber-800 text-sm"
          >
            Don't have an account? Sign up
          </a>
        </div>

        <div className="mt-6 text-center pt-4 border-t border-amber-200">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium"
          >
            ← Return to main site
          </a>
        </div>
      </div>
    </div>
  )
}
