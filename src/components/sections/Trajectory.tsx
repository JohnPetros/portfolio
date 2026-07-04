import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DotHeading, Eyebrow, Tag } from '@/components/primitives'
import { Reveal } from '@/components/common/Reveal'
import { RichText } from '@/components/common/RichText'
import { Tooltip } from '@/components/common/Tooltip'
import { PandaMascot } from './PandaMascot'
import { getTech } from '@/data/stack'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import {
  TRAJECTORY,
  type TrajectoryEntry,
  type TrajectoryFilter,
  filterTrajectory,
  trajectoryCounts,
} from '@/data/trajectory'
import { useLocalized } from '@/i18n/useLocalized'
import { cn } from '@/lib/utils'

const FILTERS: {
  id: TrajectoryFilter
  key: string
  countKey: keyof ReturnType<typeof trajectoryCounts>
}[] = [
  { id: 'all', key: 'trajectory.filterAll', countKey: 'all' },
  { id: 'professional', key: 'trajectory.filterProfessional', countKey: 'professional' },
  { id: 'academic', key: 'trajectory.filterAcademic', countKey: 'academic' },
]

function periodLabel(entry: TrajectoryEntry, present: string): string {
  const end = entry.period.end === 'present' ? present : entry.period.end
  return `${entry.period.start} — ${end}`
}

function EntryCard({ entry, index }: { entry: TrajectoryEntry; index: number }) {
  const { t } = useTranslation()
  const localize = useLocalized()
  const typeLabel =
    entry.type === 'academic'
      ? t('trajectory.filterAcademic')
      : t('trajectory.filterProfessional')
  return (
    <Reveal
      animation='animate-petros-rise'
      delay={Math.min(index, 4) * 90}
      className='relative pl-10'
    >
      {/* timeline node — pulses while the entry is current */}
      <span
        aria-hidden
        className={cn(
          'absolute left-[1px] top-2 size-3.5 rounded-pill border-2 border-bg-base bg-accent shadow-glow-dot',
          entry.current && 'animate-petros-pulse',
        )}
      />
      <div className='rounded-lg border-[0.5px] border-border bg-bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:-translate-y-0.5 hover:border-accent-tint-20 hover:shadow-[0_10px_28px_-12px_var(--accent-glow)]'>
        <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
          <Eyebrow className='text-text-muted'>
            {periodLabel(entry, t('trajectory.present'))}
          </Eyebrow>
          <span className='font-mono text-eyebrow tracking-eyebrow uppercase text-text-faint rounded-pill bg-accent-tint-12 px-2 py-0.5 shadow-glow-dot'>
            {typeLabel}
          </span>
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <h3 className='font-sans text-title font-medium tracking-tight text-text-primary'>
            {localize(entry.org)}
            <span
              aria-hidden
              className='text-accent drop-shadow-[0_0_5px_var(--accent-glow)]'
            >
              .
            </span>
          </h3>
          {entry.info && (
            <Tooltip label={localize(entry.info)}>
              <button
                type='button'
                aria-label={t('trajectory.infoLabel')}
                className='flex size-5 items-center justify-center rounded-pill font-serif text-body italic text-text-faint transition-colors hover:text-accent'
              >
                i
              </button>
            </Tooltip>
          )}
        </div>
        <p className='mt-1 font-sans text-body text-accent'>{localize(entry.role)}</p>
        <p className='mt-2.5 font-sans text-body leading-body text-text-secondary'>
          <RichText>{localize(entry.description)}</RichText>
        </p>
        <div className='mt-4 flex flex-wrap gap-1.5'>
          {entry.techs.map((id) => (
            <Tag key={id}>{getTech(id)?.name ?? id}</Tag>
          ))}
        </div>
      </div>
    </Reveal>
  )
}

export function Trajectory() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<TrajectoryFilter>('all')
  const { containerRef, fillRef } = useScrollProgress<HTMLDivElement>()
  const counts = useMemo(() => trajectoryCounts(TRAJECTORY), [])
  const shown = useMemo(() => filterTrajectory(TRAJECTORY, filter), [filter])

  return (
    <section
      id='trajectory'
      aria-labelledby='trajectory-label'
      data-themed
      className='mx-auto max-w-6xl px-section-pad-sm py-section-gap md:px-section-pad'
    >
      <Reveal>
        <Eyebrow bullet>{t('trajectory.eyebrow')}</Eyebrow>
        <DotHeading id='trajectory-label' className='mt-4'>
          {t('trajectory.title')}
        </DotHeading>
        <p className='mt-3 font-serif text-h3 italic text-accent-italic'>
          {t('trajectory.subtitle')}
        </p>
      </Reveal>

      <div
        role='tablist'
        aria-label={t('trajectory.eyebrow')}
        className='mt-8 flex flex-wrap gap-2'
      >
        {FILTERS.map((f) => {
          const isActive = filter === f.id
          return (
            <button
              key={f.id}
              type='button'
              role='tab'
              aria-selected={isActive}
              onClick={() => setFilter(f.id)}
              className={cn(
                'inline-flex min-h-11 items-center gap-2 rounded-pill border-[0.5px] px-4 font-mono text-meta tracking-meta uppercase transition-all duration-[var(--dur-micro)]',
                isActive
                  ? 'border-accent-tint-20 bg-accent-tint-12 text-text-primary'
                  : 'border-border text-text-muted hover:text-text-primary',
              )}
            >
              {t(f.key)}
              <span
                className={cn(
                  'font-semibold',
                  isActive ? 'text-accent' : 'text-text-faint',
                )}
              >
                {counts[f.countKey]}
              </span>
            </button>
          )
        })}
      </div>

      <div ref={containerRef} className='relative mt-10'>
        {/* timeline track */}
        <span
          aria-hidden
          className='absolute left-[7px] top-2 bottom-2 w-0.5 rounded-pill bg-border'
        />
        {/* scroll-linked progress fill */}
        <span
          ref={fillRef}
          aria-hidden
          className='absolute left-[7px] top-2 bottom-2 w-0.5 origin-top rounded-pill bg-gradient-to-b from-accent to-accent-italic shadow-glow-dot [transform:scaleY(0)] [transition:transform_150ms_ease-out] [will-change:transform]'
        />
        <PandaMascot className='absolute -left-[14px] -top-11 z-10' />
        <div className='flex flex-col gap-6'>
          {shown.map((entry, i) => (
            <EntryCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
