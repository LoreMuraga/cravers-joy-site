'use client'

import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import OrderModalWrapper from '@/components/OrderModalWrapper'

export default function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  // If viewing an admin page, skip the public store layout elements entirely
  if (isAdmin) {
    return <>{children}</>
  }

  // Otherwise, render the regular customer store layout
  return (
    <>
      <Suspense fallback={<div style={{ height: '80px', background: '#FFFBF8' }} />}>
        <MainNav />
      </Suspense>
      <div className="flex-1">{children}</div>
      <Footer />
      <OrderModalWrapper />
    </>
  )
}
