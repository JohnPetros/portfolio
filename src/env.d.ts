/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Public (client) — Lanyard Discord user id.
  readonly VITE_DISCORD_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Server-only environment variables (never bundled to the client).
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly RESEND_API_KEY?: string
      readonly RESEND_FROM?: string
      readonly CONTACT_TO?: string
    }
  }
}

export {}
