'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ShopClientProps {
  categories: any[]
  cakes: any[]
  allCakes: any[]
  selectedCategory?: string
}

export default function ShopClient({
  categories,
  cakes,
  allCakes,
  selectedCategory,
}: ShopClientProps) {
  const router = useRouter()
  const [priceFilter, setPriceFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [showMobileCategories, setShowMobileCategories] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const openOrder = (cakeId?: string, offerDiscount?: number) => {
    if (cakeId) {
      router.push(`/order?cakeId=${cakeId}`)
    }
  }

  // Helper to filter out image URLs and filenames from text
  const filterImageUrl = (text: string | null | undefined) => {
    if (!text) return ''
    let filtered = text.replace(/https?:\/\/[^\s]+/g, '')
    filtered = filtered.replace(/WhatsApp Image \d{4}-\d{2}-\d{2} at \d{1,2}/gi, '')
    filtered = filtered.replace(/IMG-\d+/gi, '')
    filtered = filtered.replace(/image-\d+/gi, '')
    return filtered.trim()
  }

  // 1. Filter by Category / Price / Search query
  // When a category is selected, use the pre-filtered cakes from the server
  // Otherwise use all cakes
  let processedCakes = selectedCategory ? cakes : allCakes

  if (priceFilter === 'under3000') {
    processedCakes = processedCakes.filter((cake: any) => cake.base_price < 3000)
  }

  if (searchQuery.trim() !== '') {
    processedCakes = processedCakes.filter(
      (cake: any) =>
        cake.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cake.description && cake.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  // 2. Sorting logic
  if (sortBy === 'lo') {
    processedCakes = [...processedCakes].sort((a, b) => a.base_price - b.base_price)
  } else if (sortBy === 'hi') {
    processedCakes = [...processedCakes].sort((a, b) => b.base_price - a.base_price)
  } else if (sortBy === 'az') {
    processedCakes = [...processedCakes].sort((a, b) => a.name.localeCompare(b.name))
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FFFBF8', color: '#2D1513', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* PAGE HEADER */}
      <div
        style={{
          background: 'linear-gradient(to bottom, rgba(230, 57, 103, 0.08), #FFFBF8)',
          padding: 'clamp(24px, 5vw, 40px) 0 clamp(30px, 5vw, 50px) 0',
          textAlign: 'center',
          borderBottom: '1px solid #EFE4DE',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)' }}>
          <span
            style={{
              color: '#E63967',
              fontSize: 'clamp(10px, 2vw, 11px)',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: 'clamp(6px, 1vw, 8px)',
              display: 'block',
            }}
          >
            Bespoke Collection
          </span>
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(28px, 5vw, 56px)',
              fontWeight: '700',
              color: '#2D1513',
              marginBottom: 'clamp(8px, 1vw, 10px)',
            }}
          >
            {selectedCategory ? `${selectedCategory}` : 'Shop All Cakes'}
          </h1>
          <p style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: '#7A5C55' }}>
            <Link href="/" style={{ color: '#E63967', textDecoration: 'none', fontWeight: '600' }}>Home</Link> » <span style={{ color: '#2D1513' }}>Shop</span>
          </p>
        </div>
      </div>

      {/* MAIN CONTENT SECTION */}
      <section style={{ padding: 'clamp(24px, 4vw, 40px) 0 clamp(48px, 6vw, 80px) 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(16px, 3vw, 24px)' }}>
          
          {/* MAIN PAGE LAYOUT GRID */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: (isMobile && showMobileCategories) ? '1fr' : (!isMobile ? '260px 1fr' : '1fr'),
              gap: 'clamp(16px, 3vw, 32px)',
              alignItems: 'start',
            }}
          >
            {/* SIDEBAR CATEGORIES */}
            <aside
              style={{
                backgroundColor: '#FFFFFF',
                padding: 'clamp(16px, 3vw, 20px)',
                borderRadius: 'clamp(12px, 2vw, 20px)',
                border: '1px solid #EFE4DE',
                boxShadow: '0 4px 16px rgba(45, 21, 19, 0.04)',
                position: !isMobile ? 'sticky' : 'static',
                top: '96px',
                display: (isMobile && !showMobileCategories) ? 'none' : 'block',
              }}
            >
              {/* Mobile category toggle button */}
              {isMobile && (
                <button
                  onClick={() => setShowMobileCategories(!showMobileCategories)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2D1513',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {showMobileCategories ? '✕ Hide Categories' : '📂 Show Categories'}
                </button>
              )}
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: 'clamp(18px, 3vw, 20px)',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: 'clamp(12px, 2vw, 16px)',
                  borderBottom: '1px solid #F4ECE7',
                  paddingBottom: 'clamp(8px, 1vw, 10px)',
                }}
              >
                Categories
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1vw, 8px)' }}>
                <Link
                  href="/shop"
                  style={{
                    padding: 'clamp(10px, 2vw, 12px) clamp(12px, 2vw, 16px)',
                    borderRadius: 'clamp(10px, 2vw, 12px)',
                    fontSize: 'clamp(13px, 2vw, 14px)',
                    fontWeight: '600',
                    textDecoration: 'none',
                    backgroundColor: !selectedCategory ? '#2D1513' : 'transparent',
                    color: !selectedCategory ? '#FFFFFF' : '#5C3D36',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  🎂 All Cakes
                </Link>
                {categories.map((category) => {
                  const isActive = selectedCategory === category.name
                  return (
                    <Link
                      key={category.id}
                      href={`/shop?category=${category.name}`}
                      style={{
                        padding: 'clamp(10px, 2vw, 12px) clamp(12px, 2vw, 16px)',
                        borderRadius: 'clamp(10px, 2vw, 12px)',
                        fontSize: 'clamp(13px, 2vw, 14px)',
                        fontWeight: '600',
                        textDecoration: 'none',
                        backgroundColor: isActive ? '#2D1513' : 'transparent',
                        color: isActive ? '#FFFFFF' : '#5C3D36',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      ✨ {category.name}
                    </Link>
                  )
                })}
              </div>
            </aside>

            {/* PRODUCT CONTENT AREA */}
            <div>
              {/* Mobile Category Toggle */}
              <button
                onClick={() => setShowMobileCategories(!showMobileCategories)}
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 20px)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EFE4DE',
                  borderRadius: 'clamp(10px, 2vw, 12px)',
                  fontSize: 'clamp(13px, 2vw, 14px)',
                  fontWeight: '600',
                  color: '#2D1513',
                  cursor: 'pointer',
                  marginBottom: 'clamp(12px, 2vw, 16px)',
                  textAlign: 'left',
                  display: isMobile ? 'block' : 'none',
                  minHeight: '44px',
                }}
              >
                <span style={{ fontSize: 'clamp(14px, 2vw, 16px)', marginRight: '8px' }}>📂</span>
                {showMobileCategories ? 'Hide Categories' : 'Show Categories'}
              </button>

              {/* SEARCH & SORT TOOLS */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: 'clamp(12px, 2vw, 20px)',
                  border: '1px solid #EFE4DE',
                  boxShadow: '0 4px 16px rgba(45, 21, 19, 0.04)',
                  marginBottom: 'clamp(20px, 3vw, 28px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(12px, 2vw, 16px)',
                }}
              >
                <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
                  <input
                    type="search"
                    placeholder="Search cakes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      padding: 'clamp(10px, 2vw, 12px) clamp(12px, 2vw, 16px)',
                      borderRadius: 'clamp(10px, 2vw, 12px)',
                      border: '1px solid #EFE4DE',
                      fontSize: 'clamp(13px, 2vw, 14px)',
                      flex: 1,
                      minWidth: 'clamp(140px, 40vw, 150px)',
                      outline: 'none',
                      backgroundColor: '#FAF6F0',
                      color: '#2D1513',
                      minHeight: '44px',
                    }}
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: 'clamp(10px, 2vw, 12px) clamp(12px, 2vw, 16px)',
                      borderRadius: 'clamp(10px, 2vw, 12px)',
                      border: '1px solid #EFE4DE',
                      fontSize: 'clamp(13px, 2vw, 14px)',
                      minWidth: 'clamp(130px, 35vw, 140px)',
                      outline: 'none',
                      backgroundColor: '#FAF6F0',
                      color: '#2D1513',
                      cursor: 'pointer',
                      minHeight: '44px',
                    }}
                  >
                    <option value="">Default sorting</option>
                    <option value="lo">Price: Low to High</option>
                    <option value="hi">Price: High to Low</option>
                    <option value="az">Name: A to Z</option>
                  </select>
                </div>

                {/* PRICE FILTER BUTTONS */}
                <div style={{ display: 'flex', gap: 'clamp(6px, 1vw, 8px)', flexWrap: 'wrap', paddingTop: 'clamp(6px, 1vw, 8px)', borderTop: '1px solid #F4ECE7' }}>
                  <button
                    onClick={() => setPriceFilter('all')}
                    style={{
                      padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 16px)',
                      borderRadius: '20px',
                      fontSize: 'clamp(11px, 2vw, 12px)',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: priceFilter === 'all' ? '#E63967' : '#F8F1ED',
                      color: priceFilter === 'all' ? '#FFFFFF' : '#7A5C55',
                      minHeight: '44px',
                    }}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setPriceFilter('under3000')}
                    style={{
                      padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 16px)',
                      borderRadius: '20px',
                      fontSize: 'clamp(11px, 2vw, 12px)',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: priceFilter === 'under3000' ? '#E63967' : '#F8F1ED',
                      color: priceFilter === 'under3000' ? '#FFFFFF' : '#7A5C55',
                      minHeight: '44px',
                    }}
                  >
                    Under KSh 3,000 🏷️
                  </button>
                </div>
              </div>

              {/* PRODUCTS GRID (HORIZONTAL CARDS) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(450px, 1fr))',
                  gap: 'clamp(16px, 3vw, 24px)',
                }}
              >
                {processedCakes.map((cake: any) => (
                  <div
                    key={cake.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'clamp(12px, 2vw, 20px)',
                      overflow: 'hidden',
                      border: '1px solid #EFE4DE',
                      boxShadow: '0 6px 20px rgba(45, 21, 19, 0.05)',
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      height: isMobile ? 'auto' : '200px',
                    }}
                  >
                    {/* IMAGE AREA (LEFT SIDE) */}
                    <div
                      onClick={() => router.push(`/cake/${cake.id}`)}
                      style={{
                        flex: isMobile ? 'none' : '0 0 40%',
                        height: isMobile ? 'clamp(200px, 40vw, 250px)' : '100%',
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
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            fontSize: 'clamp(32px, 5vw, 40px)',
                          }}
                        >
                          {cake.emoji || '🎂'}
                        </div>
                      )}

                      {/* TAG BADGE */}
                      {cake.tag && filterImageUrl(cake.tag) && (
                        <span
                          style={{
                            position: 'absolute',
                            top: 'clamp(8px, 1.5vw, 12px)',
                            left: 'clamp(8px, 1.5vw, 12px)',
                            backgroundColor: '#E63967',
                            color: '#FFFFFF',
                            fontSize: 'clamp(8px, 1.5vw, 9px)',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            padding: 'clamp(3px, 0.5vw, 4px) clamp(8px, 1.5vw, 10px)',
                            borderRadius: 'clamp(10px, 2vw, 12px)',
                          }}
                        >
                          {filterImageUrl(cake.tag)}
                        </span>
                      )}
                    </div>

                    {/* DETAILS AREA */}
                    <div
                      style={{
                        padding: 'clamp(12px, 2vw, 16px)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        flexGrow: 1,
                        gap: 'clamp(10px, 2vw, 12px)',
                      }}
                    >
                      <Link
                        href={`/cake/${cake.id}`}
                        style={{
                          fontFamily: 'Cormorant Garamond, Georgia, serif',
                          fontSize: 'clamp(16px, 3vw, 18px)',
                          fontWeight: '700',
                          color: '#2D1513',
                          lineHeight: '1.2',
                          margin: 0,
                          textDecoration: 'none',
                        }}
                      >
                        {cake.name}
                      </Link>

                      {/* DESCRIPTION */}
                      {cake.description && (
                        <p
                          style={{
                            fontSize: 'clamp(12px, 2vw, 13px)',
                            color: '#7A5C55',
                            lineHeight: '1.5',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            margin: 0,
                          }}
                        >
                          {filterImageUrl(cake.description)}
                        </p>
                      )}

                      {/* PRICE & BUTTON ROW */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 'auto',
                          paddingTop: 'clamp(10px, 2vw, 12px)',
                          borderTop: '1px solid #F4ECE7',
                        }}
                      >
                        <div>
                          <span
                            style={{
                              display: 'block',
                              fontSize: 'clamp(9px, 1.5vw, 10px)',
                              fontWeight: '700',
                              color: '#8A7873',
                              textTransform: 'uppercase',
                            }}
                          >
                            PRICE
                          </span>
                          <span style={{ fontSize: 'clamp(14px, 2vw, 15px)', fontWeight: '700', color: '#2D1513' }}>
                            KSh {Math.round(cake.base_price).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => openOrder(cake.id)}
                          style={{
                            backgroundColor: '#2D1513',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 16px)',
                            borderRadius: '20px',
                            fontSize: 'clamp(11px, 2vw, 12px)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            minHeight: '44px',
                          }}
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* EMPTY STATE */}
              {(!processedCakes || processedCakes.length === 0) && (
                <div style={{ textAlign: 'center', padding: 'clamp(40px, 6vw, 80px) clamp(16px, 3vw, 20px)', backgroundColor: '#FFFFFF', borderRadius: 'clamp(12px, 2vw, 20px)', border: '1px solid #EFE4DE' }}>
                  <span style={{ fontSize: 'clamp(28px, 5vw, 36px)', display: 'block', marginBottom: 'clamp(10px, 2vw, 12px)' }}>🍰</span>
                  <h3 style={{ fontSize: 'clamp(16px, 3vw, 18px)', fontWeight: '700', color: '#2D1513', marginBottom: 'clamp(5px, 1vw, 6px)' }}>No cakes found</h3>
                  <p style={{ color: '#7A5C55', fontSize: 'clamp(13px, 2vw, 14px)' }}>
                    Try adjusting your search keyword or selecting a different category.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
