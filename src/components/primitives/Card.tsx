import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Card({
  accentBar = false,
  interactive = false,
  className,
  children,
  ...props
}: ComponentProps<'div'> & { accentBar?: boolean; interactive?: boolean }) {
  return (
    <div
      data-themed
      className={cn(
        'relative rounded-md border-[0.5px] border-border bg-bg-card p-6 shadow-[var(--shadow-card)]',
        accentBar &&
          'before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-accent before:content-[""]',
        interactive &&
          'transition-all duration-[var(--dur-micro)] hover:-translate-y-0.5 hover:border-accent-tint-20',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
