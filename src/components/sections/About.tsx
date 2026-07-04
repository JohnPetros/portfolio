import { Trans, useTranslation } from 'react-i18next'
import { Reveal } from '@/components/common/Reveal'
import { RichText } from '@/components/common/RichText'
import { DotHeading, Eyebrow } from '@/components/primitives'
import { BIO } from '@/data/bio'
import { useLocalized } from '@/i18n/useLocalized'
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

      <div className='mt-12 grid items-start gap-10 md:grid-cols-[40fr_60fr]'>
        <Reveal
          animation='animate-petros-fade-left'
          className='mx-auto w-full max-w-sm'
        >
          <div className='group relative aspect-[3/4] w-full'>
            <span
              aria-hidden
              className='absolute -left-2 -top-2 size-6 border-l-2 border-t-2 border-accent'
            />
            <span
              aria-hidden
              className='absolute -right-2 -top-2 size-6 border-r-2 border-t-2 border-accent'
            />
            <span
              aria-hidden
              className='absolute -bottom-2 -left-2 size-6 border-b-2 border-l-2 border-accent'
            />
            <span
              aria-hidden
              className='absolute -bottom-2 -right-2 size-6 border-b-2 border-r-2 border-accent'
            />
            <img
              src='/images/petros/ctrl-alt-del.jpeg'
              alt={t('about.photoAlt')}
              loading='lazy'
              decoding='async'
              className='size-full rounded-md object-cover object-[30%_center] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]'
            />
            <span className='absolute bottom-3 left-3 rounded-pill border-[0.5px] border-border bg-bg-elevated px-3 py-1 font-mono text-micro tracking-meta uppercase text-text-secondary'>
              {t('about.photoLabel')}
            </span>
          </div>
          <p className='mt-6 font-serif text-body-sm italic text-text-muted'>
            <RichText>{localize(BIO.photoCaption)}</RichText>
          </p>
        </Reveal>

        <Reveal animation='animate-petros-fade-right' className='flex flex-col gap-4'>
          {BIO.paragraphs.map((p) => (
            <p
              key={localize(p)}
              className='font-sans text-body leading-body text-text-secondary'
            >
              <RichText>{localize(p)}</RichText>
            </p>
          ))}
        </Reveal>
      </div>

      <div className='mt-16 flex flex-wrap items-center justify-between gap-3'>
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
