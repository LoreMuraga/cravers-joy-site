import { supabase } from '@/lib/supabase'
import { Suspense } from 'react'

async function PrivacyContent() {
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'privacy_policy')
    .single()

  return (
    <div className="prose prose-lg max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-mahogany mb-6">Privacy Policy</h1>
      <div className="bg-white rounded-xl border border-amber-200 p-6 md:p-8">
        {data?.value ? (
          <div className="whitespace-pre-wrap text-amber-700 leading-relaxed">
            {data.value}
          </div>
        ) : (
          <p className="text-amber-600 italic">Privacy policy will be added by the administrator.</p>
        )}
      </div>
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <PrivacyContent />
        </Suspense>
      </div>
    </div>
  )
}
