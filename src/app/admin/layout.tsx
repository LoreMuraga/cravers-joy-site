'use client'

import AdminNav from '@/components/AdminNav'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/signup' || pathname === '/admin/confirm'

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && <AdminNav />}
      <main className={isAuthPage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8'}>{children}</main>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div style={{ height: '80px', background: '#f9fafb' }} />}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  )
}
