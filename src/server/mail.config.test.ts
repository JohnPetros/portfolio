import { describe, expect, it } from 'vitest'
import { resolveMailConfig } from './mail.config'

describe('resolveMailConfig', () => {
  it('falls back when env is empty', () => {
    expect(resolveMailConfig({})).toEqual({
      from: 'Petros Portfolio <onboarding@resend.dev>',
      to: 'joaopcarvalho.cds@gmail.com',
    })
  })
  it('treats blank/whitespace env values as unset', () => {
    expect(resolveMailConfig({ RESEND_FROM: '   ', CONTACT_TO: '' })).toEqual({
      from: 'Petros Portfolio <onboarding@resend.dev>',
      to: 'joaopcarvalho.cds@gmail.com',
    })
  })
  it('uses env values when provided', () => {
    expect(
      resolveMailConfig({
        RESEND_FROM: 'Petros <hi@petros.dev>',
        CONTACT_TO: 'inbox@petros.dev',
      }),
    ).toEqual({ from: 'Petros <hi@petros.dev>', to: 'inbox@petros.dev' })
  })
})
