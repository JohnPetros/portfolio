import { cn } from '@/lib/utils'

export function PandaMascot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-9 origin-top items-center justify-center rounded-pill bg-gradient-to-b from-panda-from to-panda-to text-[18px] motion-safe:animate-petros-swing',
        className,
      )}
    >
      🐼
    </span>
  )
}
