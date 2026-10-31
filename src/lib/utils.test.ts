import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn with portfolio typography', () => {
  it('preserves a custom font size alongside a text color', () => {
    expect(cn('text-h1 text-text-primary')).toBe('text-h1 text-text-primary')
    expect(cn('text-meta text-text-secondary')).toBe('text-meta text-text-secondary')
  })

  it('allows font size and color overrides independently', () => {
    expect(cn('text-h1 text-text-primary', 'text-title text-accent')).toBe(
      'text-title text-accent',
    )
  })

  it('keeps responsive sizes while replacing the base size', () => {
    expect(cn('text-hero md:text-display', 'text-h1')).toBe('md:text-display text-h1')
  })
})
