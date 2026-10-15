'use client'

import { supabase } from '@/lib/supabase'
import { useState, useEffect, useRef } from 'react'

export default function DeliveryAreasPage() {
  const [areas, setAreas] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingPrice, setEditingPrice] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    async function fetchAreas() {
      const { data } = await supabase
        .from('delivery_areas')
        .select('*')
        .order('price')
      if (data) setAreas(data)
    }
    fetchAreas()
  }, [])

  async function addArea(formData: FormData) {
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)

    console.log('Adding delivery area:', { name, price })

    const { error } = await supabase.from('delivery_areas').insert({
      name,
      price,
      is_active: true,
    })

    if (error) {
      console.error('Error adding delivery area:', error)
      if (error.code === '23505' || error.message.includes('duplicate key')) {
        alert('A delivery area with this name already exists. Please use a different name.')
      } else {
        alert('Failed to add delivery area: ' + error.message)
      }
      return
    }

    console.log('Successfully added delivery area')
    alert('Successfully added delivery area!')

    // Clear form
    formRef.current?.reset()
    console.log('Form cleared')

    // Refresh areas
    const { data } = await supabase.from('delivery_areas').select('*').order('price')
    if (data) setAreas(data)
    console.log('Areas refreshed')
  }

  async function deleteArea(id: string) {
    if (!confirm('Are you sure you want to delete this area?')) return

    const { error } = await supabase.from('delivery_areas').delete().eq('id', id)

    if (error) {
      alert('Failed to delete delivery area: ' + error.message)
      return
    }

    alert('Successfully deleted delivery area!')

    // Refresh areas
    const { data } = await supabase.from('delivery_areas').select('*').order('price')
    if (data) setAreas(data)
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('delivery_areas')
      .update({ is_active: !currentStatus })
      .eq('id', id)

    if (error) {
      alert('Failed to update delivery area: ' + error.message)
      return
    }

    alert(`Successfully ${!currentStatus ? 'activated' : 'deactivated'} delivery area!`)

    // Refresh areas
    const { data } = await supabase.from('delivery_areas').select('*').order('price')
    if (data) setAreas(data)
  }

  async function updatePrice(id: string, newPrice: number) {
    const { error } = await supabase
      .from('delivery_areas')
      .update({ price: newPrice })
      .eq('id', id)

    if (error) {
      alert('Failed to update price: ' + error.message)
      return
    }

    alert('Successfully updated price!')
    setEditingId(null)
    setEditingPrice('')

    // Refresh areas
    const { data } = await supabase.from('delivery_areas').select('*').order('price')
    if (data) setAreas(data)
  }

  const startEditing = (id: string, currentPrice: number) => {
    setEditingId(id)
    setEditingPrice(currentPrice.toString())
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingPrice('')
  }

  const savePrice = (id: string) => {
    const price = parseFloat(editingPrice)
    if (isNaN(price) || price < 0) {
      alert('Please enter a valid price')
      return
    }
    updatePrice(id, price)
  }

  return (
    <div>
      <h1>Delivery Areas</h1>
      <p className="text-gray-600 mb-6">Manage delivery areas and their fees</p>

      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); addArea(new FormData(e.currentTarget)); }} className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Delivery Area</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Area Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border rounded"
              placeholder="e.g., Kenyatta Road"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Delivery Fee (KSh)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              required
              min="0"
              step="50"
              className="w-full px-3 py-2 border rounded"
              placeholder="e.g., 300"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Area
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Area Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {areas?.map((area: any) => (
              <tr key={area.id}>
                <td className="px-6 py-4">{area.name}</td>
                <td className="px-6 py-4">
                  {editingId === area.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editingPrice}
                        onChange={(e) => setEditingPrice(e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                        min="0"
                        step="50"
                      />
                      <button
                        onClick={() => savePrice(area.id)}
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                      >
                        ✓
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-2 py-1 bg-gray-600 text-white rounded text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>KSh {area.price.toLocaleString()}</span>
                      <button
                        onClick={() => startEditing(area.id, area.price)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(area.id, area.is_active)}
                    className={`px-2 py-1 rounded text-xs ${
                      area.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {area.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteArea(area.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {(!areas || areas.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No delivery areas found. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
