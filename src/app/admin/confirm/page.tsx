'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function confirmEmail() {
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type')

      if (!token_hash || !type) {
        setStatus('error')
        setMessage('Invalid confirmation link. Please try signing up again.')
        return
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as any,
      })

      if (error) {
        setStatus('error')
        setMessage(error.message || 'Failed to confirm email')
      } else {
        setStatus('success')
        setMessage('Email confirmed successfully! You can now log in.')
      }
    }

    confirmEmail()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <div>
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-amber-900 mb-2">Confirming your email...</h1>
            <p className="text-amber-600">Please wait while we verify your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-amber-900 mb-2">Email Confirmed!</h1>
            <p className="text-amber-600 mb-6">{message}</p>
            <button
              onClick={() => router.push('/admin/login')}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-amber-900 mb-2">Confirmation Failed</h1>
            <p className="text-amber-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/login')}
                className="block w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={() => router.push('/admin/signup')}
                className="block w-full border border-amber-200 text-amber-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
              >
                Try Signing Up Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
