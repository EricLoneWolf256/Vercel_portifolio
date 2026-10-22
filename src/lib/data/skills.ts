import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Skill, SkillCategory } from '@/types'

const COL = 'skills'

export async function getSkills(): Promise<SkillCategory[]> {
  try {
    const q = query(collection(db, COL), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    const skills = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Skill))

    // Group by category, preserving order
    const map = new Map<string, Skill[]>()
    for (const skill of skills) {
      const existing = map.get(skill.category) ?? []
      map.set(skill.category, [...existing, skill])
    }

    return Array.from(map.entries()).map(([category, skills]) => ({ category, skills }))
  } catch (error) {
    console.error('[getSkills]', error)
    return []
  }
}
