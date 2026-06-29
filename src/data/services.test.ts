import { describe, expect, it } from 'vitest'
import { SERVICES, unknownTechIds } from './services'

describe('SERVICES', () => {
  it('has exactly 6 services', () => {
    expect(SERVICES).toHaveLength(6)
  })
  it('has unique ids', () => {
    expect(new Set(SERVICES.map((s) => s.id)).size).toBe(6)
  })
  it('every service references at least one tech', () => {
    for (const s of SERVICES) expect(s.techIds.length).toBeGreaterThan(0)
  })
})

describe('unknownTechIds', () => {
  it('every referenced techId exists in the stack', () => {
    expect(unknownTechIds()).toEqual([])
  })
})
