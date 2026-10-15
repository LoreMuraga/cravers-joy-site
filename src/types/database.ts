export interface Category {
  id: string
  name: string
  emoji: string | null
  image_url: string | null
  created_at: string
}

export interface Cake {
  id: string
  name: string
  category_id: string | null
  image_url: string | null
  tag: string | null
  description: string | null
  price_type: 'kg' | 'each' | 'from' | 'tier' | 'flav'
  base_price: number
  min_quantity: number
  notice_days: number
  emoji: string | null
  unit_label: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CarouselSlide {
  id: string
  title: string
  subtitle: string | null
  price_text: string | null
  image_url: string | null
  emoji: string | null
  category_name: string | null
  order_index: number
  is_active: boolean
  created_at: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  image_url: string | null
  is_offer: boolean
  discount_percentage: number | null
  custom_price_list: any
  is_active: boolean
  start_date: string | null
  end_date: string | null
  created_at: string
}

export interface Testimonial {
  id: string
  customer_name: string
  location: string | null
  review: string
  is_active: boolean
  created_at: string
}

export interface DeliveryArea {
  id: string
  name: string
  price: number
  is_active: boolean
  created_at: string
}

export interface Flavor {
  id: string
  name: string
  price_per_kg: number
  is_active: boolean
  created_at: string
}
