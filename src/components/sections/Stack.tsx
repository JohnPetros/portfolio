import { useTranslation } from 'react-i18next'
import { DotHeading, Eyebrow } from '@/components/primitives'
import { Reveal } from '@/components/common/Reveal'
import { Tooltip } from '@/components/common/Tooltip'
import {
  type Category,
  type Tech,
  TECHS,
  groupByCategory,
  techIconPath,
} from '@/data/stack'
import { cn } from '@/lib/utils'

const CATEGORY_KEY: Record<Category, string> = {
  frontend: 'stack.categoryFrontend',
  backend: 'stack.categoryBackend',
  mobile: 'stack.categoryMobile',
  databases: 'stack.categoryDatabases',
  cloud: 'stack.categoryCloud',
  tests: 'stack.categoryTests',
}

function TechItem({ tech, docsLabel }: { tech: Tech; docsLabel: string }) {
  const iconPath = techIconPath(tech.id)
  return (
    <Tooltip label={docsLabel}>
      <a
        href={tech.docsUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='group flex min-h-11 items-center gap-3 rounded-md border-[0.5px] border-border bg-bg-card px-3 py-2 shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:-translate-y-0.5 hover:border-accent-tint-20'
      >
        {iconPath ? (
          <img
            aria-hidden
            src={iconPath}
            alt=''
            loading='lazy'
            decoding='async'
            className='size-20 shrink-0 object-contain transition-transform duration-[var(--dur-micro)] group-hover:scale-105'
          />
        ) : (
          <span
            aria-hidden
            className='flex size-8 shrink-0 items-center justify-center rounded-sm font-mono text-body-sm font-medium transition-transform duration-[var(--dur-micro)] group-hover:scale-105'
            style={{ background: `${tech.brandColor}14`, color: tech.brandColor }}
          >
            {tech.monogram}
          </span>
        )}
        <span className='truncate font-sans text-body-sm text-text-primary'>
          {tech.name}
        </span>
      </a>
    </Tooltip>
  )
}

export function Stack() {
  const { t } = useTranslation()
  const groups = groupByCategory(TECHS)

  return (
    <section
      id='stack'
      aria-labelledby='stack-label'
      data-themed
      className='mx-auto max-w-6xl px-section-pad-sm py-section-gap md:px-section-pad'
    >
      <Reveal>
        <Eyebrow bullet>{t('stack.eyebrow')}</Eyebrow>
        <DotHeading id='stack-label' className='mt-4'>
          {t('stack.title')}{' '}
          <span className='font-serif italic text-accent-italic'>
            {t('stack.titleAccent')}
          </span>
        </DotHeading>
        <p className='mt-4 max-w-2xl font-sans text-body leading-body text-text-secondary'>
          {t('stack.subtitle')}
        </p>
      </Reveal>

      <div className='mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3'>
        {groups.map((group, gi) => (
          <Reveal key={group.category} delay={gi * 80}>
            <h3 className='font-mono text-meta tracking-meta uppercase text-text-muted'>
              {t(CATEGORY_KEY[group.category])}
            </h3>
            <div className='mt-4 flex flex-col gap-2'>
              {group.techs.map((tech) => (
                <TechItem key={tech.id} tech={tech} docsLabel={t('stack.docs')} />
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <div
        className={cn(
          'mt-12 flex flex-wrap items-center justify-between gap-2 border-t-[0.5px] border-border pt-4',
          'font-mono text-meta tracking-meta uppercase text-text-faint',
        )}
      >
        <span>{t('stack.footerCount')}</span>
        <span className='text-accent'>{t('stack.footerUpdated')}</span>
      </div>
    </section>
  )
}
