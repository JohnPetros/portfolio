import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

const ROWS: { key: string }[] = [
  { key: 'now.coding' },
  { key: 'now.playing' },
  { key: 'now.listening' },
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
  return (
    <div className='rounded-md border-[0.5px] border-border bg-accent-tint-06 p-5 shadow-[var(--shadow-card)]'>
      <p className='font-mono text-meta tracking-meta uppercase text-text-muted'>
        <span
          aria-hidden
          className='mr-2 inline-block size-1.5 rounded-pill bg-accent align-middle motion-safe:animate-petros-pulse'
        />
        {t('now.title')}
      </p>
      <ul className='mt-4 flex flex-col gap-3'>
        {ROWS.map((row) => (
          <li key={row.key} className='flex items-center justify-between gap-3'>
            <span className='font-sans text-body-sm text-text-secondary'>
              {t(row.key)}
            </span>
            <span
              className={cn(
                'flex items-center gap-2 font-mono text-micro tracking-meta uppercase text-text-faint',
              )}
            >
              {row.key === 'now.listening' ? <Equalizer /> : null}
              {t('now.offline')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
