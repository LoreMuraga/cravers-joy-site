'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface CakeFlavor {
  id: string
  cake_id: string
  flavor_name: string
  price_adjustment: number
  is_active: boolean
  created_at: string
}

export default function CakeFlavorsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [cakeId, setCakeId] = useState<string>('')
  const [cakeName, setCakeName] = useState<string>('')
  const [flavors, setFlavors] = useState<CakeFlavor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFlavor, setNewFlavor] = useState({
    flavor_name: '',
    price_adjustment: 0,
  })

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params
      setCakeId(resolvedParams.id)
      fetchData(resolvedParams.id)
    }
    loadParams()
  }, [params])

  const fetchData = async (id: string) => {
    // Fetch cake details
    const { data: cake } = await supabase
      .from('cakes')
      .select('name')
      .eq('id', id)
      .single()

    if (cake) setCakeName(cake.name)

    // Fetch flavors for this cake
    const { data: flavorsData } = await supabase
      .from('cake_flavors')
      .select('*')
      .eq('cake_id', id)
      .order('flavor_name')

    if (flavorsData) setFlavors(flavorsData)
    setLoading(false)
  }

  const handleAddFlavor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFlavor.flavor_name.trim()) return

    const { error } = await supabase.from('cake_flavors').insert({
      cake_id: cakeId,
      flavor_name: newFlavor.flavor_name,
      price_adjustment: newFlavor.price_adjustment,
      is_active: true,
    })

    if (error) {
      alert('Failed to add flavor: ' + error.message)
      return
    }

    setNewFlavor({ flavor_name: '', price_adjustment: 0 })
    setShowAddForm(false)
    fetchData(cakeId)
  }

  const handleDeleteFlavor = async (flavorId: string) => {
    if (!confirm('Are you sure you want to delete this flavor?')) return

    const { error } = await supabase
      .from('cake_flavors')
      .delete()
      .eq('id', flavorId)

    if (error) {
      alert('Failed to delete flavor: ' + error.message)
      return
    }

    fetchData(cakeId)
  }

  const handleToggleActive = async (flavorId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('cake_flavors')
      .update({ is_active: !currentStatus })
      .eq('id', flavorId)

    if (error) {
      alert('Failed to update flavor: ' + error.message)
      return
    }

    fetchData(cakeId)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-amber-900">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href="/admin/cakes"
            className="text-amber-600 hover:text-amber-900 text-sm mb-2 inline-block"
          >
            ← Back to Cakes
          </Link>
          <h1 className="text-3xl font-bold text-amber-900 mt-2">
            Flavors for {cakeName}
          </h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add Flavor'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-amber-900 mb-4">Add New Flavor</h2>
          <form onSubmit={handleAddFlavor} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Flavor Name
              </label>
              <input
                type="text"
                value={newFlavor.flavor_name}
                onChange={(e) =>
                  setNewFlavor({ ...newFlavor, flavor_name: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Chocolate, Vanilla, Red Velvet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Price Adjustment (KSh)
              </label>
              <input
                type="number"
                value={newFlavor.price_adjustment}
                onChange={(e) =>
                  setNewFlavor({
                    ...newFlavor,
                    price_adjustment: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="0 for no extra charge"
              />
              <p className="text-sm text-amber-600 mt-1">
                Extra cost per kg for this flavor (use negative for discount)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Add Flavor
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
        {flavors.length === 0 ? (
          <div className="text-center py-12 text-amber-600">
            No flavors added yet. Click "Add Flavor" to add the first flavor for this cake.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Flavor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Price Adjustment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {flavors.map((flavor) => (
                <tr key={flavor.id} className="hover:bg-amber-50">
                  <td className="px-6 py-4 font-medium text-amber-900">
                    {flavor.flavor_name}
                  </td>
                  <td className="px-6 py-4 text-amber-700">
                    {flavor.price_adjustment === 0
                      ? 'No extra charge'
                      : flavor.price_adjustment > 0
                      ? `+KSh ${flavor.price_adjustment.toLocaleString()}`
                      : `-KSh ${Math.abs(flavor.price_adjustment).toLocaleString()}`}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(flavor.id, flavor.is_active)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        flavor.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {flavor.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteFlavor(flavor.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
