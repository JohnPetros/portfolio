import { describe, expect, it } from 'vitest'
import { BIO, statTarget } from './bio'

describe('BIO', () => {
  it('has exactly 6 bio paragraphs', () => {
    expect(BIO.paragraphs).toHaveLength(6)
  })
  it('has exactly 4 stats', () => {
    expect(BIO.stats).toHaveLength(4)
  })
  it('every stat has a label in all 3 languages', () => {
    for (const s of BIO.stats) {
      expect(s.label.pt).toBeTruthy()
      expect(s.label.en).toBeTruthy()
      expect(s.label.es).toBeTruthy()
    }
  })
})

describe('statTarget', () => {
  it('parses a plain integer', () => {
    expect(
      statTarget({ value: '100', suffix: '%', label: { pt: '', en: '', es: '' }, meta: { pt: '', en: '', es: '' } }),
    ).toBe(100)
  })
  it('parses a value with a thousands separator', () => {
    expect(
      statTarget({ value: '2,154', suffix: '', label: { pt: '', en: '', es: '' }, meta: { pt: '', en: '', es: '' } }),
    ).toBe(2154)
  })
  it('parses a leading-number value like "5+"', () => {
    expect(
      statTarget({ value: '5', suffix: '+', label: { pt: '', en: '', es: '' }, meta: { pt: '', en: '', es: '' } }),
    ).toBe(5)
  })
  it('returns 0 for a non-numeric value', () => {
    expect(
      statTarget({ value: '∞', suffix: '', label: { pt: '', en: '', es: '' }, meta: { pt: '', en: '', es: '' } }),
    ).toBe(0)
  })
})
