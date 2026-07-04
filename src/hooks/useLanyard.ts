import { useCallback, useEffect, useRef, useState } from 'react'

export type ActivityKind = 'coding' | 'playing' | 'listening' | 'offline'
export type Activity = { kind: ActivityKind; detail?: string; subtitle?: string }

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
const CODE_RE = /visual studio code|vscode|cursor|^code$/i

export type LanyardStatus = {
  coding: Activity | null
  playing: Activity | null
  listening: Activity | null
  primary: Activity
}

export function deriveStatus(data: LanyardData | null): LanyardStatus {
  const offline: Activity = { kind: 'offline' }
  if (!data)
    return { coding: null, playing: null, listening: null, primary: offline }

  const activities = data.activities ?? []
  const codingRaw = activities.find((a) => a.name && CODE_RE.test(a.name))
  const coding: Activity | null = codingRaw
    ? {
        kind: 'coding',
        detail: codingRaw.details ?? codingRaw.name,
        subtitle: codingRaw.state,
      }
    : null

  // A "playing" activity is any type-0 that isn't already claimed as coding.
  const playingRaw = activities.find(
    (a) => a.type === 0 && (!a.name || !CODE_RE.test(a.name)),
  )
  const playing: Activity | null = playingRaw
    ? {
        kind: 'playing',
        detail: playingRaw.name,
        subtitle: playingRaw.state ?? playingRaw.details,
      }
    : null

  const listening: Activity | null =
    data.listening_to_spotify && data.spotify
      ? {
          kind: 'listening',
          detail: data.spotify.song || undefined,
          subtitle: data.spotify.artist || undefined,
        }
      : null

  const primary = coding ?? playing ?? listening ?? offline
  return { coding, playing, listening, primary }
}

export function deriveActivity(data: LanyardData | null): Activity {
  return deriveStatus(data).primary
}

const OFFLINE_STATUS: LanyardStatus = {
  coding: null,
  playing: null,
  listening: null,
  primary: { kind: 'offline' },
}

export function useLanyard(): {
  activity: Activity
  status: LanyardStatus
  lastOnlineAt: number | null
  isRefreshing: boolean
  refresh: () => void
} {
  const [status, setStatus] = useState<LanyardStatus>(OFFLINE_STATUS)
  const [lastOnlineAt, setLastOnlineAt] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const lastGood = useRef<LanyardStatus | null>(null)
  const aliveRef = useRef(true)

  const poll = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
      if (!res.ok) throw new Error(String(res.status))
      const json = (await res.json()) as { data?: LanyardData }
      if (!aliveRef.current) return
      const next = deriveStatus(json.data ?? null)
      if (next.primary.kind === 'offline') {
        setStatus(lastGood.current ?? next)
      } else {
        lastGood.current = next
        setStatus(next)
        setLastOnlineAt(Date.now())
      }
    } catch {
      if (!aliveRef.current) return
      setStatus(lastGood.current ?? OFFLINE_STATUS)
    } finally {
      if (aliveRef.current) setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    aliveRef.current = true
    poll()
    const id = setInterval(poll, POLL_MS)
    return () => {
      aliveRef.current = false
      clearInterval(id)
    }
  }, [poll])

  const refresh = useCallback(() => {
    if (isRefreshing) return
    poll()
  }, [isRefreshing, poll])

  return {
    activity: status.primary,
    status,
    lastOnlineAt,
    isRefreshing,
    refresh,
  }
}
