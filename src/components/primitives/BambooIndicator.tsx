import { cn } from '@/lib/utils'

const HEIGHTS = [5, 7, 4]

export function BambooIndicator({
  active,
  orientation = 'horizontal',
  className,
}: {
  active: boolean
  orientation?: 'horizontal' | 'vertical'
  className?: string
}) {
  if (!active) return <span className={cn('block', className)} aria-hidden />
  return (
    <span
      aria-hidden
      className={cn(
        'flex items-end gap-0.5',
        orientation === 'vertical' && 'rotate-90',
        className,
      )}
    >
      {HEIGHTS.map((h, i) => (
        <span
          key={h}
          className={cn(
            'w-0.5 rounded-pill bg-accent shadow-glow-dot animate-petros-stalk-in',
            i === 1 && 'animate-petros-pulse',
          )}
          style={{ height: `${h}px`, animationDelay: `${i * 200}ms` }}
        />
      ))}
    </span>
  )
}
