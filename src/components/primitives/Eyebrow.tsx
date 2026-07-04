import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Eyebrow({
  bullet = false,
  className,
  children,
  ...props
}: ComponentProps<'span'> & { bullet?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 font-mono text-eyebrow text-sm tracking-eyebrow uppercase',
        bullet ? 'text-accent' : 'text-text-faint',
        className,
      )}
      {...props}
    >
      {bullet && (
        <span
          aria-hidden
          className='h-px w-8 bg-accent shadow-[0_0_5px_var(--accent-glow)]'
        />
      )}
      {children}
    </span>
  )
}
