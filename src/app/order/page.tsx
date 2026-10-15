'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function OrderPageContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const cakeId = searchParams.get('cake')
    const offerDiscount = searchParams.get('offer')
    if (typeof window !== 'undefined' && (window as any).openOrder) {
      (window as any).openOrder(cakeId || undefined, offerDiscount ? parseFloat(offerDiscount) : undefined)
    }
  }, [searchParams])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-amber-900">Opening order form...</p>
      </div>
    </main>
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-amber-900">Loading...</p></div>}>
      <OrderPageContent />
    </Suspense>
  )
}
