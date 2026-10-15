import { supabase } from '@/lib/supabase'
import TestimonialsClient from './TestimonialsClient'

export const instant = false

export default async function TestimonialsPage() {
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)

  const defaultTestimonials = [
    {
      customer_name: 'Wanjiru M.',
      location: 'Ruiru · birthday',
      review: 'I ordered the Kiondo for my mother\'s 60th and people would not stop taking photos. Nobody believed the basket was cake.'
    },
    {
      customer_name: 'Peter and Anastasia',
      location: 'Kenyatta Road · wedding',
      review: 'We needed 120 giveaway cakes and Milka delivered them sealed and ready the morning of. Not one was damaged.'
    },
    {
      customer_name: 'Grace K.',
      location: 'Juja · kids\' birthday',
      review: 'My daughter asked for unicorns and got exactly what was in her head. Milka sent a photo before delivery.'
    },
    {
      customer_name: 'Brian O.',
      location: 'Thika · office',
      review: 'We ordered branded cupcakes for the whole team. They looked sharp and were gone in ten minutes.'
    },
    {
      customer_name: 'Daniel K.',
      location: 'Kiambu · office',
      review: 'Branded cupcakes for the whole team. They looked sharp and were gone in ten minutes.'
    },
    {
      customer_name: 'Mercy W.',
      location: 'Thika · baby shower',
      review: 'The cake matched our colours exactly and Milka was easy to deal with on WhatsApp.'
    },
    {
      customer_name: 'James N.',
      location: 'Juja · birthday',
      review: 'Ordered a Matone for my wife and it arrived on time and still cold. She loved it.'
    },
    {
      customer_name: 'Faith A.',
      location: 'Nairobi CBD · anniversary',
      review: 'The Siku Yako with our date on it was the talking point of the evening.'
    }
  ]

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials

  return <TestimonialsClient testimonials={displayTestimonials} />
}
