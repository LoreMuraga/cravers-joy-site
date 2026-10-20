import { supabase } from '@/lib/supabase'
import ProductClient from './ProductClient'

export const instant = false

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: cake } = await supabase
    .from('cakes')
    .select('*, categories(name)')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  const { data: flavors } = await supabase
    .from('cake_flavors')
    .select('*')
    .eq('cake_id', id)
    .eq('is_active', true)
    .order('flavor_name')

  if (!cake) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Cake not found</h1>
        <a href="/shop" style={{ color: '#E63967', textDecoration: 'none' }}>
          Return to Shop
        </a>
      </div>
    )
  }

  return <ProductClient cake={cake} flavors={flavors || []} />
}
