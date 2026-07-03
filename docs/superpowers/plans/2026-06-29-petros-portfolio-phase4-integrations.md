# Petros Portfolio — Phase 4 (Integrations) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the live/back-end layer onto the Phase 1–3 static shell — `useLanyard` real-time status (Header pill + About NOW panel), the **Contact** section (React Hook Form + Zod + a `createServerFn` Resend backend with honeypot + rate limit), the per-language **CV** download CTA, the **Panda EasterEgg** dialog, and the **mobile drawer nav** — composed into `index.tsx`.

**Architecture:** Pure logic (Lanyard activity-priority derivation, contact Zod schema + honeypot + rate-limit math, CV language resolution) lives in small testable modules under `src/hooks`, `src/server`, and `src/data`, TDD'd with Vitest (Node env — **no DOM/RTL tests**, matching the existing suite). The contact backend is a single TanStack Start `createServerFn({ method: 'POST' })` that validates with the **shared** Zod schema, drops honeypot hits silently, rate-limits by IP via an in-memory map, and sends through **Resend**. The form uses React Hook Form + `@hookform/resolvers/zod` with the same schema for client-side validation, and reports outcome through an inline `aria-live` status region (no toast dependency). Lanyard is a 30s polling hook that caches the last non-offline state. Components are presentational and token-driven; the four fixed Lanyard state colors are the **only** new non-thematic colors (PRD-sanctioned).

**Tech Stack:** TanStack Start (React 19, `createServerFn`), Tailwind CSS v4, i18next + react-i18next, **React Hook Form + Zod + @hookform/resolvers**, **Resend**, radix-ui (Dialog), `@tabler/icons-react`, Vitest, Biome.

## Global Constraints

- **Package manager:** `pnpm`. Scripts: `pnpm dev`, `pnpm build`, `pnpm typecheck` (`tsc --noEmit`), `pnpm check` (`biome check --write .`), `pnpm test` (`vitest run`).
- **Code style (Biome):** 2-space indent, line width 90, single quotes, single JSX quotes, semicolons **as-needed** (omit unless required), self-closing elements. Run `pnpm check` before every commit.
- **Path alias:** `@/*` → `./src/*`.
- **TypeScript:** `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (use `import type` for type-only imports).
- **New runtime dependencies (this phase only):** `react-hook-form`, `@hookform/resolvers`, `zod`, `resend`. **No** Framer Motion / `motion` (entrances reuse `Reveal` + existing `animate-petros-*` keyframes; the EasterEgg open reuses the Phase 3 `petros-dialog-in`/`petros-overlay-in` keyframes).
- **Color authority:** Components reference CSS-var-backed Tailwind tokens only (`bg-bg-card`, `text-text-secondary`, `border-border`, `text-accent`, `bg-accent-tint-12`, …) — **never raw hex**. The **only** exceptions are: the `text-[#0a0a0a]` accent-button foreground (Phase 1/2), tech/brand monograms, and the **four fixed Lanyard state colors** introduced in Task 4 (`#4A8FE7` coding, `#A855F7` playing, `#1ED760` listening, `#555` offline — PRD §Lanyard declares these non-thematic).
- **Hairlines:** structural borders are `border-[0.5px] border-border`; interactive hover warms to `hover:border-accent-tint-20` and lifts `hover:-translate-y-0.5`. Never heavier than 0.5px.
- **Accessibility:** visible `--accent` focus is global (Phase 1 `:focus-visible`). Touch targets ≥ 44×44px (`min-h-11`). Icon-only controls need `aria-label`. `aria-live="polite"` on the Lanyard pill, NOW panel, and contact status region. Radix Dialog provides `role="dialog"` + `aria-modal` + focus-trap + focus-return (EasterEgg + mobile drawer). Respect `prefers-reduced-motion` (handled globally; equalizer/pulse already `motion-safe:`).
- **Reduced-motion / SSR safety:** the reveal mechanism never hides content without JS (gated behind `html.theme-ready`). Lanyard/CV must render a sensible default on the server (offline pill; pt-BR CV href) and reconcile on the client — never throw during SSR.
- **i18n split:** UI chrome (contact labels/placeholders/errors, NOW row labels, easter-egg copy, CV tooltip) → `src/i18n/resources/{pt,en,es}.ts`. Channel + bio + project content stays in `src/data/*.ts`.
- **Secrets:** `RESEND_API_KEY` is server-only (`process.env`), never imported into client code. The Discord user id for Lanyard is **public** (the fetch is client-side) and lives as a constant with a `// TODO(petros)` until confirmed. Add `.env.example`; never commit a real `.env`.
- **Content is a later pass.** Real Discord id, Resend sending domain, CV PDFs, channel URLs, and the panda gif are the user's to supply. Ship working code against `// TODO(petros)` placeholders; tests validate structure/logic, never secrets or copy.
- **Commit cadence:** one commit per task (end of each task). Append the trailer:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

## File Structure (Phase 4)

```
.env.example                         # CREATE: RESEND_API_KEY + (optional) VITE_DISCORD_ID
src/
  data/
    channels.ts                      # CREATE: CONTACT_CHANNELS (4 entries) + types (TDD: structure)
    channels.test.ts                 # CREATE
    cv.ts                            # CREATE: cvFilename/cvHref/isCvFallback per Lang (TDD)
    cv.test.ts                       # CREATE
  hooks/
    useLanyard.ts                    # CREATE: deriveActivity (pure, TDD) + 30s polling hook w/ cache
    useLanyard.test.ts               # CREATE
  server/
    contact.schema.ts               # CREATE: zod contactSchema + isHoneypot + rate-limit math (TDD)
    contact.schema.test.ts          # CREATE
    contact.ts                       # CREATE: createServerFn POST — validate, honeypot, rate-limit, Resend
  components/
    sections/
      LanyardPill.tsx                # CREATE: Header compact pill (dot+icon+label; mobile dot-only)
      Contact.tsx                    # CREATE: RHF + Zod form + 4 channel cards + status region
      EasterEgg.tsx                  # CREATE: Radix Dialog — panda gif + fallback + bamboo bg
      MobileNav.tsx                  # CREATE: Radix Dialog drawer — vertical nav + active indicator
      Header.tsx                     # MODIFY: mount LanyardPill + MobileNav (hamburger)
      Hero.tsx                       # MODIFY: reactive CV href + open EasterEgg
      NowPanel.tsx                   # MODIFY: consume useLanyard live state (offline shell stays as fallback)
  i18n/resources/
    pt.ts  en.ts  es.ts              # MODIFY: add contact/easter/cv chrome + now.* detail strings
  routes/index.tsx                   # MODIFY: replace #contact placeholder with <Contact/>
package.json                         # MODIFY: add the 4 runtime deps
```

**Section order & ids** (final, no placeholders remain):
`#home` (Hero) → `#trajectory` → `#stack` → `#services` → `#projects` → `#about` → `#contact` (Contact) → Footer.

> After this phase there are **no placeholder sections**. The Header scroll-spy already observes `home/about/stack/projects/trajectory`; `#contact` is reachable via the Footer/CTA anchors. Adding `contact` to the scroll-spy is optional and covered in Task 11.

---

## Task 1: Runtime dependencies + env scaffolding

**Files:**
- Modify: `package.json` (via pnpm)
- Create: `.env.example`

- [ ] **Step 1: Install the four runtime dependencies**

Run:
```bash
pnpm add react-hook-form @hookform/resolvers zod resend
```
Expected: `package.json` `dependencies` now lists `react-hook-form`, `@hookform/resolvers`, `zod`, `resend`; `pnpm-lock.yaml` updated.

- [ ] **Step 2: Verify they resolve**

Run:
```bash
node -e "console.log(['react-hook-form','@hookform/resolvers','zod','resend'].map(n=>{try{require.resolve(n);return n+':ok'}catch(e){return n+':MISSING'}}))"
```
Expected: all `:ok`. (`@hookform/resolvers` resolves at `@hookform/resolvers/package.json` — if the bare specifier errors, that is fine; the import used later is `@hookform/resolvers/zod`, verified at typecheck time in Task 8.)

- [ ] **Step 3: Create `.env.example`**

```bash
# Resend — contact form email delivery (server-only)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Discord user id for Lanyard live status (public; client-side fetch).
# If unset, the hook falls back to the constant in src/hooks/useLanyard.ts.
VITE_DISCORD_ID=
```

- [ ] **Step 4: Confirm `.env` is gitignored**

Run: `git check-ignore .env || echo "NOT IGNORED"`
Expected: prints `.env` (already ignored). If it prints `NOT IGNORED`, append a line `.env` to `.gitignore` and re-run until it prints `.env`.

- [ ] **Step 5: Commit**

```bash
pnpm check
git add package.json pnpm-lock.yaml .env.example .gitignore
git commit -m "chore(deps): add react-hook-form, zod, resolvers, resend + env scaffold

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: i18n chrome strings for Contact / EasterEgg / CV / NOW detail

**Files:**
- Modify: `src/i18n/resources/pt.ts`
- Modify: `src/i18n/resources/en.ts`
- Modify: `src/i18n/resources/es.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: extended `UIStrings` (inferred from `pt`) with new top-level keys `contact`, `easter`, `cv`, and **added keys inside the existing `now` group** (`since`, `ago`). `en`/`es` are typed `UIStrings` and must mirror the shape exactly.

- [ ] **Step 1: Append the new groups to `src/i18n/resources/pt.ts`** (inside the `pt` object, after the existing `now` group's closing — add the three new keys to `now`, then add `contact`/`easter`/`cv`). Replace the current `now` block and add the rest:

```ts
  now: {
    title: 'AGORA',
    coding: 'Programando',
    playing: 'Jogando',
    listening: 'Ouvindo',
    offline: 'Offline',
    idle: 'Nada por agora',
    since: 'desde',
    ago: 'há {{hours}}h',
  },
  contact: {
    eyebrow: 'CONTATO',
    title: 'Vamos',
    titleAccent: 'conversar',
    closer: 'Bora construir?',
    closerNote: '(ou só puxar um papo)',
    statusOpen: 'ABERTO · FREELAS · REDE · CAFÉ',
    statusReply: 'RESPONDO EM ~2H · FUSO BRT',
    nameLabel: 'Como te chamo?',
    namePlaceholder: 'seu nome aqui',
    emailLabel: 'Pra onde respondo?',
    emailPlaceholder: 'você@email.com',
    messageLabel: 'O que tem em mente?',
    messagePlaceholder: 'projeto, ideia, dúvida, café...',
    counter: '{{count}} / 500',
    submit: 'Enviar',
    sending: 'Enviando...',
    spamNote: 'nada de spam, hein 🐼',
    errorName: 'Diz teu nome aí',
    errorEmail: 'E-mail inválido',
    errorMessage: 'Escreve uma mensagem',
    errorMessageMax: 'Máximo de 500 caracteres',
    success: 'Mensagem enviada — respondo logo!',
    errorRate: 'Muitas mensagens — tenta de novo daqui a algumas horas.',
    errorServer: 'Algo falhou — tenta pelos canais diretos.',
    errorNetwork: 'Backend offline — tenta pelos canais diretos.',
    channelsTitle: 'CANAIS DIRETOS',
  },
  easter: {
    eyebrow: 'PANDA · MODE',
    caption: 'ele dança quando você olha',
    meta: 'GIF · LOOP · 0:02',
    close: 'Fechar',
    alt: 'Panda pixel-art dançando',
  },
  cv: {
    fallbackTooltip: 'CV disponível por enquanto só em português',
  },
```

- [ ] **Step 2: Append the matching `en` groups to `src/i18n/resources/en.ts`** (replace `now`, add the rest):

```ts
  now: {
    title: 'NOW',
    coding: 'Coding',
    playing: 'Playing',
    listening: 'Listening',
    offline: 'Offline',
    idle: 'Nothing right now',
    since: 'since',
    ago: '{{hours}}h ago',
  },
  contact: {
    eyebrow: 'CONTACT',
    title: "Let's",
    titleAccent: 'talk',
    closer: 'Shall we build something?',
    closerNote: '(or just say hi)',
    statusOpen: 'OPEN · FREELANCE · NETWORK · COFFEE',
    statusReply: 'I REPLY IN ~2H · BRT',
    nameLabel: 'What should I call you?',
    namePlaceholder: 'your name here',
    emailLabel: 'Where do I reply?',
    emailPlaceholder: 'you@email.com',
    messageLabel: "What's on your mind?",
    messagePlaceholder: 'project, idea, question, coffee...',
    counter: '{{count}} / 500',
    submit: 'Send',
    sending: 'Sending...',
    spamNote: 'no spam, promise 🐼',
    errorName: 'Tell me your name',
    errorEmail: 'Invalid email',
    errorMessage: 'Write a message',
    errorMessageMax: '500 characters max',
    success: 'Message sent — I’ll reply soon!',
    errorRate: 'Too many messages — try again in a few hours.',
    errorServer: 'Something failed — try the direct channels.',
    errorNetwork: 'Backend offline — try the direct channels.',
    channelsTitle: 'DIRECT CHANNELS',
  },
  easter: {
    eyebrow: 'PANDA · MODE',
    caption: 'he dances when you see him',
    meta: 'GIF · LOOP · 0:02',
    close: 'Close',
    alt: 'Dancing pixel-art panda',
  },
  cv: {
    fallbackTooltip: 'CV currently available only in Portuguese',
  },
```

- [ ] **Step 3: Append the matching `es` groups to `src/i18n/resources/es.ts`** (replace `now`, add the rest):

```ts
  now: {
    title: 'AHORA',
    coding: 'Programando',
    playing: 'Jugando',
    listening: 'Escuchando',
    offline: 'Offline',
    idle: 'Nada por ahora',
    since: 'desde',
    ago: 'hace {{hours}}h',
  },
  contact: {
    eyebrow: 'CONTACTO',
    title: 'Vamos a',
    titleAccent: 'charlar',
    closer: '¿Construimos algo?',
    closerNote: '(o solo saluda)',
    statusOpen: 'ABIERTO · FREELANCE · RED · CAFÉ',
    statusReply: 'RESPONDO EN ~2H · BRT',
    nameLabel: '¿Cómo te llamo?',
    namePlaceholder: 'tu nombre aquí',
    emailLabel: '¿A dónde respondo?',
    emailPlaceholder: 'tú@email.com',
    messageLabel: '¿Qué tienes en mente?',
    messagePlaceholder: 'proyecto, idea, duda, café...',
    counter: '{{count}} / 500',
    submit: 'Enviar',
    sending: 'Enviando...',
    spamNote: 'nada de spam, eh 🐼',
    errorName: 'Dime tu nombre',
    errorEmail: 'Correo inválido',
    errorMessage: 'Escribe un mensaje',
    errorMessageMax: 'Máximo 500 caracteres',
    success: 'Mensaje enviado — ¡respondo pronto!',
    errorRate: 'Demasiados mensajes — inténtalo en unas horas.',
    errorServer: 'Algo falló — usa los canales directos.',
    errorNetwork: 'Backend offline — usa los canales directos.',
    channelsTitle: 'CANALES DIRECTOS',
  },
  easter: {
    eyebrow: 'PANDA · MODE',
    caption: 'baila cuando lo miras',
    meta: 'GIF · LOOP · 0:02',
    close: 'Cerrar',
    alt: 'Panda pixel-art bailando',
  },
  cv: {
    fallbackTooltip: 'CV disponible por ahora solo en portugués',
  },
```

- [ ] **Step 4: Typecheck** (confirms `en`/`es` match the `pt`-inferred `UIStrings` shape exactly)

Run: `pnpm typecheck`
Expected: PASS. If it fails, a key is missing or misspelled in `en`/`es` — align it with `pt`.

- [ ] **Step 5: Commit**

```bash
pnpm check
git add src/i18n/resources
git commit -m "feat(i18n): chrome strings for contact/easter/cv + now detail

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Contact channels data (TDD structure)

**Files:**
- Create: `src/data/channels.ts`
- Test: `src/data/channels.test.ts`

**Interfaces:**
- Consumes: `type L` from `@/i18n/useLocalized`.
- Produces:
  - `type Channel = { id: string; icon: string; label: L; handle: string; href: string }`
  - `const CONTACT_CHANNELS: Channel[]` — exactly 4: email, linkedin, github, discord.

> `icon` is a string key resolved to a Tabler component in the Contact section (same pattern as Services/ProjectDialog). `label` is the short descriptor ("more formal", "professional network", …). `handle` is the visible identifier; `href` is the link target (`mailto:` for email). URLs are `// TODO(petros)` placeholders mirroring the Footer's.

- [ ] **Step 1: Write the failing test** (`src/data/channels.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { CONTACT_CHANNELS } from './channels'

describe('CONTACT_CHANNELS', () => {
  it('has exactly 4 channels', () => {
    expect(CONTACT_CHANNELS).toHaveLength(4)
  })
  it('has the expected ids in order', () => {
    expect(CONTACT_CHANNELS.map((c) => c.id)).toEqual([
      'email',
      'linkedin',
      'github',
      'discord',
    ])
  })
  it('every channel has an icon, href, handle, and a label in all 3 languages', () => {
    for (const c of CONTACT_CHANNELS) {
      expect(c.icon).toBeTruthy()
      expect(c.href).toBeTruthy()
      expect(c.handle).toBeTruthy()
      expect(c.label.pt).toBeTruthy()
      expect(c.label.en).toBeTruthy()
      expect(c.label.es).toBeTruthy()
    }
  })
  it('email channel uses a mailto href', () => {
    const email = CONTACT_CHANNELS.find((c) => c.id === 'email')
    expect(email?.href.startsWith('mailto:')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/data/channels.test.ts`
Expected: FAIL — cannot resolve `./channels`.

- [ ] **Step 3: Write `src/data/channels.ts`**

```ts
import type { L } from '@/i18n/useLocalized'

export type Channel = {
  id: string
  icon: string
  label: L
  handle: string
  href: string
}

// TODO(petros): replace '#' hrefs with real profile URLs before launch.
export const CONTACT_CHANNELS: Channel[] = [
  {
    id: 'email',
    icon: 'IconMail',
    label: { pt: 'mais formal', en: 'more formal', es: 'más formal' },
    handle: 'joaopcarvalho.cds@gmail.com',
    href: 'mailto:joaopcarvalho.cds@gmail.com',
  },
  {
    id: 'linkedin',
    icon: 'IconBrandLinkedin',
    label: {
      pt: 'rede profissional',
      en: 'professional network',
      es: 'red profesional',
    },
    handle: 'in/joaopedro-carvalho',
    href: '#',
  },
  {
    id: 'github',
    icon: 'IconBrandGithub',
    label: { pt: 'open source', en: 'open source', es: 'open source' },
    handle: '@JohnPetros',
    href: '#',
  },
  {
    id: 'discord',
    icon: 'IconBrandDiscord',
    label: { pt: 'papo casual', en: 'casual chat', es: 'charla casual' },
    handle: '@johnpetros',
    href: '#',
  },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/data/channels.test.ts`
Expected: PASS (4 cases).

- [ ] **Step 5: Commit**

```bash
pnpm check
git add src/data/channels.ts src/data/channels.test.ts
git commit -m "feat(data): contact channels — 4 entries (email/linkedin/github/discord)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: `useLanyard` hook — activity-priority derivation (TDD) + polling

**Files:**
- Create: `src/hooks/useLanyard.ts`
- Test: `src/hooks/useLanyard.test.ts`

**Interfaces:**
- Consumes: nothing (browser `fetch`).
- Produces:
  - `type ActivityKind = 'coding' | 'playing' | 'listening' | 'offline'`
  - `type Activity = { kind: ActivityKind; detail?: string }`
  - `type LanyardData = { discord_status?: string; listening_to_spotify?: boolean; spotify?: { song?: string; artist?: string } | null; activities?: { type: number; name?: string; state?: string; details?: string }[] }`
  - `const ACTIVITY_COLOR: Record<ActivityKind, string>` — the four fixed colors.
  - `function deriveActivity(data: LanyardData | null): Activity` — priority **Coding > Playing > Listening > Offline**. Coding = an activity whose `name` matches `/visual studio code|vscode|^code$/i` (its `details` becomes `detail`); Playing = any `type === 0` activity (`name` → `detail`); Listening = `listening_to_spotify` true (`"song — artist"` → `detail`); else Offline.
  - `function useLanyard(): { activity: Activity; lastOnlineAt: number | null }` — polls `https://api.lanyard.rest/v1/users/{id}` every 30s, derives the activity, and **caches the last non-offline activity** (returns it instead of a transient offline on fetch failure), tracking `lastOnlineAt` (epoch ms) for the "Xh ago" label.

> Only `deriveActivity` and `ACTIVITY_COLOR` are unit-tested (pure). The polling/caching is verified in the dev smoke-test (Task 7). The Discord id is a public constant; the fetch is client-only and guarded so SSR returns the offline default.

- [ ] **Step 1: Write the failing test** (`src/hooks/useLanyard.test.ts`)

```ts
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
    expect(r.detail).toBe('Song — Artist')
  })
  it('exposes a fixed color for each kind', () => {
    expect(ACTIVITY_COLOR.coding).toBe('#4A8FE7')
    expect(ACTIVITY_COLOR.playing).toBe('#A855F7')
    expect(ACTIVITY_COLOR.listening).toBe('#1ED760')
    expect(ACTIVITY_COLOR.offline).toBe('#555')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/hooks/useLanyard.test.ts`
Expected: FAIL — cannot resolve `./useLanyard`.

- [ ] **Step 3: Write `src/hooks/useLanyard.ts`**

```ts
import { useEffect, useRef, useState } from 'react'

export type ActivityKind = 'coding' | 'playing' | 'listening' | 'offline'
export type Activity = { kind: ActivityKind; detail?: string }

export type LanyardData = {
  discord_status?: string
  listening_to_spotify?: boolean
  spotify?: { song?: string; artist?: string } | null
  activities?: { type: number; name?: string; state?: string; details?: string }[]
}

// PRD §Lanyard: these four are fixed, non-thematic brand-ish colors.
export const ACTIVITY_COLOR: Record<ActivityKind, string> = {
  coding: '#4A8FE7',
  playing: '#A855F7',
  listening: '#1ED760',
  offline: '#555',
}

// TODO(petros): replace with the real Discord user id (public — client fetch).
const DISCORD_ID =
  (import.meta.env?.VITE_DISCORD_ID as string | undefined) || '000000000000000000'
const POLL_MS = 30_000
const CODE_RE = /visual studio code|vscode|^code$/i

export function deriveActivity(data: LanyardData | null): Activity {
  if (!data) return { kind: 'offline' }
  const activities = data.activities ?? []
  const coding = activities.find((a) => a.name && CODE_RE.test(a.name))
  if (coding) return { kind: 'coding', detail: coding.details ?? coding.name }
  const playing = activities.find((a) => a.type === 0)
  if (playing) return { kind: 'playing', detail: playing.name }
  if (data.listening_to_spotify && data.spotify) {
    const { song, artist } = data.spotify
    const detail = [song, artist].filter(Boolean).join(' — ') || undefined
    return { kind: 'listening', detail }
  }
  return { kind: 'offline' }
}

export function useLanyard(): { activity: Activity; lastOnlineAt: number | null } {
  const [activity, setActivity] = useState<Activity>({ kind: 'offline' })
  const [lastOnlineAt, setLastOnlineAt] = useState<number | null>(null)
  const lastGood = useRef<Activity | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let alive = true

    const poll = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
        if (!res.ok) throw new Error(String(res.status))
        const json = (await res.json()) as { data?: LanyardData }
        if (!alive) return
        const next = deriveActivity(json.data ?? null)
        if (next.kind === 'offline') {
          // keep the last non-offline state rather than flashing offline
          setActivity(lastGood.current ?? next)
        } else {
          lastGood.current = next
          setActivity(next)
          setLastOnlineAt(Date.now())
        }
      } catch {
        if (!alive) return
        setActivity(lastGood.current ?? { kind: 'offline' })
      }
    }

    poll()
    const id = setInterval(poll, POLL_MS)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  return { activity, lastOnlineAt }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/hooks/useLanyard.test.ts`
Expected: PASS (6 cases).

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck`
Expected: PASS. If `import.meta.env` errors under `tsc`, it is Vite-provided; the optional-chaining + cast above keeps it type-safe. If it still complains, change the constant to `const DISCORD_ID = '000000000000000000' // TODO(petros)` and drop the env read.

- [ ] **Step 6: Commit**

```bash
pnpm check
git add src/hooks/useLanyard.ts src/hooks/useLanyard.test.ts
git commit -m "feat(hooks): useLanyard — activity-priority derivation + 30s polling cache

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Contact schema + honeypot + rate-limit math (TDD)

**Files:**
- Create: `src/server/contact.schema.ts`
- Test: `src/server/contact.schema.test.ts`

**Interfaces:**
- Consumes: `zod`.
- Produces:
  - `const contactSchema` — Zod object `{ name: string 1–80, email: valid email, message: string 1–500, website: optional string (honeypot) }`.
  - `type ContactInput = z.infer<typeof contactSchema>`
  - `function isHoneypot(input: { website?: string }): boolean` — true if `website` is a non-empty trimmed string.
  - `function withinWindow(timestamps: number[], now: number, windowMs: number): number[]` — keep only timestamps newer than `now - windowMs`.
  - `function isRateLimited(timestamps: number[], now: number, windowMs: number, max: number): boolean` — true if the in-window count ≥ `max`.
  - `const RATE_WINDOW_MS` (= 24h) and `const RATE_MAX` (= 3).

> This module is **isomorphic** (no server-only imports) so the client form and the server fn share one schema, and the pure helpers are unit-tested. Resend + request access live in `contact.ts` (Task — handler), which is server-only.

- [ ] **Step 1: Write the failing test** (`src/server/contact.schema.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import {
  RATE_MAX,
  RATE_WINDOW_MS,
  contactSchema,
  isHoneypot,
  isRateLimited,
  withinWindow,
} from './contact.schema'

describe('contactSchema', () => {
  it('accepts a valid payload', () => {
    const r = contactSchema.safeParse({
      name: 'Petros',
      email: 'a@b.com',
      message: 'hello',
    })
    expect(r.success).toBe(true)
  })
  it('rejects an invalid email', () => {
    const r = contactSchema.safeParse({ name: 'P', email: 'nope', message: 'hi' })
    expect(r.success).toBe(false)
  })
  it('rejects an empty message', () => {
    const r = contactSchema.safeParse({ name: 'P', email: 'a@b.com', message: '' })
    expect(r.success).toBe(false)
  })
  it('rejects a message over 500 chars', () => {
    const r = contactSchema.safeParse({
      name: 'P',
      email: 'a@b.com',
      message: 'x'.repeat(501),
    })
    expect(r.success).toBe(false)
  })
})

describe('isHoneypot', () => {
  it('is false when website is empty/absent', () => {
    expect(isHoneypot({})).toBe(false)
    expect(isHoneypot({ website: '   ' })).toBe(false)
  })
  it('is true when website is filled', () => {
    expect(isHoneypot({ website: 'http://spam' })).toBe(true)
  })
})

describe('rate limiting', () => {
  it('drops timestamps outside the window', () => {
    const now = 1_000_000
    const ts = [now - RATE_WINDOW_MS - 1, now - 10]
    expect(withinWindow(ts, now, RATE_WINDOW_MS)).toEqual([now - 10])
  })
  it('limits at RATE_MAX within the window', () => {
    const now = 1_000_000
    const recent = Array.from({ length: RATE_MAX }, () => now - 5)
    expect(isRateLimited(recent, now, RATE_WINDOW_MS, RATE_MAX)).toBe(true)
    expect(isRateLimited(recent.slice(1), now, RATE_WINDOW_MS, RATE_MAX)).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/server/contact.schema.test.ts`
Expected: FAIL — cannot resolve `./contact.schema`.

- [ ] **Step 3: Write `src/server/contact.schema.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/server/contact.schema.test.ts`
Expected: PASS (8 cases). If Zod's `.email()` is reported deprecated in your installed version, it still works; leave as-is.

- [ ] **Step 5: Commit**

```bash
pnpm check
git add src/server/contact.schema.ts src/server/contact.schema.test.ts
git commit -m "feat(server): contact schema — zod validation + honeypot + rate-limit math

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Contact server function (Resend backend)

**Files:**
- Create: `src/server/contact.ts`

**Interfaces:**
- Consumes: `createServerFn` from `@tanstack/react-start`; `getRequestIP` from `@tanstack/react-start/server`; `contactSchema`, `isHoneypot`, `isRateLimited`, `RATE_MAX`, `RATE_WINDOW_MS` from `./contact.schema`; `Resend` from `resend`.
- Produces:
  - `type ContactResult = { ok: true } | { ok: false; reason: 'rate' | 'server' }`
  - `const sendContact` — a `createServerFn({ method: 'POST' })` validated by `contactSchema`, returning `Promise<ContactResult>`.

> Flow: validate (schema runs in `.validator`) → if honeypot filled, return `{ ok: true }` silently (discard) → resolve IP, check the module-level in-memory `Map<string, number[]>`; if limited return `{ ok: false, reason: 'rate' }` → send via Resend; on throw return `{ ok: false, reason: 'server' }`; on success record the timestamp and return `{ ok: true }`. The in-memory map is per-instance (sufficient per PRD "via memory or KV store"); a `// TODO(petros): swap for Vercel KV in production` notes the upgrade. `RESEND_API_KEY` is read at call time from `process.env`; if missing, treat as a server error (do not throw at import).

- [ ] **Step 1: Create `src/server/contact.ts`**

```ts
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
```

- [ ] **Step 2: Verify the server APIs resolve.**

Run: `pnpm typecheck`
Expected: PASS. If `getRequestIP` is reported as not exported from `@tanstack/react-start/server`, confirm it with `grep -rn "getRequestIP" node_modules/@tanstack/start-server-core/dist/esm/request-response.d.ts` (it is re-exported through `@tanstack/react-start/server`). If `.validator` is reported missing, use `.inputValidator(contactSchema)` (the older alias) instead.

- [ ] **Step 3: Build to confirm the server fn compiles and is split correctly**

Run: `pnpm build`
Expected: client + SSR builds succeed. `resend` and `process.env.RESEND_API_KEY` must **not** appear in any `dist/client/**` chunk (TanStack Start strips the handler from the client bundle). Spot-check:
```bash
grep -rl "RESEND_API_KEY" dist/client 2>/dev/null && echo "LEAKED" || echo "clean"
```
Expected: `clean`.

- [ ] **Step 4: Commit**

```bash
pnpm check
git add src/server/contact.ts
git commit -m "feat(server): contact server fn — honeypot, IP rate limit, Resend send

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: CV language resolution (TDD) + reactive Hero CTA

**Files:**
- Create: `src/data/cv.ts`
- Test: `src/data/cv.test.ts`
- Modify: `src/components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `type Lang` from `@/theme/theme`.
- Produces:
  - `const CV_AVAILABLE: Lang[]` — languages with a real PDF (initially `['pt-BR']`).
  - `function cvFilename(lang: Lang): string` — the download filename, falling back to the pt-BR file when `lang` is unavailable.
  - `function cvHref(lang: Lang): string` — `/${cvFilename(lang)}`.
  - `function isCvFallback(lang: Lang): boolean` — true when the requested `lang` has no PDF yet.

> The CTA reads the active language from `useTheme().state.lang` and binds `href`/`download` reactively — no server round-trip for the static case (the per-language CV is a static asset; a server fn is unnecessary for this and avoided per YAGNI). When `isCvFallback(lang)` is true, wrap the button in the Phase 3 `Tooltip` showing `cv.fallbackTooltip`.

- [ ] **Step 1: Write the failing test** (`src/data/cv.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { CV_AVAILABLE, cvFilename, cvHref, isCvFallback } from './cv'

describe('cv', () => {
  it('pt-BR resolves to the pt file', () => {
    expect(cvFilename('pt-BR')).toBe('petros-cv-pt.pdf')
    expect(cvHref('pt-BR')).toBe('/petros-cv-pt.pdf')
    expect(isCvFallback('pt-BR')).toBe(false)
  })
  it('an unavailable language falls back to the pt file', () => {
    // Guard the assertion to the current availability set.
    if (!CV_AVAILABLE.includes('es')) {
      expect(cvFilename('es')).toBe('petros-cv-pt.pdf')
      expect(isCvFallback('es')).toBe(true)
    }
  })
  it('an available language resolves to its own file', () => {
    if (CV_AVAILABLE.includes('en')) {
      expect(cvFilename('en')).toBe('petros-cv-en.pdf')
      expect(isCvFallback('en')).toBe(false)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/data/cv.test.ts`
Expected: FAIL — cannot resolve `./cv`.

- [ ] **Step 3: Write `src/data/cv.ts`**

```ts
import type { Lang } from '@/theme/theme'

const FILE: Record<Lang, string> = {
  'pt-BR': 'petros-cv-pt.pdf',
  en: 'petros-cv-en.pdf',
  es: 'petros-cv-es.pdf',
}

// TODO(petros): add 'en' / 'es' once those PDFs exist in /public.
export const CV_AVAILABLE: Lang[] = ['pt-BR']

export function cvFilename(lang: Lang): string {
  return CV_AVAILABLE.includes(lang) ? FILE[lang] : FILE['pt-BR']
}

export function cvHref(lang: Lang): string {
  return `/${cvFilename(lang)}`
}

export function isCvFallback(lang: Lang): boolean {
  return !CV_AVAILABLE.includes(lang)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/data/cv.test.ts`
Expected: PASS.

- [ ] **Step 5: Wire the reactive CTA in `src/components/sections/Hero.tsx`.** Add imports at the top:

```tsx
import { Tooltip } from '@/components/common/Tooltip'
import { cvHref, cvFilename, isCvFallback } from '@/data/cv'
import { useTheme } from '@/theme/ThemeProvider'
```

Inside `Hero()`, after `const clock = useBrtClock()`, add:

```tsx
  const { state } = useTheme()
  const { lang } = state
  const cvFallback = isCvFallback(lang)
```

Then replace the existing CV `<a>` element (the one with `href='/petros-cv-pt.pdf'`) with this reactive version (the surrounding `<div className='mt-8 flex flex-wrap gap-3'>` stays):

```tsx
              {cvFallback ? (
                <Tooltip label={t('cv.fallbackTooltip')}>
                  <a
                    href={cvHref(lang)}
                    download={cvFilename(lang)}
                    className='inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-accent px-5 font-sans text-body font-medium text-[#0a0a0a] transition-all duration-[var(--dur-micro)] hover:brightness-110 max-sm:w-full'
                  >
                    {t('hero.downloadCv')}
                  </a>
                </Tooltip>
              ) : (
                <a
                  href={cvHref(lang)}
                  download={cvFilename(lang)}
                  className='inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-accent px-5 font-sans text-body font-medium text-[#0a0a0a] transition-all duration-[var(--dur-micro)] hover:brightness-110 max-sm:w-full'
                >
                  {t('hero.downloadCv')}
                </a>
              )}
```

> Leave the `See my panda` `Button` as-is for now (wired in Task 9).

- [ ] **Step 6: Typecheck + lint**

Run: `pnpm typecheck && pnpm check`
Expected: PASS. The CTA `href`/`download` now follow the active language; switching language in the SettingsPopover updates them with no reload.

- [ ] **Step 7: Commit**

```bash
git add src/data/cv.ts src/data/cv.test.ts src/components/sections/Hero.tsx
git commit -m "feat(cv): per-language resolver + reactive Hero download CTA

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: `LanyardPill` + Header wiring + live NOW panel

**Files:**
- Create: `src/components/sections/LanyardPill.tsx`
- Modify: `src/components/sections/Header.tsx`
- Modify: `src/components/sections/NowPanel.tsx`

**Interfaces:**
- Consumes: `useLanyard`, `ACTIVITY_COLOR`, `type ActivityKind` from `@/hooks/useLanyard`; `useTranslation`; Tabler icons `IconCode`, `IconDeviceGamepad2`, `IconMusic`, `IconCircleFilled`; `cn`.
- Produces:
  - `LanyardPill()` — a compact, `aria-live="polite"` pill: colored dot + kind icon + label text (kind name; `detail` when present). It is an `<a href='#about'>` (PRD: click scrolls to About). On mobile (`max-md`) the text label is hidden — dot + icon only.
  - `ACTIVITY_ICON` map shared into `NowPanel` (export from `LanyardPill.tsx`).

> The pill label uses `now.coding/playing/listening/offline`. The dot color comes from `ACTIVITY_COLOR[kind]` (inline `style`, the sanctioned fixed colors). NOW panel rows show all three states with live detail when the matching activity is current, else the offline placeholder.

- [ ] **Step 1: Verify the Tabler icon names resolve.**

Run: `node -e "const i=require('@tabler/icons-react'); console.log(['IconCode','IconDeviceGamepad2','IconMusic','IconCircleFilled'].map(n=>n+':'+(n in i)))"`
Expected: all `:true`. Substitute a present alternative for any `false` (e.g. `IconDeviceGamepad` for `IconDeviceGamepad2`) in both the import and the maps below.

- [ ] **Step 2: Create `src/components/sections/LanyardPill.tsx`**

```tsx
import {
  IconCode,
  IconDeviceGamepad2,
  IconMusic,
  type IconProps,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { ACTIVITY_COLOR, type ActivityKind, useLanyard } from '@/hooks/useLanyard'

export const ACTIVITY_ICON: Record<ActivityKind, ComponentType<IconProps>> = {
  coding: IconCode,
  playing: IconDeviceGamepad2,
  listening: IconMusic,
  offline: IconMusic,
}

const KIND_KEY: Record<ActivityKind, string> = {
  coding: 'now.coding',
  playing: 'now.playing',
  listening: 'now.listening',
  offline: 'now.offline',
}

export function LanyardPill() {
  const { t } = useTranslation()
  const { activity } = useLanyard()
  const Icon = ACTIVITY_ICON[activity.kind]
  const label = activity.detail ?? t(KIND_KEY[activity.kind])

  return (
    <a
      href='#about'
      aria-live='polite'
      aria-label={`${t(KIND_KEY[activity.kind])}${activity.detail ? `: ${activity.detail}` : ''}`}
      className='inline-flex min-h-9 items-center gap-2 rounded-pill border-[0.5px] border-border bg-bg-card px-3 font-mono text-meta tracking-meta uppercase text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20'
    >
      <span
        aria-hidden
        className='size-1.5 shrink-0 rounded-pill'
        style={{ background: ACTIVITY_COLOR[activity.kind] }}
      />
      <Icon size={14} stroke={1.5} aria-hidden />
      <span className='hidden max-w-[160px] truncate md:inline'>{label}</span>
    </a>
  )
}
```

- [ ] **Step 3: Mount the pill in `src/components/sections/Header.tsx`.** Add the import and replace the `{/* TODO Phase 4: Lanyard live-status pill */}` comment line:

```tsx
import { LanyardPill } from './LanyardPill'
```

Replace:
```tsx
        {/* TODO Phase 4: Lanyard live-status pill */}
        {/* TODO later: mobile hamburger + drawer nav */}
        <SettingsPopover />
```
with:
```tsx
        <LanyardPill />
        <SettingsPopover />
```

> The mobile hamburger is added in Task 10; leave the second comment out for now (don't reference a not-yet-created component).

- [ ] **Step 4: Make `NowPanel` consume live state.** Replace the body of `src/components/sections/NowPanel.tsx` with:

```tsx
import { useTranslation } from 'react-i18next'
import { ACTIVITY_COLOR, type ActivityKind, useLanyard } from '@/hooks/useLanyard'
import { ACTIVITY_ICON } from './LanyardPill'
import { cn } from '@/lib/utils'

const ROWS: { kind: Exclude<ActivityKind, 'offline'>; key: string }[] = [
  { kind: 'coding', key: 'now.coding' },
  { kind: 'playing', key: 'now.playing' },
  { kind: 'listening', key: 'now.listening' },
]

function Equalizer() {
  return (
    <span aria-hidden className='flex h-4 items-end gap-0.5'>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className='w-0.5 rounded-pill bg-accent motion-safe:animate-petros-equalizer'
          style={{ height: '100%', animationDelay: `${i * 180}ms` }}
        />
      ))}
    </span>
  )
}

export function NowPanel() {
  const { t } = useTranslation()
  const { activity } = useLanyard()

  return (
    <div className='rounded-md border-[0.5px] border-border bg-accent-tint-06 p-5 shadow-[var(--shadow-card)]'>
      <p className='font-mono text-meta tracking-meta uppercase text-text-muted'>
        <span
          aria-hidden
          className='mr-2 inline-block size-1.5 rounded-pill bg-accent align-middle motion-safe:animate-petros-pulse'
        />
        {t('now.title')}
      </p>
      <ul aria-live='polite' className='mt-4 flex flex-col gap-3'>
        {ROWS.map((row) => {
          const isLive = activity.kind === row.kind
          const Icon = ACTIVITY_ICON[row.kind]
          return (
            <li key={row.kind} className='flex items-center justify-between gap-3'>
              <span className='flex items-center gap-2 font-sans text-body-sm text-text-secondary'>
                <Icon
                  size={16}
                  stroke={1.5}
                  aria-hidden
                  style={{ color: isLive ? ACTIVITY_COLOR[row.kind] : undefined }}
                />
                {t(row.key)}
              </span>
              <span
                className={cn(
                  'flex items-center gap-2 font-mono text-micro tracking-meta uppercase',
                  isLive ? 'text-text-secondary' : 'text-text-faint',
                )}
              >
                {row.kind === 'listening' && isLive ? <Equalizer /> : null}
                {isLive && activity.detail ? (
                  <span className='max-w-[160px] truncate normal-case'>
                    {activity.detail}
                  </span>
                ) : (
                  t('now.offline')
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

> `useLanyard` is called in both `LanyardPill` and `NowPanel`; each manages its own 30s poll. That is acceptable (two lightweight polls). If you prefer a single poll, lift it to a context later — not required this phase (YAGNI).

- [ ] **Step 5: Typecheck + lint**

Run: `pnpm typecheck && pnpm check`
Expected: PASS.

- [ ] **Step 6: Smoke-test in dev**

Run: `pnpm dev` and open `http://localhost:3000`
Expected: a status pill appears in the Header (offline state until a real Discord id is set — dot is grey `#555`, icon + (desktop) "Offline" label); clicking it scrolls to About; the NOW panel shows 3 rows in the offline placeholder state with the pulsing AGORA bullet. No console errors; no SSR crash (the fetch is client-only).

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/LanyardPill.tsx src/components/sections/Header.tsx src/components/sections/NowPanel.tsx
git commit -m "feat(section): Lanyard pill in Header + live NOW panel wiring

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: `Contact` section (form + channels + status region)

**Files:**
- Create: `src/components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `useForm` from `react-hook-form`; `zodResolver` from `@hookform/resolvers/zod`; `contactSchema`, `type ContactInput` from `@/server/contact.schema`; `sendContact` from `@/server/contact`; `CONTACT_CHANNELS` from `@/data/channels`; `Reveal` from `@/components/common/Reveal`; `Eyebrow`, `DotHeading`, `StatusPill` from `@/components/primitives`; `useLocalized`; `useTranslation`; Tabler icons (`IconSend`, `IconArrowRight`, plus the channel icons `IconMail`, `IconBrandLinkedin`, `IconBrandGithub`, `IconBrandDiscord`); `cn`.
- Produces: `Contact()` — section `#contact`: headline + closer + two status pills, a left-accent-bar form card (name/email/message with inline errors + live char counter + honeypot input), a submit button with sending state, an `aria-live` status region, and a 4-card channel grid.

> Validation uses the **shared** `contactSchema` via `zodResolver`, so client + server agree. The honeypot is a visually-hidden `website` input (`sr-only`, `tabIndex={-1}`, `autoComplete='off'`). On submit, call `sendContact({ data })`; map the result to the success/`rate`/`server` i18n message; a thrown/network error → `errorNetwork`. The counter turns accent above 400 and red (`text-red-500` is **not** a token — use the danger pattern below) above 480: use `text-accent` ≥400 and `text-text-primary` <400; for >480 use `text-accent` with `font-medium` (the design has no dedicated danger token — keep it accent-based, matching the token rule; do **not** introduce a raw red hex).

- [ ] **Step 1: Verify the Tabler icon names resolve.**

Run: `node -e "const i=require('@tabler/icons-react'); console.log(['IconArrowRight','IconMail','IconBrandLinkedin','IconBrandGithub','IconBrandDiscord'].map(n=>n+':'+(n in i)))"`
Expected: all `:true`.

- [ ] **Step 2: Create `src/components/sections/Contact.tsx`**

```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import {
  IconArrowRight,
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  type IconProps,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/common/Reveal'
import { DotHeading, Eyebrow, StatusPill } from '@/components/primitives'
import { CONTACT_CHANNELS } from '@/data/channels'
import { useLocalized } from '@/i18n/useLocalized'
import { type ContactInput, contactSchema } from '@/server/contact.schema'
import { sendContact } from '@/server/contact'
import { cn } from '@/lib/utils'

const CHANNEL_ICONS: Record<string, ComponentType<IconProps>> = {
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandDiscord,
}

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'done'; key: string }

export function Contact() {
  const { t } = useTranslation()
  const localize = useLocalized()
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '', website: '' },
  })

  const messageLen = watch('message')?.length ?? 0

  const onSubmit = handleSubmit(async (values) => {
    setStatus({ state: 'sending' })
    try {
      const res = await sendContact({ data: values })
      if (res.ok) {
        reset()
        setStatus({ state: 'done', key: 'contact.success' })
      } else {
        setStatus({
          state: 'done',
          key: res.reason === 'rate' ? 'contact.errorRate' : 'contact.errorServer',
        })
      }
    } catch {
      setStatus({ state: 'done', key: 'contact.errorNetwork' })
    }
  })

  const counterTone =
    messageLen > 480 ? 'text-accent font-medium' : messageLen >= 400 ? 'text-accent' : 'text-text-faint'

  return (
    <section
      id='contact'
      aria-labelledby='contact-label'
      data-themed
      className='mx-auto max-w-6xl px-section-pad-sm py-section-gap md:px-section-pad'
    >
      <Reveal>
        <Eyebrow bullet>{t('contact.eyebrow')}</Eyebrow>
        <DotHeading id='contact-label' className='mt-4'>
          {t('contact.title')}{' '}
          <span className='font-serif italic text-accent-italic'>
            {t('contact.titleAccent')}
          </span>
        </DotHeading>
        <p className='mt-6 font-sans text-h2 font-medium tracking-tight text-text-primary'>
          {t('contact.closer')}{' '}
          <span className='font-sans text-body text-text-muted'>
            {t('contact.closerNote')}
          </span>
        </p>
        <div className='mt-6 flex flex-wrap gap-3'>
          <StatusPill pulse>{t('contact.statusOpen')}</StatusPill>
          <StatusPill>{t('contact.statusReply')}</StatusPill>
        </div>
      </Reveal>

      <div className='mt-12 grid items-start gap-10 md:grid-cols-2'>
        {/* form */}
        <form
          onSubmit={onSubmit}
          noValidate
          className='relative rounded-md border-l-2 border-accent bg-bg-card p-6 shadow-[var(--shadow-card)]'
        >
          {/* honeypot — must stay empty */}
          <input
            type='text'
            tabIndex={-1}
            autoComplete='off'
            aria-hidden
            className='sr-only'
            {...register('website')}
          />

          <label className='block'>
            <span className='font-sans text-body-sm text-text-secondary'>
              {t('contact.nameLabel')}
            </span>
            <input
              type='text'
              autoComplete='name'
              placeholder={t('contact.namePlaceholder')}
              className='mt-1 w-full border-b-[0.5px] border-border bg-transparent py-2 font-sans text-body text-text-primary outline-none transition-colors focus:border-accent'
              {...register('name')}
            />
            {errors.name && (
              <span className='mt-1 block font-mono text-micro tracking-meta uppercase text-accent'>
                {t('contact.errorName')}
              </span>
            )}
          </label>

          <label className='mt-5 block'>
            <span className='font-sans text-body-sm text-text-secondary'>
              {t('contact.emailLabel')}
            </span>
            <input
              type='email'
              autoComplete='email'
              placeholder={t('contact.emailPlaceholder')}
              className='mt-1 w-full border-b-[0.5px] border-border bg-transparent py-2 font-sans text-body text-text-primary outline-none transition-colors focus:border-accent'
              {...register('email')}
            />
            {errors.email && (
              <span className='mt-1 block font-mono text-micro tracking-meta uppercase text-accent'>
                {t('contact.errorEmail')}
              </span>
            )}
          </label>

          <label className='mt-5 block'>
            <span className='font-sans text-body-sm text-text-secondary'>
              {t('contact.messageLabel')}
            </span>
            <textarea
              rows={4}
              maxLength={500}
              placeholder={t('contact.messagePlaceholder')}
              className='mt-1 w-full resize-none border-b-[0.5px] border-border bg-transparent py-2 font-sans text-body text-text-primary outline-none transition-colors focus:border-accent'
              {...register('message')}
            />
            <div className='mt-1 flex items-center justify-between'>
              {errors.message ? (
                <span className='font-mono text-micro tracking-meta uppercase text-accent'>
                  {messageLen > 500
                    ? t('contact.errorMessageMax')
                    : t('contact.errorMessage')}
                </span>
              ) : (
                <span />
              )}
              <span className={cn('font-mono text-micro tracking-meta', counterTone)}>
                {t('contact.counter', { count: messageLen })}
              </span>
            </div>
          </label>

          <button
            type='submit'
            disabled={status.state === 'sending'}
            className='group mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm bg-accent px-5 font-sans text-body font-medium text-[#0a0a0a] transition-all duration-[var(--dur-micro)] hover:gap-3 hover:brightness-110 disabled:opacity-60 max-sm:w-full'
          >
            {status.state === 'sending' ? t('contact.sending') : t('contact.submit')}
            <IconArrowRight
              size={18}
              stroke={1.5}
              aria-hidden
              className='transition-transform group-hover:translate-x-0.5'
            />
          </button>

          <p
            aria-live='polite'
            className='mt-3 min-h-5 font-mono text-micro tracking-meta uppercase text-text-secondary'
          >
            {status.state === 'done' ? t(status.key) : ''}
          </p>

          <p className='mt-2 font-serif text-body-sm italic text-accent-italic'>
            {t('contact.spamNote')}
          </p>
        </form>

        {/* channels */}
        <div>
          <p className='font-mono text-meta tracking-meta uppercase text-text-muted'>
            {t('contact.channelsTitle')}
          </p>
          <div className='mt-4 grid gap-3'>
            {CONTACT_CHANNELS.map((c) => {
              const Icon = CHANNEL_ICONS[c.icon] ?? IconMail
              const external = !c.href.startsWith('mailto:')
              return (
                <a
                  key={c.id}
                  href={c.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className='group flex items-center gap-4 rounded-md border-l-2 border-transparent bg-bg-card p-4 shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:border-accent hover:-translate-y-0.5'
                >
                  <Icon size={22} stroke={1.5} aria-hidden className='text-text-secondary group-hover:text-accent' />
                  <span className='flex flex-1 flex-col'>
                    <span className='font-sans text-body text-text-primary'>
                      {c.handle}
                    </span>
                    <span className='font-mono text-micro tracking-meta uppercase text-text-muted'>
                      {localize(c.label)}
                    </span>
                  </span>
                  <IconArrowRight
                    size={16}
                    stroke={1.5}
                    aria-hidden
                    className='text-text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent'
                  />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
```

> The visible submit button uses `IconArrowRight` (the `Enviar →` arrow), matching the PRD `ti-send` intent without an extra import.

- [ ] **Step 3: Typecheck + lint**

Run: `pnpm typecheck && pnpm check`
Expected: PASS. If `zodResolver`'s generic complains about the optional `website`, ensure `useForm<ContactInput>` matches `z.infer<typeof contactSchema>` (it does — `website` is optional in both).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Contact.tsx
git commit -m "feat(section): Contact — RHF+Zod form, honeypot, channels, status region

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: `EasterEgg` dialog + Hero wiring

**Files:**
- Create: `src/components/sections/EasterEgg.tsx`
- Modify: `src/components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `Dialog` from `radix-ui`; `Eyebrow` from `@/components/primitives`; `useTranslation`; `IconX` from `@tabler/icons-react`.
- Produces: `EasterEgg({ open, onOpenChange })` — a Radix Dialog (max-w-340px) with eyebrow `● PANDA · MODE`, the dancing-panda gif (`/panda.gif`) with a static SVG fallback, caption, meta line, and a bamboo-hill background. Reuses the Phase 3 `petros-overlay-in` / `petros-dialog-in` keyframes via the `data-petros-overlay` / `data-petros-dialog` attributes.

> The gif is a `// TODO(petros)` asset; until it exists the `<img>` 404s and the `onError` swaps to the inline SVG panda fallback. Radix supplies ESC/backdrop close + focus trap + focus return to the Hero trigger. `Dialog.Title` (visually the eyebrow/caption) is required for a11y — provide a visually-hidden title.

- [ ] **Step 1: Create `src/components/sections/EasterEgg.tsx`**

```tsx
import { IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { Dialog } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { Eyebrow } from '@/components/primitives'

function PandaFallback() {
  return (
    <span className='flex aspect-square w-full items-center justify-center rounded-md bg-gradient-to-b from-panda-from to-panda-to text-[88px]'>
      🐼
    </span>
  )
}

export function EasterEgg({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          data-petros-overlay
          className='fixed inset-0 z-40 bg-[var(--dialog-overlay)] backdrop-blur-[6px]'
        />
        <Dialog.Content
          data-petros-dialog
          data-themed
          className='fixed left-1/2 top-1/2 z-50 w-[300px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border-[0.5px] border-border bg-bg-card p-6 shadow-[var(--shadow-card)] focus:outline-none md:w-[340px]'
        >
          {/* bamboo hill bg */}
          <div
            aria-hidden
            className='pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-[0.12]'
            style={{
              background:
                'radial-gradient(120% 100% at 50% 100%, var(--accent) 0%, transparent 70%)',
            }}
          />
          <div className='relative'>
            <div className='flex items-center justify-between'>
              <Eyebrow bullet>{t('easter.eyebrow')}</Eyebrow>
              <Dialog.Close
                aria-label={t('easter.close')}
                className='flex size-9 items-center justify-center rounded-sm border-[0.5px] border-border text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent'
              >
                <IconX size={16} stroke={1.5} aria-hidden />
              </Dialog.Close>
            </div>

            <Dialog.Title className='sr-only'>{t('easter.alt')}</Dialog.Title>

            <div className='mt-4'>
              {failed ? (
                <PandaFallback />
              ) : (
                <img
                  src='/panda.gif'
                  alt={t('easter.alt')}
                  onError={() => setFailed(true)}
                  className='aspect-square w-full rounded-md object-cover motion-reduce:[image-rendering:pixelated]'
                />
              )}
            </div>

            <p className='mt-4 text-center font-serif text-body italic text-accent-italic'>
              {t('easter.caption')}
            </p>
            <p className='mt-2 text-center font-mono text-micro tracking-meta uppercase text-text-faint'>
              {t('easter.meta')}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

- [ ] **Step 2: Wire the Hero trigger.** In `src/components/sections/Hero.tsx` add:

```tsx
import { useState } from 'react'
import { EasterEgg } from './EasterEgg'
```

Inside `Hero()`, add state near the other hooks:

```tsx
  const [pandaOpen, setPandaOpen] = useState(false)
```

Replace the existing `See my panda` button:
```tsx
              {/* TODO Phase 4: open EasterEgg dialog */}
              <Button variant='secondary' className='max-sm:w-full'>
                {t('hero.seePanda')}
              </Button>
```
with:
```tsx
              <Button
                variant='secondary'
                className='max-sm:w-full'
                onClick={() => setPandaOpen(true)}
              >
                {t('hero.seePanda')}
              </Button>
```

And just before the closing `</section>` (after the bottom tech-line block's closing `</div>` for `max-w-6xl`), mount the dialog:
```tsx
      <EasterEgg open={pandaOpen} onOpenChange={setPandaOpen} />
```

- [ ] **Step 3: Verify the Tabler icon resolves.**

Run: `node -e "const i=require('@tabler/icons-react'); console.log('IconX' in i)"`
Expected: `true`.

- [ ] **Step 4: Typecheck + lint + smoke-test**

Run: `pnpm typecheck && pnpm check`
Expected: PASS.
Run: `pnpm dev` → click `See my panda 🐼` in the Hero.
Expected: a centered dialog opens (fade + zoom), shows the 🐼 fallback (no `/panda.gif` yet), caption + meta; ESC / X / backdrop close it and return focus to the button. Under reduced-motion the open is instant.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/EasterEgg.tsx src/components/sections/Hero.tsx
git commit -m "feat(section): Panda EasterEgg dialog + Hero trigger

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Mobile drawer nav

**Files:**
- Create: `src/components/sections/MobileNav.tsx`
- Modify: `src/components/sections/Header.tsx`

**Interfaces:**
- Consumes: `Dialog` from `radix-ui`; `useTranslation`; `IconMenu2`, `IconX` from `@tabler/icons-react`; `cn`.
- Produces: `MobileNav({ items, active })` — a hamburger button (visible only `md:hidden`) that opens a right-side Radix Dialog drawer with the 5 nav links stacked vertically; the active item shows an accent left-bar; clicking a link closes the drawer (anchor navigation). `items` is the same `{ id, key }[]` the Header already defines; `active` is the scroll-spy id.

- [ ] **Step 1: Verify the Tabler icon names resolve.**

Run: `node -e "const i=require('@tabler/icons-react'); console.log(['IconMenu2','IconX'].map(n=>n+':'+(n in i)))"`
Expected: both `:true`.

- [ ] **Step 2: Create `src/components/sections/MobileNav.tsx`**

```tsx
import { IconMenu2, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { Dialog } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function MobileNav({
  items,
  active,
}: {
  items: readonly { id: string; key: string }[]
  active: string | null
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type='button'
          aria-label={t('nav.menu')}
          className='flex size-9 items-center justify-center rounded-sm border-[0.5px] border-border text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent md:hidden'
        >
          <IconMenu2 size={18} stroke={1.5} aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          data-petros-overlay
          className='fixed inset-0 z-40 bg-[var(--dialog-overlay)] backdrop-blur-[6px] md:hidden'
        />
        <Dialog.Content
          data-themed
          aria-label={t('nav.menu')}
          className='fixed right-0 top-0 z-50 flex h-full w-64 flex-col gap-1 border-l-[0.5px] border-border bg-bg-card p-6 focus:outline-none md:hidden'
        >
          <div className='mb-4 flex items-center justify-end'>
            <Dialog.Close
              aria-label={t('easter.close')}
              className='flex size-9 items-center justify-center rounded-sm border-[0.5px] border-border text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent'
            >
              <IconX size={18} stroke={1.5} aria-hidden />
            </Dialog.Close>
          </div>
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                'border-l-2 px-4 py-3 font-sans text-nav text-text-secondary transition-colors hover:text-text-primary',
                active === item.id
                  ? 'border-accent text-text-primary'
                  : 'border-transparent',
              )}
            >
              {t(item.key)}
            </a>
          ))}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

- [ ] **Step 3: Add the `nav.menu` string** to all three i18n resources (inside the existing `nav` group):
  - `src/i18n/resources/pt.ts` → `nav: { …, menu: 'Menu' }`
  - `src/i18n/resources/en.ts` → `nav: { …, menu: 'Menu' }`
  - `src/i18n/resources/es.ts` → `nav: { …, menu: 'Menú' }`

- [ ] **Step 4: Mount the hamburger in `src/components/sections/Header.tsx`.** Add the import:

```tsx
import { MobileNav } from './MobileNav'
```

Update the right-side controls block so the drawer shows only on mobile and the pill/settings stay:
```tsx
      <div className='flex items-center gap-3'>
        <LanyardPill />
        <SettingsPopover />
        <MobileNav items={NAV} active={active} />
      </div>
```

> `NAV` is already `as const` with `{ id, key }`; it satisfies `MobileNav`'s `items` type. `active` comes from the existing `useScrollSpy(IDS)` call.

- [ ] **Step 5: Typecheck + lint + smoke-test**

Run: `pnpm typecheck && pnpm check`
Expected: PASS.
Run: `pnpm dev`, narrow the viewport (<768px).
Expected: the desktop nav hides; a hamburger appears; clicking opens a right drawer with the 5 links (active one accent-barred); clicking a link scrolls and closes; ESC/backdrop close and return focus to the hamburger.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/MobileNav.tsx src/components/sections/Header.tsx src/i18n/resources
git commit -m "feat(section): mobile drawer nav (hamburger + Radix Dialog)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Compose Contact into `index.tsx` + full verification

**Files:**
- Modify: `src/routes/index.tsx`

**Interfaces:**
- Consumes: `Contact` from `@/components/sections/Contact` (plus the existing sections).
- Produces: the final single-page route with **no placeholder sections**.

- [ ] **Step 1: Replace `src/routes/index.tsx`** with the composed page (removes the `#contact` placeholder):

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Services } from '@/components/sections/Services'
import { Stack } from '@/components/sections/Stack'
import { Trajectory } from '@/components/sections/Trajectory'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { t } = useTranslation()
  return (
    <>
      <a
        href='#main'
        className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-[#0a0a0a]'
      >
        {t('skipToContent')}
      </a>
      <Header />
      <main id='main'>
        <Hero />
        <Trajectory />
        <Stack />
        <Services />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Full test + typecheck + lint + build**

Run: `pnpm test && pnpm typecheck && pnpm check && pnpm build`
Expected: all Vitest suites pass (Phase 1–3 suites + channels, cv, useLanyard, contact.schema); no TS errors; Biome clean except the pre-existing accepted warnings (`prototype.html` size, `__root.tsx` suppression comment, the `!important` reduced-motion block, and the Phase 3 RichText array-index keys + Carousel `useSemanticElements`); client + SSR builds succeed; `grep -rl "RESEND_API_KEY" dist/client` prints nothing.

- [ ] **Step 3: Dev render — full-page walkthrough**

Run: `pnpm dev` → `http://localhost:3000`
Expected:
- Sections in order: Hero → Trajectory → Stack → Services → Projects → About → **Contact** → Footer. No placeholder sections remain.
- Header: Lanyard pill (offline until a real id is set) + gear + (mobile) hamburger; scroll-spy lights nav items.
- Hero: `Download CV` href/filename follow the active language (switch language in the popover → link updates, no reload); fallback languages show the CV tooltip; `See my panda 🐼` opens the EasterEgg.
- Contact: typing validates inline (bad email, empty fields), counter turns accent past 400/480, submit shows "Sending..." then a status line. With no `RESEND_API_KEY` set, expect the `errorServer` message — this confirms the wiring; set `RESEND_API_KEY` in `.env` to test a real send (optional).
- Channels: 4 cards with hover accent bar.
- Switch mode/scheme/language across a few combos — all chrome + content update; dialog overlays swap via `--dialog-overlay`.
- No console errors; no SSR crash; no FOUC.

- [ ] **Step 4: Confirm reduced-motion** — emulate `prefers-reduced-motion: reduce`, reload.
Expected: entrance fades skipped, equalizer/pulse static, EasterEgg/dialog opens instant, panda gif paused/pixelated fallback. Lanyard polling still runs (not motion-gated).

- [ ] **Step 5: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat(shell): compose Contact into page — Phase 4 complete

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Phase 4 Done — Definition of Complete

- [ ] `react-hook-form`, `@hookform/resolvers`, `zod`, `resend` added; `.env.example` present; `.env` gitignored.
- [ ] `useLanyard` derives Coding>Playing>Listening>Offline (unit-tested), polls every 30s, caches last-online; Header pill + About NOW panel consume it with the four fixed state colors.
- [ ] Contact: shared Zod schema (client + server), honeypot, in-memory IP rate limit (3/24h), Resend send via `createServerFn` POST; form reports success/rate/server/network states via an `aria-live` region; 4 channel cards; live char counter.
- [ ] CV CTA resolves the per-language PDF reactively with a pt-BR fallback + tooltip (unit-tested resolver).
- [ ] Panda EasterEgg dialog opens from the Hero with gif + fallback; mobile drawer nav works with focus trap/return.
- [ ] All new chrome localized in pt/en/es; `pnpm test && pnpm typecheck && pnpm check && pnpm build` all green; no secret leaks into the client bundle.
- [ ] Outstanding `TODO(petros)` items (real Discord id, Resend domain sender, channel URLs, CV PDFs for en/es, panda gif) flagged for a content pass — not blockers for Phase 4 structural completion.

## Deferred to Phase 5 (do NOT build here)

- a11y sweep across all 10 mode×scheme combos + screen-reader pass; Lighthouse 95+/100s.
- `prefers-contrast` hairline thickening verification across sections.
- Vercel deploy + production env vars (`RESEND_API_KEY`) + Vercel KV rate-limit upgrade.
- Replacing in-memory rate limiting with a durable store.
- Single shared Lanyard poll via context (only if the dual-poll proves wasteful).
