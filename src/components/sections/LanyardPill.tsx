import {
  IconBrandSpotify,
  IconCode,
  IconDeviceGamepad2,
  IconMusic,
  IconRefresh,
  IconSparkles,
  type IconProps,
} from '@tabler/icons-react'
import { Popover } from 'radix-ui'
import { type ComponentType, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ACTIVITY_COLOR, type ActivityKind, useLanyard } from '@/hooks/useLanyard'
import { cn } from '@/lib/utils'

type LiveKind = Exclude<ActivityKind, 'offline'>
type Preference = LiveKind | 'auto'

const STORAGE_KEY = 'petros:lanyard-pref'

const ACTIVITY_ICON: Record<ActivityKind, ComponentType<IconProps>> = {
  coding: IconCode,
  playing: IconDeviceGamepad2,
  listening: IconMusic,
  offline: IconMusic,
}

const CHANNEL_ICON: Record<Preference, ComponentType<IconProps>> = {
  auto: IconSparkles,
  coding: IconCode,
  playing: IconDeviceGamepad2,
  listening: IconBrandSpotify,
}

const KIND_KEY: Record<ActivityKind, string> = {
  coding: 'now.coding',
  playing: 'now.playing',
  listening: 'now.listening',
  offline: 'now.offline',
}

const PREF_ORDER: Preference[] = ['auto', 'coding', 'playing', 'listening']

function isPreference(value: unknown): value is Preference {
  return (
    value === 'auto' ||
    value === 'coding' ||
    value === 'playing' ||
    value === 'listening'
  )
}

function useLanyardPreference(): [Preference, (next: Preference) => void] {
  const [pref, setPref] = useState<Preference>('auto')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isPreference(stored)) setPref(stored)
  }, [])

  const update = (next: Preference) => {
    setPref(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
  }

  return [pref, update]
}

export function LanyardPill() {
  const { t } = useTranslation()
  const { status, isRefreshing, refresh } = useLanyard()
  const [pref, setPref] = useLanyardPreference()

  const shown =
    pref === 'auto' ? status.primary : (status[pref] ?? { kind: pref })
  const Icon = ACTIVITY_ICON[shown.kind]
  const label = shown.detail ?? t(KIND_KEY[shown.kind])
  const kindLabel = t(KIND_KEY[shown.kind])

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type='button'
          aria-live='polite'
          aria-label={`${kindLabel}${shown.detail ? `: ${shown.detail}` : ''}`}
          className='inline-flex h-[36px] items-center gap-2 rounded-pill border-[0.5px] border-border bg-bg-card px-3 font-mono text-meta tracking-meta uppercase text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 data-[state=open]:border-accent-tint-20'
        >
          <span
            aria-hidden
            className='size-1.5 shrink-0 rounded-pill'
            style={{ background: ACTIVITY_COLOR[shown.kind] }}
          />
          <Icon size={14} stroke={1.5} aria-hidden />
          <span className='hidden max-w-[160px] truncate md:inline'>{label}</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align='end'
          className='z-50 w-[240px] rounded-md border-[0.5px] border-border bg-bg-elevated p-1.5 shadow-[var(--shadow-card)] focus:outline-none'
        >
          <div className='flex items-center justify-between px-2.5 pt-1.5 pb-1'>
            <p className='font-mono text-micro tracking-meta uppercase text-text-faint'>
              {t('now.channelTitle')}
            </p>
            <button
              type='button'
              onClick={refresh}
              disabled={isRefreshing}
              aria-label={t('now.refresh')}
              title={t('now.refresh')}
              className='inline-flex size-6 items-center justify-center rounded-sm text-text-muted transition-all duration-[var(--dur-micro)] hover:bg-bg-card hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40'
            >
              <IconRefresh
                size={12}
                stroke={1.8}
                aria-hidden
                className={cn(isRefreshing && 'animate-spin')}
              />
            </button>
          </div>
          <ul className='flex flex-col gap-0.5'>
            {PREF_ORDER.map((option) => {
              const isSelected = option === pref
              const OptIcon = CHANNEL_ICON[option]
              const optActivity =
                option === 'auto' ? status.primary : status[option]
              const isLive =
                option === 'auto'
                  ? status.primary.kind !== 'offline'
                  : optActivity !== null
              const color =
                option === 'auto'
                  ? 'var(--accent)'
                  : ACTIVITY_COLOR[option as LiveKind]
              const optLabel =
                option === 'auto'
                  ? t('now.channelAuto')
                  : t(KIND_KEY[option as LiveKind])
              const optDetail =
                option === 'auto'
                  ? (status.primary.detail ?? t('now.offline'))
                  : (optActivity?.detail ?? t('now.offline'))
              return (
                <li key={option}>
                  <button
                    type='button'
                    onClick={() => setPref(option)}
                    aria-pressed={isSelected}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left transition-colors duration-[var(--dur-micro)]',
                      isSelected
                        ? 'bg-bg-card text-text-primary'
                        : 'text-text-secondary hover:bg-bg-card hover:text-text-primary',
                    )}
                  >
                    <span
                      aria-hidden
                      className='flex size-7 shrink-0 items-center justify-center rounded-sm'
                      style={{
                        background: `${color}1f`,
                        color,
                        boxShadow: `inset 0 0 0 0.5px ${color}55`,
                      }}
                    >
                      <OptIcon size={14} stroke={1.6} />
                    </span>
                    <span className='min-w-0 flex-1'>
                      <span className='block font-sans text-body-sm font-medium'>
                        {optLabel}
                      </span>
                      <span className='block truncate font-mono text-micro text-text-muted'>
                        {optDetail}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        'size-1.5 shrink-0 rounded-pill transition-opacity duration-[var(--dur-micro)]',
                        isLive ? 'opacity-100' : 'opacity-30',
                      )}
                      style={{
                        background: isLive ? color : 'var(--text-faint)',
                      }}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
          <Popover.Arrow className='fill-border' />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
