'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function EditBannerPage() {
  const router = useRouter()
  const params = useParams()
  const bannerId = params.id as string

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    is_offer: false,
    discount_percentage: '',
    custom_price_list: '',
    is_active: true,
    start_date: '',
    end_date: '',
  })

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('banners')
        .select('*')
        .eq('id', bannerId)
        .single()

      if (data) {
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          image_url: data.image_url || '',
          is_offer: data.is_offer || false,
          discount_percentage: data.discount_percentage?.toString() || '',
          custom_price_list: data.custom_price_list ? JSON.stringify(data.custom_price_list, null, 2) : '',
          is_active: data.is_active !== false,
          start_date: data.start_date || '',
          end_date: data.end_date || '',
        })
      }
      setFetchLoading(false)
    }

    fetchData()
  }, [bannerId])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('You must be logged in to upload images')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('cake-images')
        .upload(`banners/${fileName}`, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('cake-images')
        .getPublicUrl(data.path)

      setFormData({ ...formData, image_url: publicUrl })
    } catch (error: any) {
      alert('Failed to upload image: ' + (error?.message || 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let priceListJson = null
      if (formData.custom_price_list) {
        try {
          priceListJson = JSON.parse(formData.custom_price_list)
        } catch {
          alert('❌ Invalid JSON format for custom price list')
          setLoading(false)
          return
        }
      }

      const { error } = await supabase.from('banners').update([
        {
          title: formData.title,
          subtitle: formData.subtitle || null,
          description: formData.description || null,
          image_url: formData.image_url || null,
          is_offer: formData.is_offer,
          discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : null,
          custom_price_list: priceListJson,
          is_active: formData.is_active,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
        },
      ]).eq('id', bannerId)

      if (error) throw error

      alert('✅ Successfully updated banner!')
      router.push('/admin/banners')
    } catch (error: any) {
      alert('❌ Failed to update banner: ' + (error?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-6 sm:mb-8">Edit Banner</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 border border-amber-100">
        <div className="space-y-4 sm:space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Banner Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              placeholder="e.g., Customer Service Week Special"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              placeholder="e.g., Limited time offer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              placeholder="Banner description text"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Banner Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            />
            {uploading && <p className="text-sm text-amber-600 mt-2">Uploading...</p>}
            {formData.image_url && (
              <img
                src={formData.image_url}
                alt="Preview"
                className="mt-4 w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Offer Settings */}
          <div className="border-t border-amber-200 pt-4 sm:pt-6">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="is_offer"
                checked={formData.is_offer}
                onChange={(e) => setFormData({ ...formData, is_offer: e.target.checked })}
                className="w-4 h-4 text-pink-600 border-amber-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="is_offer" className="text-sm font-medium text-amber-900">
                This is an offer banner
              </label>
            </div>

            {formData.is_offer && (
              <div className="space-y-4 pl-6 border-l-2 border-pink-200">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    placeholder="e.g., 20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Custom Price List (JSON format)
                  </label>
                  <textarea
                    value={formData.custom_price_list}
                    onChange={(e) => setFormData({ ...formData, custom_price_list: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
                    placeholder='[
  {"name": "Vanilla Cake", "original_price": 3000, "offer_price": 2400},
  {"name": "Chocolate Cake", "original_price": 3200, "offer_price": 2560}
]'
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    Optional: JSON array with custom pricing for this offer
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-pink-600 border-amber-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="is_active" className="text-sm text-amber-900">
              Active (visible on website)
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? 'Updating...' : 'Update Banner'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-amber-200 rounded-lg text-amber-900 hover:bg-amber-50 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
