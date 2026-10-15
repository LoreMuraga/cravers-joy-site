'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Cake {
  id: string
  name: string
  price_type: string
  base_price: number
  min_quantity: number
  notice_days: number
  emoji?: string
  unit_label?: string
  category_id?: string
}

interface Category {
  id: string
  name: string
}

interface Flavor {
  id: string
  name: string
  price_per_kg: number
}

interface DeliveryArea {
  id: string
  name: string
  price: number
}

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  initialCakeId?: string
  offerDiscount?: number
}

export default function OrderModal({ isOpen, onClose, initialCakeId, offerDiscount }: OrderModalProps) {
  const [cakes, setCakes] = useState<Cake[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [flavors, setFlavors] = useState<Flavor[]>([])
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>([])

  const [selectedCake, setSelectedCake] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [size, setSize] = useState('1')
  const [flavor, setFlavor] = useState('')
  const [message, setMessage] = useState('')
  const [date, setDate] = useState('')
  const [name, setName] = useState('')
  const [deliveryType, setDeliveryType] = useState<'collection' | 'delivery'>('collection')
  const [deliveryArea, setDeliveryArea] = useState('')
  const [notes, setNotes] = useState('')
  const [estimate, setEstimate] = useState<any>(null)
  const [warning, setWarning] = useState('')
  const [offerApplied, setOfferApplied] = useState(false)

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

  useEffect(() => {
    const fetchData = async () => {
      const [cakesRes, categoriesRes, flavorsRes, areasRes] = await Promise.all([
        supabase.from('cakes').select('*').eq('is_active', true),
        supabase.from('categories').select('*'),
        supabase.from('flavors').select('*').eq('is_active', true),
        supabase.from('delivery_areas').select('*').eq('is_active', true),
      ])

      if (cakesRes.data) setCakes(cakesRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      if (flavorsRes.data) setFlavors(flavorsRes.data)

      // Use database areas if available, otherwise use default areas
      if (areasRes.data && areasRes.data.length > 0) {
        setDeliveryAreas(areasRes.data)
      } else {
        // Default delivery areas as fallback
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

      if (initialCakeId) {
        setSelectedCake(initialCakeId)
        const cake = cakesRes.data?.find(c => c.id === initialCakeId)
        if (cake) {
          setSize(cake.min_quantity.toString())
          if (cake.category_id) {
            setSelectedCategory(cake.category_id)
          }
        }
      }
    }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen, initialCakeId])

  useEffect(() => {
    calculateEstimate()
  }, [selectedCake, selectedCategory, size, flavor, date, deliveryType, deliveryArea, cakes, flavors, deliveryAreas, offerApplied])

  const calculateEstimate = () => {
    const cake = cakes.find(c => c.id === selectedCake)
    if (!cake) return

    const quantity = Math.max(parseFloat(size) || 1, cake.min_quantity)
    let base = 0
    let note = ''

    if (cake.price_type === 'kg') {
      base = cake.base_price * quantity
    } else if (cake.price_type === 'flav') {
      const flav = flavors.find(f => f.name === flavor)
      base = (flav?.price_per_kg || 1800) * quantity
    } else if (cake.price_type === 'tier') {
      const tierRate = quantity <= 3 ? 2800 : quantity <= 6 ? 2500 : quantity <= 10 ? 2300 : 2000
      base = tierRate * quantity
    } else if (cake.price_type === 'each') {
      base = cake.base_price * quantity
    } else {
      base = cake.base_price
      note = 'starting price, final quote on design'
    }

    if ((cake.price_type === 'kg' || cake.name?.toLowerCase().includes('vipande')) && quantity !== parseFloat(size)) {
      note = `${cake.min_quantity} minimum applied`
    }

    let rush = 0
    let warn = ''
    if (date) {
      const days = Math.ceil((new Date(date).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000)
      if (days < 0) {
        warn = 'Please pick a future date.'
      } else if (days < cake.notice_days) {
        rush = base * 0.15
        warn = `${cake.name} needs ${cake.notice_days} day(s) notice. A 15% rush charge applies.`
      }
    }

    setWarning(warn)

    const fee = deliveryType === 'delivery' ? (deliveryAreas.find(a => a.id === deliveryArea)?.price || 0) : 0
    let total = base + rush + fee
    let discount = 0

    // Apply offer discount if claimed
    if (offerApplied && offerDiscount) {
      discount = (base * offerDiscount) / 100
      total = total - discount
    }

    setEstimate({
      cake,
      quantity,
      base,
      rush,
      fee,
      discount,
      total,
      note,
    })
  }

  const sendWhatsApp = () => {
    if (!estimate) return

    const { cake, quantity, total, fee, discount } = estimate
    const flav = flavors.find(f => f.name === flavor)
    const area = deliveryAreas.find(a => a.id === deliveryArea)
    const category = categories.find(c => c.id === selectedCategory)

    const text = `Hi Milka! I would like to order a cake 🎂

Category: ${category?.name || '-'}
Cake: ${cake.name}
${cake.price_type === 'from' ? 'Size/tiers' : 'Quantity'}: ${quantity}
Flavour: ${flavor || '-'}
On the cake: ${message || '-'}
Date needed: ${date || '-'}
Collection/Delivery: ${deliveryType === 'delivery' ? `Delivery to ${area?.name || 'Area not selected'}` : 'Collection on Kenyatta Road'}
Delivery fee: ${fee ? `KSh ${fee.toLocaleString()}` : 'Free'}
Details: ${notes || '-'}
${offerApplied && discount > 0 ? `✨ You're in luck! ${offerDiscount}% discount applied (KSh ${Math.round(discount).toLocaleString()} off)` : ''}

Estimate: KSh ${Math.round(total).toLocaleString()}${cake.price_type === 'from' ? ' (starting)' : ''}
Name: ${name || '-'}`

    window.open(`https://wa.me/254725811787?text=${encodeURIComponent(text)}`, '_blank')
  }

  const { cake } = estimate || {}
  const showMessageField = cake && !cake.name?.toLowerCase().includes('vipande') && !cake.name?.toLowerCase().includes('garland')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-cream-surface w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gold/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-mahogany">Order a cake</h3>
          <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream-soft hover:bg-cream-border text-mahogany flex items-center justify-center transition-colors" aria-label="Close" onClick={onClose}>
            <i className="fa-solid fa-xmark text-base sm:text-lg"></i>
          </button>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="cat" className="block text-sm font-semibold text-mahogany mb-2">Category</label>
            <select
              id="cat"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-cream-border text-sm focus:outline-none focus:ring-2 focus:ring-blush/40"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ck" className="block text-sm font-semibold text-mahogany mb-2">Cake</label>
            <select
              id="ck"
              value={selectedCake}
              onChange={(e) => setSelectedCake(e.target.value)}
              className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-cream-border text-sm focus:outline-none focus:ring-2 focus:ring-blush/40"
            >
              <option value="">Select a cake</option>
              {cakes
                .filter(cake => !selectedCategory || cake.category_id === selectedCategory)
                .map((cake) => (
                <option key={cake.id} value={cake.id}>
                  {cake.name} — {cake.price_type === 'kg' ? `KSh ${cake.base_price.toLocaleString()} / kg` : cake.price_type === 'from' ? `from KSh ${cake.base_price.toLocaleString()}` : cake.price_type === 'each' ? `KSh ${cake.base_price.toLocaleString()}${cake.unit_label ? ` / ${cake.unit_label}` : ' each'}` : `KSh ${cake.base_price.toLocaleString()}`}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="sz" className="block text-sm font-semibold text-mahogany mb-2">
                {cake?.price_type === 'each' ? cake.unit_label : cake?.price_type === 'from' ? 'Tiers / size (kg)' : 'Size (kg)'}
              </label>
              <input
                id="sz"
                type="number"
                min="0.5"
                step="0.5"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-cream-border text-sm focus:outline-none focus:ring-2 focus:ring-blush/40"
              />
            </div>
            <div>
              <label htmlFor="fl" className="block text-sm font-semibold text-mahogany mb-2">Flavour</label>
              <select
                id="fl"
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
                className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-cream-border text-sm focus:outline-none focus:ring-2 focus:ring-blush/40"
              >
                {flavors.map((flavor) => (
                  <option key={flavor.id} value={flavor.name}>
                    {flavor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {showMessageField && (
            <div>
              <label htmlFor="msg" className="block text-sm font-semibold text-mahogany mb-2">Name / age / message on cake</label>
              <input
                id="msg"
                placeholder="e.g. Happy 30th Wanjiru"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-cream-border text-sm focus:outline-none focus:ring-2 focus:ring-blush/40"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="dt" className="block text-sm font-semibold text-mahogany mb-2">Date needed</label>
              <input
                id="dt"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-cream-border text-sm focus:outline-none focus:ring-2 focus:ring-blush/40"
              />
            </div>
            <div>
              <label htmlFor="nm" className="block text-sm font-semibold text-mahogany mb-2">Your name</label>
              <input
                id="nm"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-cream-border text-sm focus:outline-none focus:ring-2 focus:ring-blush/40"
              />
            </div>
          </div>
          {warning && <div className="bg-blush/10 text-blush text-sm p-3 rounded-xl">{warning}</div>}
          {offerDiscount && (
            <div className="bg-blush/10 p-3 rounded-xl border border-blush/30">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={offerApplied}
                  onChange={(e) => setOfferApplied(e.target.checked)}
                  className="w-5 h-5 text-blush rounded focus:ring-blush"
                />
                <div>
                  <span className="font-semibold text-mahogany">You're in luck! {offerDiscount}% off</span>
                  <p className="text-xs text-mahogany-soft">Apply the special offer to your order</p>
                </div>
              </label>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-mahogany mb-2">Collection or delivery</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* COLLECTION BUTTON */}
              <button
                type="button"
                onClick={() => setDeliveryType('collection')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: deliveryType === 'collection' ? '2px solid #3D231D' : '1px solid #EFE4DE',
                  /* FIX HERE: Force white text when active, dark text when inactive */
                  backgroundColor: deliveryType === 'collection' ? '#3D231D' : '#F8F1ED',
                  color: deliveryType === 'collection' ? '#FFFFFF' : '#3D231D',
                }}
              >
                Collection
              </button>

              {/* DELIVERY BUTTON */}
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: deliveryType === 'delivery' ? '2px solid #3D231D' : '1px solid #EFE4DE',
                  /* FIX HERE: Force white text when active, dark text when inactive */
                  backgroundColor: deliveryType === 'delivery' ? '#3D231D' : '#F8F1ED',
                  color: deliveryType === 'delivery' ? '#FFFFFF' : '#3D231D',
                }}
              >
                Delivery
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="ar" className="block text-sm font-semibold text-mahogany mb-2">Delivery area</label>
            <select
              id="ar"
              value={deliveryArea}
              onChange={(e) => setDeliveryArea(e.target.value)}
              disabled={deliveryType === 'collection'}
              className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-cream-border text-sm focus:outline-none focus:ring-2 focus:ring-blush/40 disabled:opacity-50"
            >
              <option value="">Select delivery area</option>
              {deliveryAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name} — KSh {area.price.toLocaleString()}
                </option>
              ))}
            </select>
            {deliveryType === 'collection' && (
              <small className="text-mahogany-soft text-xs">Enable delivery to select area</small>
            )}
          </div>
          <div>
            <label htmlFor="nt" className="block text-sm font-semibold text-mahogany mb-2">Extra details (colours, themes, characters)</label>
            <textarea
              id="nt"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-cream-border text-sm focus:outline-none focus:ring-2 focus:ring-blush/40"
            />
          </div>
          {estimate && (
            <div className="bg-cream-soft p-4 rounded-2xl border border-cream-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-mahogany">{estimate.cake.name}{estimate.cake.price_type === 'from' ? '' : ` × ${estimate.quantity}`}</span>
                <span className="font-semibold text-mahogany">KSh {Math.round(estimate.base).toLocaleString()}{estimate.cake.price_type === 'from' ? '+' : ''}</span>
              </div>
              {estimate.rush > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-blush">Rush (15%)</span>
                  <span className="font-semibold text-blush">KSh {Math.round(estimate.rush).toLocaleString()}</span>
                </div>
              )}
              {estimate.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600">You're in luck! {offerDiscount}% off</span>
                  <span className="font-semibold text-emerald-600">-KSh {Math.round(estimate.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-mahogany">Delivery ({deliveryType === 'delivery' ? deliveryAreas.find(a => a.id === deliveryArea)?.name || 'Select area' : 'Collection'})</span>
                <span className="font-semibold text-mahogany">{estimate.fee ? `KSh ${estimate.fee.toLocaleString()}` : 'Free'}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-cream-border pt-2 mt-2">
                <span className="text-mahogany">Total Estimate</span>
                <span className="text-blush">KSh {Math.round(estimate.total).toLocaleString()}{estimate.cake.price_type === 'from' ? '+' : ''}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-mahogany-soft">50% deposit to confirm</span>
                <span className="font-semibold text-mahogany">KSh {Math.round(estimate.total / 2).toLocaleString()}</span>
              </div>
              {estimate.note && <div className="text-xs text-mahogany-soft mt-2">{estimate.note}</div>}
            </div>
          )}
          <button
            onClick={sendWhatsApp}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg transition"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i> Send order on WhatsApp
          </button>
          <p className="text-xs text-center text-mahogany-soft">
            Final price is confirmed by Milka. 50% deposit holds your date.
          </p>
        </div>
      </div>
    </div>
  )
}
