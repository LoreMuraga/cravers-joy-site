'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    cakes: 0,
    categories: 0,
    banners: 0,
    testimonials: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      const [cakes, categories, banners, testimonials] = await Promise.all([
        supabase.from('cakes').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('banners').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
      ])

      setStats({
        cakes: cakes.count || 0,
        categories: categories.count || 0,
        banners: banners.count || 0,
        testimonials: testimonials.count || 0,
      })
    }

    fetchStats()
  }, [])

  const quickActions = [
    {
      title: 'Add New Cake',
      description: 'Create a new cake with image and pricing',
      href: '/admin/cakes/new',
      icon: '🎂',
      bgColor: '#E63967',
    },
    {
      title: 'Manage Carousel',
      description: 'Update homepage carousel slides',
      href: '/admin/carousel',
      icon: '🖼️',
      bgColor: '#8B5CF6',
    },
    {
      title: 'Create Banner',
      description: 'Add promotional banners with offers',
      href: '/admin/banners/new',
      icon: '📢',
      bgColor: '#D4AF37',
    },
    {
      title: 'Add Testimonial',
      description: 'Share customer reviews',
      href: '/admin/testimonials/new',
      icon: '⭐',
      bgColor: '#10B981',
    },
  ]

  return (
    <div style={{ backgroundColor: '#FFFBF8', minHeight: '100vh', padding: '24px 0 60px 0', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#2D1513' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
        {/* PAGE TITLE */}
        <h1
          style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '36px',
            fontWeight: '700',
            color: '#2D1513',
            marginBottom: '24px',
          }}
        >
          Dashboard Overview
        </h1>

        {/* STATS GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {/* STAT CARD 1 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #EFE4DE',
              boxShadow: '0 4px 12px rgba(45, 21, 19, 0.04)',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎂</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2D1513', lineHeight: '1' }}>
              {stats.cakes}
            </div>
            <div style={{ fontSize: '13px', color: '#7A5C55', fontWeight: '600', marginTop: '6px' }}>
              Total Cakes
            </div>
          </div>

          {/* STAT CARD 2 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #EFE4DE',
              boxShadow: '0 4px 12px rgba(45, 21, 19, 0.04)',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📁</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2D1513', lineHeight: '1' }}>
              {stats.categories}
            </div>
            <div style={{ fontSize: '13px', color: '#7A5C55', fontWeight: '600', marginTop: '6px' }}>
              Categories
            </div>
          </div>

          {/* STAT CARD 3 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #EFE4DE',
              boxShadow: '0 4px 12px rgba(45, 21, 19, 0.04)',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📢</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2D1513', lineHeight: '1' }}>
              {stats.banners}
            </div>
            <div style={{ fontSize: '13px', color: '#7A5C55', fontWeight: '600', marginTop: '6px' }}>
              Active Banners
            </div>
          </div>

          {/* STAT CARD 4 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #EFE4DE',
              boxShadow: '0 4px 12px rgba(45, 21, 19, 0.04)',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>⭐</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2D1513', lineHeight: '1' }}>
              {stats.testimonials}
            </div>
            <div style={{ fontSize: '13px', color: '#7A5C55', fontWeight: '600', marginTop: '6px' }}>
              Testimonials
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS SECTION */}
        <h2
          style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#2D1513',
            marginBottom: '16px',
            fontFamily: 'Cormorant Garamond, Georgia, serif',
          }}
        >
          Quick Actions
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid #EFE4DE',
                boxShadow: '0 4px 12px rgba(45, 21, 19, 0.04)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(45, 21, 19, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 21, 19, 0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div
                  style={{
                    backgroundColor: action.bgColor,
                    color: '#FFFFFF',
                    fontSize: '22px',
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {action.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2D1513', margin: '0 0 4px 0' }}>
                    {action.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#7A5C55', margin: 0, lineHeight: '1.4' }}>
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}