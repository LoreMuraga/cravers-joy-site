'use client'

import { useState } from 'react'

export default function PriceEstimator() {
  const [occasion, setOccasion] = useState('')
  const [weight, setWeight] = useState('1')
  const [estimatedPrice, setEstimatedPrice] = useState(0)

  const basePrices: { [key: string]: number } = {
    birthday: 2500,
    wedding: 3500,
    corporate: 3000,
    graduation: 2800,
    ruracio: 3200,
    cupcakes: 2000,
  }

  const calculatePrice = () => {
    const basePrice = basePrices[occasion] || 2500
    const price = basePrice * parseInt(weight)
    setEstimatedPrice(price)
  }

  const sendToWhatsApp = () => {
    const message = `Hi Milka, I'd like to order a cake:\n\nOccasion: ${occasion}\nWeight: ${weight}kg\nEstimated Price: KSh ${estimatedPrice.toLocaleString()}\n\nPlease let me know availability and final pricing.`
    window.open(`https://wa.me/254725811787?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E8DDD5',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(61, 35, 29, 0.08)'
    }}>
      <h3 style={{
        color: '#3D231D',
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '16px'
      }}>
        Quick Price Estimate
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: '#3D231D',
            marginBottom: '6px'
          }}>
            Occasion
          </label>
          <select
            value={occasion}
            onChange={(e) => {
              setOccasion(e.target.value)
              calculatePrice()
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1.5px solid #E8DDD5',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#3D231D',
              background: '#fff'
            }}
          >
            <option value="">Select occasion</option>
            <option value="birthday">Birthday</option>
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate Event</option>
            <option value="graduation">Graduation</option>
            <option value="ruracio">Ruracio</option>
            <option value="cupcakes">Cupcakes</option>
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: '#3D231D',
            marginBottom: '6px'
          }}>
            Weight (kg)
          </label>
          <select
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value)
              calculatePrice()
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1.5px solid #E8DDD5',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#3D231D',
              background: '#fff'
            }}
          >
            <option value="1">1 kg</option>
            <option value="2">2 kg</option>
            <option value="3">3 kg</option>
            <option value="4">4 kg</option>
            <option value="5">5 kg</option>
            <option value="6">6 kg</option>
            <option value="7">7 kg</option>
            <option value="8">8 kg</option>
            <option value="9">9 kg</option>
            <option value="10">10 kg</option>
          </select>
        </div>

        {estimatedPrice > 0 && (
          <div style={{
            background: '#FFE5EC',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#3D231D', marginBottom: '4px' }}>
              Estimated Price
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#E63967'
            }}>
              KSh {estimatedPrice.toLocaleString()}
            </div>
          </div>
        )}

        <button
          onClick={sendToWhatsApp}
          disabled={!occasion || estimatedPrice === 0}
          style={{
            width: '100%',
            background: '#25D366',
            color: '#fff',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: !occasion || estimatedPrice === 0 ? 'not-allowed' : 'pointer',
            opacity: !occasion || estimatedPrice === 0 ? 0.5 : 1,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (occasion && estimatedPrice > 0) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <span>💬</span>
          <span>Send to WhatsApp</span>
        </button>
      </div>
    </div>
  )
}
