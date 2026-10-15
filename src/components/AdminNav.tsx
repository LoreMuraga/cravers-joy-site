'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEffect, useState, Suspense } from 'react'

function AdminNavContent() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/cakes', label: 'Cakes' },
    { href: '/admin/categories', label: 'Categories' },
    { href: '/admin/delivery-areas', label: 'Delivery Areas' },
    { href: '/admin/carousel', label: 'Carousel' },
    { href: '/admin/banners', label: 'Banners' },
    { href: '/admin/testimonials', label: 'Testimonials' },
    { href: '/admin/admins', label: 'Admins' },
    { href: '/admin/settings', label: 'Settings' },
  ]

  if (!mounted || !session) {
    return null
  }

  return (
    <nav style={{ backgroundColor: '#2D1513', boxShadow: '0 4px 16px rgba(45, 21, 19, 0.08)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFBF8', fontWeight: '700', fontSize: '15px' }}>
            <img
              src="/logo.jpg"
              alt="Cravers Joy Cakes Logo"
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
            Cravers Joy Admin
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  backgroundColor: pathname === item.href ? '#E63967' : 'transparent',
                  color: pathname === item.href ? '#FFFFFF' : '#FFFBF8',
                }}
                onMouseEnter={(e) => {
                  if (pathname !== item.href) e.currentTarget.style.color = '#E63967'
                }}
                onMouseLeave={(e) => {
                  if (pathname !== item.href) e.currentTarget.style.color = '#FFFBF8'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#E63967',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C02652')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E63967')}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default function AdminNav() {
  return (
    <Suspense fallback={<div style={{ height: '80px', background: '#2D1513' }} />}>
      <AdminNavContent />
    </Suspense>
  )
}
