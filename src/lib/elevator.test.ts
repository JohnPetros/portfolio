import { describe, expect, it } from 'vitest'
import { elevatorSpeed, nextElevatorY, shouldShowElevator } from './elevator'

describe('shouldShowElevator', () => {
  const desktop = { viewportWidth: 1280, viewportHeight: 800, documentHeight: 6000 }
  const phone = { viewportWidth: 390, viewportHeight: 800, documentHeight: 6000 }

  it('shows on wide screens after 300px', () => {
    expect(shouldShowElevator({ ...desktop, scrollY: 300 })).toBe(false)
    expect(shouldShowElevator({ ...desktop, scrollY: 301 })).toBe(true)
  })
  it('shows on phones only in the last 300px of the page', () => {
    expect(shouldShowElevator({ ...phone, scrollY: 4900 })).toBe(false)
    expect(shouldShowElevator({ ...phone, scrollY: 4901 })).toBe(true)
  })
  it('stays hidden at the top of a page too short to scroll', () => {
    const short = { viewportWidth: 390, viewportHeight: 800, documentHeight: 900 }
    expect(shouldShowElevator({ ...short, scrollY: 0 })).toBe(false)
  })
})

describe('elevatorSpeed', () => {
  it('keeps the normal pace for rides under 20 seconds', () => {
    expect(elevatorSpeed(480)).toBe(240)
    expect(elevatorSpeed(4800)).toBe(240)
  })
  it('speeds up so longer rides still take 20 seconds', () => {
    expect(elevatorSpeed(9600)).toBe(480)
    expect(elevatorSpeed(18000)).toBe(900)
  })
})

describe('nextElevatorY', () => {
  it('moves by the same distance whatever the frame rate', () => {
    let at60 = 1000
    for (let i = 0; i < 60; i++) at60 = nextElevatorY(at60, 1000 / 60, 240)
    let at120 = 1000
    for (let i = 0; i < 120; i++) at120 = nextElevatorY(at120, 1000 / 120, 240)
    expect(at60).toBeCloseTo(760)
    expect(at120).toBeCloseTo(760)
  })
  it('never goes above the top', () => {
    expect(nextElevatorY(2, 1000, 240)).toBe(0)
  })
  it('does not move down on a negative elapsed time', () => {
    expect(nextElevatorY(500, -16, 240)).toBe(500)
  })
})
