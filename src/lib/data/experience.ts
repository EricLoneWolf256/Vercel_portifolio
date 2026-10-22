import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Experience } from '@/types'

const COL = 'experience'

export async function getExperience(): Promise<Experience[]> {
  try {
    const q = query(collection(db, COL), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Experience))
  } catch (error) {
    console.error('[getExperience]', error)
    return []
  }
}
