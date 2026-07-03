# Deploy — Vercel

This app is a TanStack Start SSR app built with Vite + Nitro. The `vercel`
Nitro preset (in `vite.config.ts`) makes `pnpm build` emit the Vercel Build
Output API tree at `.vercel/output/`, so Vercel deploys it with no build-setting
overrides.

## One-time setup

1. Push this repo to GitHub.
2. In Vercel: **New Project** → import the repo.
3. Framework preset: **Other** (the Nitro `vercel` preset already produces
   `.vercel/output`). Build command `pnpm build`, install command `pnpm install`,
   output handled by the Build Output API (leave the output directory default).
4. Add the environment variables below (Project → Settings → Environment
   Variables), then deploy.

## Environment variables

| Variable          | Scope         | Required | Purpose                                                        |
| ----------------- | ------------- | -------- | -------------------------------------------------------------- |
| `RESEND_API_KEY`  | Server        | Yes      | Resend API key for contact-form email delivery.                |
| `RESEND_FROM`     | Server        | Rec.     | Verified Resend domain sender. Falls back to the Resend test sender when unset. |
| `CONTACT_TO`      | Server        | No       | Destination inbox for messages. Falls back to the owner's gmail. |
| `VITE_DISCORD_ID` | Public/client | No       | Discord user id for the Lanyard live-status pill.              |

- Server vars must **not** be prefixed `VITE_` (that would bundle them to the
  client). Only `VITE_*` is exposed to the browser.
- `RESEND_FROM` must be a domain you've verified in Resend before real launch;
  the `onboarding@resend.dev` fallback is for testing only and cannot send to
  arbitrary recipients reliably.

## Content still to supply (`TODO(petros)`)

Not deploy blockers, but needed for a real launch:
- Real Discord id (`VITE_DISCORD_ID`) — else the Lanyard pill stays offline.
- Verified Resend sender domain (`RESEND_FROM`).
- Contact channel URLs in `src/data/channels.ts` (currently `#`).
- CV PDFs `petros-cv-en.pdf` / `petros-cv-es.pdf` in `/public` (add each lang to
  `CV_AVAILABLE` in `src/data/cv.ts` once present).
- `panda.gif` in `/public` for the EasterEgg (falls back to the 🐼 emoji).

## Known limitation — contact rate limit

The contact server fn rate-limits by IP using a **per-instance in-memory `Map`**
(`src/server/contact.ts`, 3 messages / 24h). On Vercel's serverless runtime each
cold start / instance has its own memory, so the limit is best-effort, not
global — a determined sender hitting different instances can exceed it. This is
accepted for now.

**Upgrade path (future):** swap the in-memory `Map` for a durable store — e.g.
Upstash Redis via the Vercel Marketplace (`@upstash/ratelimit` + `@upstash/redis`)
keyed by IP. The pure rate-limit math in `src/server/contact.schema.ts`
(`withinWindow` / `isRateLimited`) stays; only the storage layer changes.
