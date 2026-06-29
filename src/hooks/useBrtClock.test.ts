import { describe, expect, it } from 'vitest'
import { formatBrt } from './useBrtClock'

describe('formatBrt', () => {
  it('formats a UTC date into BRT HH:MM (UTC-3)', () => {
    // 2026-06-28T15:30:00Z → 12:30 in America/Sao_Paulo
    expect(formatBrt(new Date('2026-06-28T15:30:00Z'))).toBe('12:30')
  })
  it('pads single digits', () => {
    // 2026-06-28T12:05:00Z → 09:05
    expect(formatBrt(new Date('2026-06-28T12:05:00Z'))).toBe('09:05')
  })
})
