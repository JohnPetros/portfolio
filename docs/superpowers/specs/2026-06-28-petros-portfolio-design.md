# Design Spec — Petros. Portfolio Redesign

**Date:** 2026-06-28
**Author:** João Pedro Carvalho dos Santos (Petros) · spec drafted with Claude Code
**Source docs:** `documentation/prd.md`, `documentation/design.md`
**Status:** Approved design → ready for implementation plan

---

## 1. Purpose & Scope

Redesign Petros' portfolio from the legacy Flask/Jinja/HTMX MPA into a single-page
editorial **TanStack Start (React 19)** application: SSR for SEO, server functions for
the contact backend and per-language CV, a configurable theme system, 3-language i18n,
real-time Lanyard status, and a premium bamboo-and-panda editorial identity.

This spec covers all **16 PRD requirements** (6 cross-cutting systems + 10 sections) as
**one design**, implemented in **5 phases** (see §10). It is the single source of truth
for the implementation plan that follows.

### Resolved decisions (from brainstorming)

| Topic | Decision | Notes |
|---|---|---|
| Theming | **Light + dark × 5 schemes = 10 combos** (PRD wins over design.md's old "dark only") | `design.md` updated with a full light palette |
| Light palette | **Derived & approved** | Warm paper ramp; per-scheme darkened light accents — see `design.md` `colors-light` |
| i18n | **i18next + react-i18next** | UI strings via resources; dynamic content via typed `{pt,en,es}` data |
| Contact email | **Resend** | Recipient `joaopcarvalho.cds@gmail.com` |
| Rate limiting | **In-memory** | Documented caveat: resets on cold start, not cross-instance; upgrade path = Vercel KV |
| Animation | **`motion` (Framer Motion)** for entrances/loops + CSS for token transitions | All gated by `prefers-reduced-motion` |
| Primitives | **Custom Petros primitives + Radix** under Dialog/Popover/Tabs | Radix only for focus-trap/aria, not generic shadcn components |
| Scope | **One spec, phased plan** | |

### Out of scope

Per PRD §4: no light-by-time-of-day, no Sanity/CMS, no admin panel, no functional MCP
server, no blog, no analytics, no PWA, no in-tab project search, no testimonials, no
automated stat updates, no custom CI/CD, no E2E suite. (Vitest is available for pure
logic helpers only — not a testing mandate.)

---

## 2. Architecture

**App shell.** Single primary route `/` rendering all 10 sections in sequence inside
`<main>`. `__root.tsx` owns the `<html>` shell, the pre-paint theme bootstrap script,
font loading, and SEO/`hreflang` head tags. Two server functions back contact + CV.
SSR renders per-language HTML.

**Three-tier CSS variables** (the theming spine), applied to
`<html data-mode data-scheme lang>`:

1. **Mode tokens** — `[data-mode="dark|light"]`: surfaces, text ramp, borders, `--card-shadow`.
2. **Scheme tokens** — `[data-scheme="…"]`: `--accent`, `--accent-italic`, panda gradient; combined selectors `[data-mode="light"][data-scheme="…"]` carry the darkened light-mode accent pairs.
3. **Component tokens** — consume tiers 1–2 via `var()`. No component references raw hex.

A **blocking inline script** in `<head>` reads `localStorage['petros-theme']` (and
`prefers-color-scheme` on first visit) and sets the attributes **before paint** to avoid
FOUC. The 400ms ease color transition is enabled via a class added after hydration, so the
initial apply does not animate.

### Directory layout

```
src/
  routes/__root.tsx        # html shell, theme bootstrap, fonts, SEO/hreflang
  routes/index.tsx         # composes the 10 sections
  server/contact.ts        # createServerFn — Zod, honeypot, rate limit, Resend
  server/cv.ts             # createServerFn — serves PDF per lang (+ fallback)
  components/
    sections/              # Header, Hero, Trajectory, Stack, Services,
                           #   Projects, About, Contact, Footer, EasterEgg
    primitives/            # Brand, Card, Eyebrow, DotHeading, StatusPill,
                           #   Tag, Button, Input, BambooIndicator
    theme/                 # ThemeProvider, SettingsPopover, useTheme
    common/                # RichText, Toast, etc.
  i18n/                    # config, resources/{pt,en,es}.ts, useLocalized
  hooks/                   # useLanyard, useScrollSpy, useBrtClock, useCounter
  data/                    # projects.ts, trajectory.ts, stack.ts, services.ts, bio.ts
  styles/tokens/           # modes.css, schemes.css, components.css, animations.css
```

---

## 3. Theme System & Cross-cutting State

**ThemeProvider** holds `{ mode, scheme, lang }`, hydrated from `localStorage`. On change it:
(1) writes `data-mode`/`data-scheme`/`lang` to `<html>`, (2) persists to
`localStorage['petros-theme']`, (3) for `lang`, calls `i18n.changeLanguage()`.

First-visit defaults: `mode` ← `prefers-color-scheme`, `scheme` ← `bambuzal`,
`lang` ← `pt-BR`. The three dimensions are independent.

**Token files** in `styles/tokens/`:
- `modes.css` — dark/light surface, text, border, shadow tiers.
- `schemes.css` — per-scheme accent/italic/panda, with `[data-mode="light"][data-scheme]` overrides for darkened light accents.
- `components.css` — semantic component vars.
- `animations.css` — keyframes (`petros-stalk-in`, `petros-pulse`, `petros-fade-up`, `petros-swing`) + `prefers-reduced-motion` overrides.

**SettingsPopover** (Radix Popover): 3 groups — Mode (2 buttons), Scheme (5 rows: gradient
circle + check), Language (3 rows: inline SVG flag + native name + mono code + check).
Opens via gear or `⌘+,`/`Ctrl+,`; closes via ESC / click-outside / re-click. Footer hint.

### Shared hooks

- `useLanyard()` — polls `api.lanyard.rest/v1/users/{id}` every 30s, caches last good state, derives priority **Coding > Playing > Listening > Offline**. Consumed by Header pill and About NOW panel.
- `useScrollSpy(ids)` — IntersectionObserver, ~150ms debounce, drives BambooIndicator.
- `useBrtClock()` — `Intl.DateTimeFormat('pt-BR', {timeZone:'America/Sao_Paulo'})`, minute tick, `aria-live="polite"`.
- `useCounter(target)` — rolling number for About stats; snaps to final under reduced-motion.

---

## 4. Internationalization

`i18next` + `react-i18next`.

- **UI strings** (labels, placeholders, toasts, eyebrows, tooltips, errors) live in `i18n/resources/{pt,en,es}.ts`.
- **Dynamic content** (projects, trajectory, bio) is NOT in i18next — it lives in `src/data/*.ts` as `{ pt, en, es }` objects, read via `useLocalized(field)`. Editorial expressions are **culturally adapted**, not literally translated (e.g. "Bora construir?").
- SSR renders the requested language; `<html lang>` + `<link rel="alternate" hreflang>` emitted server-side. Default `pt-BR`.

---

## 5. Data Model (`src/data/*.ts`)

Shared: `type L<T = string> = { pt: T; en: T; es: T }`.

### `projects.ts`
```ts
type Project = {
  id: string
  kind: 'academic' | 'professional'
  order: number                    // tab ordering + dialog prev/next within kind
  eyebrow: L
  title: string                    // not localized
  tagline: L
  layout: 'web' | 'mobile'         // 16:9 vs 9:16 phone frame
  cover: string
  gallery: string[]                // 1 image ⇒ hide arrows/counter
  techs: string[]                  // tech ids → stack.ts; card shows max 5 + "+N"
  links?: { code?: string; live?: string }   // absent ⇒ hide button
  detail: {
    about: L
    features: L[]
    techGroups: { label: L; techs: string[] }[]
    contributions: L[]
    lessons: L[]
    hardSkills: { icon: string; label: L }[]
    softSkills: { icon: string; label: L }[]
  }
}
```
Exactly 5 academic + 6 professional (the 11 named in PRD §Projects). Dialog prev/next
walks `order` within the same `kind`, disabling at extremes.

### `trajectory.ts`
```ts
type TrajectoryEntry = {
  id: string
  type: 'professional' | 'academic'
  current?: boolean                // "CURRENT" / "IN PROGRESS"
  period: { start: string; end: string | 'present' }
  org: L; role: L; description: L
  techs: string[]
  info?: L                         // "i" tooltip
}
```
7 entries (PRD list). Filters ALL/PROFESSIONAL/ACADEMIC + counts derive from the array;
first 3 shown, rest behind "+ N PREVIOUS ENTRIES".

### `stack.ts`
```ts
type Tech = {
  id: string; name: string
  brandColor: string               // non-thematic, official
  monogram: string
  docsUrl: string
  category: 'frontend'|'backend'|'mobile'|'databases'|'cloud'|'ai'
}
```
35 techs across 6 categories. Single source — projects/services/trajectory reference by id.

### `services.ts`
`{ icon: string; title: L; description: L; techIds: string[] }` × 6 (informational, no click).

### `bio.ts`
`{ paragraphs: L[]; photoCaption: L; stats: { value: string; suffix: string; label: L }[] }`.
Stats: Duolingo days *(confirm exact value)*, attendance 100%, lofi 5+ yrs, software 3+ yrs — static.

### Emphasis convention
Editorial paragraphs use lightweight inline tokens — `**bold**` (→ `--text-primary`) and
`*italic*` (→ serif-italic `--accent-italic`) — rendered by a `RichText` component. Keeps
data files readable, no raw JSX in data.

---

## 6. Sections & Components

`components/primitives/`: **Brand, Card, Eyebrow, DotHeading, StatusPill, Tag, Button,
Input, BambooIndicator** — custom, token-driven (no generic shadcn). Radix powers the
interactive overlays only.

| Section | Key behaviors |
|---|---|
| `Header` | sticky; scroll-spy BambooIndicator; Lanyard pill (→About); gear→SettingsPopover (`⌘+,`); mobile drawer; backdrop-blur + hairline after ~80px |
| `Hero` | 60/40 grid; BRT clock; photo w/ accent brackets + floating tags; CV CTA + "See my panda 🐼"; bg grid; 1-col + smaller name on mobile; photo fallback = JP initials |
| `Trajectory` | filter tabs + counts; first-3 then expand (stagger); swinging panda on gradient spine |
| `Stack` | 6 categories × tech grid; brand-color monograms (non-thematic); hover tooltip + docs link |
| `Services` | 6 informational cards; icon in `--accent-tint-12` square |
| `Projects` | Academic/Professional tabs (Radix Tabs, bamboo stalk on active); cards; `ProjectDialog` (Radix Dialog): carousel (arrows/counter/thumbs, ←→, swipe, 6s auto-loop pausable), 7 detail sections, prev/next within kind |
| `About` | bio (RichText) fade-left + photo fade-right (3:4, brackets, `JP & 🐼` label); 4 stat counters; Lanyard NOW panel (3 rows, equalizer) |
| `Contact` | form (React Hook Form + Zod) + 4 channel cards; status pills; char counter |
| `Footer` | brand + colophon + 4 social squares (tooltip, new tab, `rel="noopener"`) |
| `EasterEgg` | Radix Dialog from Hero CTA; panda gif (+ static fallback); focus returns to trigger |

---

## 7. Server Functions

### `contact.ts`
`createServerFn` POST. Zod-validates `{ name, email, message(1–500), honeypot }` on client
(inline real-time) and server.
- **Honeypot filled** → return success silently, discard message.
- **Rate limit**: in-memory map keyed by IP, 3 / 24h → 429. *Caveat: resets on cold start, not shared across serverless instances; acceptable for a portfolio; upgrade path = Vercel KV.*
- **Send** via Resend to `joaopcarvalho.cds@gmail.com`. Env: `RESEND_API_KEY`.
- Returns: 200 success / 400 validation / 429 rate-limit / 500 send-failure.

### `cv.ts`
Resolves active lang → serves `/public/petros-cv-{lang}.pdf`. Client binds the Hero CTA
`href` + `download` reactively to `lang` (no round-trip for the static case); the server
function covers the `Accept-Language` fallback path. Missing language PDF → fall back to
`-pt` and show a discreet "available only in Portuguese" tooltip.

---

## 8. Error Handling & Feedback

- **Contact toasts:** success (green) / inline field validation / 429 "too many messages — try again in a few hours" / 500 "try via direct channels" / network "backend offline".
- **Lanyard failure:** render cached/offline state ("Offline · Xh ago"); never blocks render.
- **Media fallbacks:** Hero photo → JP initials; easter-egg gif → static SVG; carousel single image → hide arrows/counter; project without site → hide button.
- **Form UX:** real-time email validation; counter accent >400, red >480, hard stop at 500.

---

## 9. Accessibility (WCAG 2.1 AAA target)

- **Contrast** validated across **all 10 mode×scheme combos** (axe + Lighthouse). Light + dark ramps both AAA for body; accents reserved for dot/bullet/border/fill/icon, rarely long text. Light-mode accents darkened per scheme for paper contrast.
- **Keyboard:** logical Tab order; visible `--accent` focus + 2px offset; focus traps on all modals/popover with focus-return; shortcuts `⌘+,`/`Ctrl+,`, ESC, ←→. Skip-to-main link.
- **Screen readers:** `aria-label` on icon-only buttons; `aria-expanded`/`aria-current`; `role="dialog"`+`aria-modal`; `role=tablist/tab/tabpanel` on project tabs; semantic landmarks; `aria-live="polite"` for clock, Lanyard, carousel counter, toasts; descriptive/empty alt.
- **Preferences:** `prefers-reduced-motion` (loops off, transitions ~100ms, gif first-frame); `prefers-color-scheme` as initial mode hint; `prefers-contrast: more` thickens hairline 0.5→1px.
- **Touch targets** ≥ 44×44px.
- Caveat retained from design.md: designed *with* accessibility in mind; no formal certification claimed.

---

## 10. Implementation Phasing

1. **P1 — Foundation:** token tiers (modes/schemes/components/animations), fonts, ThemeProvider + bootstrap script, SettingsPopover, i18n setup, app shell + SEO/hreflang, primitives.
2. **P2 — Static sections:** Hero, Stack, Services, Trajectory, Footer (+ their data files).
3. **P3 — Rich sections:** Projects (tabs + ProjectDialog + carousel + prev/next), About (bio, stats, NOW panel shell).
4. **P4 — Integrations:** `useLanyard` wired to Header + NOW panel, contact server fn + form, CV server fn + reactive CTA, EasterEgg.
5. **P5 — Polish:** a11y sweep across 10 combos, reduced-motion/contrast passes, Lighthouse (95+ perf / 100 a11y, BP, SEO), Vercel deploy + env vars.

---

## 11. Success Metrics (from PRD)

Lighthouse 95+ Performance · 100 Accessibility · 100 Best Practices · 100 SEO ·
WCAG AAA contrast across all 10 combos · contact response < 2s · auto-deploy to Vercel.

---

## Appendix — Stack

TanStack Start (React 19, SSR, server functions, type-safe routing) · TypeScript ·
Tailwind v4 · i18next + react-i18next · React Hook Form + Zod · `motion` · Radix
(Dialog/Popover/Tabs) · Tabler Icons (`@tabler/icons-react`) · Lanyard API · Resend ·
Vercel · content in `src/data/*.ts`.
