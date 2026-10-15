'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'

interface HomeClientProps {
  categories: any[]
  cakes: any[]
  carouselSlides: any[]
  banners: any[]
  testimonials: any[]
  featuredCakes: any[]
}

export default function HomeClient({
  categories,
  cakes,
  carouselSlides,
  banners,
  testimonials,
  featuredCakes,
}: HomeClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showOfferModal, setShowOfferModal] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  const openOrder = useCallback((cakeId?: string, offerDiscount?: number) => {
    if (typeof window !== 'undefined' && (window as any).openOrder) {
      (window as any).openOrder(cakeId, offerDiscount)
    }
  }, [])

  // Helper to filter out image URLs and filenames from text
  const filterImageUrl = (text: string | null | undefined) => {
    if (!text) return ''
    // Remove any http/https URLs
    let filtered = text.replace(/https?:\/\/[^\s]+/g, '')
    // Remove common filename patterns like "WhatsApp Image 2026-10-13 at 21"
    filtered = filtered.replace(/WhatsApp Image \d{4}-\d{2}-\d{2} at \d{1,2}/gi, '')
    // Remove other image filename patterns
    filtered = filtered.replace(/IMG-\d+/gi, '')
    filtered = filtered.replace(/image-\d+/gi, '')
    return filtered.trim()
  }

  const heroSlides = carouselSlides.length > 0
    ? carouselSlides.map(slide => ({ url: slide.image_url, title: slide.title || 'Featured Cake' }))
    : [
        { url: 'https://elvisw.co.ke/images/kiondo.jpg', title: 'Kiondo Royal Cream Tier' },
        { url: 'https://elvisw.co.ke/images/herufi.jpg', title: 'Herufi Monogram Artistry' },
        { url: 'https://elvisw.co.ke/images/dhahabu.jpg', title: 'Dhahabu Gold Tier' },
        { url: 'https://elvisw.co.ke/images/malkia.jpg', title: 'Malkia Fresh Berry Cascade' },
        { url: 'https://elvisw.co.ke/images/ndoto.jpg', title: 'Ndoto Velvet Luxury' },
      ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [heroSlides.length])

  const filterCategory = useCallback((cat: string) => {
    setActiveTab(cat)
  }, [])

  const filteredCakes = activeTab === 'all'
    ? featuredCakes
    : featuredCakes.filter((cake: any) => {
        const category = categories.find((c: any) => c.id === cake.category_id)
        return category?.name?.toLowerCase() === activeTab
      })

  return (
    <main className="min-h-screen">
      
      {/* OFFER MODAL */}
      {showOfferModal && banners.length > 0 && banners[0].is_offer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-cream-surface rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 lg:p-8 border border-gold/30 shadow-2xl relative overflow-hidden transform transition-all scale-100">
            <button onClick={() => setShowOfferModal(false)} className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cream-soft hover:bg-cream-border text-mahogany flex items-center justify-center transition-colors z-10">
              <i className="fa-solid fa-xmark text-base sm:text-lg"></i>
            </button>
            {banners[0].image_url && (
              <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden">
                <img
                  src={banners[0].image_url}
                  alt={banners[0].title}
                  className="w-full h-48 sm:h-56 object-cover"
                />
              </div>
            )}
            <div className="text-center">
              <span className="inline-block bg-blush/10 text-blush text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-2 sm:mb-3">
                ✨ Exclusive Offer
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-mahogany mb-1 sm:mb-2">{banners[0].title}</h3>
              <p className="text-mahogany-soft text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                {banners[0].description || banners[0].subtitle}
              </p>
              {banners[0].discount_percentage && (
                <div className="bg-cream-soft p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-cream-border mb-4 sm:mb-6">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-mahogany-muted font-semibold block mb-1">Use Offer Code</span>
                  <span className="font-mono text-lg sm:text-xl font-bold text-blush tracking-widest">CRAVERSJOY{banners[0].discount_percentage}</span>
                </div>
              )}
              <button onClick={() => { setShowOfferModal(false); window.location.href = `/order?offer=${banners[0].discount_percentage}`; }} className="w-full bg-blush hover:bg-blush-dark text-white font-semibold py-3 sm:py-3.5 px-4 sm:px-6 rounded-full shadow-lg shadow-blush/25 transition-all transform hover:-translate-y-0.5 text-xs sm:text-sm">
                Claim Offer & Order Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. LUXURY TICKER BANNER */}
      {banners.length > 0 && (
        <div className="bg-gradient-to-r from-mahogany via-mahogany-light to-mahogany text-cream-surface py-2.5 overflow-hidden border-b border-blush/20 shadow-sm text-xs font-medium tracking-wide">
          <div className="flex whitespace-nowrap ticker-wrap">
            <div className="flex items-center gap-8 shrink-0 pr-8">
              {banners[0].is_offer && <span className="inline-flex items-center gap-2 bg-blush text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">🎉 Customer Service Week Offer</span>}
              <span>{banners[0].title}</span>
              {banners[0].subtitle && <span>• {banners[0].subtitle}</span>}
              {banners[0].is_offer && banners[0].discount_percentage && <span>• Save up to {banners[0].discount_percentage}% OFF</span>}
              <span className="text-gold">• Free Delivery in Kiambu & Nairobi Environs on Orders above KSh 10,000</span>
            </div>
            <div className="flex items-center gap-8 shrink-0 pr-8">
              {banners[0].is_offer && <span className="inline-flex items-center gap-2 bg-blush text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">🎉 Customer Service Week Offer</span>}
              <span>{banners[0].title}</span>
              {banners[0].subtitle && <span>• {banners[0].subtitle}</span>}
              {banners[0].is_offer && banners[0].discount_percentage && <span>• Save up to {banners[0].discount_percentage}% OFF</span>}
              <span className="text-gold">• Free Delivery in Kiambu & Nairobi Environs on Orders above KSh 10,000</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. REFINED EDITORIAL HERO SECTION */}
      <section
        id="hero"
        style={{
          backgroundColor: '#FFFBF8',
          width: '100%',
          padding: '40px 0 60px 0',
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
            {/* Text Content */}
            <div>
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
                  marginBottom: '20px',
                }}
              >
                ✨ Handcrafted Perfection
              </span>

              <h1
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontWeight: '700',
                  lineHeight: '1.08',
                  color: '#2D1513',
                  marginBottom: '20px',
                  letterSpacing: '-0.5px',
                }}
              >
                Every cake <br />
                <span style={{ fontStyle: 'italic', color: '#E63967', fontWeight: '400' }}>
                  has a name.
                </span>
              </h1>

              <p
                style={{
                  fontSize: '16px',
                  lineHeight: '1.7',
                  color: '#6A4C45',
                  marginBottom: '32px',
                  maxWidth: '500px',
                }}
              >
                Milka bakes for the days people remember. Custom wedding tiers,
                birthday showstoppers, and corporate creations finished by hand with
                soft, creamy, milky goodness.
              </p>

              {/* BUTTON GROUP */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
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

                <a
                  href="#categories"
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
                  Explore Catalog →
                </a>
              </div>

              {/* STATS ROW */}
              <div
                style={{
                  display: 'flex',
                  gap: '36px',
                  borderTop: '1px solid #EFE4DE',
                  paddingTop: '24px',
                }}
              >
                <div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#2D1513' }}>100%</div>
                  <div style={{ fontSize: '12px', color: '#7A5C55' }}>Fresh Ingredients</div>
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#2D1513' }}>500+</div>
                  <div style={{ fontSize: '12px', color: '#7A5C55' }}>Weddings & Events</div>
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#2D1513' }}>4.9 ★</div>
                  <div style={{ fontSize: '12px', color: '#7A5C55' }}>Customer Rating</div>
                </div>
              </div>
            </div>

            {/* RIGHT HERO IMAGE CONTAINER */}
            <div
              style={{
                position: 'relative',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 24px 48px rgba(45, 21, 19, 0.12)',
                height: '480px',
                backgroundColor: '#F8F1ED',
                border: '1px solid #EFE4DE',
              }}
            >
              <img
                src={heroSlides[currentSlide].url}
                alt="Cravers Joy Showcase"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* FLOATING BADGE */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px 20px',
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
                    Crafted by Baker Milka
                  </div>
                  <div style={{ fontSize: '11px', color: '#7A5C55' }}>
                    Custom designs made to order
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MINIMALIST CATEGORY GRID */}
      <section
        id="categories"
        style={{
          backgroundColor: '#F8F1ED',
          width: '100%',
          padding: '40px 0',
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
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '32px',
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
                Curated Selections
              </span>
              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  fontWeight: '700',
                  color: '#2D1513',
                }}
              >
                Shop by Category
              </h2>
            </div>
            <Link
              href="/shop"
              style={{
                color: '#E63967',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View All →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
            }}
          >
            {categories.slice(0, 6).map((category) => (
              <div
                key={category.id}
                onClick={() => (window.location.href = `/shop?category=${category.name}`)}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  border: '1px solid #EFE4DE',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#E63967'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(230, 57, 103, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#EFE4DE'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#F8F1ED',
                    margin: '0 auto 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #EFE4DE',
                  }}
                >
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  ) : (
                    <span style={{ fontSize: '24px' }}>{category.emoji || '🎂'}</span>
                  )}
                </div>
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#2D1513',
                    marginBottom: '4px',
                  }}
                >
                  {category.name}
                </h4>
                <p style={{ fontSize: '12px', color: '#7A5C55' }}>
                  {category.description || 'Celebration treats'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED BEST SELLERS WITH TABBED FILTER */}
      <section
        id="featured"
        style={{
          width: '100%',
          padding: '40px 0 60px 0',
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
              flexDirection: 'column',
              gap: '16px',
              marginBottom: '32px',
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
                Handcrafted Artistry
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
                Best Sellers & Specials
              </h2>
              <p style={{ fontSize: '14px', color: '#7A5C55' }}>
                Tap any cake to customize & order instantly
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                backgroundColor: '#F8F1ED',
                padding: '6px',
                borderRadius: '50px',
                border: '1px solid #EFE4DE',
                width: 'fit-content',
              }}
            >
              <button
                onClick={() => filterCategory('all')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: activeTab === 'all' ? '#2D1513' : 'transparent',
                  color: activeTab === 'all' ? '#FFFFFF' : '#7A5C55',
                }}
              >
                All
              </button>
              <button
                onClick={() => filterCategory('birthday')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: activeTab === 'birthday' ? '#2D1513' : 'transparent',
                  color: activeTab === 'birthday' ? '#FFFFFF' : '#7A5C55',
                }}
              >
                Birthday
              </button>
              <button
                onClick={() => filterCategory('wedding')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: activeTab === 'wedding' ? '#2D1513' : 'transparent',
                  color: activeTab === 'wedding' ? '#FFFFFF' : '#7A5C55',
                }}
              >
                Wedding
              </button>
              <button
                onClick={() => filterCategory('corporate')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: activeTab === 'corporate' ? '#2D1513' : 'transparent',
                  color: activeTab === 'corporate' ? '#FFFFFF' : '#7A5C55',
                }}
              >
                Corporate
              </button>
            </div>
          </div>

          {/* Dynamic Cake Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredCakes.slice(0, 4).map((cake: any) => (
              <div
                key={cake.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid #EFE4DE',
                  boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 16px 32px rgba(45, 21, 19, 0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 21, 19, 0.08)'
                }}
              >
                <div
                  onClick={() => openOrder(cake.id)}
                  style={{
                    height: '240px',
                    backgroundColor: '#F8F1ED',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  {cake.image_url ? (
                    <img
                      src={cake.image_url}
                      alt={cake.name}
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
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        fontSize: '48px',
                      }}
                    >
                      {cake.emoji || '🎂'}
                    </div>
                  )}
                  {cake.tag && filterImageUrl(cake.tag) && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#E63967',
                        color: '#FFFFFF',
                        fontSize: '10px',
                        fontWeight: '700',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        padding: '6px 12px',
                        borderRadius: '50px',
                        boxShadow: '0 4px 12px rgba(230, 57, 103, 0.3)',
                      }}
                    >
                      {filterImageUrl(cake.tag)}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: 'Cormorant Garamond, Georgia, serif',
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#2D1513',
                        marginBottom: '8px',
                      }}
                    >
                      {cake.name}
                    </h3>
                    {cake.description && filterImageUrl(cake.description) && (
                      <p
                        style={{
                          fontSize: '13px',
                          color: '#7A5C55',
                          lineHeight: '1.6',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {filterImageUrl(cake.description)}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      marginTop: '16px',
                      borderTop: '1px solid #EFE4DE',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#7A5C55',
                          textTransform: 'uppercase',
                          fontWeight: '600',
                          display: 'block',
                        }}
                      >
                        Starting from
                      </span>
                      <span
                        style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2D1513',
                        }}
                      >
                        KSh {Math.round(cake.base_price).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => openOrder(cake.id)}
                      style={{
                        backgroundColor: '#2D1513',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '50px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E63967'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#2D1513'
                      }}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section
        id="testimonials"
        style={{
          backgroundColor: '#F8F1ED',
          width: '100%',
          padding: '40px 0 60px 0',
          borderTop: '1px solid #EFE4DE',
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
              Client Stories
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
              What People Say
            </h2>
            <p style={{ fontSize: '14px', color: '#7A5C55' }}>
              Sweet words from our valued clientele across Kenya
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {testimonials && testimonials.length > 0 ? (
              testimonials.slice(0, 3).map((testimonial: any) => (
                <div
                  key={testimonial.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '32px',
                    borderRadius: '20px',
                    border: '1px solid #EFE4DE',
                    boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
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
                      {testimonial.review}
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
              ))
            ) : (
              // Fallback testimonials
              <>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '32px',
                    borderRadius: '20px',
                    border: '1px solid #EFE4DE',
                    boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
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
                      "Milka delivered beyond our expectations for our wedding in Muthaiga. The tiers were structurally flawless and the cream texture was pure magic!"
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
                      Wambui & David
                    </span>
                    <span style={{ fontSize: '12px', color: '#7A5C55' }}>
                      Nairobi, Muthaiga
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '32px',
                    borderRadius: '20px',
                    border: '1px solid #EFE4DE',
                    boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
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
                      "Cravers Joy made our company's 10th anniversary cake. It was accurate to our logo design and tasted heavenly. Recommended 100%!"
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
                      Dr. Sarah K.
                    </span>
                    <span style={{ fontSize: '12px', color: '#7A5C55' }}>
                      Kenyatta Road, Kiambu
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '32px',
                    borderRadius: '20px',
                    border: '1px solid #EFE4DE',
                    boxShadow: '0 4px 12px rgba(45, 21, 19, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
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
                      "The Red Velvet dream cake for my daughter's 21st birthday was the highlight of the night. So fresh, soft, and moist!"
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
                      Grace N.
                    </span>
                    <span style={{ fontSize: '12px', color: '#7A5C55' }}>
                      Thika Road
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 7. FLOATING ACTION BUTTONS */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <button
          onClick={() => openOrder()}
          style={{
            backgroundColor: '#E63967',
            color: '#FFFFFF',
            border: 'none',
            padding: '14px 20px',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(230, 57, 103, 0.3)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <span style={{ fontSize: '18px' }}>🛒</span>
          <span style={{ display: 'none' }}>Order Now</span>
        </button>
        <a
          href="https://wa.me/254725811787?text=Hi%20Milka,%20I%20would%20like%20to%20order%20a%20custom%20cake%20from%20Cravers%20Joy%20Cakes."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            padding: '14px 20px',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <span style={{ fontSize: '20px' }}>💬</span>
          <div style={{ textAlign: 'left', display: 'none' }}>
            <span
              style={{
                display: 'block',
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1,
              }}
            >
              Online & Ready
            </span>
            <span style={{ display: 'block', fontSize: '12px', fontWeight: '700' }}>
              Chat with Milka
            </span>
          </div>
        </a>
      </div>

    </main>
  )
}
