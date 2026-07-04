import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Tag({ className, children, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border-[0.5px] border-border px-2 py-0.5 font-mono text-micro tracking-meta uppercase text-text-muted text-xs',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
