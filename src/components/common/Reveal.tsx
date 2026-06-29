import type { ComponentProps } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

export function Reveal({
  delay = 0,
  animation = 'animate-petros-fade-up',
  className,
  style,
  children,
  ...props
}: ComponentProps<'div'> & { delay?: number; animation?: string }) {
  const { ref, shown } = useReveal()
  return (
    <div
      ref={ref}
      data-reveal={shown ? 'shown' : 'pending'}
      className={cn(shown && animation, className)}
      style={{ ...style, animationDelay: shown ? `${delay}ms` : undefined }}
      {...props}
    >
      {children}
    </div>
  )
}
