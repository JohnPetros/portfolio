import { useCallback, useEffect, useRef, useState } from 'react'

const PINNED_QUERY = '(min-width: 48rem) and (prefers-reduced-motion: no-preference)'
// The first story waits until the track is well inside the viewport, so its
// entrance plays where the visitor can see it.
const ENTER_AT = 0.6

type Direction = 'down' | 'up'
type Story = { active: number; direction: Direction }

export function storyIndex(scrolled: number, distance: number, count: number): number {
  if (distance <= 0) return 0
  const progress = Math.max(0, Math.min(0.9999, scrolled / distance))
  return Math.floor(progress * count)
}

/**
 * Drives the pinned About story: maps the page scroll inside the track to the
 * active milestone. Where the story is stacked instead (phones, reduced
 * motion), it only marks each item as seen so its entrance can play.
 */
export function useStoryScroll(count: number) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [story, setStory] = useState<Story>({ active: -1, direction: 'down' })
  const [pinned, setPinned] = useState<boolean | null>(null)

  useEffect(() => {
    const query = matchMedia(PINNED_QUERY)
    const sync = () => setPinned(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    const stage = track?.querySelector<HTMLElement>('[data-story-stage]')
    if (!track || !stage || !pinned) return

    let raf = 0
    const update = () => {
      raf = 0
      const trackRect = track.getBoundingClientRect()
      const stageRect = stage.getBoundingClientRect()
      const next =
        trackRect.top > window.innerHeight * ENTER_AT
          ? -1
          : storyIndex(stageRect.top - trackRect.top, trackRect.height - stageRect.height, count)
      setStory((prev) =>
        prev.active === next
          ? prev
          : { active: next, direction: next > prev.active ? 'down' : 'up' },
      )
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
  }, [count, pinned])

  useEffect(() => {
    const track = trackRef.current
    if (!track || pinned !== false) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-seen', 'true')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.2 },
    )
    for (const item of track.querySelectorAll('[data-story]')) observer.observe(item)
    return () => observer.disconnect()
  }, [pinned])

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current
      const stage = track?.querySelector<HTMLElement>('[data-story-stage]')
      if (!track || !stage) return
      const distance = track.offsetHeight - stage.offsetHeight
      const stickyTop = Number.parseFloat(getComputedStyle(stage).top) || 0
      const trackTop = track.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: trackTop - stickyTop + ((index + 0.5) / count) * distance })
    },
    [count],
  )

  return { trackRef, story, ready: pinned !== null, goTo }
}
