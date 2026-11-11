// Refreshes src/data/github-stats.json at build time. A missing token or a
// GitHub failure only logs a warning, so the build ships the last snapshot.
import { writeFile } from 'node:fs/promises'
import process from 'node:process'
import {
  type CalendarDay,
  type GithubStats,
  summarizeCalendar,
} from '../src/lib/githubStats.ts'

const LOGIN = 'JohnPetros'
const OUTPUT = new URL('../src/data/github-stats.json', import.meta.url)

const OVERVIEW_QUERY = `query($login: String!, $merged: String!, $outside: String!) {
  user(login: $login) { contributionsCollection { contributionYears } }
  merged: search(query: $merged, type: ISSUE, first: 1) { issueCount }
  outside: search(query: $outside, type: ISSUE, first: 1) { issueCount }
}`

const CALENDAR_QUERY = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar { weeks { contributionDays { date contributionCount } } }
    }
  }
}`

type Overview = {
  user: { contributionsCollection: { contributionYears: number[] } }
  merged: { issueCount: number }
  outside: { issueCount: number }
}

type YearCalendar = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: { contributionDays: CalendarDay[] }[]
      }
    }
  }
}

async function graphql<T>(
  token: string,
  query: string,
  variables: Record<string, string>,
): Promise<T> {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  })
  if (!response.ok) throw new Error(`GitHub answered ${response.status}`)
  const body = (await response.json()) as {
    data?: T
    errors?: { message: string }[]
  }
  if (!body.data) {
    throw new Error(body.errors?.[0]?.message ?? 'GitHub sent no data')
  }
  return body.data
}

async function fetchYear(token: string, year: number): Promise<CalendarDay[]> {
  const data = await graphql<YearCalendar>(token, CALENDAR_QUERY, {
    login: LOGIN,
    from: `${year}-01-01T00:00:00Z`,
    to: `${year}-12-31T23:59:59Z`,
  })
  return data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
    (week) => week.contributionDays,
  )
}

async function fetchStats(token: string): Promise<GithubStats> {
  const mergedQuery = `author:${LOGIN} type:pr is:public is:merged`
  const overview = await graphql<Overview>(token, OVERVIEW_QUERY, {
    login: LOGIN,
    merged: mergedQuery,
    outside: `${mergedQuery} -user:${LOGIN}`,
  })
  const years = await Promise.all(
    overview.user.contributionsCollection.contributionYears.map((year) =>
      fetchYear(token, year),
    ),
  )
  const today = new Date().toISOString().slice(0, 10)
  return {
    ...summarizeCalendar(years.flat(), today),
    mergedPullRequests: overview.merged.issueCount,
    mergedOutsideOwnRepos: overview.outside.issueCount,
  }
}

async function main() {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.warn('GITHUB_TOKEN is not set; keeping the saved GitHub stats.')
    return
  }
  try {
    const stats = await fetchStats(token)
    if (stats.contributions === 0) throw new Error('GitHub reported no activity')
    await writeFile(OUTPUT, `${JSON.stringify(stats, null, 2)}\n`)
    console.log('GitHub stats updated.')
  } catch (error) {
    console.warn('Keeping the saved GitHub stats:', error)
  }
}

await main()
