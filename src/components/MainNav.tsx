'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'

function MainNavContent() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About Us' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/contact', label: 'Contact' },
  ]

  const openOrder = (offerDiscount?: number) => {
    // Redirect to shop page for custom order
    router.push('/shop')
  }

  return (
    <>
      {/* TOP CONTACT BAR */}
      <div className="bg-cream-soft border-b border-cream-border py-1.5 sm:py-2 text-[10px] sm:text-xs text-mahogany-muted">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 flex flex-wrap justify-between items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-blush text-sm sm:text-base">📞</span>
            <span className="text-[10px] sm:text-xs">Call or WhatsApp <a href="tel:+254725811787" className="text-blush font-semibold hover:underline">0725 811 787</a> <span className="hidden sm:inline">· Mon–Sat, 8am–6pm</span></span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="font-medium flex items-center gap-1 text-[10px] sm:text-xs">
              <span className="text-blush text-sm sm:text-base">📍</span> Kenyatta Road, Kiambu
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION HEADER */}
      <nav className="sticky top-0 z-40 bg-cream-surface/90 backdrop-blur-md border-b border-cream-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3.5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <img
              src="/logo.jpg"
              alt="Cravers Joy Cakes Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-mahogany block leading-none">Cravers Joy Cakes</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4 sm:gap-6 text-sm font-medium text-mahogany-soft">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? 'text-blush' : 'hover:text-blush transition-colors'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openOrder()}
              className="bg-mahogany hover:bg-mahogany-light text-cream-surface px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase border border-gold/30 shadow-md transition-all hover:shadow-lg hidden sm:block"
            >
              Custom Order
            </button>

            <button
              className="md:hidden p-2 text-mahogany hover:text-blush text-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-cream-surface border-t border-cream-border px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href ? 'text-blush py-3 text-sm min-h-[48px] flex items-center' : 'text-mahogany-soft hover:text-blush transition-colors py-3 text-sm min-h-[48px] flex items-center'}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { openOrder(); setIsOpen(false); }}
                className="bg-mahogany hover:bg-mahogany-light text-cream-surface px-3 sm:px-5 py-3 sm:py-3.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase border border-gold/30 shadow-md transition-all min-h-[48px]"
              >
                Custom Order
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default function MainNav() {
  return (
    <Suspense fallback={<div style={{ height: '80px', background: '#FFFBF8' }} />}>
      <MainNavContent />
    </Suspense>
  )
}
