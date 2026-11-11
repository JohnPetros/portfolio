import { describe, expect, it } from 'vitest'
import { BIO, buildStats, statTarget } from './bio'

describe('BIO', () => {
  it('tells the story in 8 milestones with unique ids', () => {
    expect(BIO.milestones).toHaveLength(8)
    expect(new Set(BIO.milestones.map((m) => m.id)).size).toBe(8)
  })
  it('every milestone is written in all 3 languages', () => {
    for (const m of BIO.milestones) {
      for (const field of [m.title, m.body, m.imageHint]) {
        expect(field.pt).toBeTruthy()
        expect(field.en).toBeTruthy()
        expect(field.es).toBeTruthy()
      }
    }
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

describe('buildStats', () => {
  const stats = buildStats({
    contributions: 24337,
    contributionsLastYear: 7569,
    activeDaysLastYear: 347,
    longestStreak: { days: 275, from: '2023-06-16', to: '2024-03-16' },
    mergedPullRequests: 665,
    mergedOutsideOwnRepos: 241,
  })

  it('keeps the total contributions countable', () => {
    expect(statTarget(stats[0])).toBe(24337)
  })
  it('groups the yearly total by language', () => {
    expect(stats[0].meta.pt).toContain('7.569')
    expect(stats[0].meta.en).toContain('7,569')
    expect(stats[0].meta.es).toContain('7.569')
  })
  it('shows the streak period as months', () => {
    expect(stats[1].value).toBe('275')
    expect(stats[1].meta.pt).toBe('06/2023 – 03/2024')
  })
  it('turns the active days into a rounded share', () => {
    expect(stats[2].value).toBe('95')
    expect(stats[2].suffix).toBe('%')
  })
  it('reports merged pull requests with the outside count', () => {
    expect(stats[3].value).toBe('665')
    expect(stats[3].meta.pt).toContain('241')
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
