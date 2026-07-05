import { describe, expect, it } from 'vitest'
import { CV_AVAILABLE, cvFilename, cvHref, isCvFallback } from './cv'

describe('cv', () => {
  it('pt-BR resolves to the pt file', () => {
    expect(cvFilename('pt-BR')).toBe('petros-cv-ptbr.pdf')
    expect(cvHref('pt-BR')).toBe('/pdfs/petros-cv-ptbr.pdf')
    expect(isCvFallback('pt-BR')).toBe(false)
  })
  it('en resolves to its own file', () => {
    expect(cvFilename('en')).toBe('petros-cv-en.pdf')
    expect(cvHref('en')).toBe('/pdfs/petros-cv-en.pdf')
    expect(isCvFallback('en')).toBe(false)
  })
  it('es resolves to its own file', () => {
    expect(cvFilename('es')).toBe('petros-cv-es.pdf')
    expect(cvHref('es')).toBe('/pdfs/petros-cv-es.pdf')
    expect(isCvFallback('es')).toBe(false)
  })
  it('all three languages are marked as available', () => {
    expect(CV_AVAILABLE).toEqual(['pt-BR', 'en', 'es'])
  })
})
