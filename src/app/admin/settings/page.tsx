'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DeliveryArea, Flavor } from '@/types/database'

export default function SettingsPage() {
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>([])
  const [flavors, setFlavors] = useState<Flavor[]>([])
  const [loading, setLoading] = useState(true)

  const [areaForm, setAreaForm] = useState({ name: '', price: '' })
  const [flavorForm, setFlavorForm] = useState({ name: '', price_per_kg: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [areasData, flavorsData] = await Promise.all([
      supabase.from('delivery_areas').select('*').order('name'),
      supabase.from('flavors').select('*').order('name'),
    ])

    if (areasData.data) setDeliveryAreas(areasData.data)
    if (flavorsData.data) setFlavors(flavorsData.data)
    setLoading(false)
  }

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.from('delivery_areas').insert([
      {
        name: areaForm.name,
        price: parseFloat(areaForm.price),
      },
    ])

    if (error) {
      alert('Failed to add delivery area')
      return
    }

    setAreaForm({ name: '', price: '' })
    fetchData()
  }

  const handleDeleteArea = async (id: string) => {
    if (!confirm('Delete this delivery area?')) return

    const { error } = await supabase.from('delivery_areas').delete().eq('id', id)
    if (error) {
      alert('Failed to delete')
      return
    }

    fetchData()
  }

  const handleAddFlavor = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.from('flavors').insert([
      {
        name: flavorForm.name,
        price_per_kg: parseFloat(flavorForm.price_per_kg),
      },
    ])

    if (error) {
      alert('Failed to add flavor')
      return
    }

    setFlavorForm({ name: '', price_per_kg: '' })
    fetchData()
  }

  const handleDeleteFlavor = async (id: string) => {
    if (!confirm('Delete this flavor?')) return

    const { error } = await supabase.from('flavors').delete().eq('id', id)
    if (error) {
      alert('Failed to delete')
      return
    }

    fetchData()
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Settings</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Delivery Areas */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-amber-100">
          <h2 className="text-xl font-semibold text-amber-900 mb-6">Delivery Areas</h2>

          <form onSubmit={handleAddArea} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Area Name *
              </label>
              <input
                type="text"
                value={areaForm.name}
                onChange={(e) => setAreaForm({ ...areaForm, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Kenyatta Road"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Delivery Price (KSh) *
              </label>
              <input
                type="number"
                value={areaForm.price}
                onChange={(e) => setAreaForm({ ...areaForm, price: e.target.value })}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., 300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Add Area
            </button>
          </form>

          <div className="space-y-2">
            {deliveryAreas.map((area) => (
              <div
                key={area.id}
                className="flex justify-between items-center p-3 bg-amber-50 rounded-lg"
              >
                <div>
                  <span className="font-medium text-amber-900">{area.name}</span>
                  <span className="ml-2 text-amber-600">KSh {area.price.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => handleDeleteArea(area.id)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Flavors */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-amber-100">
          <h2 className="text-xl font-semibold text-amber-900 mb-6">Cake Flavors</h2>

          <form onSubmit={handleAddFlavor} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Flavor Name *
              </label>
              <input
                type="text"
                value={flavorForm.name}
                onChange={(e) => setFlavorForm({ ...flavorForm, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Vanilla"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Price per kg (KSh) *
              </label>
              <input
                type="number"
                value={flavorForm.price_per_kg}
                onChange={(e) => setFlavorForm({ ...flavorForm, price_per_kg: e.target.value })}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., 1800"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Add Flavor
            </button>
          </form>

          <div className="space-y-2">
            {flavors.map((flavor) => (
              <div
                key={flavor.id}
                className="flex justify-between items-center p-3 bg-amber-50 rounded-lg"
              >
                <div>
                  <span className="font-medium text-amber-900">{flavor.name}</span>
                  <span className="ml-2 text-amber-600">KSh {flavor.price_per_kg.toLocaleString()} / kg</span>
                </div>
                <button
                  onClick={() => handleDeleteFlavor(flavor.id)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
