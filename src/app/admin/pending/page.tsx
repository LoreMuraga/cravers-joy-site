'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function PendingPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function getUserEmail() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
      }
    }
    getUserEmail()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Account Pending Approval</h1>
        <p className="text-amber-600 mb-6">
          Your account ({email}) has been created but is waiting for approval from the administrator.
        </p>
        <div className="bg-amber-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>What happens next:</strong><br />
            The admin will review your request and approve your account. Once approved, you'll be able to log in and access the admin panel.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
