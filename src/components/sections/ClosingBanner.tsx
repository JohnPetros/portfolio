import { useTranslation } from 'react-i18next'

export function ClosingBanner() {
  const { t } = useTranslation()
  return (
    <section
      data-themed
      aria-labelledby='closer-label'
      className='relative overflow-hidden pt-24 md:pt-32'
    >
      <div className='mx-auto max-w-4xl px-section-pad-sm text-center md:px-section-pad'>
        <h2
          id='closer-label'
          className='whitespace-nowrap font-sans font-medium text-h2 tracking-hero text-text-primary md:text-h1 lg:text-hero'
        >
          {t('closer.title')}{' '}
          <span className='font-serif italic text-accent-italic drop-shadow-[0_0_12px_var(--accent-glow)]'>
            {t('closer.titleAccent')}
          </span>
        </h2>
        <p className='mt-4 font-serif text-h3 italic text-text-muted'>
          {t('closer.subtitle')}
        </p>
      </div>

      <div className='relative mt-16 h-56 md:h-72'>
        {/* back hills — slightly muted */}
        <svg
          viewBox='0 0 1000 300'
          preserveAspectRatio='none'
          aria-hidden='true'
          className='absolute inset-x-0 bottom-0 h-full w-full opacity-70'
        >
          <path
            d='M0,260 Q160,240 260,240 Q380,240 460,190 Q560,120 660,150 Q780,190 880,220 Q950,235 1000,230 L1000,300 L0,300 Z'
            fill='var(--accent)'
          />
        </svg>
        {/* front hills — main silhouette */}
        <svg
          viewBox='0 0 1000 300'
          preserveAspectRatio='none'
          aria-hidden='true'
          className='absolute inset-x-0 bottom-0 h-full w-full'
        >
          <path
            d='M0,265 Q120,265 220,240 Q300,225 340,235 Q400,245 440,175 Q510,80 620,145 Q730,220 830,240 Q930,260 1000,250 L1000,300 L0,300 Z'
            fill='var(--accent)'
          />
        </svg>
        {/* dancing panda perched on the main peak */}
        <span aria-hidden className='absolute left-1/2 -translate-x-1/2'>
          <img
            src='/images/pandas/panda-dacing.gif'
            alt=''
            width={120}
            height={120}
            className='size-64 [image-rendering:pixelated]'
          />
        </span>
      </div>
    </section>
  )
}
