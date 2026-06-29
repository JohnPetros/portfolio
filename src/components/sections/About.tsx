import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/common/Reveal'
import { RichText } from '@/components/common/RichText'
import { DotHeading, Eyebrow } from '@/components/primitives'
import { BIO } from '@/data/bio'
import { useLocalized } from '@/i18n/useLocalized'
import { NowPanel } from './NowPanel'
import { StatCounter } from './StatCounter'

function PhotoFallback() {
  return (
    <span className='flex size-full items-center justify-center rounded-md bg-gradient-to-b from-panda-from to-panda-to font-sans text-display font-medium tracking-tight text-accent'>
      JP
    </span>
  )
}

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
      </Reveal>

      <div className='mt-12 grid items-start gap-10 md:grid-cols-[60fr_40fr]'>
        <Reveal animation='animate-petros-fade-left' className='flex flex-col gap-4'>
          {BIO.paragraphs.map((p) => (
            <p
              key={localize(p)}
              className='font-sans text-body leading-body text-text-secondary'
            >
              <RichText>{localize(p)}</RichText>
            </p>
          ))}
        </Reveal>

        <Reveal
          animation='animate-petros-fade-right'
          className='mx-auto w-full max-w-[280px]'
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
            <PhotoFallback />
            <span className='absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-pill border-[0.5px] border-border bg-bg-elevated px-3 py-1 font-mono text-micro tracking-meta uppercase text-text-secondary'>
              {t('about.photoLabel')}
            </span>
          </div>
          <p className='mt-6 text-center font-serif text-body italic text-accent-italic'>
            <RichText>{localize(BIO.photoCaption)}</RichText>
          </p>
        </Reveal>
      </div>

      <div className='mt-14 grid grid-cols-2 gap-6 md:grid-cols-4'>
        {BIO.stats.map((stat) => (
          <StatCounter key={localize(stat.label)} stat={stat} />
        ))}
      </div>

      <div className='mt-12 max-w-md'>
        <NowPanel />
      </div>
    </section>
  )
}
