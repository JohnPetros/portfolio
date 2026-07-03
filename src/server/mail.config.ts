export type MailConfig = { from: string; to: string }

const FALLBACK_FROM = 'Petros Portfolio <onboarding@resend.dev>'
const FALLBACK_TO = 'joaopcarvalho.cds@gmail.com'

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

// TODO(petros): set RESEND_FROM to a verified Resend domain sender in prod.
export function resolveMailConfig(env: {
  RESEND_FROM?: string
  CONTACT_TO?: string
}): MailConfig {
  return {
    from: clean(env.RESEND_FROM) ?? FALLBACK_FROM,
    to: clean(env.CONTACT_TO) ?? FALLBACK_TO,
  }
}
