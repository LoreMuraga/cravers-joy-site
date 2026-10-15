'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface AdminUser {
  id: string
  user_id: string
  email: string
  role: string
  is_approved: boolean
  approved_by: string | null
  approved_at: string | null
  created_at: string
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      const { data } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setAdmins(data)
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleApprove = async (adminId: string, userId: string) => {
    // Find current user's admin_users record
    const { data: currentAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', currentUser?.id)
      .single()

    const { error } = await supabase
      .from('admin_users')
      .update({
        is_approved: true,
        approved_by: currentAdmin?.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', adminId)

    if (error) {
      alert('Failed to approve admin: ' + error.message)
      return
    }

    setAdmins(admins.map(a => a.id === adminId ? { ...a, is_approved: true } : a))
  }

  const handleReject = async (adminId: string, userId: string) => {
    if (!confirm('Reject this admin request? This will delete their account.')) return

    // Delete from auth.users (need to use admin client or Supabase dashboard)
    // For now, just delete from admin_users table
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminId)

    if (error) {
      alert('Failed to reject admin')
      return
    }

    setAdmins(admins.filter(a => a.id !== adminId))
  }

  const handleRemove = async (adminId: string, userId: string) => {
    if (!confirm('Remove this admin? This will revoke their access.')) return

    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminId)

    if (error) {
      alert('Failed to remove admin')
      return
    }

    setAdmins(admins.filter(a => a.id !== adminId))
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  const pendingAdmins = admins.filter(a => !a.is_approved)
  const approvedAdmins = admins.filter(a => a.is_approved)

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Admin Management</h1>

      {/* Pending Approvals */}
      {pendingAdmins.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">
            Pending Approvals ({pendingAdmins.length})
          </h2>
          <div className="space-y-4">
            {pendingAdmins.map((admin) => (
              <div
                key={admin.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-amber-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-amber-900">{admin.email}</h3>
                    <p className="text-sm text-amber-600">
                      Role: {admin.role} · Requested: {new Date(admin.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(admin.id, admin.user_id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(admin.id, admin.user_id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Admins */}
      <div>
        <h2 className="text-xl font-semibold text-amber-900 mb-4">
          Approved Admins ({approvedAdmins.length})
        </h2>
        <div className="space-y-4">
          {approvedAdmins.map((admin) => (
            <div
              key={admin.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-amber-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-amber-900">{admin.email}</h3>
                  <p className="text-sm text-amber-600">
                    Role: {admin.role} · Approved: {admin.approved_at ? new Date(admin.approved_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(admin.id, admin.user_id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Remove Access
                </button>
              </div>
            </div>
          ))}
        </div>

        {approvedAdmins.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-amber-100 text-center text-amber-600">
            No approved admins yet.
          </div>
        )}
      </div>
    </div>
  )
}
