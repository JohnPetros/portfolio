import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@/components/common/Tooltip'
import { Brand, Button, StatusPill, Tag } from '@/components/primitives'
import { cvFilename, cvHref, isCvFallback } from '@/data/cv'
import { useBrtClock } from '@/hooks/useBrtClock'
import { useTheme } from '@/theme/ThemeProvider'
import { EasterEgg } from './EasterEgg'

const TECH_LINE = ['TS', 'PYTHON', 'REACT', 'NEXT.JS', 'FLUTTER', 'AWS']

function PhotoFallback() {
  return (
    <span className='flex size-full items-center justify-center rounded-md bg-gradient-to-b from-panda-from to-panda-to font-sans text-display font-medium tracking-tight text-accent'>
      JP
    </span>
  )
}

export function Hero() {
  const { t } = useTranslation()
  const clock = useBrtClock()
  const { state } = useTheme()
  const { lang } = state
  const cvFallback = isCvFallback(lang)
  const [pandaOpen, setPandaOpen] = useState(false)

  return (
    <section
      id='home'
      aria-labelledby='home-label'
      data-themed
      className='relative flex min-h-[90vh] flex-col justify-center overflow-hidden px-section-pad-sm py-section-gap md:px-section-pad'
    >
      {/* subtle accent vertical grid */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, var(--accent) 0 1px, transparent 1px 80px)',
        }}
      />

      <div className='relative mx-auto w-full max-w-6xl'>
        {/* top metadata */}
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <StatusPill pulse>{t('hero.statusPill')}</StatusPill>
          <div className='flex items-center gap-3 font-mono text-meta tracking-meta uppercase text-text-muted'>
            <span>{t('hero.location')}</span>
            <span aria-hidden>·</span>
            <span aria-live='polite' className='text-text-secondary'>
              {clock} BRT
            </span>
          </div>
        </div>

        {/* main block */}
        <div className='mt-12 grid items-center gap-10 md:grid-cols-[60fr_40fr]'>
          <div className='animate-petros-fade-up'>
            <h1 id='home-label' className='font-sans font-medium leading-tight'>
              <Brand size='text-hero' className='tracking-hero' />
            </h1>
            <p className='mt-4 font-serif text-h3 italic text-accent-italic'>
              {t('hero.byline')}
            </p>
            <div className='mt-5'>
              <StatusPill>{t('hero.role')}</StatusPill>
            </div>
            <p className='mt-6 max-w-md font-sans text-lead leading-body text-text-secondary'>
              {t('hero.description')}
            </p>
            <div className='mt-8 flex flex-wrap gap-3'>
              {/* Styled as the primary button — the Phase 1 Button renders a
                  <button>, so the CTA is an <a> that mirrors its classes (no <a>
                  nested in <button>). href/download follow the active language. */}
              {cvFallback ? (
                <Tooltip label={t('cv.fallbackTooltip')}>
                  <a
                    href={cvHref(lang)}
                    download={cvFilename(lang)}
                    className='inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-accent px-5 font-sans text-body font-medium text-[#0a0a0a] transition-all duration-[var(--dur-micro)] hover:brightness-110 max-sm:w-full'
                  >
                    {t('hero.downloadCv')}
                  </a>
                </Tooltip>
              ) : (
                <a
                  href={cvHref(lang)}
                  download={cvFilename(lang)}
                  className='inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-accent px-5 font-sans text-body font-medium text-[#0a0a0a] transition-all duration-[var(--dur-micro)] hover:brightness-110 max-sm:w-full'
                >
                  {t('hero.downloadCv')}
                </a>
              )}
              <Button
                variant='secondary'
                className='max-sm:w-full'
                onClick={() => setPandaOpen(true)}
              >
                {t('hero.seePanda')}
              </Button>
            </div>
          </div>

          {/* photo + brackets + floating tags */}
          <div className='group relative mx-auto aspect-[4/5] w-full max-w-xs'>
            <span
              aria-hidden
              className='absolute -left-2 -top-2 size-6 border-l-2 border-t-2 border-accent transition-all duration-[var(--dur-micro)] group-hover:-left-3 group-hover:-top-3'
            />
            <span
              aria-hidden
              className='absolute -right-2 -top-2 size-6 border-r-2 border-t-2 border-accent transition-all duration-[var(--dur-micro)] group-hover:-right-3 group-hover:-top-3'
            />
            <span
              aria-hidden
              className='absolute -bottom-2 -left-2 size-6 border-b-2 border-l-2 border-accent transition-all duration-[var(--dur-micro)] group-hover:-bottom-3 group-hover:-left-3'
            />
            <span
              aria-hidden
              className='absolute -bottom-2 -right-2 size-6 border-b-2 border-r-2 border-accent transition-all duration-[var(--dur-micro)] group-hover:-bottom-3 group-hover:-right-3'
            />
            <PhotoFallback />
            <Tag className='absolute -left-4 top-6 bg-bg-elevated'>
              {t('hero.tagFatec')}
            </Tag>
            <Tag className='absolute -right-4 bottom-10 bg-bg-elevated'>
              {t('hero.tagAka')}
            </Tag>
          </div>
        </div>

        {/* bottom tech line */}
        <div className='mt-14 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-meta tracking-meta uppercase text-text-faint'>
          {TECH_LINE.map((tech, i) => (
            <span key={tech} className='flex items-center gap-3'>
              {i > 0 && <span aria-hidden>·</span>}
              {tech}
            </span>
          ))}
        </div>
      </div>

      <EasterEgg open={pandaOpen} onOpenChange={setPandaOpen} />
    </section>
  )
}
