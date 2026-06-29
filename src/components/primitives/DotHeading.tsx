import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function DotHeading({ className, children, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'font-sans font-medium text-h1 tracking-h1 text-text-primary',
        className,
      )}
      {...props}
    >
      {children}
      <span aria-hidden className='text-accent drop-shadow-[0_0_5px_var(--accent-glow)]'>
        .
      </span>
    </h2>
  )
}
