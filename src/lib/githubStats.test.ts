import { describe, expect, it } from 'vitest'
import { type CalendarDay, summarizeCalendar } from './githubStats'

function calendar(start: string, counts: number[]): CalendarDay[] {
  return counts.map((contributionCount, index) => {
    const date = new Date(`${start}T00:00:00Z`)
    date.setUTCDate(date.getUTCDate() + index)
    return { date: date.toISOString().slice(0, 10), contributionCount }
  })
}

describe('summarizeCalendar', () => {
  it('adds up every contribution', () => {
    const days = calendar('2026-01-01', [2, 0, 3])
    expect(summarizeCalendar(days, '2026-01-03').contributions).toBe(5)
  })
  it('finds the longest run of active days and its dates', () => {
    const days = calendar('2026-01-01', [1, 1, 0, 4, 1, 2, 0, 1])
    expect(summarizeCalendar(days, '2026-01-08').longestStreak).toEqual({
      days: 3,
      from: '2026-01-04',
      to: '2026-01-06',
    })
  })
  it('keeps the first streak when a later one only ties it', () => {
    const days = calendar('2026-01-01', [1, 1, 0, 1, 1])
    expect(summarizeCalendar(days, '2026-01-05').longestStreak.from).toBe(
      '2026-01-01',
    )
  })
  it('ignores days after today', () => {
    const days = calendar('2026-01-01', [1, 1, 9, 9])
    const summary = summarizeCalendar(days, '2026-01-02')
    expect(summary.contributions).toBe(2)
    expect(summary.longestStreak.days).toBe(2)
  })
  it('limits the yearly figures to the last 365 days', () => {
    const counts = [50, ...Array<number>(364).fill(0), 2]
    const summary = summarizeCalendar(
      calendar('2025-01-01', counts),
      '2026-01-01',
    )
    expect(summary.contributions).toBe(52)
    expect(summary.contributionsLastYear).toBe(2)
    expect(summary.activeDaysLastYear).toBe(1)
  })
  it('sorts days that arrive out of order', () => {
    const days = calendar('2026-01-01', [1, 1, 1]).reverse()
    expect(summarizeCalendar(days, '2026-01-03').longestStreak).toEqual({
      days: 3,
      from: '2026-01-01',
      to: '2026-01-03',
    })
  })
  it('reports no streak on an empty calendar', () => {
    expect(summarizeCalendar([], '2026-01-01').longestStreak.days).toBe(0)
  })
})
