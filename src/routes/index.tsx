import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Header } from '@/components/sections/Header'

export const Route = createFileRoute('/')({ component: App })

const SECTIONS = ['home', 'about', 'stack', 'projects', 'trajectory'] as const

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
        {SECTIONS.map((id) => (
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
    </>
  )
}
