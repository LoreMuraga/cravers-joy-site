'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Category } from '@/types/database'
import { useRouter } from 'next/navigation'

export default function NewCakePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    image_url: '',
    tag: '',
    description: '',
    price_type: 'kg' as 'kg' | 'each' | 'from' | 'tier' | 'flav',
    base_price: '',
    min_quantity: '1',
    notice_days: '1',
    emoji: '',
    unit_label: '',
    is_active: true,
  })

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*').order('name')
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('You must be logged in to upload images')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('cake-images')
        .upload(`cakes/${fileName}`, file)

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
      const { error } = await supabase.from('cakes').insert([
        {
          name: formData.name,
          category_id: formData.category_id || null,
          image_url: formData.image_url || null,
          tag: formData.tag || null,
          description: formData.description || null,
          price_type: formData.price_type,
          base_price: parseFloat(formData.base_price),
          min_quantity: parseInt(formData.min_quantity),
          notice_days: parseInt(formData.notice_days),
          emoji: formData.emoji || null,
          unit_label: formData.unit_label || null,
          is_active: formData.is_active,
        },
      ])

      if (error) throw error

      // Reset form
      setFormData({
        name: '',
        category_id: '',
        image_url: '',
        tag: '',
        description: '',
        price_type: 'kg',
        base_price: '',
        min_quantity: '1',
        notice_days: '1',
        emoji: '',
        unit_label: '',
        is_active: true,
      })

      alert('✅ Successfully added cake!')
      router.push('/admin/cakes')
    } catch (error: any) {
      alert('❌ Failed to create cake: ' + (error?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Add New Cake</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-xl shadow-sm p-8 border border-amber-100">
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Cake Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Category
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            {uploading && <p className="text-sm text-amber-600 mt-2">Uploading...</p>}
            {formData.image_url && (
              <img
                src={formData.image_url}
                alt="Preview"
                className="mt-4 w-48 h-48 object-cover rounded-lg"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Tag (short description)
            </label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., Birthday cake, tall"
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
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Price Type *
              </label>
              <select
                value={formData.price_type}
                onChange={(e) => setFormData({ ...formData, price_type: e.target.value as any })}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="kg">Per kg</option>
                <option value="each">Each</option>
                <option value="from">From (starting price)</option>
                <option value="tier">Per tier</option>
                <option value="flav">By flavor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Base Price (KSh) *
              </label>
              <input
                type="number"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Min Quantity
              </label>
              <input
                type="number"
                value={formData.min_quantity}
                onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })}
                min="1"
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Notice Days
              </label>
              <input
                type="number"
                value={formData.notice_days}
                onChange={(e) => setFormData({ ...formData, notice_days: e.target.value })}
                min="1"
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Optional fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Emoji
              </label>
              <input
                type="text"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="🎂"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Unit Label
              </label>
              <input
                type="text"
                value={formData.unit_label}
                onChange={(e) => setFormData({ ...formData, unit_label: e.target.value })}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Dozens, Boxes"
              />
            </div>
          </div>

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

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Cake'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-amber-200 rounded-lg text-amber-900 hover:bg-amber-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
