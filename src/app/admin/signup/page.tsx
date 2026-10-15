'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminSignup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/confirm`,
        },
      })

      if (error) throw error

      if (data.user) {
        // Try to add to admin_users table with is_approved = false
        try {
          console.log('Creating admin user record for:', data.user.id, data.user.email)
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({
              user_id: data.user.id,
              email: data.user.email,
              role: 'admin',
              is_approved: false,
            })

          if (insertError) {
            console.error('Failed to create admin user record:', insertError)
            console.error('Error details:', JSON.stringify(insertError, null, 2))
            // Continue anyway - the user can be approved later via SQL
          } else {
            console.log('Admin user record created successfully')
          }
        } catch (err) {
          console.error('Error creating admin user record:', err)
        }

        if (data.user && !data.session) {
          // Email confirmation required
          alert('Account created! Please check your email for a confirmation link. The admin will need to approve your account before you can log in.')
          router.push('/admin/login')
        } else if (data.session) {
          // Auto-confirmed (if email confirmation is disabled in Supabase)
          alert('Account created! Please wait for the admin to approve your account before you can log in.')
          router.push('/admin/login')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900">Admin Signup</h1>
          <p className="text-amber-700 mt-2">Cravers Joy Cakes</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
              minLength={6}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/admin/login"
            className="text-amber-700 hover:text-amber-800 text-sm"
          >
            Already have an account? Log in
          </a>
        </div>
      </div>
    </div>
  )
}
