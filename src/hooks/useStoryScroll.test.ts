import { describe, expect, it } from 'vitest'
import { storyIndex } from './useStoryScroll'

describe('storyIndex', () => {
  it('starts on the first story', () => {
    expect(storyIndex(0, 800, 8)).toBe(0)
  })
  it('splits the scroll distance evenly between stories', () => {
    expect(storyIndex(99, 800, 8)).toBe(0)
    expect(storyIndex(100, 800, 8)).toBe(1)
    expect(storyIndex(450, 800, 8)).toBe(4)
  })
  it('stays on the last story at the end of the track', () => {
    expect(storyIndex(800, 800, 8)).toBe(7)
    expect(storyIndex(5000, 800, 8)).toBe(7)
  })
  it('clamps a scroll position above the track', () => {
    expect(storyIndex(-200, 800, 8)).toBe(0)
  })
  it('falls back to the first story with no distance to travel', () => {
    expect(storyIndex(10, 0, 8)).toBe(0)
  })
})
