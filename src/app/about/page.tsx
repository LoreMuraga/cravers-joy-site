'use client'

import Link from 'next/link'

export default function AboutPage() {
  const openOrder = (offerDiscount?: number) => {
    if (typeof window !== 'undefined' && (window as any).openOrder) {
      (window as any).openOrder(undefined, offerDiscount)
    }
  }

  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Page Header */}
      <div
        style={{
          background: 'linear-gradient(to bottom, rgba(230, 57, 103, 0.1), #FFFBF8)',
          padding: '64px 0 80px 0',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 32px',
          }}
        >
          <span
            style={{
              color: '#E63967',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            Our Story
          </span>
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: '700',
              color: '#2D1513',
              marginBottom: '12px',
            }}
          >
            About Us
          </h1>
          <p style={{ fontSize: '18px', color: '#7A5C55' }}>
            Baked by Milka, on Kenyatta Road
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section
        style={{
          padding: '64px 0 96px 0',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 32px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(230, 57, 103, 0.08)',
                  color: '#E63967',
                  padding: '8px 18px',
                  borderRadius: '30px',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  width: 'fit-content',
                }}
              >
                Every cake has a name
              </span>
              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  color: '#2D1513',
                }}
              >
                Made to order, <span style={{ fontStyle: 'italic', color: '#E63967', fontWeight: '400' }}>finished by hand</span>
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#6A4C45' }}>
                Cravers Joy Cakes bakes for the days people remember: weddings, ceremonies, birthdays and cakes for the children. Every cake is made to order and finished by hand.
              </p>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#6A4C45' }}>
                Tiered cakes are built with internal supports so they hold through the photos, the speeches and the heat. Giveaway cakes are boxed and sealed, ready to hand out.
              </p>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#6A4C45' }}>
                There is no checkout and no account. You talk to the person who bakes your cake, on WhatsApp, and agree the design, the price and the date together.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '16px' }}>
                <button
                  onClick={() => openOrder()}
                  style={{
                    backgroundColor: '#E63967',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '50px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(230, 57, 103, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Start an Order
                </button>
                <Link
                  href="/contact"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#2D1513',
                    border: '2px solid #2D1513',
                    padding: '14px 30px',
                    borderRadius: '50px',
                    fontSize: '15px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Talk to Milka →
                </Link>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  boxShadow: '0 24px 48px rgba(45, 21, 19, 0.12)',
                  aspectRatio: '4/3',
                  backgroundColor: '#F8F1ED',
                  border: '1px solid #EFE4DE',
                }}
              >
                <img
                  src="https://elvisw.co.ke/images/gallery-pair.jpg"
                  alt="Two finished cakes at a party"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(45, 21, 19, 0.3), transparent)',
                  }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '-24px',
                  right: '-16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(10px)',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
              >
                <span style={{ fontSize: '24px' }}>🎂</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#2D1513' }}>
                    Crafted with Love
                  </div>
                  <div style={{ fontSize: '11px', color: '#7A5C55' }}>
                    Every detail matters
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Stand For */}
      <section
        style={{
          backgroundColor: '#F8F1ED',
          padding: '64px 0',
          borderTop: '1px solid #EFE4DE',
          borderBottom: '1px solid #EFE4DE',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 32px',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto 48px',
            }}
          >
            <span
              style={{
                color: '#E63967',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Our Values
            </span>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: '700',
                color: '#2D1513',
                marginBottom: '8px',
              }}
            >
              What We Stand For
            </h2>
            <p style={{ fontSize: '14px', color: '#7A5C55' }}>
              Three promises we keep with every cake
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid #EFE4DE',
                boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(45, 21, 19, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 21, 19, 0.08)'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(230, 57, 103, 0.1)',
                  color: '#E63967',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '16px',
                }}
              >
                🎯
              </div>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '12px',
                }}
              >
                Made to order
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#7A5C55' }}>
                Nothing sits on a shelf. Your cake is baked for your date, in the flavour you choose.
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid #EFE4DE',
                boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(45, 21, 19, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 21, 19, 0.08)'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(212, 165, 116, 0.1)',
                  color: '#D4A574',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '16px',
                }}
              >
                💰
              </div>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '12px',
                }}
              >
                Clear prices
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#7A5C55' }}>
                Prices are listed per kilogram and the order form gives an instant estimate before you pay anything.
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid #EFE4DE',
                boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(45, 21, 19, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 21, 19, 0.08)'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(230, 57, 103, 0.1)',
                  color: '#E63967',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '16px',
                }}
              >
                🏆
              </div>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '12px',
                }}
              >
                Built to stand all day
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#7A5C55' }}>
                Structured, boxed and delivered with care, so it arrives looking the way it was designed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Work Gallery */}
      <section
        style={{
          padding: '64px 0 80px 0',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '48px',
            }}
          >
            <div>
              <span
                style={{
                  color: '#E63967',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Gallery
              </span>
              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  fontWeight: '700',
                  color: '#2D1513',
                }}
              >
                Recent Work
              </h2>
              <p style={{ fontSize: '14px', color: '#7A5C55', marginTop: '4px' }}>
                Photographed as they left the kitchen
              </p>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              { img: 'https://elvisw.co.ke/images/kiondo.jpg', emoji: '🧺', alt: 'Sculpted basket cake' },
              { img: 'https://elvisw.co.ke/images/herufi.jpg', emoji: '💍', alt: 'Three tier wedding cake' },
              { img: 'https://elvisw.co.ke/images/gallery-pair.jpg', emoji: '🎉', alt: 'Two finished cakes at a party' },
              { img: 'https://elvisw.co.ke/images/vipande.jpg', emoji: '🎁', alt: 'Boxed giveaway cakes' },
              { img: 'https://elvisw.co.ke/images/malkia.jpg', emoji: '👑', alt: 'Two tier vintage cake' },
              { img: 'https://elvisw.co.ke/images/ndoto.jpg', emoji: '🦄', alt: 'Unicorn kids cake' },
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => window.open(item.img, '_blank')}
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  aspectRatio: '1',
                  backgroundColor: '#F8F1ED',
                  border: '1px solid #EFE4DE',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 16px 32px rgba(45, 21, 19, 0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <img
                  src={item.img}
                  alt={item.alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(45, 21, 19, 0.6), transparent)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      color: '#FFFFFF',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
