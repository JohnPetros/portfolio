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
        'inline-flex items-center gap-2 font-mono text-eyebrow tracking-eyebrow text-text-faint uppercase',
        className,
      )}
      {...props}
    >
      {bullet && (
        <span aria-hidden className='size-1.5 rounded-pill bg-accent shadow-glow-dot' />
      )}
      {children}
    </span>
  )
}
