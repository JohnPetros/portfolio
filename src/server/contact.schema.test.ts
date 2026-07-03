import { describe, expect, it } from 'vitest'
import {
  RATE_MAX,
  RATE_WINDOW_MS,
  contactSchema,
  isHoneypot,
  isRateLimited,
  withinWindow,
} from './contact.schema'

describe('contactSchema', () => {
  it('accepts a valid payload', () => {
    const r = contactSchema.safeParse({
      name: 'Petros',
      email: 'a@b.com',
      message: 'hello',
    })
    expect(r.success).toBe(true)
  })
  it('rejects an invalid email', () => {
    const r = contactSchema.safeParse({ name: 'P', email: 'nope', message: 'hi' })
    expect(r.success).toBe(false)
  })
  it('rejects an empty message', () => {
    const r = contactSchema.safeParse({ name: 'P', email: 'a@b.com', message: '' })
    expect(r.success).toBe(false)
  })
  it('rejects a message over 500 chars', () => {
    const r = contactSchema.safeParse({
      name: 'P',
      email: 'a@b.com',
      message: 'x'.repeat(501),
    })
    expect(r.success).toBe(false)
  })
})

describe('isHoneypot', () => {
  it('is false when website is empty/absent', () => {
    expect(isHoneypot({})).toBe(false)
    expect(isHoneypot({ website: '   ' })).toBe(false)
  })
  it('is true when website is filled', () => {
    expect(isHoneypot({ website: 'http://spam' })).toBe(true)
  })
})

describe('rate limiting', () => {
  it('drops timestamps outside the window', () => {
    const now = 1_000_000
    const ts = [now - RATE_WINDOW_MS - 1, now - 10]
    expect(withinWindow(ts, now, RATE_WINDOW_MS)).toEqual([now - 10])
  })
  it('limits at RATE_MAX within the window', () => {
    const now = 1_000_000
    const recent = Array.from({ length: RATE_MAX }, () => now - 5)
    expect(isRateLimited(recent, now, RATE_WINDOW_MS, RATE_MAX)).toBe(true)
    expect(isRateLimited(recent.slice(1), now, RATE_WINDOW_MS, RATE_MAX)).toBe(false)
  })
})
