'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Cake, Category } from '@/types/database'
import Link from 'next/link'

export default function CakesPage() {
  const [cakes, setCakes] = useState<Cake[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    async function fetchData() {
      const [cakesData, categoriesData] = await Promise.all([
        supabase.from('cakes').select('*, categories(name)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ])

      if (cakesData.data) setCakes(cakesData.data as any)
      if (categoriesData.data) setCategories(categoriesData.data)
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('⚠️ Are you sure you want to delete this cake? This action cannot be undone.')) return

    const { error } = await supabase.from('cakes').delete().eq('id', id)
    if (error) {
      alert('❌ Failed to delete cake: ' + error.message)
      return
    }

    setCakes(cakes.filter((c) => c.id !== id))
    alert('✅ Cake deleted successfully')
  }

  const getCategoryName = (categoryId: string | null) => {
    const cat = categories.find((c) => c.id === categoryId)
    return cat?.name || 'Uncategorized'
  }

  const isCakeIncomplete = (cake: any) => {
    return !cake.image_url || !cake.description || cake.base_price === 0 || !cake.is_active
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-amber-900">Cakes</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/cakes/bulk"
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Bulk Add
          </Link>
          <Link
            href="/admin/cakes/new"
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Add New Cake
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
        <div style={{ overflowX: isMobile ? 'auto' : 'visible' }}>
          <table className="w-full">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Cake
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Price
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
              {cakes.map((cake) => (
                <tr key={cake.id} className="hover:bg-amber-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {cake.image_url ? (
                        <img
                          src={cake.image_url}
                          alt={cake.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-400">
                          🎂
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-amber-900 flex items-center gap-2">
                          {cake.name}
                          {isCakeIncomplete(cake) && (
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">
                              Incomplete
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-amber-600">{cake.tag}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-amber-700">
                    {getCategoryName(cake.category_id)}
                  </td>
                  <td className="px-6 py-4 text-amber-900 font-medium">
                    {cake.base_price === 0 ? '-' : `KSh ${cake.base_price.toLocaleString()}`}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cake.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {cake.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/cakes/${cake.id}/flavors`}
                        className="bg-pink-100 text-pink-700 px-3 py-1 rounded-lg text-sm hover:bg-pink-200 transition-colors"
                      >
                        Flavors
                      </Link>
                      <Link
                        href={`/admin/cakes/${cake.id}/edit`}
                        className="text-amber-600 hover:text-amber-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(cake.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cakes.length === 0 && (
          <div className="text-center py-12 text-amber-600">
            No cakes yet. Add your first cake!
          </div>
        )}
      </div>
    </div>
  )
}
