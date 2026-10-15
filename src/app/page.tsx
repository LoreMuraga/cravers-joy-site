import { supabase } from '@/lib/supabase'
import HomeClient from './HomeClient'

export const instant = false

export default async function Home() {
  const [categories, cakes, carouselSlides, banners, testimonials] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('cakes').select('*, categories(name)').eq('is_active', true).limit(8),
    supabase.from('carousel_slides').select('*').eq('is_active', true).order('order_index'),
    supabase.from('banners').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1),
    supabase.from('testimonials').select('*').eq('is_active', true).limit(4),
  ])

  const activeBanners = banners.data?.filter(b => {
    if (!b.start_date && !b.end_date) return true
    const now = new Date()
    const start = b.start_date ? new Date(b.start_date) : new Date('2000-01-01')
    const end = b.end_date ? new Date(b.end_date) : new Date('2100-01-01')
    return now >= start && now <= end
  }) || []

  const featuredCakes = cakes.data?.filter(c =>
    ['dhahabu', 'bento', 'cupc', 'ndoto', 'siku', 'matone', 'upinde', 'bustani'].includes(c.name?.toLowerCase().replace(/\s/g, ''))
  ) || []

  return (
    <HomeClient
      categories={categories.data || []}
      cakes={cakes.data || []}
      carouselSlides={carouselSlides.data || []}
      banners={activeBanners}
      testimonials={testimonials.data || []}
      featuredCakes={featuredCakes}
    />
  )
}
