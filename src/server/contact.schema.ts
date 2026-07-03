import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  message: z.string().trim().min(1).max(500),
  // Honeypot: must stay empty. Not validated for content, only presence.
  website: z.string().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

export function isHoneypot(input: { website?: string }): boolean {
  return Boolean(input.website && input.website.trim().length > 0)
}

export const RATE_WINDOW_MS = 24 * 60 * 60 * 1000
export const RATE_MAX = 3

export function withinWindow(
  timestamps: number[],
  now: number,
  windowMs: number,
): number[] {
  return timestamps.filter((t) => now - t < windowMs)
}

export function isRateLimited(
  timestamps: number[],
  now: number,
  windowMs: number,
  max: number,
): boolean {
  return withinWindow(timestamps, now, windowMs).length >= max
}
