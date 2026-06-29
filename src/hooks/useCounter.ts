import { useEffect, useState } from 'react'

export function counterValue(from: number, to: number, t: number): number {
  const clamped = Math.min(1, Math.max(0, t))
  const eased = 1 - (1 - clamped) ** 3
  return from + (to - from) * eased
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useCounter(target: number, opts?: { duration?: number }): number {
  const duration = opts?.duration ?? 1200
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target)
      return
    }
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const t = (now - start) / duration
      setValue(counterValue(0, target, t))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}
