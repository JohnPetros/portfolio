import { useEffect, useRef, useState } from 'react'

export type ActivityKind = 'coding' | 'playing' | 'listening' | 'offline'
export type Activity = { kind: ActivityKind; detail?: string }

export type LanyardData = {
  discord_status?: string
  listening_to_spotify?: boolean
  spotify?: { song?: string; artist?: string } | null
  activities?: { type: number; name?: string; state?: string; details?: string }[]
}

// PRD §Lanyard: these four are fixed, non-thematic brand-ish colors.
export const ACTIVITY_COLOR: Record<ActivityKind, string> = {
  coding: '#4A8FE7',
  playing: '#A855F7',
  listening: '#1ED760',
  offline: '#555',
}

// TODO(petros): replace with the real Discord user id (public — client fetch).
const DISCORD_ID =
  (import.meta.env?.VITE_DISCORD_ID as string | undefined) || '000000000000000000'
const POLL_MS = 30_000
const CODE_RE = /visual studio code|vscode|^code$/i

export function deriveActivity(data: LanyardData | null): Activity {
  if (!data) return { kind: 'offline' }
  const activities = data.activities ?? []
  const coding = activities.find((a) => a.name && CODE_RE.test(a.name))
  if (coding) return { kind: 'coding', detail: coding.details ?? coding.name }
  const playing = activities.find((a) => a.type === 0)
  if (playing) return { kind: 'playing', detail: playing.name }
  if (data.listening_to_spotify && data.spotify) {
    const { song, artist } = data.spotify
    const detail = [song, artist].filter(Boolean).join(' — ') || undefined
    return { kind: 'listening', detail }
  }
  return { kind: 'offline' }
}

export function useLanyard(): { activity: Activity; lastOnlineAt: number | null } {
  const [activity, setActivity] = useState<Activity>({ kind: 'offline' })
  const [lastOnlineAt, setLastOnlineAt] = useState<number | null>(null)
  const lastGood = useRef<Activity | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let alive = true

    const poll = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
        if (!res.ok) throw new Error(String(res.status))
        const json = (await res.json()) as { data?: LanyardData }
        if (!alive) return
        const next = deriveActivity(json.data ?? null)
        if (next.kind === 'offline') {
          // keep the last non-offline state rather than flashing offline
          setActivity(lastGood.current ?? next)
        } else {
          lastGood.current = next
          setActivity(next)
          setLastOnlineAt(Date.now())
        }
      } catch {
        if (!alive) return
        setActivity(lastGood.current ?? { kind: 'offline' })
      }
    }

    poll()
    const id = setInterval(poll, POLL_MS)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  return { activity, lastOnlineAt }
}
