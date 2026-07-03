# Petros Portfolio — Phase 5 (Production Deploy) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Phase 1–4 app deployable to Vercel as a production TanStack Start SSR app — add the Nitro Vercel build target, make the Resend sender/recipient environment-driven, declare production env var types, and document the deploy + the known in-memory rate-limit limitation.

**Architecture:** TanStack Start 1.168 builds through Vite 8; deployment targets are provided by the `nitro/vite` plugin (Nitro is the agnostic deploy layer). Adding `nitro({ preset: 'vercel' })` makes `vite build` emit the Vercel Build Output API v3 tree at `.vercel/output/`, which Vercel deploys with zero extra config. The contact server fn's `from`/`to` addresses move from hardcoded constants to a small pure, unit-tested `resolveMailConfig(env)` reading `process.env` with safe fallbacks, so a verified Resend domain can be set per-environment without code changes. The in-memory IP rate limit is **kept as-is** (per decision) and its per-instance limitation is documented, with a KV upgrade path noted for later.

**Tech Stack:** TanStack Start (React 19, Vite 8, `createServerFn`), **Nitro** (`nitro/vite`, `preset: 'vercel'`), Resend, Vitest, Biome. **No** new runtime app dependencies beyond `nitro` (a build/deploy dependency).

## Global Constraints

- **Package manager:** `pnpm`. Scripts: `pnpm dev`, `pnpm build`, `pnpm typecheck` (`tsc --noEmit`), `pnpm check` (`biome check --write .`), `pnpm test` (`vitest run`).
- **Code style (Biome):** 2-space indent, line width 90, single quotes, single JSX quotes, semicolons **as-needed** (omit unless required), self-closing elements. Run `pnpm check` before every commit.
- **Path alias:** `@/*` → `./src/*`.
- **TypeScript:** `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (use `import type` for type-only imports).
- **Secrets:** `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_TO` are **server-only** (`process.env`), never imported into client code and never prefixed `VITE_`. `VITE_DISCORD_ID` is public (client fetch). Never commit a real `.env`; `.env.example` stays the template.
- **Client-bundle safety:** after every build, `grep -rl "RESEND_API_KEY" .vercel/output` (and `dist/client` if present) must find nothing in client chunks. TanStack Start strips `createServerFn` handlers from the client bundle; this plan must not break that.
- **Content is the user's to supply.** Real values behind `// TODO(petros)` (verified Resend domain sender, real Discord id, channel URLs, CV PDFs for en/es, `panda.gif`) are set as Vercel env vars / static assets at launch — not code changes. This plan ships working config against fallbacks.
- **Commit cadence:** one commit per task (end of each task). Append the trailer:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

## File Structure (Phase 5)

```
.gitignore                      # MODIFY: ignore .vercel build output
.env.example                    # MODIFY: add RESEND_FROM + CONTACT_TO (server-only)
DEPLOY.md                       # CREATE: Vercel deploy steps + env var table + rate-limit caveat
vite.config.ts                  # MODIFY: add nitro({ preset: 'vercel' })
package.json                    # MODIFY: add nitro (dev/build dep)
src/
  env.d.ts                      # CREATE: ImportMetaEnv + NodeJS.ProcessEnv declarations
  server/
    mail.config.ts              # CREATE: resolveMailConfig(env) pure helper (TDD)
    mail.config.test.ts         # CREATE
    contact.ts                  # MODIFY: use resolveMailConfig(process.env) instead of constants
```

**No app behavior changes for users.** Phase 5 is build/deploy config + a server-side refactor with identical default behavior.

---

## Task 1: Nitro Vercel build target

**Files:**
- Modify: `package.json` (via pnpm)
- Modify: `vite.config.ts`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: the existing `tanstackStart()` / `viteReact()` / `tailwindcss()` / `devtools()` plugin chain.
- Produces: a `vite build` that additionally emits `.vercel/output/` (Vercel Build Output API v3), deployable by Vercel with no dashboard build-setting overrides.

- [ ] **Step 1: Install Nitro as a dependency**

Run:
```bash
pnpm add nitro
```
Expected: `package.json` `dependencies` (or `devDependencies`) lists `nitro`; `pnpm-lock.yaml` updated. (`nitro` ships the `nitro/vite` plugin used below.)

- [ ] **Step 2: Verify the `nitro/vite` entry resolves**

Run:
```bash
node -e "try{require.resolve('nitro/vite');console.log('nitro/vite: ok')}catch(e){console.log('nitro/vite: MISSING')}"
```
Expected: `nitro/vite: ok`. If it prints `MISSING`, the installed `nitro` version does not expose the Vite plugin at that path — run `node -e "console.log(require('nitro/package.json').version)"` and check the package's `exports` for the Vite entry, then adjust the import specifier in Step 3 to match (e.g. `nitropack/vite`).

- [ ] **Step 3: Add the Vercel preset to `vite.config.ts`**

Replace the entire file with:
```ts
import { nitro } from 'nitro/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    nitro({ preset: 'vercel' }),
    viteReact(),
  ],
})

export default config
```

> Plugin order matters: `nitro()` sits **after** `tanstackStart()` and **before** `viteReact()`, matching the TanStack Start hosting guide. The `vercel` preset targets the Vercel Build Output API — no `vercel.json` is required.

- [ ] **Step 4: Ignore the Vercel build output**

Add `.vercel` to `.gitignore` (the `.output` line already exists). Append after the `.output` line:
```
.vercel
```

- [ ] **Step 5: Build and confirm the Vercel output tree is produced**

Run:
```bash
pnpm build
```
Expected: build succeeds. Then confirm the Vercel Build Output API tree exists:
```bash
test -f .vercel/output/config.json && echo "vercel output: ok" || echo "vercel output: MISSING"
```
Expected: `vercel output: ok`. If `MISSING`, the preset did not take effect — re-check Step 3's plugin order and the `preset: 'vercel'` string, then rebuild.

- [ ] **Step 6: Confirm no server secret leaked into client assets**

Run:
```bash
grep -rl "RESEND_API_KEY" .vercel/output/static 2>/dev/null && echo "LEAKED" || echo "clean"
```
Expected: `clean`. (`.vercel/output/static` holds the client-served assets; the handler + `process.env` reads live only in the serverless function.)

- [ ] **Step 7: Commit**

```bash
pnpm check
git add package.json pnpm-lock.yaml vite.config.ts .gitignore
git commit -m "build(deploy): add Nitro Vercel preset build target

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Environment-driven mail config (TDD) + env type declarations

**Files:**
- Create: `src/server/mail.config.ts`
- Test: `src/server/mail.config.test.ts`
- Modify: `src/server/contact.ts`
- Create: `src/env.d.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: nothing new (pure `process.env` object).
- Produces:
  - `type MailConfig = { from: string; to: string }`
  - `function resolveMailConfig(env: { RESEND_FROM?: string; CONTACT_TO?: string }): MailConfig` — returns `RESEND_FROM`/`CONTACT_TO` when set (non-empty after trim), else the existing fallbacks (`'Petros Portfolio <onboarding@resend.dev>'` / `'joaopcarvalho.cds@gmail.com'`).
- `contact.ts` calls `resolveMailConfig(process.env)` at request time (inside the handler) so a redeploy is not required to be correct, and so tests never touch real env.

- [ ] **Step 1: Write the failing test** (`src/server/mail.config.test.ts`)

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/server/mail.config.test.ts`
Expected: FAIL — cannot resolve `./mail.config`.

- [ ] **Step 3: Write `src/server/mail.config.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/server/mail.config.test.ts`
Expected: PASS (3 cases).

- [ ] **Step 5: Refactor `src/server/contact.ts` to use it.** Replace the two module-level constants and the `send` call fields.

Replace:
```ts
const RECIPIENT = 'joaopcarvalho.cds@gmail.com'
// TODO(petros): use a verified Resend domain sender before launch.
const SENDER = 'Petros Portfolio <onboarding@resend.dev>'
```
with:
```ts
import { resolveMailConfig } from './mail.config'
```
(place the import with the other imports at the top, and delete the two constants entirely).

Then, inside the `.handler` — after the `if (!apiKey) return { ok: false, reason: 'server' }` line and before the `try` — add:
```ts
    const mail = resolveMailConfig(process.env)
```

And in the `resend.emails.send({ ... })` call, replace:
```ts
        from: SENDER,
        to: RECIPIENT,
```
with:
```ts
        from: mail.from,
        to: mail.to,
```

> Everything else in `contact.ts` (honeypot, rate limit, error handling, timestamp recording) is unchanged. Default behavior is identical to Phase 4 when the env vars are unset.

- [ ] **Step 6: Create `src/env.d.ts`** (production env var type declarations)

```ts
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
```

- [ ] **Step 7: Extend `.env.example`** with the two new server-only vars. Replace its contents with:

```bash
# Resend — contact form email delivery (server-only)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
# Verified Resend domain sender (server-only). Falls back to the Resend test
# sender when unset — set a verified domain before real launch.
RESEND_FROM=Petros Portfolio <hi@yourdomain.dev>
# Where contact-form messages are delivered (server-only). Falls back to the
# owner's gmail when unset.
CONTACT_TO=joaopcarvalho.cds@gmail.com

# Optional: Discord user id for Lanyard live status (public; client-side fetch).
# If unset, the hook falls back to the constant in src/hooks/useLanyard.ts.
VITE_DISCORD_ID=
```

- [ ] **Step 8: Typecheck + test + lint**

Run: `pnpm typecheck && pnpm test src/server && pnpm check`
Expected: PASS. `tsc` picks up `src/env.d.ts` via the existing `include: ["**/*.ts", ...]`. If `process.env.RESEND_API_KEY` now reports a type error in `contact.ts`, it means the `ProcessEnv` augmentation didn't load — confirm `src/env.d.ts` has the top `/// <reference types="vite/client" />` and the `export {}` at the bottom (required to make it a module augmentation).

- [ ] **Step 9: Build + confirm no secret leak** (the refactor must not pull `process.env` into the client)

Run:
```bash
pnpm build
grep -rl "RESEND_API_KEY\|CONTACT_TO" .vercel/output/static 2>/dev/null && echo "LEAKED" || echo "clean"
```
Expected: `clean`.

- [ ] **Step 10: Commit**

```bash
git add src/server/mail.config.ts src/server/mail.config.test.ts src/server/contact.ts src/env.d.ts .env.example
git commit -m "feat(server): env-driven Resend sender/recipient + env type decls

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Deploy documentation + rate-limit limitation note

**Files:**
- Create: `DEPLOY.md`
- Modify: `src/server/contact.ts` (comment only)

**Interfaces:**
- Consumes: the env var names from Tasks 1–2.
- Produces: a single source of truth for deploying to Vercel and the documented rate-limit caveat. No runtime behavior change.

- [ ] **Step 1: Create `DEPLOY.md`**

```markdown
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
```

- [ ] **Step 2: Point the code comment at the doc.** In `src/server/contact.ts`, replace the existing store comment:
```ts
// Per-instance memory store. TODO(petros): swap for Vercel KV in production.
const hits = new Map<string, number[]>()
```
with:
```ts
// Per-instance in-memory store; best-effort on serverless. Upgrade path
// (durable store) documented in DEPLOY.md § Known limitation.
const hits = new Map<string, number[]>()
```

- [ ] **Step 3: Lint**

Run: `pnpm check`
Expected: PASS (Biome does not lint Markdown by default; the `contact.ts` edit stays clean).

- [ ] **Step 4: Commit**

```bash
git add DEPLOY.md src/server/contact.ts
git commit -m "docs(deploy): Vercel deploy guide + rate-limit limitation note

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Full production verification

**Files:** none (verification only — no commit unless a fix is needed).

- [ ] **Step 1: Full suite**

Run: `pnpm test && pnpm typecheck && pnpm check`
Expected: all Vitest suites pass (Phase 1–4 suites + the new `mail.config`); no TS errors; Biome clean except the pre-existing accepted warnings (`prototype.html` size, `__root.tsx` suppression comment, the `!important` reduced-motion block, the Phase 3 RichText array-index keys + Carousel `useSemanticElements`).

- [ ] **Step 2: Clean production build + Vercel output shape**

Run:
```bash
rm -rf .vercel dist
pnpm build
test -f .vercel/output/config.json && echo "vercel output: ok" || echo "vercel output: MISSING"
```
Expected: build succeeds; `vercel output: ok`.

- [ ] **Step 3: Secret-leak gate**

Run:
```bash
grep -rl "RESEND_API_KEY\|CONTACT_TO" .vercel/output/static 2>/dev/null && echo "LEAKED" || echo "clean"
```
Expected: `clean`.

- [ ] **Step 4: Local production smoke (optional but recommended)**

Run: `pnpm preview` (or the Vercel CLI `vercel dev` if installed), open the served URL.
Expected: the page renders SSR with no console errors; the contact form submits and — with no `RESEND_API_KEY` set locally — returns the `errorServer` status line (confirming the server fn runs in the production build). Setting `RESEND_API_KEY` + `RESEND_FROM` locally sends a real test email.

- [ ] **Step 5: Confirm working tree is clean**

Run: `git status --short`
Expected: empty (all Phase 5 changes committed; `.vercel` and `dist` are gitignored).

---

## Phase 5 Done — Definition of Complete

- [ ] `nitro` added; `vite.config.ts` uses `nitro({ preset: 'vercel' })`; `pnpm build` emits `.vercel/output/config.json`; `.vercel` gitignored.
- [ ] Resend `from`/`to` are env-driven via `resolveMailConfig(process.env)` (unit-tested, identical default behavior); `RESEND_FROM` / `CONTACT_TO` added to `.env.example`.
- [ ] `src/env.d.ts` declares `VITE_DISCORD_ID` (client) and `RESEND_API_KEY` / `RESEND_FROM` / `CONTACT_TO` (server) for type safety.
- [ ] `DEPLOY.md` documents the Vercel flow, the env var table, the outstanding content `TODO(petros)` items, and the in-memory rate-limit limitation + durable-store upgrade path.
- [ ] `pnpm test && pnpm typecheck && pnpm check && pnpm build` all green; no server secret leaks into `.vercel/output/static`.

## Explicitly out of scope (decided)

- **Durable rate-limit store** (Upstash Redis / KV) — deferred; in-memory kept and documented.
- **a11y sweep + Lighthouse targets** across the 10 mode×scheme combos.
- **`prefers-contrast` hairline reconciliation** (the raw `border-[0.5px]` utilities do not yet follow the `--border-hair` var that the media query thickens) — noted for a future accessibility pass.
- **Single shared Lanyard poll via context** — the Phase 4 dual-poll is retained (YAGNI).
