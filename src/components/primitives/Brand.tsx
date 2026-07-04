import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

function PandaBadge() {
  return (
    <span
      aria-hidden
      className='inline-flex size-7 items-center justify-center rounded-full bg-[var(--panda-from)] ring-1 ring-[var(--panda-to)]'
    >
      🐼
    </span>
  )
}

export function Brand({
  size = 'text-title',
  withMascot = false,
  className,
  ...props
}: ComponentProps<'span'> & { size?: string; withMascot?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-sans font-medium tracking-tight text-text-primary',
        size,
        className,
      )}
      {...props}
    >
      {withMascot && <PandaBadge />}
      <span>
        Petros
        <span
          aria-hidden
          className='text-accent drop-shadow-[0_0_5px_var(--accent-glow)]'
        >
          .
        </span>
      </span>
    </span>
  )
}
