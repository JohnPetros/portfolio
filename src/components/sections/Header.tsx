import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BambooIndicator, Brand } from '@/components/primitives'
import { SettingsPopover } from '@/theme/SettingsPopover'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'
import { LanyardPill } from './LanyardPill'
import { MobileNav } from './MobileNav'

const NAV = [
  { id: 'home', key: 'nav.home' },
  { id: 'trajectory', key: 'nav.trajectory' },
  { id: 'stack', key: 'nav.stack' },
  { id: 'services', key: 'nav.services' },
  { id: 'projects', key: 'nav.projects' },
  { id: 'about', key: 'nav.about' },
] as const

const IDS = NAV.map((n) => n.id)

export function Header() {
  const { t } = useTranslation()
  const active = useScrollSpy(IDS)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      data-themed
      className={cn(
        'sticky top-0 z-40 flex items-center justify-between gap-2 px-4 py-3 transition-all duration-[var(--dur-micro)] sm:px-section-pad-sm md:px-section-pad',
        scrolled && 'border-b-[0.5px] border-border bg-bg-base/70 backdrop-blur-[14px]',
      )}
    >
      <a href='#home' className='min-w-0 shrink-0'>
        <Brand withMascot />
      </a>

      <nav aria-label='Primary' className='hidden items-center gap-6 md:flex'>
        {NAV.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={active === item.id ? 'true' : undefined}
            className={cn(
              'flex flex-col items-center gap-1 font-sans text-nav text-text-secondary hover:text-text-primary',
              active === item.id && 'text-text-primary',
            )}
          >
            {t(item.key)}
            <BambooIndicator active={active === item.id} />
          </a>
        ))}
      </nav>

      <div className='flex items-center gap-1.5 sm:gap-3'>
        <LanyardPill />
        <SettingsPopover />
        <MobileNav items={NAV} active={active} />
      </div>
    </header>
  )
}
