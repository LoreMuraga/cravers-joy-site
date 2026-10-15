'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Banner } from '@/types/database'
import Link from 'next/link'

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBanners() {
      const { data } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setBanners(data)
      setLoading(false)
    }

    fetchBanners()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('⚠️ Are you sure you want to delete this banner? This action cannot be undone.')) return

    const { error } = await supabase.from('banners').delete().eq('id', id)
    if (error) {
      alert('❌ Failed to delete banner: ' + error.message)
      return
    }

    setBanners(banners.filter((b) => b.id !== id))
    alert('✅ Banner deleted successfully')
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('banners')
      .update({ is_active: !isActive })
      .eq('id', id)

    if (error) {
      alert('❌ Failed to update banner: ' + error.message)
      return
    }

    setBanners(
      banners.map((b) =>
        b.id === id ? { ...b, is_active: !isActive } : b
      )
    )
    alert('✅ Banner status updated successfully')
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-amber-900">Banners</h1>
        <Link
          href="/admin/banners/new"
          className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
        >
          Create Banner
        </Link>
      </div>

      <div className="grid gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-xl shadow-sm p-6 border border-amber-100"
          >
            <div className="flex gap-6">
              {banner.image_url && (
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-48 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-amber-900">
                      {banner.title}
                    </h3>
                    {banner.subtitle && (
                      <p className="text-amber-600 mt-1">{banner.subtitle}</p>
                    )}
                    {banner.description && (
                      <p className="text-sm text-amber-700 mt-2">{banner.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleToggleActive(banner.id, banner.is_active)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        banner.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {banner.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>

                {banner.is_offer && (
                  <div className="mt-4 flex items-center gap-4">
                    <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                      🎉 Offer Banner
                    </span>
                    {banner.discount_percentage && (
                      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                        {banner.discount_percentage}% OFF
                      </span>
                    )}
                    {banner.start_date && (
                      <span className="text-sm text-amber-600">
                        {new Date(banner.start_date).toLocaleDateString()} -{' '}
                        {banner.end_date
                          ? new Date(banner.end_date).toLocaleDateString()
                          : 'Ongoing'}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/banners/${banner.id}/edit`}
                    className="text-amber-600 hover:text-amber-900 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-amber-100 text-center text-amber-600">
            No banners yet. Create your first banner!
          </div>
        )}
      </div>
    </div>
  )
}
