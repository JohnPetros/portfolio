import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type InputProps =
  | ({ as?: 'input' } & ComponentProps<'input'>)
  | ({ as: 'textarea' } & ComponentProps<'textarea'>)

export function Input({ as = 'input', className, ...props }: InputProps) {
  const base = cn(
    'w-full border-0 border-b-[0.5px] border-border bg-transparent py-2 font-sans text-body text-text-primary placeholder:text-text-faint focus:border-accent focus:outline-none focus:[box-shadow:0_1px_0_0_var(--accent)]',
    className,
  )
  if (as === 'textarea') {
    return <textarea className={base} {...(props as ComponentProps<'textarea'>)} />
  }
  return <input className={base} {...(props as ComponentProps<'input'>)} />
}
