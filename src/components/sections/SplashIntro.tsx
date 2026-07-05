import { useCallback, useEffect, useMemo, useState } from 'react'
import { type L, useLocalized } from '@/i18n/useLocalized'
import { cn } from '@/lib/utils'

const SESSION_KEY = 'petros_splash_seen'
const QUICK_DURATION_MS = 1400
const EXIT_ANIMATION_MS = 420
const PHRASE_ROTATE_MS = 2600

/** Clear the "already seen" marker so the next mount plays the full splash. */
export function resetSplashSeen() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(SESSION_KEY)
}

// Curated phrases that match Petros' vibe: pragmatic, playful, dev-culture-native.
const PHRASES: L[] = [
  {
    pt: 'CODAR, CODAR E CODAR',
    en: 'CODE, CODE, CODE',
    es: 'CODAR, CODAR Y CODAR',
  },
  {
    pt: 'MENOS HYPE, MAIS DEPLOY',
    en: 'LESS HYPE, MORE DEPLOY',
    es: 'MENOS HYPE, MÁS DEPLOY',
  },
  {
    pt: 'SEM MOCK — VAI PRA PROD',
    en: 'NO MOCK — SHIP IT',
    es: 'SIN MOCK — A PROD',
  },
  {
    pt: 'CAFÉ + TECLADO = 💜',
    en: 'COFFEE + KEYBOARD = 💜',
    es: 'CAFÉ + TECLADO = 💜',
  },
  {
    pt: 'ARQUITETURA LIMPA, HYPE ZERO',
    en: 'CLEAN ARCH, ZERO HYPE',
    es: 'ARQUITECTURA LIMPIA, HYPE CERO',
  },
  {
    pt: "IT'S ALWAYS DNS",
    en: "IT'S ALWAYS DNS",
    es: 'SIEMPRE ES EL DNS',
  },
  {
    pt: 'GIT PUSH --NÃO --FORCE',
    en: 'GIT PUSH --NO --FORCE',
    es: 'GIT PUSH --NO --FORCE',
  },
  {
    pt: 'ESCOLHIDO PELO QUE ENTREGA',
    en: 'PICKED FOR WHAT IT SHIPS',
    es: 'ELEGIDO POR LO QUE ENTREGA',
  },
]

const CTA: L = {
  pt: 'Clica aqui',
  en: 'Click here',
  es: 'Haz clic aquí',
}

type Mode = 'full' | 'quick'

function readInitialMode(): Mode {
  if (typeof window === 'undefined') return 'full'
  return window.sessionStorage.getItem(SESSION_KEY) === '1' ? 'quick' : 'full'
}

// Timestamp of the last SplashIntro mount. StrictMode double-mounts in dev
// happen within milliseconds, so a rapid remount inside this window is
// treated as a StrictMode cycle and the entrance animation is suppressed to
// avoid the visible "runs twice" symptom. Real remounts (via "Ver meu panda")
// happen way outside this window and animate normally.
let lastMountAt = -Infinity
const STRICT_MODE_WINDOW_MS = 200

export function SplashIntro({
  onDismiss,
  onExitStart,
}: {
  onDismiss: () => void
  onExitStart?: () => void
}) {
  const localize = useLocalized()
  const [mode] = useState<Mode>(readInitialMode)
  const [isExiting, setIsExiting] = useState(false)
  // Start on a random phrase so every visit opens different, then walk the list.
  const startIndex = useMemo(() => Math.floor(Math.random() * PHRASES.length), [])
  const [phraseIndex, setPhraseIndex] = useState(startIndex)
  const phrase = PHRASES[phraseIndex]
  // Detect StrictMode double-mount: if the previous mount was < 200ms ago,
  // this is the second half of a dev double-mount cycle — render in the final
  // state instantly instead of replaying the entrance animation.
  const [skipEnter] = useState(() => {
    if (typeof performance === 'undefined') return false
    const now = performance.now()
    const rapid = now - lastMountAt < STRICT_MODE_WINDOW_MS
    lastMountAt = now
    return rapid
  })

  const dismiss = useCallback(() => {
    if (isExiting) return
    setIsExiting(true)
    onExitStart?.()
    window.sessionStorage.setItem(SESSION_KEY, '1')
    window.setTimeout(onDismiss, EXIT_ANIMATION_MS)
  }, [isExiting, onDismiss, onExitStart])

  // Lock body scroll while the splash is visible.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Quick mode: auto-dismiss after a short pause; no bubble, no button.
  useEffect(() => {
    if (mode !== 'quick') return
    const id = window.setTimeout(dismiss, QUICK_DURATION_MS)
    return () => window.clearTimeout(id)
  }, [mode, dismiss])

  // Full mode: rotate the speech-bubble phrase while the user hangs around.
  useEffect(() => {
    if (mode !== 'full' || isExiting) return
    const id = window.setInterval(() => {
      setPhraseIndex((i) => (i + 1) % PHRASES.length)
    }, PHRASE_ROTATE_MS)
    return () => window.clearInterval(id)
  }, [mode, isExiting])

  // ESC as an escape hatch for keyboard users when the button is shown.
  useEffect(() => {
    if (mode !== 'full') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        dismiss()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, dismiss])

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label='Petros — intro'
      data-petros-splash-instant={skipEnter ? 'true' : undefined}
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-bg-base',
        isExiting
          ? 'animate-petros-splash-out'
          : skipEnter
            ? ''
            : 'animate-petros-splash-in',
      )}
    >
      {/* Wavy accent band behind the panda. Fills the viewport and scales to fit. */}
      <svg
        aria-hidden
        preserveAspectRatio='none'
        viewBox='0 0 1600 900'
        className='pointer-events-none absolute inset-0 size-full'
      >
        <defs>
          <linearGradient id='splash-wave' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='var(--accent)' stopOpacity='0.85' />
            <stop offset='100%' stopColor='var(--accent)' stopOpacity='0.55' />
          </linearGradient>
        </defs>
        <path
          d='M0,240 C200,120 340,340 560,240 C780,140 900,360 1120,260 C1300,180 1460,320 1600,220 L1600,700 C1420,820 1260,600 1040,700 C820,800 700,580 480,680 C260,780 140,600 0,700 Z'
          fill='url(#splash-wave)'
        />
      </svg>

      {/* Stage: panda + optional bubble + optional CTA. */}
      <div className='relative z-10 flex flex-col items-center gap-6 px-6'>
        {mode === 'full' && (
          <div
            key={phraseIndex}
            aria-live='polite'
            className='relative animate-petros-bubble-in'
          >
            <div className='rounded-md border-[0.5px] border-border bg-bg-elevated/95 px-5 py-3 font-mono text-meta tracking-meta uppercase text-text-primary shadow-[var(--shadow-card)] backdrop-blur-[8px]'>
              {localize(phrase)}
            </div>
            {/* Bubble tail pointing down to the panda. */}
            <span
              aria-hidden
              className='absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 border-b-[0.5px] border-r-[0.5px] border-border bg-bg-elevated/95'
            />
          </div>
        )}

        <img
          src='/images/pandas/panda-coding.gif'
          alt=''
          width={260}
          height={260}
          decoding='async'
          className='petros-panda size-64 animate-petros-panda-pop select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] [animation-delay:120ms]'
        />

        {mode === 'full' && (
          <div className='mt-2 animate-petros-cta-rise [animation-delay:640ms]'>
            <button
              type='button'
              onClick={dismiss}
              autoFocus
              className='animate-petros-cta-pulse rounded-sm bg-accent px-8 py-3 font-sans text-body font-medium text-[#0a0a0a] transition-transform duration-[var(--dur-micro)] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base [animation-delay:820ms]'
            >
              {localize(CTA)}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
