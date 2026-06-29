import { describe, expect, it } from 'vitest'
import { counterValue } from './useCounter'

describe('counterValue', () => {
  it('returns from at t=0 and to at t=1', () => {
    expect(counterValue(0, 100, 0)).toBe(0)
    expect(counterValue(0, 100, 1)).toBe(100)
  })
  it('clamps t outside 0..1', () => {
    expect(counterValue(0, 100, -1)).toBe(0)
    expect(counterValue(0, 100, 2)).toBe(100)
  })
  it('eases out (past midpoint by t=0.5)', () => {
    expect(counterValue(0, 100, 0.5)).toBeGreaterThan(50)
  })
})
