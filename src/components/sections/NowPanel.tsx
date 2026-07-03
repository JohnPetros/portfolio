import { useTranslation } from 'react-i18next'
import { ACTIVITY_COLOR, type ActivityKind, useLanyard } from '@/hooks/useLanyard'
import { cn } from '@/lib/utils'
import { ACTIVITY_ICON } from './LanyardPill'

const ROWS: { kind: Exclude<ActivityKind, 'offline'>; key: string }[] = [
  { kind: 'coding', key: 'now.coding' },
  { kind: 'playing', key: 'now.playing' },
  { kind: 'listening', key: 'now.listening' },
]

function Equalizer() {
  return (
    <span aria-hidden className='flex h-4 items-end gap-0.5'>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className='w-0.5 rounded-pill bg-accent motion-safe:animate-petros-equalizer'
          style={{ height: '100%', animationDelay: `${i * 180}ms` }}
        />
      ))}
    </span>
  )
}

export function NowPanel() {
  const { t } = useTranslation()
  const { activity } = useLanyard()

  return (
    <div className='rounded-md border-[0.5px] border-border bg-accent-tint-06 p-5 shadow-[var(--shadow-card)]'>
      <p className='font-mono text-meta tracking-meta uppercase text-text-muted'>
        <span
          aria-hidden
          className='mr-2 inline-block size-1.5 rounded-pill bg-accent align-middle motion-safe:animate-petros-pulse'
        />
        {t('now.title')}
      </p>
      <ul aria-live='polite' className='mt-4 flex flex-col gap-3'>
        {ROWS.map((row) => {
          const isLive = activity.kind === row.kind
          const Icon = ACTIVITY_ICON[row.kind]
          return (
            <li key={row.kind} className='flex items-center justify-between gap-3'>
              <span className='flex items-center gap-2 font-sans text-body-sm text-text-secondary'>
                <Icon
                  size={16}
                  stroke={1.5}
                  aria-hidden
                  style={{ color: isLive ? ACTIVITY_COLOR[row.kind] : undefined }}
                />
                {t(row.key)}
              </span>
              <span
                className={cn(
                  'flex items-center gap-2 font-mono text-micro tracking-meta uppercase',
                  isLive ? 'text-text-secondary' : 'text-text-faint',
                )}
              >
                {row.kind === 'listening' && isLive ? <Equalizer /> : null}
                {isLive && activity.detail ? (
                  <span className='max-w-[160px] truncate normal-case'>
                    {activity.detail}
                  </span>
                ) : (
                  t('now.offline')
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
