import { describe, expect, it } from 'vitest'
import { ACTIVITY_COLOR, deriveActivity } from './useLanyard'

describe('deriveActivity', () => {
  it('returns offline for null data', () => {
    expect(deriveActivity(null)).toEqual({ kind: 'offline' })
  })
  it('returns offline when nothing is active', () => {
    expect(deriveActivity({ discord_status: 'online', activities: [] })).toEqual({
      kind: 'offline',
    })
  })
  it('prioritises coding (VS Code) over everything', () => {
    const r = deriveActivity({
      listening_to_spotify: true,
      spotify: { song: 'A', artist: 'B' },
      activities: [
        { type: 0, name: 'Some Game' },
        { type: 0, name: 'Visual Studio Code', details: 'index.tsx' },
      ],
    })
    expect(r.kind).toBe('coding')
    expect(r.detail).toBe('index.tsx')
  })
  it('returns playing when a game is active and no coding', () => {
    const r = deriveActivity({ activities: [{ type: 0, name: 'Celeste' }] })
    expect(r).toEqual({ kind: 'playing', detail: 'Celeste' })
  })
  it('returns listening when only spotify is active', () => {
    const r = deriveActivity({
      listening_to_spotify: true,
      spotify: { song: 'Song', artist: 'Artist' },
      activities: [],
    })
    expect(r.kind).toBe('listening')
    expect(r.detail).toBe('Song')
    expect(r.subtitle).toBe('Artist')
  })
  it('exposes a fixed color for each kind', () => {
    expect(ACTIVITY_COLOR.coding).toBe('#4A8FE7')
    expect(ACTIVITY_COLOR.playing).toBe('#A855F7')
    expect(ACTIVITY_COLOR.listening).toBe('#1ED760')
    expect(ACTIVITY_COLOR.offline).toBe('#555')
  })
})
