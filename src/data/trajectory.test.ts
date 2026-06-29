import { describe, expect, it } from 'vitest'
import { TRAJECTORY, filterTrajectory, trajectoryCounts } from './trajectory'

describe('TRAJECTORY', () => {
  it('has 7 entries', () => {
    expect(TRAJECTORY).toHaveLength(7)
  })
  it('has unique ids', () => {
    expect(new Set(TRAJECTORY.map((e) => e.id)).size).toBe(7)
  })
  it('exactly one entry is marked current professional (Lumetis)', () => {
    const current = TRAJECTORY.filter((e) => e.current)
    expect(current.length).toBeGreaterThanOrEqual(1)
    expect(TRAJECTORY[0].id).toBe('lumetis')
    expect(TRAJECTORY[0].current).toBe(true)
  })
})

describe('trajectoryCounts', () => {
  it('counts 7 total, 4 professional, 3 academic', () => {
    expect(trajectoryCounts(TRAJECTORY)).toEqual({
      all: 7,
      professional: 4,
      academic: 3,
    })
  })
})

describe('filterTrajectory', () => {
  it('all returns every entry in order', () => {
    expect(filterTrajectory(TRAJECTORY, 'all')).toEqual(TRAJECTORY)
  })
  it('professional returns only professional entries', () => {
    const r = filterTrajectory(TRAJECTORY, 'professional')
    expect(r).toHaveLength(4)
    expect(r.every((e) => e.type === 'professional')).toBe(true)
  })
  it('academic returns only academic entries', () => {
    const r = filterTrajectory(TRAJECTORY, 'academic')
    expect(r).toHaveLength(3)
    expect(r.every((e) => e.type === 'academic')).toBe(true)
  })
})
