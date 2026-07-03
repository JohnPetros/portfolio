import {
  IconCode,
  IconDeviceGamepad2,
  IconMusic,
  type IconProps,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { ACTIVITY_COLOR, type ActivityKind, useLanyard } from '@/hooks/useLanyard'

export const ACTIVITY_ICON: Record<ActivityKind, ComponentType<IconProps>> = {
  coding: IconCode,
  playing: IconDeviceGamepad2,
  listening: IconMusic,
  offline: IconMusic,
}

const KIND_KEY: Record<ActivityKind, string> = {
  coding: 'now.coding',
  playing: 'now.playing',
  listening: 'now.listening',
  offline: 'now.offline',
}

export function LanyardPill() {
  const { t } = useTranslation()
  const { activity } = useLanyard()
  const Icon = ACTIVITY_ICON[activity.kind]
  const label = activity.detail ?? t(KIND_KEY[activity.kind])

  return (
    <a
      href='#about'
      aria-live='polite'
      aria-label={`${t(KIND_KEY[activity.kind])}${activity.detail ? `: ${activity.detail}` : ''}`}
      className='inline-flex min-h-9 items-center gap-2 rounded-pill border-[0.5px] border-border bg-bg-card px-3 font-mono text-meta tracking-meta uppercase text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20'
    >
      <span
        aria-hidden
        className='size-1.5 shrink-0 rounded-pill'
        style={{ background: ACTIVITY_COLOR[activity.kind] }}
      />
      <Icon size={14} stroke={1.5} aria-hidden />
      <span className='hidden max-w-[160px] truncate md:inline'>{label}</span>
    </a>
  )
}
