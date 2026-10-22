import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Testimonial } from '@/types'

const COL = 'testimonials'

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const q = query(collection(db, COL), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Testimonial))
  } catch (error) {
    console.error('[getTestimonials]', error)
    return []
  }
}
