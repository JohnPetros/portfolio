import { describe, expect, it } from 'vitest'
import { localize } from './useLocalized'

describe('localize', () => {
  const field = { pt: 'olá', en: 'hi', es: 'hola' }
  it('maps pt-BR to pt', () => {
    expect(localize(field, 'pt-BR')).toBe('olá')
  })
  it('maps en and es directly', () => {
    expect(localize(field, 'en')).toBe('hi')
    expect(localize(field, 'es')).toBe('hola')
  })
  it('works for non-string values', () => {
    expect(localize({ pt: [1], en: [2], es: [3] }, 'es')).toEqual([3])
  })
})
