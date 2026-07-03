import { createServerFn } from '@tanstack/react-start'
import { getRequestIP } from '@tanstack/react-start/server'
import { Resend } from 'resend'
import {
  RATE_MAX,
  RATE_WINDOW_MS,
  contactSchema,
  isHoneypot,
  isRateLimited,
} from './contact.schema'

export type ContactResult = { ok: true } | { ok: false; reason: 'rate' | 'server' }

// Per-instance memory store. TODO(petros): swap for Vercel KV in production.
const hits = new Map<string, number[]>()

const RECIPIENT = 'joaopcarvalho.cds@gmail.com'
// TODO(petros): use a verified Resend domain sender before launch.
const SENDER = 'Petros Portfolio <onboarding@resend.dev>'

export const sendContact = createServerFn({ method: 'POST' })
  .validator(contactSchema)
  .handler(async ({ data }): Promise<ContactResult> => {
    // Honeypot: pretend success, drop the message.
    if (isHoneypot(data)) return { ok: true }

    const ip = getRequestIP({ xForwardedFor: true }) ?? 'unknown'
    const now = Date.now()
    const prior = hits.get(ip) ?? []
    if (isRateLimited(prior, now, RATE_WINDOW_MS, RATE_MAX)) {
      return { ok: false, reason: 'rate' }
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return { ok: false, reason: 'server' }

    try {
      const resend = new Resend(apiKey)
      const { error } = await resend.emails.send({
        from: SENDER,
        to: RECIPIENT,
        replyTo: data.email,
        subject: `Portfolio contact — ${data.name}`,
        text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
      })
      if (error) return { ok: false, reason: 'server' }
    } catch {
      return { ok: false, reason: 'server' }
    }

    hits.set(ip, [...prior.filter((t) => now - t < RATE_WINDOW_MS), now])
    return { ok: true }
  })
