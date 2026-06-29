import { useEffect, useRef, useState } from 'react'

export function useScrollSpy(
  ids: string[],
  options?: { rootMargin?: string },
): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setActive(visible.target.id), 150)
      },
      {
        rootMargin: options?.rootMargin ?? '-40% 0px -55% 0px',
        threshold: [0, 0.25, 0.5],
      },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => {
      observer.disconnect()
      if (timer.current) clearTimeout(timer.current)
    }
  }, [ids, options?.rootMargin])

  return active
}
