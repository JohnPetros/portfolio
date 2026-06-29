import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BambooIndicator, Brand } from '@/components/primitives'
import { SettingsPopover } from '@/theme/SettingsPopover'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'

const NAV = [
  { id: 'home', key: 'nav.home' },
  { id: 'about', key: 'nav.about' },
  { id: 'stack', key: 'nav.stack' },
  { id: 'projects', key: 'nav.projects' },
  { id: 'trajectory', key: 'nav.trajectory' },
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
        'sticky top-0 z-40 flex items-center justify-between px-section-pad-sm py-3 transition-all duration-[var(--dur-micro)] md:px-section-pad',
        scrolled && 'border-b-[0.5px] border-border bg-bg-base/70 backdrop-blur-[14px]',
      )}
    >
      <a href='#home'>
        <Brand />
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

      <div className='flex items-center gap-3'>
        {/* TODO Phase 4: Lanyard live-status pill */}
        {/* TODO later: mobile hamburger + drawer nav */}
        <SettingsPopover />
      </div>
    </header>
  )
}
