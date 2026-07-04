import { cn } from '@/lib/utils'

const INK = '#141414'
const FUR = '#f5f2e8'

/**
 * Panda mascot that grips the timeline's progress bar. Body stays white in
 * both modes; a subtle light halo is applied in dark mode (see
 * `.petros-panda` in animations.css) so the dark ink parts stay legible on
 * the near-black background.
 */
export function PandaMascot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'petros-panda block origin-bottom motion-safe:animate-petros-swing',
        className,
      )}
    >
      <svg
        viewBox='0 0 44 56'
        width='44'
        height='56'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
      >
        {/* arms reaching down to the bar */}
        <path
          d='M14 30 Q6 40 18 48'
          stroke={INK}
          strokeWidth='6'
          fill='none'
          strokeLinecap='round'
        />
        <path
          d='M30 30 Q38 40 26 48'
          stroke={INK}
          strokeWidth='6'
          fill='none'
          strokeLinecap='round'
        />
        {/* paws gripping the bar */}
        <circle cx='17.5' cy='48' r='4.5' fill={INK} />
        <circle cx='26.5' cy='48' r='4.5' fill={INK} />
        {/* ears */}
        <circle cx='11' cy='11' r='6' fill={INK} />
        <circle cx='33' cy='11' r='6' fill={INK} />
        {/* head (body — always white) */}
        <circle cx='22' cy='22' r='14' fill={FUR} />
        {/* eye patches */}
        <ellipse
          cx='15.5'
          cy='22'
          rx='3.6'
          ry='4.6'
          fill={INK}
          transform='rotate(-15 15.5 22)'
        />
        <ellipse
          cx='28.5'
          cy='22'
          rx='3.6'
          ry='4.6'
          fill={INK}
          transform='rotate(15 28.5 22)'
        />
        {/* eyes */}
        <circle cx='15.5' cy='22' r='1' fill={FUR} />
        <circle cx='28.5' cy='22' r='1' fill={FUR} />
        {/* nose + mouth */}
        <ellipse cx='22' cy='28' rx='1.9' ry='1.3' fill={INK} />
        <path
          d='M19.8 30 Q22 32 24.2 30'
          stroke={INK}
          strokeWidth='0.9'
          fill='none'
          strokeLinecap='round'
        />
      </svg>
    </span>
  )
}
