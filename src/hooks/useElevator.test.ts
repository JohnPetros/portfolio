import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useElevator } from './useElevator'

class FakeAudio {
  static created: FakeAudio[] = []
  loop = false
  volume = 1
  muted = false
  currentTime = 0
  play = vi.fn(() => Promise.resolve())
  pause = vi.fn()
  constructor(public src: string) {
    FakeAudio.created.push(this)
  }
}

const audio = (name: string) => {
  const found = FakeAudio.created.find((a) => a.src.includes(name))
  if (!found) throw new Error(`no audio ${name}`)
  return found
}

let frames: FrameRequestCallback[] = []
const runFrame = (now: number) => {
  const pending = frames
  frames = []
  act(() => {
    for (const cb of pending) cb(now)
  })
}

const setScrollY = (value: number) =>
  Object.defineProperty(window, 'scrollY', { value, configurable: true, writable: true })

const scrollEvent = () => act(() => void window.dispatchEvent(new Event('scroll')))

const flushPromises = () => act(async () => void (await Promise.resolve()))

function mockReducedMotion(matches: boolean) {
  vi.stubGlobal('matchMedia', () => ({ matches }))
}

beforeEach(() => {
  FakeAudio.created = []
  frames = []
  vi.stubGlobal('Audio', FakeAudio)
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(cb))
  vi.stubGlobal('cancelAnimationFrame', () => {
    frames = []
  })
  mockReducedMotion(false)
  Object.defineProperty(window, 'innerWidth', { value: 1280, configurable: true })
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 6000,
    configurable: true,
  })
  setScrollY(480)
  window.scrollTo = vi.fn((options: ScrollToOptions) =>
    setScrollY(options.top ?? 0),
  ) as never
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useElevator', () => {
  it('shows once the page has scrolled and hides at the top', () => {
    setScrollY(0)
    const { result } = renderHook(() => useElevator())
    expect(result.current.visible).toBe(false)
    setScrollY(480)
    scrollEvent()
    expect(result.current.visible).toBe(true)
  })

  it('rides up with music, then stops the music and chimes at the top', async () => {
    const { result } = renderHook(() => useElevator())
    act(() => result.current.start())
    await flushPromises()

    expect(result.current.visible).toBe(false)
    expect(audio('music').loop).toBe(true)
    expect(audio('music').play).toHaveBeenCalledTimes(1)
    const chimePlaysBeforeArrival = audio('chime').play.mock.calls.length

    runFrame(0)
    runFrame(1000)
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 240, behavior: 'instant' })
    expect(audio('music').pause).not.toHaveBeenCalled()

    runFrame(2000)
    expect(window.scrollY).toBe(0)
    expect(audio('music').pause).toHaveBeenCalled()
    expect(audio('music').currentTime).toBe(0)
    expect(audio('chime').play.mock.calls.length).toBe(chimePlaysBeforeArrival + 1)
    expect(frames).toHaveLength(0)
  })

  it('finishes a very long ride in 20 seconds', () => {
    setScrollY(9600)
    const { result } = renderHook(() => useElevator())
    act(() => result.current.start())

    runFrame(0)
    runFrame(19000)
    expect(window.scrollY).toBe(480)

    runFrame(20000)
    expect(window.scrollY).toBe(0)
    expect(frames).toHaveLength(0)
  })

  it('stays hidden during the ride even when scrolled far down', () => {
    const { result } = renderHook(() => useElevator())
    act(() => result.current.start())
    scrollEvent()
    expect(result.current.visible).toBe(false)
  })

  it.each([
    'wheel',
    'touchstart',
    'pointerdown',
    'keydown',
  ])('stops silently when the visitor interrupts with %s', async (type) => {
    const { result } = renderHook(() => useElevator())
    act(() => result.current.start())
    await flushPromises()
    const chimePlays = audio('chime').play.mock.calls.length
    runFrame(0)

    act(() => void window.dispatchEvent(new Event(type)))

    expect(frames).toHaveLength(0)
    expect(audio('music').pause).toHaveBeenCalled()
    expect(audio('chime').play.mock.calls.length).toBe(chimePlays)
    expect(result.current.visible).toBe(true)
  })

  it('jumps to the top with no audio for reduced motion', () => {
    mockReducedMotion(true)
    const { result } = renderHook(() => useElevator())
    act(() => result.current.start())
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
    expect(FakeAudio.created).toHaveLength(0)
    expect(frames).toHaveLength(0)
  })

  it('stops the ride on unmount', async () => {
    const { result, unmount } = renderHook(() => useElevator())
    act(() => result.current.start())
    await flushPromises()
    unmount()
    expect(frames).toHaveLength(0)
    expect(audio('music').pause).toHaveBeenCalled()
  })
})
