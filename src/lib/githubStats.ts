export type CalendarDay = { date: string; contributionCount: number }

export type GithubStats = {
  contributions: number
  contributionsLastYear: number
  activeDaysLastYear: number
  longestStreak: { days: number; from: string; to: string }
  mergedPullRequests: number
  mergedOutsideOwnRepos: number
}

export type CalendarSummary = Pick<
  GithubStats,
  | 'contributions'
  | 'contributionsLastYear'
  | 'activeDaysLastYear'
  | 'longestStreak'
>

export const DAYS_IN_LAST_YEAR = 365

/** Expects every calendar day, zero-contribution days included; ignores days after `today`. */
export function summarizeCalendar(
  days: CalendarDay[],
  today: string,
): CalendarSummary {
  const past = days
    .filter((day) => day.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date))
  const lastYear = past.slice(-DAYS_IN_LAST_YEAR)

  let longestStreak = { days: 0, from: '', to: '' }
  let streak = 0
  let streakStart = ''
  for (const day of past) {
    if (day.contributionCount === 0) {
      streak = 0
      continue
    }
    if (streak === 0) streakStart = day.date
    streak += 1
    if (streak > longestStreak.days) {
      longestStreak = { days: streak, from: streakStart, to: day.date }
    }
  }

  return {
    contributions: sumContributions(past),
    contributionsLastYear: sumContributions(lastYear),
    activeDaysLastYear: lastYear.filter((day) => day.contributionCount > 0)
      .length,
    longestStreak,
  }
}

function sumContributions(days: CalendarDay[]): number {
  return days.reduce((total, day) => total + day.contributionCount, 0)
}
