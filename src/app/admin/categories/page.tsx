'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Category } from '@/types/database'
import Link from 'next/link'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    emoji: '',
    image_url: '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) setCategories(data)
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
      const fileName = `${Math.random()}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('cake-images')
        .upload(`categories/${fileName}`, file)

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

    const { error } = await supabase.from('categories').insert([
      {
        name: formData.name,
        emoji: formData.emoji || null,
        image_url: formData.image_url || null,
      },
    ])

    if (error) {
      alert('❌ Failed to create category: ' + error.message)
      return
    }

    // Reset form
    setFormData({ name: '', emoji: '', image_url: '' })
    alert('✅ Successfully added category!')
    fetchCategories()
  }

  const handleDelete = async (id: string) => {
    // First check if there are cakes associated with this category
    const { data: cakesData, error: checkError } = await supabase
      .from('cakes')
      .select('id')
      .eq('category_id', id)

    if (checkError) {
      alert('❌ Failed to check category: ' + checkError.message)
      return
    }

    if (cakesData && cakesData.length > 0) {
      alert(`⚠️ Cannot delete this category. There are ${cakesData.length} cake(s) associated with it. Please reassign or delete those cakes first.`)
      return
    }

    if (!confirm('⚠️ Are you sure you want to delete this category? This action cannot be undone.')) return

    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) {
      alert('❌ Failed to delete category: ' + error.message)
      return
    }

    alert('✅ Successfully deleted category!')
    fetchCategories()
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Categories</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-amber-100">
          <h2 className="text-xl font-semibold text-amber-900 mb-6">Add Category</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Birthday"
              />
            </div>

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
                Category Image
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
                  className="mt-4 w-32 h-32 object-cover rounded-lg"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Add Category
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-amber-900">Current Categories</h2>
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm p-4 border border-amber-100 flex items-center gap-4"
            >
              {category.image_url && (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900">
                  {category.emoji} {category.name}
                </h3>
              </div>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:text-red-900 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-amber-100 text-center text-amber-600">
              No categories yet. Add your first category!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
