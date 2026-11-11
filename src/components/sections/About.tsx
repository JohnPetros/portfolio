import { Trans, useTranslation } from 'react-i18next'
import { Reveal } from '@/components/common/Reveal'
import { DotHeading, Eyebrow } from '@/components/primitives'
import { BIO } from '@/data/bio'
import { useLocalized } from '@/i18n/useLocalized'
import { AboutStory } from './AboutStory'
import { NowPanel } from './NowPanel'
import { StatCounter } from './StatCounter'

export function About() {
  const { t } = useTranslation()
  const localize = useLocalized()

  return (
    <section
      id='about'
      aria-labelledby='about-label'
      data-themed
      className='mx-auto max-w-6xl px-section-pad-sm py-section-gap md:px-section-pad'
    >
      <Reveal>
        <Eyebrow bullet>{t('about.eyebrow')}</Eyebrow>
        <DotHeading id='about-label' className='mt-4'>
          {t('about.title')}{' '}
          <span className='font-serif italic text-accent-italic'>
            {t('about.titleAccent')}
          </span>
        </DotHeading>
        <p className='mt-4 max-w-2xl font-sans text-body leading-body text-text-secondary'>
          <Trans
            i18nKey='about.subtitle'
            components={{ b: <strong className='font-semibold text-text-primary' /> }}
          />
        </p>
      </Reveal>

      <AboutStory />

      <div
        id='about-stats'
        className='mt-16 flex scroll-mt-24 flex-wrap items-center justify-between gap-3'
      >
        <Eyebrow bullet>{t('about.statsEyebrow')}</Eyebrow>
        <span className='font-mono text-eyebrow tracking-eyebrow uppercase text-text-faint'>
          {t('about.statsMeta')}
        </span>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {BIO.stats.map((stat) => (
          <StatCounter key={localize(stat.label)} stat={stat} />
        ))}
      </div>

      <div className='mt-6'>
        <NowPanel />
      </div>
    </section>
  )
}
