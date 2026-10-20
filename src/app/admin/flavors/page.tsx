'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function FlavorsPage() {
  const [flavors, setFlavors] = useState<any[]>([])
  const [name, setName] = useState('')
  const [pricePerKg, setPricePerKg] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchFlavors()
  }, [])

  const fetchFlavors = async () => {
    const { data } = await supabase.from('flavors').select('*').order('name')
    if (data) setFlavors(data)
    setLoading(false)
  }

  const addFlavor = async () => {
    if (!name || !pricePerKg) {
      setMessage('Please fill in all fields')
      return
    }

    setSaving(true)
    const { error } = await supabase.from('flavors').insert({
      name,
      price_per_kg: parseFloat(pricePerKg),
      is_active: true,
    })

    if (error) {
      setMessage('Error adding flavor: ' + error.message)
    } else {
      setMessage('Flavor added successfully!')
      setName('')
      setPricePerKg('')
      fetchFlavors()
      setTimeout(() => setMessage(''), 3000)
    }
    setSaving(false)
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase.from('flavors').update({ is_active: !isActive }).eq('id', id)
    if (error) {
      setMessage('Error updating flavor: ' + error.message)
    } else {
      fetchFlavors()
    }
  }

  const deleteFlavor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flavor?')) return

    const { error } = await supabase.from('flavors').delete().eq('id', id)
    if (error) {
      setMessage('Error deleting flavor: ' + error.message)
    } else {
      setMessage('Flavor deleted successfully!')
      fetchFlavors()
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-mahogany mb-6">Flavors</h1>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Add New Flavor */}
      <div className="bg-white rounded-xl border border-amber-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-mahogany mb-4">Add New Flavor</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Flavor name (e.g. Chocolate)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 rounded-lg border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="number"
            placeholder="Price per kg (KSh)"
            value={pricePerKg}
            onChange={(e) => setPricePerKg(e.target.value)}
            className="px-4 py-3 rounded-lg border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={addFlavor}
            disabled={saving}
            className="bg-mahogany hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add Flavor'}
          </button>
        </div>
      </div>

      {/* Flavors List */}
      <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-amber-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-mahogany">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-mahogany">Price per kg</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-mahogany">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-mahogany">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flavors.map((flavor) => (
              <tr key={flavor.id} className="border-t border-amber-200">
                <td className="px-6 py-4 text-sm text-mahogany">{flavor.name}</td>
                <td className="px-6 py-4 text-sm text-mahogany">KSh {flavor.price_per_kg.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(flavor.id, flavor.is_active)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      flavor.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {flavor.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteFlavor(flavor.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
