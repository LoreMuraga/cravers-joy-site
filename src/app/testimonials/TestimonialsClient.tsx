'use client'

interface TestimonialsClientProps {
  testimonials: any[]
}

export default function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
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
            Client Stories
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
            Testimonials
          </h1>
          <p style={{ fontSize: '18px', color: '#7A5C55' }}>
            Sweet words from our valued clientele
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
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
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
            }}
          >
            {testimonials.map((testimonial: any, index: number) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '32px',
                  borderRadius: '20px',
                  border: '1px solid #EFE4DE',
                  boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 16px 32px rgba(45, 21, 19, 0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 21, 19, 0.08)'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      marginBottom: '16px',
                      color: '#D4A574',
                      fontSize: '14px',
                    }}
                  >
                    ★★★★★
                  </div>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#6A4C45',
                      fontStyle: 'italic',
                      lineHeight: '1.7',
                      marginBottom: '24px',
                    }}
                  >
                    "{testimonial.review}"
                  </p>
                </div>
                <div
                  style={{
                    borderTop: '1px solid #EFE4DE',
                    paddingTop: '16px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#2D1513',
                      display: 'block',
                    }}
                  >
                    {testimonial.customer_name}
                  </span>
                  <span style={{ fontSize: '12px', color: '#7A5C55' }}>
                    {testimonial.location || ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
            maxWidth: '768px',
            margin: '0 auto',
            padding: '0 32px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: '700',
              color: '#2D1513',
              marginBottom: '16px',
            }}
          >
            Ready to order your cake?
          </h2>
          <p style={{ fontSize: '14px', color: '#7A5C55', marginBottom: '32px' }}>
            Join hundreds of happy customers across Kenya
          </p>
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
            Start Custom Order
          </button>
        </div>
      </section>
    </main>
  )
}
