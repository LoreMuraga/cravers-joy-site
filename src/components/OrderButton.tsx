'use client'

import { useOrderModal } from './OrderModalWrapper'

interface OrderButtonProps {
  children: React.ReactNode
  className?: string
  cakeId?: string
  offerDiscount?: number
}

export default function OrderButton({ children, className, cakeId, offerDiscount }: OrderButtonProps) {
  const { openOrder } = useOrderModal()

  return (
    <button className={className} onClick={() => openOrder(cakeId, offerDiscount)}>
      {children}
    </button>
  )
}
