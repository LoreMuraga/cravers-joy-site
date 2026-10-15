'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Category } from '@/types/database'
import { useRouter } from 'next/navigation'

export default function BulkAddCakesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [cakeNames, setCakeNames] = useState<string[]>([])

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*').order('name')
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(files)

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)

    // Initialize empty names for each image
    setCakeNames(files.map(() => ''))
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    const newNames = cakeNames.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
    setCakeNames(newNames)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUploading(true)

    if (images.length === 0) {
      alert('Please select at least one image')
      setLoading(false)
      setUploading(false)
      return
    }

    // Validate that all cake names are provided
    const emptyNameIndex = cakeNames.findIndex(name => !name.trim())
    if (emptyNameIndex !== -1) {
      alert(`Please provide a name for cake #${emptyNameIndex + 1}`)
      setLoading(false)
      setUploading(false)
      return
    }

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('You must be logged in to upload images')
      }

      const uploadedUrls: string[] = []

      // Upload each image
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${i}.${fileExt}`

        const { data, error } = await supabase.storage
          .from('cake-images')
          .upload(`cakes/${fileName}`, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('cake-images')
          .getPublicUrl(data.path)

        uploadedUrls.push(publicUrl)
        setUploadProgress(((i + 1) / images.length) * 100)
      }

      // Create cakes with uploaded images and user-provided names
      const cakesToInsert = uploadedUrls.map((imageUrl, index) => ({
        name: cakeNames[index].trim(), // Use user-provided name
        category_id: selectedCategory || null,
        image_url: imageUrl,
        tag: null,
        description: null,
        price_type: 'kg',
        base_price: 0,
        min_quantity: 1,
        notice_days: 1,
        emoji: null,
        unit_label: null,
        is_active: false, // Inactive until details are filled
      }))

      const { error } = await supabase.from('cakes').insert(cakesToInsert)

      if (error) throw error

      alert(`✅ Successfully added ${images.length} cake(s) with images! You can now edit them to add pricing and other details.`)
      setImages([])
      setImagePreviews([])
      setCakeNames([])
      setSelectedCategory('')
      setUploadProgress(0)
      router.push('/admin/cakes')
    } catch (error: any) {
      alert('❌ Failed to create cakes: ' + (error?.message || 'Unknown error'))
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-pink-600 hover:text-pink-900 mb-4 inline-block"
        >
          ← Back to Cakes
        </button>
        <h1 className="text-3xl font-bold text-amber-900">Bulk Add Cakes with Images</h1>
        <p className="text-amber-600 mt-2">
          Upload multiple cake images at once. Each image will create a new cake entry.
        </p>
      </div>

      <div className="max-w-4xl bg-white rounded-xl shadow-sm p-8 border border-amber-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Category (Optional)
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">No category (Uncategorized)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-amber-600 mt-2">
              Select a category to add all cakes under the same category (e.g., all Birthday cakes, all Wedding cakes, etc.)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Select Images *
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              disabled={uploading}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <p className="text-sm text-amber-600 mt-2">
              Select multiple images at once. You will provide a name for each cake below.
            </p>
          </div>

          {imagePreviews.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Provide Names for Each Cake ({imagePreviews.length})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group border border-amber-200 rounded-lg p-3">
                    <div className="flex gap-3">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-amber-900 mb-1">
                          Cake #{index + 1} Name *
                        </label>
                        <input
                          type="text"
                          value={cakeNames[index]}
                          onChange={(e) => {
                            const newNames = [...cakeNames]
                            newNames[index] = e.target.value
                            setCakeNames(newNames)
                          }}
                          placeholder="e.g., Chocolate Fudge Cake"
                          className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="mt-2 text-xs text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploading && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-900">Uploading images...</span>
                <span className="text-sm text-amber-700">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div
                  className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
              <li>All cakes will be created as <strong>inactive</strong></li>
              <li>Each image will create a new cake entry with the name you provide</li>
              <li>All cakes will be assigned to the selected category</li>
              <li>You can edit each cake individually to add pricing and descriptions</li>
              <li>Complete cakes can be marked as active to appear on the website</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || images.length === 0}
              className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : `Create ${images.length} Cake(s)`}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-amber-200 rounded-lg text-amber-900 hover:bg-amber-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
