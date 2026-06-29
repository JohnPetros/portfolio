import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { About } from '@/components/sections/About'
import { Footer } from '@/components/sections/Footer'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Services } from '@/components/sections/Services'
import { Stack } from '@/components/sections/Stack'
import { Trajectory } from '@/components/sections/Trajectory'

export const Route = createFileRoute('/')({ component: App })

const PLACEHOLDERS = ['contact'] as const

function App() {
  const { t } = useTranslation()
  return (
    <>
      <a
        href='#main'
        className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-[#0a0a0a]'
      >
        {t('skipToContent')}
      </a>
      <Header />
      <main id='main'>
        <Hero />
        <Trajectory />
        <Stack />
        <Services />
        <Projects />
        <About />
        {PLACEHOLDERS.map((id) => (
          <section
            key={id}
            id={id}
            aria-labelledby={`${id}-label`}
            className='flex min-h-screen items-center justify-center px-section-pad-sm'
          >
            <h2
              id={`${id}-label`}
              className='font-mono text-eyebrow tracking-eyebrow uppercase text-text-faint'
            >
              {id}
            </h2>
          </section>
        ))}
      </main>
      <Footer />
    </>
  )
}
