import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Project } from '@/types'

const COL = 'projects'

export async function getProjects(): Promise<Project[]> {
  try {
    const q = query(collection(db, COL), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project))
  } catch (error) {
    console.error('[getProjects]', error)
    return []
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const q = query(
      collection(db, COL),
      where('featured', '==', true),
      orderBy('order', 'asc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project))
  } catch (error) {
    console.error('[getFeaturedProjects]', error)
    return []
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const q = query(collection(db, COL), where('slug', '==', slug))
    const snap = await getDocs(q)
    if (snap.empty) return null
    const d = snap.docs[0]
    return { id: d.id, ...d.data() } as Project
  } catch (error) {
    console.error('[getProjectBySlug]', error)
    return null
  }
}
