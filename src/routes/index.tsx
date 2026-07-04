import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { About } from '@/components/sections/About'
import { ClosingBanner } from '@/components/sections/ClosingBanner'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Services } from '@/components/sections/Services'
import { resetSplashSeen, SplashIntro } from '@/components/sections/SplashIntro'
import { Stack } from '@/components/sections/Stack'
import { Trajectory } from '@/components/sections/Trajectory'
import { logConsoleGreeting } from '@/lib/consoleGreeting'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { t, i18n } = useTranslation()
  const [showSplash, setShowSplash] = useState(true)
  const [heroActive, setHeroActive] = useState(false)

  useEffect(() => {
    logConsoleGreeting(i18n.language)
  }, [i18n.language])
  const replaySplash = () => {
    resetSplashSeen()
    setHeroActive(false)
    setShowSplash(true)
  }
  return (
    <>
      {showSplash && (
        <SplashIntro
          onExitStart={() => setHeroActive(true)}
          onDismiss={() => setShowSplash(false)}
        />
      )}
      <a
        href='#main'
        className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-[#0a0a0a]'
      >
        {t('skipToContent')}
      </a>
      <Header />
      <main id='main'>
        <Hero active={heroActive} onSeePanda={replaySplash} />
        <Trajectory />
        <Stack />
        <Services />
        <Projects />
        <About />
        <Contact />
        <ClosingBanner />
      </main>
      <Footer />
    </>
  )
}
