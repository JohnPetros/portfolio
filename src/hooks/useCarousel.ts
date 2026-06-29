import { useCallback, useEffect, useRef, useState } from 'react'

export function nextIndex(i: number, length: number): number {
  if (length <= 1) return 0
  return (i + 1) % length
}

export function prevIndex(i: number, length: number): number {
  if (length <= 1) return 0
  return (i - 1 + length) % length
}

export function useCarousel(
  length: number,
  opts?: { intervalMs?: number; auto?: boolean },
) {
  const intervalMs = opts?.intervalMs ?? 6000
  const auto = opts?.auto ?? true
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // Clamp when the source length shrinks (e.g. switching projects).
  useEffect(() => {
    setIndex((i) => (i >= length ? 0 : i))
  }, [length])

  const next = useCallback(() => setIndex((i) => nextIndex(i, length)), [length])
  const prev = useCallback(() => setIndex((i) => prevIndex(i, length)), [length])
  const goTo = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(i, length - 1))),
    [length],
  )
  const pause = useCallback(() => setPaused(true), [])
  const resume = useCallback(() => setPaused(false), [])

  const nextRef = useRef(next)
  nextRef.current = next

  useEffect(() => {
    if (!auto || paused || length <= 1) return
    const id = setInterval(() => nextRef.current(), intervalMs)
    return () => clearInterval(id)
  }, [auto, paused, length, intervalMs])

  return { index, next, prev, goTo, paused, pause, resume }
}
