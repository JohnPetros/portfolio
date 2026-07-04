import {
  IconBrandSpotify,
  IconCode,
  IconDeviceGamepad2,
  type IconProps,
  IconRefresh,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { ACTIVITY_COLOR, type ActivityKind, useLanyard } from '@/hooks/useLanyard'
import { cn } from '@/lib/utils'

const ROW_ICON: Record<Exclude<ActivityKind, 'offline'>, ComponentType<IconProps>> = {
  coding: IconCode,
  playing: IconDeviceGamepad2,
  listening: IconBrandSpotify,
}

const ROWS: { kind: Exclude<ActivityKind, 'offline'>; key: string }[] = [
  { kind: 'coding', key: 'now.coding' },
  { kind: 'playing', key: 'now.playing' },
  { kind: 'listening', key: 'now.listening' },
]

function Equalizer({ color }: { color: string }) {
  return (
    <span aria-hidden className='ml-2 inline-flex h-3.5 items-end gap-[3px]'>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className='w-[3px] origin-bottom rounded-pill motion-safe:animate-petros-equalizer'
          style={{
            background: color,
            height: '100%',
            animationDelay: `${i * 180}ms`,
          }}
        />
      ))}
    </span>
  )
}

export function NowPanel() {
  const { t } = useTranslation()
  const { status, isRefreshing, refresh } = useLanyard()

  return (
    <div
      data-themed
      className='rounded-lg border-[0.5px] border-border bg-bg-card p-6 shadow-[var(--shadow-card)]'
    >
      <div className='flex items-center justify-between gap-3'>
        <p className='inline-flex items-center gap-2 font-mono text-eyebrow tracking-eyebrow uppercase text-accent'>
          <span
            aria-hidden
            className='size-1.5 rounded-pill bg-accent shadow-glow-dot motion-safe:animate-petros-pulse'
          />
          {t('now.title')}
          <span className='text-text-faint'>· {t('now.realTime')}</span>
        </p>
        <button
          type='button'
          onClick={refresh}
          disabled={isRefreshing}
          aria-label={t('now.refresh')}
          title={t('now.refresh')}
          className='inline-flex size-7 items-center justify-center rounded-pill border-[0.5px] border-border text-text-muted transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40'
        >
          <IconRefresh
            size={12}
            stroke={1.6}
            aria-hidden
            className={cn(isRefreshing && 'animate-spin')}
          />
        </button>
      </div>

      <ul
        aria-live='polite'
        className='mt-6 grid grid-cols-1 gap-5 md:grid-cols-3'
      >
        {ROWS.map((row) => {
          const rowActivity = status[row.kind]
          const isLive = rowActivity !== null
          const Icon = ROW_ICON[row.kind]
          const color = ACTIVITY_COLOR[row.kind]
          return (
            <li key={row.kind} className='flex items-center gap-3'>
              <span
                aria-hidden
                className='flex size-12 shrink-0 items-center justify-center rounded-lg'
                style={{
                  background: `${color}1f`,
                  color,
                  boxShadow: `inset 0 0 0 0.5px ${color}55`,
                }}
              >
                <Icon size={22} stroke={1.6} />
              </span>
              <div className='min-w-0 flex-1'>
                <p
                  className='inline-flex items-center font-mono text-eyebrow tracking-eyebrow uppercase'
                  style={{ color }}
                >
                  {t(row.key)}
                  {row.kind === 'listening' && isLive ? <Equalizer color={color} /> : null}
                </p>
                <p className='truncate font-sans text-body font-semibold text-text-primary'>
                  {isLive && rowActivity.detail ? rowActivity.detail : t('now.offline')}
                </p>
                {isLive && rowActivity.subtitle && (
                  <p className='truncate font-mono text-meta text-text-muted'>
                    {rowActivity.subtitle}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
