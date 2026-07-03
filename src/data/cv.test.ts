import { describe, expect, it } from 'vitest'
import { CV_AVAILABLE, cvFilename, cvHref, isCvFallback } from './cv'

describe('cv', () => {
  it('pt-BR resolves to the pt file', () => {
    expect(cvFilename('pt-BR')).toBe('petros-cv-pt.pdf')
    expect(cvHref('pt-BR')).toBe('/petros-cv-pt.pdf')
    expect(isCvFallback('pt-BR')).toBe(false)
  })
  it('an unavailable language falls back to the pt file', () => {
    // Guard the assertion to the current availability set.
    if (!CV_AVAILABLE.includes('es')) {
      expect(cvFilename('es')).toBe('petros-cv-pt.pdf')
      expect(isCvFallback('es')).toBe(true)
    }
  })
  it('an available language resolves to its own file', () => {
    if (CV_AVAILABLE.includes('en')) {
      expect(cvFilename('en')).toBe('petros-cv-en.pdf')
      expect(isCvFallback('en')).toBe(false)
    }
  })
})
