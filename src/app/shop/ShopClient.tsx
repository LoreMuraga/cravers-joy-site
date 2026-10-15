'use client'

import Link from 'next/link'
import { useState } from 'react'

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
  const [priceFilter, setPriceFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('')

  const openOrder = (cakeId?: string, offerDiscount?: number) => {
    if (typeof window !== 'undefined' && (window as any).openOrder) {
      (window as any).openOrder(cakeId, offerDiscount)
    }
  }

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

  // 1. Filter by Category / Price / Search query
  let processedCakes = selectedCategory
    ? allCakes.filter((cake: any) => cake.category_name === selectedCategory || cake.category === selectedCategory)
    : cakes

  if (priceFilter === 'under3000') {
    processedCakes = processedCakes.filter((cake: any) => cake.base_price < 3000)
  }

  if (searchQuery.trim() !== '') {
    processedCakes = processedCakes.filter((cake: any) =>
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
          padding: '50px 0 60px 0',
          textAlign: 'center',
          borderBottom: '1px solid #EFE4DE',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
          <span
            style={{
              color: '#E63967',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            Bespoke Collection
          </span>
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: '700',
              color: '#2D1513',
              marginBottom: '10px',
            }}
          >
            {selectedCategory ? `${selectedCategory}` : 'Shop All Cakes'}
          </h1>
          <p style={{ fontSize: '15px', color: '#7A5C55' }}>
            <Link href="/" style={{ color: '#E63967', textDecoration: 'none', fontWeight: '600' }}>Home</Link> » <span style={{ color: '#2D1513' }}>Shop</span>
          </p>
        </div>
      </div>

      {/* MAIN LAYOUT WITH SIDEBAR & GRID */}
      <section style={{ padding: '48px 0 80px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* SIDEBAR CATEGORIES */}
            <aside
              style={{
                backgroundColor: '#FFFFFF',
                padding: '24px',
                borderRadius: '20px',
                border: '1px solid #EFE4DE',
                boxShadow: '0 4px 16px rgba(45, 21, 19, 0.04)',
                position: 'sticky',
                top: '96px',
              }}
            >
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '16px',
                  borderBottom: '1px solid #F4ECE7',
                  paddingBottom: '10px',
                }}
              >
                Categories
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link
                  href="/shop"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: !selectedCategory ? '#2D1513' : 'transparent',
                    color: !selectedCategory ? '#FFFFFF' : '#5C3D36',
                  }}
                >
                  🎂 All Cakes
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${category.name}`}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: selectedCategory === category.name ? '#2D1513' : 'transparent',
                      color: selectedCategory === category.name ? '#FFFFFF' : '#5C3D36',
                    }}
                  >
                    ✨ {category.name}
                  </Link>
                ))}
              </div>
            </aside>

            {/* PRODUCT CONTENT AREA */}
            <div>
              {/* SEARCH & SORT TOOLS */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '20px',
                  border: '1px solid #EFE4DE',
                  boxShadow: '0 4px 16px rgba(45, 21, 19, 0.04)',
                  marginBottom: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <input
                    type="search"
                    placeholder="Search cakes by name or flavor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '12px',
                      border: '1px solid #EFE4DE',
                      fontSize: '14px',
                      flex: 1,
                      minWidth: '220px',
                      outline: 'none',
                      backgroundColor: '#FAF6F0',
                      color: '#2D1513',
                    }}
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '12px',
                      border: '1px solid #EFE4DE',
                      fontSize: '14px',
                      minWidth: '180px',
                      outline: 'none',
                      backgroundColor: '#FAF6F0',
                      color: '#2D1513',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Default sorting</option>
                    <option value="lo">Price: Low to High</option>
                    <option value="hi">Price: High to Low</option>
                    <option value="az">Name: A to Z</option>
                  </select>
                </div>

                {/* QUICK PRICE FILTER PILLS */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid #F4ECE7' }}>
                  <button
                    onClick={() => setPriceFilter('all')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: priceFilter === 'all' ? '#E63967' : '#F8F1ED',
                      color: priceFilter === 'all' ? '#FFFFFF' : '#7A5C55',
                      transition: 'all 0.2s',
                    }}
                  >
                    All Prices
                  </button>
                  <button
                    onClick={() => setPriceFilter('under3000')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: priceFilter === 'under3000' ? '#E63967' : '#F8F1ED',
                      color: priceFilter === 'under3000' ? '#FFFFFF' : '#7A5C55',
                      transition: 'all 0.2s',
                    }}
                  >
                    Under KSh 3,000 🏷️
                  </button>
                </div>
              </div>

              {/* UNIFORM PRODUCT GRID */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '24px',
                }}
              >
                {processedCakes.map((cake: any) => (
                  <div
                    key={cake.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid #EFE4DE',
                      boxShadow: '0 6px 20px rgba(45, 21, 19, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(45, 21, 19, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(45, 21, 19, 0.05)'
                    }}
                  >
                    {/* FIXED HEIGHT IMAGE CONTAINER */}
                    <div
                      onClick={() => openOrder(cake.id)}
                      style={{
                        height: '220px',
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
                            transition: 'transform 0.4s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            fontSize: '44px',
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
                            padding: '5px 12px',
                            borderRadius: '20px',
                            boxShadow: '0 4px 12px rgba(230, 57, 103, 0.3)',
                          }}
                        >
                          {filterImageUrl(cake.tag)}
                        </span>
                      )}
                    </div>

                    {/* CARD BODY (FLEXBOX FILL) */}
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
                            fontSize: '19px',
                            fontWeight: '700',
                            color: '#2D1513',
                            marginBottom: '6px',
                            lineHeight: '1.2',
                          }}
                        >
                          {cake.name}
                        </h3>
                        {cake.description && filterImageUrl(cake.description) && (
                          <p
                            style={{
                              fontSize: '13px',
                              color: '#7A5C55',
                              lineHeight: '1.5',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              marginBottom: '16px',
                            }}
                          >
                            {filterImageUrl(cake.description)}
                          </p>
                        )}
                      </div>

                      {/* PRICE & ORDER BUTTON */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '14px',
                          borderTop: '1px solid #F4ECE7',
                          marginTop: 'auto',
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '10px', color: '#8C6D65', textTransform: 'uppercase', fontWeight: '600', display: 'block' }}>
                            Price
                          </span>
                          <span style={{ fontSize: '15px', fontWeight: '700', color: '#2D1513' }}>
                            KSh {Math.round(cake.base_price).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => openOrder(cake.id)}
                          style={{
                            backgroundColor: '#2D1513',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '10px 18px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E63967')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2D1513')}
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
                <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #EFE4DE' }}>
                  <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>🍰</span>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2D1513', marginBottom: '6px' }}>No cakes found</h3>
                  <p style={{ color: '#7A5C55', fontSize: '14px' }}>
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