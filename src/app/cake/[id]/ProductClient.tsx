'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProductClientProps {
  cake: any
  flavors: any[]
}

export default function ProductClient({ cake, flavors }: ProductClientProps) {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedFlavor, setSelectedFlavor] = useState('')
  const [message, setMessage] = useState('')
  const [customFlavor, setCustomFlavor] = useState('')

  // Generate placeholder images for gallery
  const images = [cake.image_url, cake.image_url, cake.image_url, cake.image_url, cake.image_url].filter(Boolean)

  const sizes = ['1kg', '1.5kg', '2kg', '3kg', '4kg']
  const prices: { [key: string]: number } = {
    '1kg': cake.base_price,
    '1.5kg': Math.round(cake.base_price * 1.4),
    '2kg': Math.round(cake.base_price * 1.8),
    '3kg': Math.round(cake.base_price * 2.5),
    '4kg': Math.round(cake.base_price * 3.2),
  }

  const selectedFlavorData = flavors.find(f => f.flavor_name === selectedFlavor)
  const flavorAdjustment = selectedFlavorData ? selectedFlavorData.price_adjustment : 0
  const currentPrice = selectedSize ? prices[selectedSize] + flavorAdjustment : cake.base_price + flavorAdjustment

  const openOrder = () => {
    router.push(`/order?cakeId=${cake.id}`)
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FFFBF8', color: '#2D1513', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* BREADCRUMB */}
      <div style={{ padding: '20px 0', borderBottom: '1px solid #EFE4DE' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', fontSize: '14px' }}>
          <Link href="/" style={{ color: '#E63967', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px', color: '#7A5C55' }}>»</span>
          <Link href="/shop" style={{ color: '#E63967', textDecoration: 'none' }}>Shop</Link>
          <span style={{ margin: '0 8px', color: '#7A5C55' }}>»</span>
          <span style={{ color: '#2D1513' }}>{cake.name}</span>
        </div>
      </div>

      {/* PRODUCT DETAIL SECTION */}
      <section style={{ padding: '40px 0 80px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
            
            {/* IMAGE GALLERY */}
            <div>
              {/* MAIN IMAGE */}
              <div
                style={{
                  backgroundColor: '#F8F1ED',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  aspectRatio: '1',
                  position: 'relative',
                }}
              >
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage]}
                    alt={cake.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'zoom-in',
                    }}
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.open(images[selectedImage], '_blank')
                      }
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      fontSize: '64px',
                    }}
                  >
                    {cake.emoji || '🎂'}
                  </div>
                )}
              </div>

              {/* THUMBNAILS */}
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImage === idx ? '3px solid #E63967' : '2px solid #EFE4DE',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img}
                      alt={`${cake.name} ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div>
              <h1
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: '700',
                  color: '#2D1513',
                  marginBottom: '16px',
                  lineHeight: '1.2',
                }}
              >
                {cake.name}
              </h1>

              {/* CATEGORY TAG */}
              {cake.categories?.name && (
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#F8F1ED',
                    color: '#2D1513',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '20px',
                  }}
                >
                  {cake.categories.name}
                </span>
              )}

              {/* HIGHLIGHTS */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid #EFE4DE',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#E63967',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Highlights
                </h3>
                <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#2D1513', margin: 0 }}>
                  {cake.description || 'A beautiful handcrafted cake made with love and premium ingredients.'}
                </p>
              </div>

              {/* SIZE SELECTION */}
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#2D1513',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Cake Size
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        border: '2px solid',
                        borderColor: selectedSize === size ? '#E63967' : '#EFE4DE',
                        backgroundColor: selectedSize === size ? '#E63967' : '#FFFFFF',
                        color: selectedSize === size ? '#FFFFFF' : '#2D1513',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* FLAVOR SELECTION */}
              {flavors.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#2D1513',
                      marginBottom: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    Select Flavor
                  </h3>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setSelectedFlavor('')}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '12px',
                        border: '2px solid',
                        borderColor: selectedFlavor === '' ? '#E63967' : '#EFE4DE',
                        backgroundColor: selectedFlavor === '' ? '#E63967' : '#FFFFFF',
                        color: selectedFlavor === '' ? '#FFFFFF' : '#2D1513',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      Standard
                    </button>
                    {flavors.map((flavor) => (
                      <button
                        key={flavor.id}
                        onClick={() => setSelectedFlavor(flavor.flavor_name)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '12px',
                          border: '2px solid',
                          borderColor: selectedFlavor === flavor.flavor_name ? '#E63967' : '#EFE4DE',
                          backgroundColor: selectedFlavor === flavor.flavor_name ? '#E63967' : '#FFFFFF',
                          color: selectedFlavor === flavor.flavor_name ? '#FFFFFF' : '#2D1513',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {flavor.flavor_name}
                        {flavor.price_adjustment !== 0 && (
                          <span style={{ marginLeft: '4px', fontSize: '11px', opacity: 0.8 }}>
                            {flavor.price_adjustment > 0 ? '+' : ''}
                            {flavor.price_adjustment}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CUSTOM MESSAGE */}
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#2D1513',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Add a Cake Message
                </h3>
                <input
                  type="text"
                  placeholder="e.g., Happy Birthday My Dear"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid #EFE4DE',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#FAF6F0',
                    color: '#2D1513',
                  }}
                />
                <p style={{ fontSize: '12px', color: '#7A5C55', marginTop: '8px' }}>
                  (We don't charge extra for this)
                </p>
              </div>

              {/* PRICE & ORDER */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid #EFE4DE',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#7A5C55', fontWeight: '600' }}>Price:</span>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: '#E63967' }}>
                    KSh {currentPrice.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={openOrder}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#2D1513',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
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

              {/* DELIVERY INFO */}
              <div
                style={{
                  backgroundColor: '#F8F1ED',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  color: '#7A5C55',
                  textAlign: 'center',
                }}
              >
                ⏰ Order by 5pm for same day delivery in Kiambu
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
