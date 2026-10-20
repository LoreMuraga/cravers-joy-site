'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [terms, setTerms] = useState('')
  const [cancellation, setCancellation] = useState('')
  const [privacy, setPrivacy] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('*')
    if (data) {
      const termsSetting = data.find(s => s.key === 'terms_of_service')
      const cancellationSetting = data.find(s => s.key === 'cancellation_policy')
      const privacySetting = data.find(s => s.key === 'privacy_policy')

      if (termsSetting) setTerms(termsSetting.value)
      if (cancellationSetting) setCancellation(cancellationSetting.value)
      if (privacySetting) setPrivacy(privacySetting.value)
    }
    setLoading(false)
  }

  const saveSetting = async (key: string, value: string) => {
    setSaving(true)
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' })

    if (error) {
      setMessage('Error saving: ' + error.message)
    } else {
      setMessage('Saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-mahogany mb-6">Settings</h1>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Terms of Service */}
        <div className="bg-white rounded-xl border border-amber-200 p-6">
          <h2 className="text-lg font-semibold text-mahogany mb-4">Terms of Service</h2>
          <textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 rounded-lg border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
            placeholder="Enter terms of service..."
          />
          <button
            onClick={() => saveSetting('terms_of_service', terms)}
            disabled={saving}
            className="bg-mahogany hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Terms'}
          </button>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-white rounded-xl border border-amber-200 p-6">
          <h2 className="text-lg font-semibold text-mahogany mb-4">Cancellation Policy</h2>
          <textarea
            value={cancellation}
            onChange={(e) => setCancellation(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 rounded-lg border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
            placeholder="Enter cancellation policy..."
          />
          <button
            onClick={() => saveSetting('cancellation_policy', cancellation)}
            disabled={saving}
            className="bg-mahogany hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Cancellation Policy'}
          </button>
        </div>

        {/* Privacy Policy */}
        <div className="bg-white rounded-xl border border-amber-200 p-6">
          <h2 className="text-lg font-semibold text-mahogany mb-4">Privacy Policy</h2>
          <textarea
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 rounded-lg border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
            placeholder="Enter privacy policy..."
          />
          <button
            onClick={() => saveSetting('privacy_policy', privacy)}
            disabled={saving}
            className="bg-mahogany hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Privacy Policy'}
          </button>
        </div>
      </div>
    </div>
  )
}
