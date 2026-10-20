'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [year, setYear] = useState(2024)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer
      style={{
        backgroundColor: '#2D1513',
        color: '#FAF6F0',
        paddingTop: 'clamp(40px, 8vw, 60px)',
        paddingBottom: 'calc(clamp(20px, 4vw, 30px) + env(safe-area-inset-bottom, 0px))',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 20px)',
        }}
      >
        {/* TOP ROW: 4 COLUMNS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            marginBottom: '40px',
          }}
        >
          {/* COLUMN 1: BRAND & BIO */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/logo.jpg"
                alt="Cravers Joy Cakes Logo"
                style={{ width: '48px', height: '48px', objectFit: 'contain' }}
              />
              <div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#FFFBF8',
                    margin: 0,
                    letterSpacing: '0.5px',
                    fontFamily: 'serif',
                  }}
                >
                  Cravers Joy
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#D2C3B8', marginBottom: '20px', maxWidth: '320px' }}>
              Handcrafted bespoke cakes for life&apos;s most memorable celebrations. Created with love, fine cream, and precision in Kiambu, Kenya.
            </p>

            {/* SOCIAL LINKS WITH PROFESSIONAL SVG ICONS */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* INSTAGRAM */}
              <a
                href="https://www.instagram.com/c.j.bakers/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FAF6F0',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E63967'
                  e.currentTarget.style.borderColor = '#E63967'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* FACEBOOK */}
              <a
                href="https://web.facebook.com/creatingmemories254"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FAF6F0',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E63967'
                  e.currentTarget.style.borderColor = '#E63967'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* TIKTOK */}
              <a
                href="https://www.tiktok.com/@craversjoy_cakes03?_r=1&_t=ZS-9AXW37fkn1G"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FAF6F0',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E63967'
                  e.currentTarget.style.borderColor = '#E63967'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.42V9.01a6.34 6.34 0 0 0-5.11 2.12A6.33 6.33 0 0 0 3 15.67a6.34 6.34 0 0 0 6.34 6.33 6.34 6.34 0 0 0 6.33-6.33V8.8a8.28 8.28 0 0 0 3.92 1.34V6.69z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#D4AF37',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Home Showcase', href: '/' },
                { label: 'Shop Categories', href: '/shop' },
                { label: 'About Milka', href: '/about' },
                { label: 'Customer Reviews', href: '/testimonials' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    style={{
                      color: '#E0D2C7',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#E63967')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#E0D2C7')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: BAKERY STUDIO DETAILS */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#D4AF37',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Bakery Studio
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', color: '#E0D2C7' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '16px', color: '#E63967' }}>📍</span>
                <span>Kenyatta Road, Kiambu County, Kenya</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px', color: '#E63967' }}>📞</span>
                <a href="tel:+254725811787" style={{ color: '#FFFBF8', fontWeight: '600', textDecoration: 'none' }}>
                  0725 811 787
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px', color: '#E63967' }}>⏰</span>
                <span>Mon–Sat: 8:00 AM – 6:00 PM (Closed Sun)</span>
              </div>
            </div>
          </div>

          {/* COLUMN 4: LEGAL */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#D4AF37',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cancellation Policy', href: '/cancellation-policy' },
                { label: 'Privacy Policy', href: '/privacy' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    style={{
                      color: '#E0D2C7',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#E63967')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#E0D2C7')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR / COPYRIGHT */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: '#A89588',
          }}
        >
          <div>© {year} Cravers Joy Cakes Kenya. All rights reserved.</div>
          <div>Baked with ❤️ by Milka</div>
        </div>
      </div>
    </footer>
  )
}