const MIN_SPEED_PX_PER_SEC = 240
const MAX_RIDE_SECONDS = 20
const SHOW_AFTER_PX = 300
const PHONE_MAX_WIDTH = 640

type ScrollMetrics = {
  scrollY: number
  viewportWidth: number
  viewportHeight: number
  documentHeight: number
}

/** Wide screens show the button after 300px; phones only near the page's end. */
export function shouldShowElevator({
  scrollY,
  viewportWidth,
  viewportHeight,
  documentHeight,
}: ScrollMetrics): boolean {
  const threshold =
    viewportWidth > PHONE_MAX_WIDTH
      ? SHOW_AFTER_PX
      : documentHeight - viewportHeight - SHOW_AFTER_PX
  return scrollY > Math.max(threshold, 0)
}

/** Normal pace for short rides; faster when needed to arrive within the cap. */
export function elevatorSpeed(startY: number): number {
  return Math.max(MIN_SPEED_PX_PER_SEC, startY / MAX_RIDE_SECONDS)
}

/** Next scroll position, based on elapsed time so speed ignores frame rate. */
export function nextElevatorY(
  currentY: number,
  elapsedMs: number,
  speedPxPerSec: number,
): number {
  const travelled = (speedPxPerSec * Math.max(elapsedMs, 0)) / 1000
  return Math.max(currentY - travelled, 0)
}
