'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Testimonial } from '@/types/database'
import Link from 'next/link'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    customer_name: '',
    location: '',
    review: '',
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setTestimonials(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.from('testimonials').insert([
      {
        customer_name: formData.customer_name,
        location: formData.location || null,
        review: formData.review,
      },
    ])

    if (error) {
      alert('Failed to add testimonial: ' + error.message)
      return
    }

    alert('Successfully added testimonial!')
    setFormData({ customer_name: '', location: '', review: '' })
    fetchTestimonials()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return

    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) {
      alert('Failed to delete testimonial: ' + error.message)
      return
    }

    alert('Successfully deleted testimonial!')
    fetchTestimonials()
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_active: !isActive })
      .eq('id', id)

    if (error) {
      alert('Failed to update testimonial: ' + error.message)
      return
    }

    alert(`Successfully ${!isActive ? 'activated' : 'deactivated'} testimonial!`)
    setTestimonials(
      testimonials.map((t) =>
        t.id === id ? { ...t, is_active: !isActive } : t
      )
    )
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Testimonials</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-amber-100">
          <h2 className="text-xl font-semibold text-amber-900 mb-6">Add Testimonial</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Wanjiru M."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Ruiru · birthday"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Review *
              </label>
              <textarea
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                rows={4}
                required
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Customer review text"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Add Testimonial
            </button>
          </form>
        </div>

        {/* Testimonials List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-amber-900">Current Testimonials</h2>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-amber-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-amber-900">{testimonial.customer_name}</h3>
                  {testimonial.location && (
                    <p className="text-sm text-amber-600">{testimonial.location}</p>
                  )}
                  <p className="mt-2 text-amber-700">{testimonial.review}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={() => handleToggleActive(testimonial.id, testimonial.is_active)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      testimonial.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {testimonial.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {testimonials.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-amber-100 text-center text-amber-600">
              No testimonials yet. Add your first testimonial!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
