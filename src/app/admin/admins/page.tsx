'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('admin')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')
  const [currentUserRole, setCurrentUserRole] = useState('')
  const [currentUserId, setCurrentUserId] = useState('')

  useEffect(() => {
    fetchAdmins()
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setCurrentUserId(user.id)
      const { data } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', user.id)
        .single()
      if (data) setCurrentUserRole(data.role)
    }
  }

  const fetchAdmins = async () => {
    const { data } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false })
    if (data) setAdmins(data)
    setLoading(false)
  }

  const addAdmin = async () => {
    if (!newEmail || !newPassword) {
      setMessage('Please fill in all fields')
      return
    }

    setAdding(true)
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newEmail,
      password: newPassword,
    })

    if (authError) {
      setMessage('Error creating user: ' + authError.message)
      setAdding(false)
      return
    }

    if (authData.user) {
      // Add to admin_users table
      const { error: dbError } = await supabase.from('admin_users').insert({
        id: authData.user.id,
        email: newEmail,
        role: newRole,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      })

      if (dbError) {
        setMessage('Error adding admin: ' + dbError.message)
      } else {
        setMessage('Admin added successfully!')
        setNewEmail('')
        setNewPassword('')
        fetchAdmins()
        setTimeout(() => setMessage(''), 3000)
      }
    }

    setAdding(false)
  }

  const updateRole = async (adminId: string, newRole: string) => {
    const { error } = await supabase
      .from('admin_users')
      .update({ role: newRole })
      .eq('id', adminId)

    if (error) {
      setMessage('Error updating role: ' + error.message)
    } else {
      setMessage('Role updated successfully!')
      fetchAdmins()
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const deleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to remove this admin?')) return

    const { error } = await supabase.from('admin_users').delete().eq('id', adminId)

    if (error) {
      setMessage('Error removing admin: ' + error.message)
    } else {
      setMessage('Admin removed successfully!')
      fetchAdmins()
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-mahogany mb-6">Admin Management</h1>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Add New Admin */}
      <div className="bg-white rounded-xl border border-amber-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-mahogany mb-4">Add New Admin</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="px-4 py-3 rounded-lg border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-4 py-3 rounded-lg border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="px-4 py-3 rounded-lg border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>
        <button
          onClick={addAdmin}
          disabled={adding}
          className="bg-mahogany hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {adding ? 'Adding...' : 'Add Admin'}
        </button>
      </div>

      {/* Admins List */}
      <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-amber-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-mahogany">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-mahogany">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-mahogany">Created</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-mahogany">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-t border-amber-200">
                <td className="px-6 py-4 text-sm text-mahogany">{admin.email}</td>
                <td className="px-6 py-4">
                  {currentUserRole === 'superadmin' ? (
                    <select
                      value={admin.role}
                      onChange={(e) => updateRole(admin.id, e.target.value)}
                      className="px-3 py-1 rounded border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  ) : (
                    <span className="px-3 py-1 rounded bg-amber-100 text-sm font-medium capitalize">{admin.role}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-amber-700">
                  {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4">
                  {currentUserRole === 'superadmin' && admin.id !== currentUserId && (
                    <button
                      onClick={() => deleteAdmin(admin.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-amber-600">
        <p><strong>Superadmin</strong> can manage all settings and assign roles.</p>
        <p><strong>Admin</strong> can manage cakes, categories, and other content but cannot change admin roles.</p>
      </div>
    </div>
  )
}
