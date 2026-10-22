/**
 * Firestore Seed Script
 *
 * Populates your Firestore database with sample portfolio data
 * so you can develop and test without entering everything manually
 * in the Firebase Console.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Prerequisites:
 *   - Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL,
 *     and FIREBASE_ADMIN_PRIVATE_KEY in your .env.local
 *   - Install tsx: npm install -D tsx
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// ─── Init ─────────────────────────────────────────────────────────────────────

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

// ─── Seed Data ────────────────────────────────────────────────────────────────

const projects = [
  {
    slug: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with real-time inventory, Stripe payments, and an admin dashboard.',
    impact: '10,000+ monthly active users, 99.9% uptime',
    tech: ['Next.js', 'TypeScript', 'Firebase', 'Stripe', 'Tailwind CSS'],
    tags: ['Next.js', 'TypeScript', 'Firebase', 'Full-Stack'],
    github: 'https://github.com/yourusername/ecommerce-platform',
    demo: 'https://ecommerce-demo.vercel.app',
    status: 'live',
    role: 'Solo project',
    featured: true,
    imagePublicId: 'portfolio/projects/ecommerce',
    order: 1,
  },
  {
    slug: 'task-management-app',
    title: 'Task Management App',
    description: 'Collaborative task manager with real-time updates, drag-and-drop boards, and team workspaces.',
    impact: 'Reduced team planning time by 35%',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'Docker'],
    tags: ['React', 'Node.js', 'PostgreSQL', 'Full-Stack'],
    github: 'https://github.com/yourusername/task-app',
    demo: 'https://tasks-demo.vercel.app',
    status: 'live',
    role: 'Led frontend',
    featured: true,
    imagePublicId: 'portfolio/projects/task-app',
    order: 2,
  },
  {
    slug: 'ai-content-generator',
    title: 'AI Content Generator',
    description: 'OpenAI-powered content generation tool with custom prompts, history, and export to multiple formats.',
    impact: '500+ GitHub stars, 200+ weekly active users',
    tech: ['Next.js', 'OpenAI API', 'Prisma', 'PostgreSQL', 'Tailwind'],
    tags: ['Next.js', 'AI/ML', 'TypeScript', 'API'],
    github: 'https://github.com/yourusername/ai-generator',
    demo: 'https://ai-gen-demo.vercel.app',
    status: 'live',
    role: 'Solo project',
    featured: true,
    imagePublicId: 'portfolio/projects/ai-generator',
    order: 3,
  },
]

const experience = [
  {
    company: 'Acme Corp',
    role: 'Senior Frontend Engineer',
    start: Timestamp.fromDate(new Date('2023-01-01')),
    end: null, // current
    location: 'Cairo, Egypt',
    arrangement: 'remote',
    type: 'full-time',
    bullets: [
      'Led migration of legacy jQuery codebase to React, reducing bundle size by 62%',
      'Built a reusable design system used by 3 product teams across 5 products',
      'Mentored 2 junior engineers and ran bi-weekly code review sessions',
      'Improved Core Web Vitals scores from 45 → 94 on the main product',
    ],
    tech: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'AWS'],
    logoPublicId: 'portfolio/logos/acme',
    order: 1,
  },
  {
    company: 'Startup XYZ',
    role: 'Full-Stack Engineer',
    start: Timestamp.fromDate(new Date('2021-03-01')),
    end: Timestamp.fromDate(new Date('2022-12-31')),
    location: 'Cairo, Egypt',
    arrangement: 'hybrid',
    type: 'full-time',
    bullets: [
      'Built and shipped 4 major features end-to-end from design to deployment',
      'Integrated Firebase Auth, Firestore, and Cloud Functions for the core product',
      'Reduced API response times by 40% through query optimization and caching',
    ],
    tech: ['React', 'Node.js', 'Firebase', 'PostgreSQL', 'Docker'],
    logoPublicId: 'portfolio/logos/startup-xyz',
    order: 2,
  },
  {
    company: 'Freelance',
    role: 'Frontend Developer',
    start: Timestamp.fromDate(new Date('2019-06-01')),
    end: Timestamp.fromDate(new Date('2021-02-28')),
    location: 'Remote',
    arrangement: 'remote',
    type: 'freelance',
    bullets: [
      'Delivered 8 client projects on time and under budget',
      'Specialized in React SPAs and WordPress-to-Next.js migrations',
    ],
    tech: ['React', 'JavaScript', 'WordPress', 'CSS', 'PHP'],
    logoPublicId: 'portfolio/logos/freelance',
    order: 3,
  },
]

const skills = [
  // Languages
  { category: 'Languages',   name: 'TypeScript',  icon: 'typescript',  level: 'expert',     order: 1 },
  { category: 'Languages',   name: 'JavaScript',  icon: 'javascript',  level: 'expert',     order: 2 },
  { category: 'Languages',   name: 'Python',      icon: 'python',      level: 'proficient', order: 3 },
  { category: 'Languages',   name: 'SQL',         icon: 'postgresql',  level: 'proficient', order: 4 },
  // Frameworks
  { category: 'Frameworks',  name: 'React',       icon: 'react',       level: 'expert',     order: 5 },
  { category: 'Frameworks',  name: 'Next.js',     icon: 'nextdotjs',   level: 'expert',     order: 6 },
  { category: 'Frameworks',  name: 'Node.js',     icon: 'nodedotjs',   level: 'expert',     order: 7 },
  { category: 'Frameworks',  name: 'Tailwind CSS',icon: 'tailwindcss', level: 'expert',     order: 8 },
  // Tools
  { category: 'Tools',       name: 'Git',         icon: 'git',         level: 'expert',     order: 9 },
  { category: 'Tools',       name: 'Docker',      icon: 'docker',      level: 'proficient', order: 10 },
  { category: 'Tools',       name: 'Figma',       icon: 'figma',       level: 'proficient', order: 11 },
  // Cloud
  { category: 'Cloud',       name: 'Firebase',    icon: 'firebase',    level: 'expert',     order: 12 },
  { category: 'Cloud',       name: 'Cloudinary',  icon: 'cloudinary',  level: 'proficient', order: 13 },
  { category: 'Cloud',       name: 'Vercel',      icon: 'vercel',      level: 'expert',     order: 14 },
  { category: 'Cloud',       name: 'AWS',         icon: 'amazonaws',   level: 'familiar',   order: 15 },
]

const testimonials = [
  {
    quote: 'One of the most technically sharp engineers I\'ve worked with. Delivered complex features with impressive attention to detail and great communication throughout.',
    name: 'Sarah Johnson',
    title: 'Engineering Manager',
    company: 'Acme Corp',
    linkedIn: 'https://linkedin.com/in/sarah-johnson',
    avatarPublicId: 'portfolio/avatars/sarah',
    order: 1,
  },
  {
    quote: 'Took full ownership of the frontend architecture from day one. The codebase he left behind is clean, well-documented, and a joy to work in.',
    name: 'Ahmed Hassan',
    title: 'CTO',
    company: 'Startup XYZ',
    linkedIn: 'https://linkedin.com/in/ahmed-hassan',
    avatarPublicId: 'portfolio/avatars/ahmed',
    order: 2,
  },
  {
    quote: 'Professional, fast, and truly understood what we needed. Delivered a beautiful product ahead of schedule. Would hire again without hesitation.',
    name: 'Maria Rodriguez',
    title: 'Product Owner',
    company: 'Client Co',
    linkedIn: 'https://linkedin.com/in/maria-rodriguez',
    avatarPublicId: 'portfolio/avatars/maria',
    order: 3,
  },
]

// ─── Seed Functions ───────────────────────────────────────────────────────────

async function seedCollection(collectionName: string, docs: object[]) {
  const col = db.collection(collectionName)
  const batch = db.batch()

  // Clear existing docs first
  const existing = await col.get()
  existing.docs.forEach((d) => batch.delete(d.ref))

  // Add new docs
  docs.forEach((doc) => {
    const ref = col.doc()
    batch.set(ref, doc)
  })

  await batch.commit()
  console.log(`✅ Seeded ${docs.length} documents to /${collectionName}`)
}

async function main() {
  console.log('🌱 Seeding Firestore...\n')
  await seedCollection('projects', projects)
  await seedCollection('experience', experience)
  await seedCollection('skills', skills)
  await seedCollection('testimonials', testimonials)
  console.log('\n✨ Seed complete!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
