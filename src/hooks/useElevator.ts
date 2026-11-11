import { useCallback, useEffect, useRef, useState } from 'react'
import { elevatorSpeed, nextElevatorY, shouldShowElevator } from '@/lib/elevator'

const MUSIC_SRC = '/audio/elevator-music.mp3'
const CHIME_SRC = '/audio/elevator-chime.mp3'
const CHIME_VOLUME = 0.5
const INTERRUPT_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const

// The site sets `scroll-behavior: smooth`, which would animate every step.
const scrollInstantly = (top: number) => window.scrollTo({ top, behavior: 'instant' })

// Browsers may reject play(), e.g. when audio is blocked. The ride works silently.
const play = (audio: HTMLAudioElement) => audio.play().catch(() => {})

// iOS Safari only plays audio started from a tap, and the chime plays much later.
function unlockForLaterPlayback(audio: HTMLAudioElement) {
  audio.muted = true
  play(audio).finally(() => {
    audio.pause()
    audio.currentTime = 0
    audio.muted = false
  })
}

function readShouldShow() {
  return shouldShowElevator({
    scrollY: window.scrollY,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    documentHeight: document.documentElement.scrollHeight,
  })
}

/**
 * Back-to-top "elevator": the page climbs slowly to looping music and a chime
 * plays on arrival. Any visitor input stops the ride; reduced motion jumps to
 * the top with no audio.
 */
export function useElevator() {
  const [visible, setVisible] = useState(false)
  const stopRideRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const update = () => {
      if (!stopRideRef.current) setVisible(readShouldShow())
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      stopRideRef.current?.()
    }
  }, [])

  const start = useCallback(() => {
    if (stopRideRef.current) return

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scrollInstantly(0)
      return
    }

    const music = new Audio(MUSIC_SRC)
    const chime = new Audio(CHIME_SRC)
    music.loop = true
    chime.volume = CHIME_VOLUME
    play(music)
    unlockForLaterPlayback(chime)

    let raf = 0
    let y = window.scrollY
    const speed = elevatorSpeed(y)
    let lastFrame: number | null = null

    const stopRide = () => {
      cancelAnimationFrame(raf)
      for (const type of INTERRUPT_EVENTS) window.removeEventListener(type, interrupt)
      music.pause()
      music.currentTime = 0
      stopRideRef.current = null
    }

    const interrupt = () => {
      stopRide()
      setVisible(readShouldShow())
    }

    const frame = (now: number) => {
      y = nextElevatorY(y, lastFrame === null ? 0 : now - lastFrame, speed)
      lastFrame = now
      scrollInstantly(y)
      if (y > 0) {
        raf = requestAnimationFrame(frame)
        return
      }
      stopRide()
      play(chime)
    }

    for (const type of INTERRUPT_EVENTS) {
      window.addEventListener(type, interrupt, { passive: true })
    }
    stopRideRef.current = stopRide
    setVisible(false)
    raf = requestAnimationFrame(frame)
  }, [])

  return { visible, start }
}
