import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ComponentProps<'button'> & { variant?: 'primary' | 'secondary' }) {
  return (
    <button
      type='button'
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 font-sans text-body font-medium transition-all duration-[var(--dur-micro)]',
        variant === 'primary' && 'bg-accent text-[#0a0a0a] hover:brightness-110',
        variant === 'secondary' &&
          'border-[0.5px] border-border bg-transparent text-text-primary hover:border-accent-tint-20',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
