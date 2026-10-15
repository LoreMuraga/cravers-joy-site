'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CarouselSlide } from '@/types/database'

export default function CarouselPage() {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    price_text: '',
    image_url: '',
    emoji: '',
    category_name: '',
    order_index: slides.length + 1,
    is_active: true,
  })

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    const { data } = await supabase
      .from('carousel_slides')
      .select('*')
      .order('order_index')
    if (data) {
      setSlides(data)
      setFormData({ ...formData, order_index: data.length + 1 })
    }
    setLoading(false)
  }

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
      const timestamp = Date.now()
      const fileName = `carousel_${timestamp}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('cake-images')
        .upload(fileName, file)

      if (error) {
        console.error('Upload error:', error)
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from('cake-images')
        .getPublicUrl(data.path)

      setFormData({ ...formData, image_url: publicUrl })
    } catch (error: any) {
      console.error('Image upload failed:', error)
      alert('Failed to upload image: ' + (error?.message || 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.from('carousel_slides').insert([
      {
        title: formData.title,
        subtitle: formData.subtitle || null,
        price_text: formData.price_text || null,
        image_url: formData.image_url || null,
        emoji: formData.emoji || null,
        category_name: formData.category_name || null,
        order_index: formData.order_index,
        is_active: formData.is_active,
      },
    ])

    if (error) {
      alert('Failed to create slide: ' + error.message)
      return
    }

    alert('Successfully added carousel slide!')
    setFormData({
      title: '',
      subtitle: '',
      price_text: '',
      image_url: '',
      emoji: '',
      category_name: '',
      order_index: slides.length + 2,
      is_active: true,
    })
    fetchSlides()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return

    const { error } = await supabase.from('carousel_slides').delete().eq('id', id)
    if (error) {
      alert('Failed to delete slide: ' + error.message)
      return
    }

    alert('Successfully deleted carousel slide!')
    fetchSlides()
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('carousel_slides')
      .update({ is_active: !isActive })
      .eq('id', id)

    if (error) {
      alert('Failed to update slide: ' + error.message)
      return
    }

    alert(`Successfully ${!isActive ? 'activated' : 'deactivated'} carousel slide!`)
    fetchSlides()
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Carousel Management</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-amber-100">
          <h2 className="text-xl font-semibold text-amber-900 mb-6">
            {editingId ? 'Edit Slide' : 'Add New Slide'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Every cake has a name"
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
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Birthday, kids' and signature cakes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Price Text
              </label>
              <input
                type="text"
                value={formData.price_text}
                onChange={(e) => setFormData({ ...formData, price_text: e.target.value })}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., from KSh 3,000"
              />
            </div>

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
                  className="mt-4 w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>

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
                  Category Link
                </label>
                <input
                  type="text"
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Birthday"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                min="1"
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
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
                Active (visible on carousel)
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Add Slide
            </button>
          </form>
        </div>

        {/* Slides List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-amber-900">Current Slides</h2>
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white rounded-xl shadow-sm p-4 border border-amber-100"
            >
              <div className="flex gap-4">
                {slide.image_url && (
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900">{slide.title}</h3>
                  <p className="text-sm text-amber-600">{slide.subtitle}</p>
                  <p className="text-sm text-amber-600">{slide.price_text}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-amber-500">Order: {slide.order_index}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        slide.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {slide.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleToggleActive(slide.id, slide.is_active)}
                    className="text-sm text-amber-600 hover:text-amber-900"
                  >
                    {slide.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="text-sm text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {slides.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-amber-100 text-center text-amber-600">
              No slides yet. Add your first slide!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
