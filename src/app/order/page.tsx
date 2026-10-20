'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function OrderPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cakeId = searchParams.get('cakeId')
  
  const [cake, setCake] = useState<any>(null)
  const [flavors, setFlavors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'options' | 'customs' | 'checkout'>('options')
  
  // Form State
  const [selectedSize, setSelectedSize] = useState('1')
  const [selectedFlavor, setSelectedFlavor] = useState('')
  const [cakeMessage, setCakeMessage] = useState('')
  const [cardMessage, setCardMessage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [deliveryType, setDeliveryType] = useState<'collection' | 'delivery'>('collection')
  const [deliveryArea, setDeliveryArea] = useState('')
  const [deliveryAreas, setDeliveryAreas] = useState<any[]>([])
  const [extraNotes, setExtraNotes] = useState('')
  
  // Options
  const [options, setOptions] = useState({
    eggless: false,
    glutenFree: false,
    flowersRose: false,
    flowersMixed: false,
    premiumCard: false,
    birthdayCandle: false,
  })

  // Size options (from Happy Cakes)
  const sizeOptions = ['0.5', '1', '1.5', '2', '3', '4']
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTime: '',
  })

  useEffect(() => {
    async function fetchCake() {
      if (!cakeId) {
        router.push('/shop')
        return
      }

      const [cakeData, flavorsData, areasRes] = await Promise.all([
        supabase.from('cakes').select('*, categories(name)').eq('id', cakeId).eq('is_active', true).single(),
        supabase.from('cake_flavors').select('*').eq('cake_id', cakeId).eq('is_active', true).order('flavor_name'),
        supabase.from('delivery_areas').select('*').eq('is_active', true),
      ])

      if (!cakeData.data) {
        router.push('/shop')
        return
      }

      setCake(cakeData.data)
      if (flavorsData.data) setFlavors(flavorsData.data)

      if (areasRes.data && areasRes.data.length > 0) {
        setDeliveryAreas(areasRes.data)
      } else {
        setDeliveryAreas([
          { id: '1', name: 'Kenyatta Road', price: 300 },
          { id: '2', name: 'Juja', price: 500 },
          { id: '3', name: 'Ruiru', price: 600 },
          { id: '4', name: 'Kahawa', price: 700 },
          { id: '5', name: 'Githurai', price: 700 },
          { id: '6', name: 'Thika', price: 800 },
          { id: '7', name: 'Nairobi CBD', price: 1000 },
        ])
      }

      setLoading(false)
    }

    fetchCake()
  }, [cakeId, router])

  const selectedFlavorData = flavors.find(f => f.flavor_name === selectedFlavor)
  const flavorAdjustment = selectedFlavorData ? selectedFlavorData.price_adjustment : 0
  const sizeKg = parseFloat(selectedSize) || 1
  
  // Calculate price based on kg input with tiered pricing
  let basePrice = 0
  if (sizeKg <= 1) {
    basePrice = (cake?.base_price || 0) * sizeKg
  } else if (sizeKg <= 1.5) {
    basePrice = (cake?.base_price || 0) * 1.4 * (sizeKg / 1.5)
  } else if (sizeKg <= 2) {
    basePrice = (cake?.base_price || 0) * 1.8 * (sizeKg / 2)
  } else if (sizeKg <= 3) {
    basePrice = (cake?.base_price || 0) * 2.5 * (sizeKg / 3)
  } else {
    basePrice = (cake?.base_price || 0) * 3.2 * (sizeKg / 4)
  }
  
  basePrice = Math.round(basePrice) + flavorAdjustment

  const optionsTotal =
    (options.eggless ? 400 : 0) +
    (options.glutenFree ? 500 : 0) +
    (options.flowersRose ? 1500 : 0) +
    (options.flowersMixed ? 2000 : 0) +
    (options.premiumCard ? 1000 : 0)

  const deliveryFee = deliveryType === 'delivery' ? (deliveryAreas.find(a => a.id === deliveryArea)?.price || 0) : 0
  const orderTotal = (basePrice + optionsTotal + deliveryFee) * quantity

  const handleWhatsAppOrder = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Please enter your name and phone number in step 3.')
      setActiveTab('checkout')
      return
    }

    const deliveryAreaName = deliveryAreas.find(a => a.id === deliveryArea)?.name || 'Not selected'
    const message = `
🎂 *New Order - Cravers Joy*

*Cake:* ${cake?.name}
*Size:* ${selectedSize}kg ${selectedFlavor ? `(${selectedFlavor})` : ''}
*Qty:* ${quantity}

*Customizations:*
${cakeMessage ? `💬 Cake Message: "${cakeMessage}"` : ''}
${options.eggless ? '• Eggless (+KSh 400)' : ''}
${options.glutenFree ? '• Gluten Free (+KSh 500)' : ''}
${options.flowersRose ? '• Roses Bouquet (+KSh 1,500)' : ''}
${options.flowersMixed ? '• Mixed Flowers Bouquet (+KSh 2,000)' : ''}
${options.premiumCard ? '• Premium Card, Candles & Balloon Set (+KSh 1,000)' : ''}
${options.birthdayCandle ? '• Free Birthday Candle' : ''}
${cardMessage ? `📝 Card Note: "${cardMessage}"` : ''}

*Fulfillment:* ${deliveryType === 'collection' ? 'Collection at Store' : `Delivery to ${deliveryAreaName}`}
*Customer:* ${customerInfo.name} (${customerInfo.phone})
${customerInfo.deliveryDate ? `*Date:* ${customerInfo.deliveryDate}` : ''}
${extraNotes ? `*Notes:* ${extraNotes}` : ''}

*Order Total:* KSh ${orderTotal.toLocaleString()}
*50% Deposit Required:* KSh ${Math.round(orderTotal / 2).toLocaleString()}
    `.trim()

    window.open(`https://wa.me/254725811787?text=${encodeURIComponent(message)}`, '_blank')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontWeight: '600', color: '#2D1513' }}>Loading details...</p>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FAF6F0', color: '#2D1513', paddingBottom: '100px' }}>

      {/* HEADER BAR */}
      <div style={{ backgroundColor: '#2D1513', padding: 'clamp(10px, 2vw, 12px) clamp(16px, 4vw, 20px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => router.back()} style={{ background: 'none', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: 'clamp(12px, 2.5vw, 13px)', fontWeight: '600', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
          ← Back
        </button>
        <span style={{ color: '#E63967', fontWeight: '800', fontSize: 'clamp(11px, 2vw, 12px)', letterSpacing: '1px' }}>CRAVERS JOY</span>
      </div>

      <div style={{ maxWidth: '1000px', margin: 'clamp(16px, 3vw, 24px) auto', padding: '0 clamp(12px, 3vw, 16px)' }}>

        {/* FIXED CAKE DETAILS & IMAGE SECTION */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'center' }}>
            {/* Controlled Image Box */}
            <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F8F1ED', height: '200px', position: 'relative' }}>
              {cake.image_url ? (
                <img src={cake.image_url} alt={cake.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '48px' }}>🎂</div>
              )}
            </div>

            {/* Cake Info */}
            <div>
              <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: '700', margin: '0 0 6px 0', color: '#2D1513' }}>{cake.name}</h1>
              {cake.categories && (
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#E63967', fontWeight: '600', textTransform: 'uppercase' }}>{cake.categories.name}</p>
              )}
              {cake.description && (
                <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#7A5C55', lineHeight: '1.5' }}>{cake.description}</p>
              )}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '8px 14px', backgroundColor: '#FAF6F0', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#7A5C55' }}>Base Price:</span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#E63967' }}>KSh {cake.base_price?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COMPACT TAB NAVIGATION */}
        <div style={{ display: 'flex', backgroundColor: '#EFE4DE', padding: '4px', borderRadius: '12px', marginBottom: 'clamp(16px, 3vw, 20px)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('options')}
            style={{
              flex: 1, padding: 'clamp(8px, 2vw, 10px) 4px', borderRadius: '8px', border: 'none', fontSize: 'clamp(11px, 2.5vw, 12px)', fontWeight: '700', cursor: 'pointer', minHeight: '44px',
              backgroundColor: activeTab === 'options' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'options' ? '#2D1513' : '#7A5C55',
              boxShadow: activeTab === 'options' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            1. Size & Flavor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customs')}
            style={{
              flex: 1, padding: 'clamp(8px, 2vw, 10px) 4px', borderRadius: '8px', border: 'none', fontSize: 'clamp(11px, 2.5vw, 12px)', fontWeight: '700', cursor: 'pointer', minHeight: '44px',
              backgroundColor: activeTab === 'customs' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'customs' ? '#2D1513' : '#7A5C55',
              boxShadow: activeTab === 'customs' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            2. Customizations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('checkout')}
            style={{
              flex: 1, padding: 'clamp(8px, 2vw, 10px) 4px', borderRadius: '8px', border: 'none', fontSize: 'clamp(11px, 2.5vw, 12px)', fontWeight: '700', cursor: 'pointer', minHeight: '44px',
              backgroundColor: activeTab === 'checkout' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'checkout' ? '#2D1513' : '#7A5C55',
              boxShadow: activeTab === 'checkout' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            3. Contact & Delivery
          </button>
        </div>

        {/* TAB 1: SIZE & FLAVOR */}
        {activeTab === 'options' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#2D1513', marginBottom: '12px', textTransform: 'uppercase' }}>
              Select Cake Weight (kg)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {sizeOptions.map((size) => {
                const isSelected = selectedSize === size
                const sizePrice = Math.round((cake?.base_price || 0) * (size === '0.5' ? 0.5 : parseFloat(size)))
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '16px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                      border: isSelected ? '2px solid #E63967' : '1px solid #EFE4DE',
                      backgroundColor: isSelected ? '#FFF0F3' : '#FAF6F0',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ display: 'block', fontWeight: '800', fontSize: '18px', color: isSelected ? '#E63967' : '#2D1513', marginBottom: '4px' }}>{size}kg</span>
                    <span style={{ fontSize: '12px', color: '#7A5C55', fontWeight: '600' }}>KSh {sizePrice.toLocaleString()}</span>
                  </button>
                )
              })}
            </div>

            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#2D1513', marginBottom: '12px', textTransform: 'uppercase' }}>
              Quantity
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #EFE4DE', backgroundColor: '#FAF6F0', fontSize: '20px', fontWeight: '700', cursor: 'pointer' }}
              >
                -
              </button>
              <span style={{ fontSize: '18px', fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #EFE4DE', backgroundColor: '#FAF6F0', fontSize: '20px', fontWeight: '700', cursor: 'pointer' }}
              >
                +
              </button>
            </div>

            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#2D1513', marginBottom: '12px', textTransform: 'uppercase' }}>
              Select Flavor Preference
            </label>
            <select
              value={selectedFlavor}
              onChange={(e) => setSelectedFlavor(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EFE4DE', backgroundColor: '#FAF6F0', fontSize: '14px', marginBottom: '24px' }}
            >
              <option value="">Standard (No Extra Cost)</option>
              {flavors.map((f) => (
                <option key={f.id} value={f.flavor_name}>
                  {f.flavor_name} {f.price_adjustment ? `(+KSh ${f.price_adjustment})` : ''}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setActiveTab('customs')}
              style={{ width: '100%', padding: '14px', backgroundColor: '#2D1513', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}
            >
              Next: Customizations →
            </button>
          </div>
        )}

        {/* TAB 2: CUSTOMIZATIONS */}
        {activeTab === 'customs' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#2D1513', marginBottom: '8px', textTransform: 'uppercase' }}>
                a) Add a Cake Message (Free)
              </label>
              <p style={{ fontSize: '12px', color: '#7A5C55', marginBottom: '8px' }}>Tell the message to write on top of the cake (e.g. Happy Birthday My Dear)</p>
              <input
                type="text"
                placeholder="e.g. Happy Birthday John"
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EFE4DE', backgroundColor: '#FAF6F0', fontSize: '14px' }}
              />
            </div>

            <div style={{ borderTop: '1px solid #EFE4DE', paddingTop: '20px', marginBottom: '20px' }}>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#2D1513', marginBottom: '12px', textTransform: 'uppercase' }}>
                b) Dietary Options
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', padding: '12px', backgroundColor: '#FAF6F0', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={options.eggless} onChange={(e) => setOptions({ ...options, eggless: e.target.checked })} style={{ accentColor: '#E63967' }} />
                  <span>Make the Cake Eggless (+KSh 400)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', padding: '12px', backgroundColor: '#FAF6F0', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={options.glutenFree} onChange={(e) => setOptions({ ...options, glutenFree: e.target.checked })} style={{ accentColor: '#E63967' }} />
                  <span>Make the Cake Gluten Free (+KSh 500)</span>
                </label>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #EFE4DE', paddingTop: '20px', marginBottom: '20px' }}>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#2D1513', marginBottom: '12px', textTransform: 'uppercase' }}>
                c) Add a Fresh Flowers Bouquet
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', padding: '12px', backgroundColor: '#FAF6F0', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={options.flowersRose} onChange={(e) => setOptions({ ...options, flowersRose: e.target.checked })} style={{ accentColor: '#E63967' }} />
                  <span>Mixed Colors Roses Bouquet (20-25 stems) (+KSh 1,500)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', padding: '12px', backgroundColor: '#FAF6F0', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={options.flowersMixed} onChange={(e) => setOptions({ ...options, flowersMixed: e.target.checked })} style={{ accentColor: '#E63967' }} />
                  <span>Mixed Flowers Bouquet (Mums, Fillers, Roses, Carnations) (+KSh 2,000)</span>
                </label>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #EFE4DE', paddingTop: '20px', marginBottom: '20px' }}>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#2D1513', marginBottom: '12px', textTransform: 'uppercase' }}>
                d) Add Something Extra
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', padding: '12px', backgroundColor: '#FAF6F0', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={options.premiumCard} onChange={(e) => setOptions({ ...options, premiumCard: e.target.checked })} style={{ accentColor: '#E63967' }} />
                  <span>Premium Card, Pair of Sparkling Candles & Large Balloon (+KSh 1,000)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', padding: '12px', backgroundColor: '#FAF6F0', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={options.birthdayCandle} onChange={(e) => setOptions({ ...options, birthdayCandle: e.target.checked })} style={{ accentColor: '#E63967' }} />
                  <span>Free Birthday Candle</span>
                </label>
              </div>
              {options.premiumCard && (
                <div style={{ marginTop: '12px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '6px' }}>Write Card Message here</label>
                  <input
                    type="text"
                    placeholder="Tell the message to write inside the card (e.g. Sending all the love. From David)"
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #EFE4DE', backgroundColor: '#FAF6F0', fontSize: '13px' }}
                  />
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ backgroundColor: '#FAF6F0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#2D1513', marginBottom: '12px', textTransform: 'uppercase' }}>
                Price Breakdown
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: '#7A5C55' }}>Product Price ({selectedSize}kg × {quantity}):</span>
                <span style={{ fontWeight: '600' }}>KSh {(basePrice * quantity).toLocaleString()}</span>
              </div>
              {flavorAdjustment > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#7A5C55' }}>Flavor Adjustment:</span>
                  <span style={{ fontWeight: '600' }}>KSh {(flavorAdjustment * quantity).toLocaleString()}</span>
                </div>
              )}
              {optionsTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#7A5C55' }}>Total Options:</span>
                  <span style={{ fontWeight: '600' }}>KSh {(optionsTotal * quantity).toLocaleString()}</span>
                </div>
              )}
              {deliveryFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#7A5C55' }}>Delivery Fee:</span>
                  <span style={{ fontWeight: '600' }}>KSh {deliveryFee.toLocaleString()}</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid #EFE4DE', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                <span style={{ fontWeight: '800', color: '#2D1513' }}>Order Total:</span>
                <span style={{ fontWeight: '800', color: '#E63967' }}>KSh {orderTotal.toLocaleString()}</span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#7A5C55', textAlign: 'center' }}>
                50% Deposit Required: KSh {Math.round(orderTotal / 2).toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => setActiveTab('options')} style={{ flex: 1, padding: '14px', backgroundColor: '#FAF6F0', border: '1px solid #EFE4DE', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                ← Back
              </button>
              <button type="button" onClick={() => setActiveTab('checkout')} style={{ flex: 2, padding: '14px', backgroundColor: '#2D1513', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                Next: Contact Details →
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT & DELIVERY */}
        {activeTab === 'checkout' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <span style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#2D1513', marginBottom: '16px', textTransform: 'uppercase' }}>
              Choose Fulfillment Method
            </span>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => setDeliveryType('collection')}
                style={{
                  flex: 1, padding: '16px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                  border: deliveryType === 'collection' ? '2px solid #2D1513' : '1px solid #EFE4DE',
                  backgroundColor: deliveryType === 'collection' ? '#2D1513' : '#FAF6F0',
                  color: deliveryType === 'collection' ? '#FFFFFF' : '#2D1513',
                }}
              >
                🏪 Store Pickup
                <span style={{ display: 'block', fontSize: '11px', fontWeight: '400', marginTop: '4px', opacity: 0.8 }}>Kenyatta Road, Kiambu</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                style={{
                  flex: 1, padding: '16px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                  border: deliveryType === 'delivery' ? '2px solid #2D1513' : '1px solid #EFE4DE',
                  backgroundColor: deliveryType === 'delivery' ? '#2D1513' : '#FAF6F0',
                  color: deliveryType === 'delivery' ? '#FFFFFF' : '#2D1513',
                }}
              >
                🚚 Delivery
                <span style={{ display: 'block', fontSize: '11px', fontWeight: '400', marginTop: '4px', opacity: 0.8 }}>To your location</span>
              </button>
            </div>

            {deliveryType === 'delivery' && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>Select Delivery Location</label>
                <select
                  value={deliveryArea}
                  onChange={(e) => setDeliveryArea(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EFE4DE', backgroundColor: '#FAF6F0', fontSize: '14px' }}
                >
                  <option value="">-- Choose Delivery Location --</option>
                  {deliveryAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name} (+KSh {area.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <span style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#2D1513', marginBottom: '16px', textTransform: 'uppercase' }}>
              Your Contact Details
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EFE4DE', backgroundColor: '#FAF6F0', fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="07XXXXXXXX"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EFE4DE', backgroundColor: '#FAF6F0', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>Preferred Delivery Date (Optional)</label>
              <input
                type="date"
                value={customerInfo.deliveryDate}
                onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryDate: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EFE4DE', backgroundColor: '#FAF6F0', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>Extra Notes (Optional)</label>
              <textarea
                placeholder="Any special instructions..."
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EFE4DE', backgroundColor: '#FAF6F0', fontSize: '14px', minHeight: '80px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => setActiveTab('customs')} style={{ flex: 1, padding: '14px', backgroundColor: '#FAF6F0', border: '1px solid #EFE4DE', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                ← Back
              </button>
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                style={{ flex: 2, padding: '14px', backgroundColor: '#25D366', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,211,102,0.2)' }}
              >
                💬 Complete Order on WhatsApp
              </button>
            </div>
          </div>
        )}

      </div>

      {/* FLOATING ACTION BAR FOR FAST CHECKOUT */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTop: '1px solid #EFE4DE', padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)', paddingBottom: 'calc(clamp(12px, 3vw, 16px) + env(safe-area-inset-bottom, 0px))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100, boxShadow: '0 -4px 16px rgba(0,0,0,0.05)' }}>
        <div>
          <span style={{ display: 'block', fontSize: 'clamp(9px, 2vw, 10px)', color: '#8A7873', fontWeight: '700' }}>ORDER TOTAL</span>
          <span style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '800', color: '#E63967' }}>KSh {orderTotal.toLocaleString()}</span>
          <span style={{ display: 'block', fontSize: 'clamp(9px, 2vw, 10px)', color: '#8A7873', marginTop: '2px' }}>50% Deposit: KSh {Math.round(orderTotal / 2).toLocaleString()}</span>
        </div>
        <button
          type="button"
          onClick={handleWhatsAppOrder}
          style={{ backgroundColor: '#25D366', color: '#FFFFFF', border: 'none', padding: 'clamp(12px, 3vw, 14px) clamp(16px, 4vw, 24px)', borderRadius: '10px', fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,211,102,0.2)', minHeight: '44px' }}
        >
          💬 Order on WhatsApp
        </button>
      </div>

    </main>
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderPageContent />
    </Suspense>
  )
}
