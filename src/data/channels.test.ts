import { describe, expect, it } from 'vitest'
import { CONTACT_CHANNELS } from './channels'

describe('CONTACT_CHANNELS', () => {
  it('has exactly 4 channels', () => {
    expect(CONTACT_CHANNELS).toHaveLength(4)
  })
  it('has the expected ids in order', () => {
    expect(CONTACT_CHANNELS.map((c) => c.id)).toEqual([
      'email',
      'linkedin',
      'github',
      'discord',
    ])
  })
  it('every channel has an icon, href, handle, and a label in all 3 languages', () => {
    for (const c of CONTACT_CHANNELS) {
      expect(c.icon).toBeTruthy()
      expect(c.href).toBeTruthy()
      expect(c.handle).toBeTruthy()
      expect(c.label.pt).toBeTruthy()
      expect(c.label.en).toBeTruthy()
      expect(c.label.es).toBeTruthy()
    }
  })
  it('email channel uses a mailto href', () => {
    const email = CONTACT_CHANNELS.find((c) => c.id === 'email')
    expect(email?.href.startsWith('mailto:')).toBe(true)
  })
})
