import { useEffect, useRef } from 'react'

/**
 * Scroll-linked progress for a section timeline. Drives `fillRef`'s vertical
 * scale (0→1) from the container's position in the viewport, written straight
 * to the DOM inside a rAF (no React re-render per scroll frame) so the fill
 * stays fluid on desktop and mobile. Honors `prefers-reduced-motion` by
 * snapping to fully filled.
 */
export function useScrollProgress<
  C extends HTMLElement = HTMLDivElement,
  F extends HTMLElement = HTMLSpanElement,
>() {
  const containerRef = useRef<C | null>(null)
  const fillRef = useRef<F | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const fill = fillRef.current
    if (!container || !fill) return

    const reduce =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      fill.style.transform = 'scaleY(1)'
      return
    }

    let raf = 0
    const update = () => {
      raf = 0
      const rect = container.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      // Fill grows as the timeline travels through the viewport middle.
      const progress = (vh * 0.5 - rect.top) / Math.max(rect.height, 1)
      const clamped = Math.max(0, Math.min(1, progress))
      fill.style.transform = `scaleY(${clamped})`
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return { containerRef, fillRef }
}
