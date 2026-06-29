import { IconInfoCircle } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DotHeading, Eyebrow, StatusPill, Tag } from '@/components/primitives'
import { Reveal } from '@/components/common/Reveal'
import { Tooltip } from '@/components/common/Tooltip'
import { PandaMascot } from './PandaMascot'
import { getTech } from '@/data/stack'
import {
  TRAJECTORY,
  type TrajectoryEntry,
  type TrajectoryFilter,
  filterTrajectory,
  trajectoryCounts,
} from '@/data/trajectory'
import { useLocalized } from '@/i18n/useLocalized'
import { cn } from '@/lib/utils'

const VISIBLE = 3

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

function EntryCard({ entry }: { entry: TrajectoryEntry }) {
  const { t } = useTranslation()
  const localize = useLocalized()
  return (
    <Reveal className='relative pl-10'>
      <span
        aria-hidden
        className='absolute left-[5px] top-1.5 size-3 rounded-pill bg-accent shadow-glow-dot'
      />
      <div className='rounded-md border-[0.5px] border-border bg-bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:-translate-y-0.5 hover:border-accent-tint-20'>
        <div className='flex flex-wrap items-center gap-3'>
          <Eyebrow>{periodLabel(entry, t('trajectory.present'))}</Eyebrow>
          {entry.current && (
            <StatusPill pulse>
              {entry.type === 'academic'
                ? t('trajectory.inProgress')
                : t('trajectory.current')}
            </StatusPill>
          )}
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <h3 className='font-sans text-title font-medium tracking-tight text-text-primary'>
            {localize(entry.org)}
          </h3>
          {entry.info && (
            <Tooltip label={localize(entry.info)}>
              <button
                type='button'
                aria-label={localize(entry.info)}
                className='flex size-5 items-center justify-center rounded-pill text-text-faint hover:text-accent'
              >
                <IconInfoCircle size={15} stroke={1.5} aria-hidden />
              </button>
            </Tooltip>
          )}
        </div>
        <p className='mt-1 font-sans text-body text-accent'>{localize(entry.role)}</p>
        <p className='mt-2 font-sans text-body leading-body text-text-secondary'>
          {localize(entry.description)}
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
  const [expanded, setExpanded] = useState(false)
  const counts = useMemo(() => trajectoryCounts(TRAJECTORY), [])
  const filtered = useMemo(() => filterTrajectory(TRAJECTORY, filter), [filter])
  const shown = expanded ? filtered : filtered.slice(0, VISIBLE)
  const hidden = filtered.length - VISIBLE

  return (
    <section
      id='trajectory'
      aria-labelledby='trajectory-label'
      data-themed
      className='mx-auto max-w-4xl px-section-pad-sm py-section-gap md:px-section-pad'
    >
      <Reveal>
        <Eyebrow bullet>{t('trajectory.eyebrow')}</Eyebrow>
        <DotHeading id='trajectory-label' className='mt-4'>
          {t('trajectory.title')}{' '}
          <span className='font-serif italic text-accent-italic'>
            {t('trajectory.titleAccent')}
          </span>
        </DotHeading>
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
              onClick={() => {
                setFilter(f.id)
                setExpanded(false)
              }}
              className={cn(
                'inline-flex min-h-11 items-center gap-2 rounded-pill border-[0.5px] px-4 font-mono text-meta tracking-meta uppercase transition-all duration-[var(--dur-micro)]',
                isActive
                  ? 'border-accent-tint-20 bg-accent-tint-12 text-text-primary'
                  : 'border-border text-text-muted hover:text-text-primary',
              )}
            >
              {t(f.key)}
              <span className='text-text-faint'>{counts[f.countKey]}</span>
            </button>
          )
        })}
      </div>

      <div className='relative mt-10'>
        <span
          aria-hidden
          className='absolute left-1.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent to-transparent'
        />
        <PandaMascot className='absolute -left-3 -top-2 z-10' />
        <div className='flex flex-col gap-6'>
          {shown.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>

      {hidden > 0 && (
        <button
          type='button'
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className='mt-8 inline-flex min-h-11 items-center rounded-pill border-[0.5px] border-border px-5 font-mono text-meta tracking-meta uppercase text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-text-primary'
        >
          {expanded
            ? t('trajectory.collapse')
            : t('trajectory.expand', { count: hidden })}
        </button>
      )}
    </section>
  )
}
