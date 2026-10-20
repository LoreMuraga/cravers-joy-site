'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEffect, useState, Suspense } from 'react'

function AdminNavContent() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsMobile(window.innerWidth < 768)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)

    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('resize', handleResize)
    }
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
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFBF8', fontWeight: '700', fontSize: '15px' }}>
            <img
              src="/logo.jpg"
              alt="Cravers Joy Cakes Logo"
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
            Cravers Joy Admin
          </div>

          {/* Desktop Navigation */}
          <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                display: isMobile ? 'none' : 'block',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C02652')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E63967')}
            >
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                display: isMobile ? 'block' : 'none',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFBF8',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '8px',
                minHeight: '44px',
                minWidth: '44px',
              }}
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div style={{ display: isMobile ? 'block' : 'none', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    backgroundColor: pathname === item.href ? '#E63967' : 'transparent',
                    color: pathname === item.href ? '#FFFFFF' : '#FFFBF8',
                    display: 'block',
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                style={{
                  backgroundColor: '#E63967',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginTop: '8px',
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
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
