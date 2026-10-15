'use client'

import { useState, createContext, useContext, useEffect, useCallback } from 'react'
import OrderModal from './OrderModal'

interface OrderModalContextType {
  openOrder: (cakeId?: string, offerDiscount?: number) => void
  closeOrder: () => void
}

const OrderModalContext = createContext<OrderModalContextType | undefined>(undefined)

export function useOrderModal() {
  const context = useContext(OrderModalContext)
  if (!context) {
    throw new Error('useOrderModal must be used within OrderModalWrapper')
  }
  return context
}

export default function OrderModalWrapper() {
  const [isOpen, setIsOpen] = useState(false)
  const [initialCakeId, setInitialCakeId] = useState<string | undefined>()
  const [offerDiscount, setOfferDiscount] = useState<number | undefined>()
  const [isMounted, setIsMounted] = useState(false)

  const openOrder = useCallback((cakeId?: string, discount?: number) => {
    setInitialCakeId(cakeId)
    setOfferDiscount(discount)
    setIsOpen(true)
  }, [])

  const closeOrder = useCallback(() => {
    setIsOpen(false)
    setInitialCakeId(undefined)
    setOfferDiscount(undefined)
  }, [])

  // Ensure we only run on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Make it available globally via window for onclick handlers (only once)
  useEffect(() => {
    if (!isMounted) return

    // Ensure execution strictly happens on the client browser environment
    if (typeof window !== 'undefined' && window) {
      // Cast window explicitly or use globalThis
      const globalObj = typeof window !== 'undefined' ? window : globalThis

      if (globalObj) {
        ;(globalObj as any).openOrder = openOrder
        ;(globalObj as any)._openOrderFromWrapper = openOrder
      }
    }
  }, [isMounted, openOrder])

  return (
    <OrderModalContext.Provider value={{ openOrder, closeOrder }}>
      <OrderModal isOpen={isOpen} onClose={closeOrder} initialCakeId={initialCakeId} offerDiscount={offerDiscount} />
    </OrderModalContext.Provider>
  )
}
