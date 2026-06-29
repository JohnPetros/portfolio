import { describe, expect, it } from 'vitest'
import { CATEGORIES, TECHS, getTech, groupByCategory } from './stack'

describe('TECHS', () => {
  it('has exactly 35 techs', () => {
    expect(TECHS).toHaveLength(35)
  })
  it('has unique ids', () => {
    const ids = TECHS.map((t) => t.id)
    expect(new Set(ids).size).toBe(35)
  })
  it('every tech has a category in CATEGORIES', () => {
    for (const t of TECHS) expect(CATEGORIES).toContain(t.category)
  })
  it('every brandColor is a hex string', () => {
    for (const t of TECHS) expect(t.brandColor).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })
})

describe('getTech', () => {
  it('finds by id', () => {
    expect(getTech('react')?.name).toBe('React')
  })
  it('returns undefined for unknown id', () => {
    expect(getTech('nope')).toBeUndefined()
  })
})

describe('groupByCategory', () => {
  it('groups all techs, preserving CATEGORIES order', () => {
    const groups = groupByCategory(TECHS)
    expect(groups.map((g) => g.category)).toEqual(CATEGORIES)
    expect(groups.reduce((n, g) => n + g.techs.length, 0)).toBe(35)
  })
  it('drops empty categories', () => {
    const groups = groupByCategory(TECHS.filter((t) => t.category === 'mobile'))
    expect(groups).toHaveLength(1)
    expect(groups[0].category).toBe('mobile')
    expect(groups[0].techs).toHaveLength(3)
  })
})
