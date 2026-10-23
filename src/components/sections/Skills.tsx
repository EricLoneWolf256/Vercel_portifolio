'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp } from '@/components/animations/FadeUp'
import { TechIcon } from '@/components/shared/TechIcon'
import { getTechIcon } from '@/lib/techIcons'
import { cn } from '@/lib/utils'
import type { SkillCategory, SkillLevel } from '@/types'

interface SkillsSectionProps {
  skillCategories: SkillCategory[]
}

const levelConfig: Record<SkillLevel, { label: string; color: string }> = {
  expert:     { label: 'Expert',     color: 'text-[var(--accent)] border-[var(--accent)]/40 bg-[var(--accent)]/10' },
  proficient: { label: 'Proficient', color: 'text-[var(--success)] border-[var(--success)]/40 bg-[var(--success)]/10' },
  familiar:   { label: 'Familiar',   color: 'text-[var(--text-tertiary)] border-[var(--border)] bg-[var(--surface-elevated)]' },
}

export function Skills({ skillCategories }: SkillsSectionProps) {
  const [activeTab, setActiveTab] = useState(skillCategories[0]?.category ?? '')

  const activeCategory = skillCategories.find((c) => c.category === activeTab)

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="section-padding border-t border-[var(--border)]"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <FadeUp>
          <p className="font-mono text-sm text-[var(--accent)]">02. skills</p>
          <h2
            id="skills-heading"
            className="mt-2 font-display text-4xl font-semibold text-[var(--text-primary)]"
          >
            Tech Stack
          </h2>
        </FadeUp>

        {/* Proficiency legend */}
        <FadeUp delay={0.1}>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {(Object.keys(levelConfig) as SkillLevel[]).map((level) => (
              <span
                key={level}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
                  levelConfig[level].color,
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {levelConfig[level].label}
              </span>
            ))}
          </div>
        </FadeUp>

        {/* Category tabs */}
        {skillCategories.length > 0 && (
          <FadeUp delay={0.15}>
            <div
              role="tablist"
              aria-label="Skill categories"
              className="mt-8 flex flex-wrap gap-2"
            >
              {skillCategories.map((cat) => (
                <button
                  key={cat.category}
                  role="tab"
                  aria-selected={activeTab === cat.category}
                  aria-controls={`skills-panel-${cat.category}`}
                  onClick={() => setActiveTab(cat.category)}
                  className={cn(
                    'rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                    activeTab === cat.category
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50 hover:text-[var(--text-primary)]',
                  )}
                >
                  {cat.category}
                </button>
              ))}
            </div>
          </FadeUp>
        )}

        {/* Skills grid */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeCategory && (
              <motion.div
                key={activeCategory.category}
                id={`skills-panel-${activeCategory.category}`}
                role="tabpanel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
              >
                {activeCategory.skills.map((skill, i) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    className={cn(
                      'flex flex-col gap-3 rounded-xl border p-4',
                      'border-[var(--border)] bg-[var(--surface)]',
                      'transition-all duration-200 hover:border-[var(--accent)]/40 hover:shadow-sm',
                    )}
                  >
                    {/* Brand logo via simple-icons, falling back to initials when unmapped */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-elevated)] text-sm font-bold font-mono text-[var(--accent)]">
                      {getTechIcon(skill.name) ? (
                        <TechIcon name={skill.name} className="h-4.5 w-4.5" />
                      ) : (
                        skill.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{skill.name}</p>
                      <span
                        className={cn(
                          'mt-1 inline-block rounded-full border px-2 py-0.5 text-xs font-medium',
                          levelConfig[skill.level].color,
                        )}
                      >
                        {levelConfig[skill.level].label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fallback when Firestore is empty (dev) */}
          {skillCategories.length === 0 && (
            <FadeUp delay={0.2}>
              <div className="rounded-xl border border-dashed border-[var(--border)] p-12 text-center">
                <p className="text-[var(--text-tertiary)]">
                  Add skills to Firestore <code className="font-mono text-xs">/skills</code> collection to see them here.
                </p>
              </div>
            </FadeUp>
          )}
        </div>
      </div>
    </section>
  )
}
