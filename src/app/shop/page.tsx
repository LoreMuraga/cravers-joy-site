import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ShopClient from './ShopClient'

export const instant = false

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const categories = await supabase.from('categories').select('*').order('name')

  let query = supabase.from('cakes').select('*, categories(name)').eq('is_active', true)

  if (params.category) {
    const category = categories.data?.find(c => c.name === params.category)
    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  const { data: cakes } = await query.order('name')

  const allCakes = await supabase.from('cakes').select('*, categories(name)').eq('is_active', true)

  return (
    <ShopClient
      categories={categories.data || []}
      cakes={cakes || []}
      allCakes={allCakes.data || []}
      selectedCategory={params.category}
    />
  )
}
