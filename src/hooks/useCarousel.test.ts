import { describe, expect, it } from 'vitest'
import { nextIndex, prevIndex } from './useCarousel'

describe('nextIndex', () => {
  it('advances within range', () => {
    expect(nextIndex(0, 3)).toBe(1)
    expect(nextIndex(1, 3)).toBe(2)
  })
  it('wraps to 0 after the last', () => {
    expect(nextIndex(2, 3)).toBe(0)
  })
  it('stays at 0 for a single item', () => {
    expect(nextIndex(0, 1)).toBe(0)
  })
})

describe('prevIndex', () => {
  it('goes back within range', () => {
    expect(prevIndex(2, 3)).toBe(1)
  })
  it('wraps to the last before the first', () => {
    expect(prevIndex(0, 3)).toBe(2)
  })
  it('stays at 0 for a single item', () => {
    expect(prevIndex(0, 1)).toBe(0)
  })
})
