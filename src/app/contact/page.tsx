'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const openOrder = (offerDiscount?: number) => {
    if (typeof window !== 'undefined' && (window as any).openOrder) {
      (window as any).openOrder(undefined, offerDiscount)
    }
  }
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const sendWhatsApp = (text: string) => {
    window.open(`https://wa.me/254725811787?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleMessage = () => {
    sendWhatsApp(`Hi Milka! ${message}\n\nName: ${name || '-'}`)
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
            Get in Touch
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
            Contact Us
          </h1>
          <p style={{ fontSize: '18px', color: '#7A5C55' }}>
            <Link href="/" style={{ color: '#E63967', textDecoration: 'none' }}>Home</Link> » Contact Us
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <section
        style={{
          padding: '64px 0',
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid #EFE4DE',
                boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
                textAlign: 'center',
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
                  margin: '0 auto 16px',
                }}
              >
                💬
              </div>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '8px',
                }}
              >
                WhatsApp
              </h3>
              <p style={{ fontSize: '14px', color: '#7A5C55', marginBottom: '16px' }}>
                The fastest way to order.
              </p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  sendWhatsApp('Hi Milka, I would like to order a cake.')
                }}
                style={{ color: '#E63967', fontWeight: '600', textDecoration: 'none' }}
              >
                0725 811 787
              </a>
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid #EFE4DE',
                boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
                textAlign: 'center',
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
                  margin: '0 auto 16px',
                }}
              >
                📞
              </div>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '8px',
                }}
              >
                Call
              </h3>
              <p style={{ fontSize: '14px', color: '#7A5C55', marginBottom: '16px' }}>
                Monday to Saturday.
              </p>
              <a href="tel:+254725811787" style={{ color: '#E63967', fontWeight: '600', textDecoration: 'none' }}>
                0725 811 787
              </a>
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid #EFE4DE',
                boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
                textAlign: 'center',
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
                  margin: '0 auto 16px',
                }}
              >
                📍
              </div>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '8px',
                }}
              >
                Find Milka
              </h3>
              <p style={{ fontSize: '14px', color: '#7A5C55', marginBottom: '16px' }}>
                Kenyatta Road, Kiambu
              </p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.google.com/maps/search/?api=1&query=Kenyatta+Road%2C+Kiambu%2C+Kenya"
                style={{ color: '#E63967', fontWeight: '600', textDecoration: 'none' }}
              >
                Open in Google Maps
              </a>
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid #EFE4DE',
                boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
                textAlign: 'center',
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
                  margin: '0 auto 16px',
                }}
              >
                ⏰
              </div>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '8px',
                }}
              >
                Hours
              </h3>
              <p style={{ fontSize: '14px', color: '#7A5C55' }}>
                Mon–Sat, 8:00am to 6:00pm
              </p>
              <p style={{ fontSize: '14px', color: '#7A5C55' }}>
                Closed on Sunday
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Message Form & Delivery Areas */}
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
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
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
              }}
            >
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '8px',
                }}
              >
                Send a message
              </h3>
              <p style={{ fontSize: '14px', color: '#7A5C55', marginBottom: '24px' }}>
                It opens WhatsApp with your message ready to send
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label htmlFor="cn" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2D1513', marginBottom: '8px' }}>
                    Your name
                  </label>
                  <input
                    id="cn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid #EFE4DE',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="cm" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2D1513', marginBottom: '8px' }}>
                    Message
                  </label>
                  <textarea
                    id="cm"
                    rows={4}
                    placeholder="Tell Milka about the cake, date and number of guests"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid #EFE4DE',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <button
                  onClick={handleMessage}
                  style={{
                    width: '100%',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '14px 20px',
                    borderRadius: '50px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>💬</span> Send on WhatsApp
                </button>
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid #EFE4DE',
                boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '8px',
                }}
              >
                Where cakes go
              </h3>
              <p style={{ fontSize: '14px', color: '#7A5C55', marginBottom: '24px' }}>
                Collection is free. Delivery is confirmed before you pay.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { area: 'Kenyatta Road', price: 'KSh 300' },
                  { area: 'Juja', price: 'KSh 500' },
                  { area: 'Ruiru', price: 'KSh 600' },
                  { area: 'Kahawa', price: 'KSh 700' },
                  { area: 'Githurai', price: 'KSh 700' },
                  { area: 'Thika', price: 'KSh 800' },
                  { area: 'Nairobi CBD', price: 'KSh 1,000' },
                  { area: 'Further on request', price: '' },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#F8F1ED',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#2D1513' }}>{item.area}</span>
                    {item.price && <span style={{ fontSize: '14px', fontWeight: '700', color: '#E63967' }}>{item.price}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Order */}
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
              Simple Process
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
              How to Order
            </h2>
            <p style={{ fontSize: '14px', color: '#7A5C55' }}>
              Four easy steps to your perfect cake
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '32px',
              marginBottom: '48px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#E63967',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 20px rgba(230, 57, 103, 0.25)',
                }}
              >
                1
              </div>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '8px',
                }}
              >
                Pick a cake
              </h3>
              <p style={{ fontSize: '14px', color: '#7A5C55' }}>
                Tap any cake or open the order form.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#D4A574',
                  color: '#2D1513',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 20px rgba(212, 165, 116, 0.25)',
                }}
              >
                2
              </div>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '8px',
                }}
              >
                Share details
              </h3>
              <p style={{ fontSize: '14px', color: '#7A5C55' }}>
                Date, size, flavour and any colours to match.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#E63967',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 20px rgba(230, 57, 103, 0.25)',
                }}
              >
                3
              </div>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '8px',
                }}
              >
                Send on WhatsApp
              </h3>
              <p style={{ fontSize: '14px', color: '#7A5C55' }}>
                Your estimate goes straight to Milka. Pay a 50% deposit to hold the date.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#D4A574',
                  color: '#2D1513',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 20px rgba(212, 165, 116, 0.25)',
                }}
              >
                4
              </div>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '8px',
                }}
              >
                Collect or deliver
              </h3>
              <p style={{ fontSize: '14px', color: '#7A5C55' }}>
                Pick up on Kenyatta Road or we deliver to your venue.
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
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
          </div>
        </div>
      </section>
    </main>
  )
}
