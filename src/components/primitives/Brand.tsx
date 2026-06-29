import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Brand({
  size = 'text-title',
  className,
  ...props
}: ComponentProps<'span'> & { size?: string }) {
  return (
    <span
      className={cn(
        'font-sans font-medium tracking-tight text-text-primary',
        size,
        className,
      )}
      {...props}
    >
      Petros
      <span aria-hidden className='text-accent drop-shadow-[0_0_5px_var(--accent-glow)]'>
        .
      </span>
    </span>
  )
}
