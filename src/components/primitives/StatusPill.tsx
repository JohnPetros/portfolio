import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function StatusPill({
  dotColor,
  pulse = false,
  className,
  children,
  ...props
}: ComponentProps<'span'> & { dotColor?: string; pulse?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border-[0.5px] border-border bg-accent-tint-06 px-3 py-1 font-mono text-meta tracking-meta uppercase text-text-secondary',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn('size-1.5 rounded-pill', pulse && 'animate-petros-pulse')}
        style={{ background: dotColor ?? 'var(--accent)' }}
      />
      {children}
    </span>
  )
}
