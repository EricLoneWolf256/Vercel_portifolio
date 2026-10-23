import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ResumeFAB } from '@/components/shared/ResumeFAB'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Projects } from '@/components/sections/Projects'
import { Experience } from '@/components/sections/Experience'
import { Testimonials } from '@/components/sections/Testimonials'
import { Contact } from '@/components/sections/Contact'
import { getProjects } from '@/lib/data/projects'
import { getExperience } from '@/lib/data/experience'
import { getSkills } from '@/lib/data/skills'
import { getTestimonials } from '@/lib/data/testimonials'

// Revalidate page data every hour
export const revalidate = 3600

export default async function HomePage() {
  // Fetch all data in parallel — server-side, no client waterfalls
  const [projects, experience, skillCategories, testimonials] = await Promise.all([
    getProjects(),
    getExperience(),
    getSkills(),
    getTestimonials(),
  ])

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills skillCategories={skillCategories} />
        <Projects projects={projects} />
        <Experience experience={experience} />
        <Testimonials testimonials={testimonials} />
        <Contact />
      </main>
      <Footer />
      <ResumeFAB />
    </>
  )
}
