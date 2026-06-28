# Petros Portfolio — Phase 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the theming foundation (10 mode×scheme combos), i18n, design-system primitives, settings popover, shared hooks, and the app shell — the substrate every later section composes against.

**Architecture:** Three-tier CSS variables on `<html data-mode data-scheme lang>` (mode tokens → scheme tokens → component tokens), a pre-paint bootstrap script to avoid FOUC, a `ThemeProvider` for runtime state, i18next for UI strings + a typed `{pt,en,es}` resolver for content, and custom token-driven primitives (Radix only under the interactive popover). All visual work is verified with typecheck + Biome + build + dev render; all pure logic is TDD with Vitest.

**Tech Stack:** TanStack Start (React 19), Tailwind CSS v4, i18next + react-i18next, radix-ui (Popover), Tabler Icons (`@tabler/icons-react`), Vitest + Testing Library, Biome.

## Global Constraints

- **Package manager:** `pnpm`. Scripts: `pnpm dev`, `pnpm build`, `pnpm typecheck` (`tsc --noEmit`), `pnpm check` (`biome check --write .`), `pnpm test` (`vitest run`).
- **Code style (Biome):** 2-space indent, line width 90, single quotes, single JSX quotes, semicolons **as-needed** (omit unless required), self-closing elements. Run `pnpm check` before every commit.
- **Path alias:** `@/*` → `./src/*`.
- **TypeScript:** `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (use `import type` for type-only imports).
- **Theme model:** `<html data-mode="dark|light" data-scheme="bambuzal|sakura|glaciar|crepusculo|pelagem" lang="pt-BR|en|es">`. 2 modes × 5 schemes = 10 combinations, independent. Defaults: `mode` ← `prefers-color-scheme`, `scheme` = `bambuzal`, `lang` = `pt-BR`. Persist to `localStorage['petros-theme']` as `{ mode, scheme, lang }`.
- **Color authority:** Components reference CSS vars only — never raw hex. Surfaces/text/border/shadow change with `data-mode`; accent/italic/panda change with `data-scheme`. External brand colors (VS Code/Steam/Spotify) and tech brand colors never change with theme.
- **Token values:** Exactly as in `documentation/design.md` (`colors` = dark, `colors-light` = light, `themes` = per-scheme accent pairs per mode + panda map).
- **Accessibility:** Visible `--accent` focus + 2px offset on all focusables; never `outline:none` without substitute. Touch targets ≥ 44×44px. Respect `prefers-reduced-motion` (loops off, transitions ~100ms) and `prefers-contrast: more` (hairline 0.5→1px). `<html lang>` reflects active language.
- **Reduced motion is already handled globally** in `src/styles.css` (`@media (prefers-reduced-motion: reduce)` kills animation/transition durations) — keep that block.
- **Commit cadence:** one commit per task (end of each task). Append the trailer:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

## File Structure (Phase 1)

```
src/
  styles.css                       # MODIFY: keep @theme inline + base; import token files
  styles/tokens/
    modes.css                      # CREATE: [data-mode=dark|light] surfaces/text/border/shadow
    schemes.css                    # CREATE: [data-scheme] accent/italic/panda (+ light overrides)
    animations.css                 # CREATE: @property + @keyframes + reduced-motion (moved out of styles.css)
  theme/
    theme.ts                       # CREATE: types + pure persistence/resolution helpers (TDD)
    theme.test.ts                  # CREATE: tests for theme.ts
    ThemeProvider.tsx              # CREATE: context provider + useTheme + bootstrap script string
    SettingsPopover.tsx            # CREATE: Radix popover (mode/scheme/lang)
  i18n/
    config.ts                      # CREATE: i18next init (pt/en/es)
    resources/pt.ts                # CREATE: UI strings (pt-BR)
    resources/en.ts                # CREATE: UI strings (en)
    resources/es.ts                # CREATE: UI strings (es)
    useLocalized.ts                # CREATE: { pt,en,es } resolver hook + pure resolve fn (TDD)
    useLocalized.test.ts           # CREATE: tests for resolver
  hooks/
    useScrollSpy.ts                # CREATE
    useBrtClock.ts                 # CREATE: + pure formatBrt() (TDD)
    useBrtClock.test.ts            # CREATE
    useCounter.ts                  # CREATE: + pure counterValue() easing (TDD)
    useCounter.test.ts             # CREATE
  components/primitives/
    Eyebrow.tsx  DotHeading.tsx  StatusPill.tsx  Tag.tsx
    Brand.tsx  Card.tsx  Button.tsx  Input.tsx  BambooIndicator.tsx
    index.ts                       # CREATE: barrel export
  routes/__root.tsx                # MODIFY: shell, fonts, SEO/hreflang, bootstrap, ThemeProvider
  routes/index.tsx                 # MODIFY: skip-link, <main>, placeholder section anchors, Header stub
```

> **Note on the existing scaffold:** `src/styles.css` already contains a `@theme inline` block, the `@property`/`@keyframes` definitions, and `[data-theme="..."]` scheme blocks (dark-only). You will refactor those into the `data-mode`/`data-scheme` model. The orphaned shadcn `src/components/ui/button.tsx` (references undefined `--primary`/`--ring` tokens) is **left in place** this phase — the Petros `Button` primitive lives at `components/primitives/Button.tsx`; do not delete `ui/button.tsx`.

---

## Task 1: Token system — `data-mode` × `data-scheme` with light palette

**Files:**
- Create: `src/styles/tokens/modes.css`
- Create: `src/styles/tokens/schemes.css`
- Create: `src/styles/tokens/animations.css`
- Modify: `src/styles.css`

**Interfaces:**
- Produces: CSS custom properties consumed by every component — surfaces `--bg-base|card|input|elevated`, `--border`, `--border-strong`, text `--text-primary|secondary|muted|faint`, `--accent`, `--accent-italic`, `--accent-tint-06|12|20`, `--accent-glow`, `--panda-from|to`, `--card-shadow`, `--border-hair`, `--border-tint`, plus brand `--color-brand-vscode|steam|spotify`. Selectors: `[data-mode="dark|light"]` and `[data-scheme="..."]` (+ `[data-mode="light"][data-scheme="..."]` accent overrides).

- [ ] **Step 1: Create `src/styles/tokens/animations.css`** (move `@property`, `@keyframes`, and the theme-transition out of `styles.css`; gate the transition behind `.theme-ready` to prevent first-paint animation)

```css
/* Animatable theme colors so scheme/mode swaps interpolate */
@property --accent {
  syntax: "<color>";
  inherits: true;
  initial-value: #5b8c3e;
}
@property --accent-italic {
  syntax: "<color>";
  inherits: true;
  initial-value: #8fb872;
}
@property --panda-from {
  syntax: "<color>";
  inherits: true;
  initial-value: #1a2818;
}
@property --panda-to {
  syntax: "<color>";
  inherits: true;
  initial-value: #2a3d24;
}

@keyframes petros-stalk-in {
  from { transform: scaleY(0); transform-origin: bottom; }
  to { transform: scaleY(1); transform-origin: bottom; }
}
@keyframes petros-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
@keyframes petros-fade-up {
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes petros-swing {
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(4deg); }
}

/* Transitions enabled only after hydration (html.theme-ready) to avoid FOUC flash */
html.theme-ready {
  transition:
    --accent var(--dur-theme) var(--ease-spring),
    --accent-italic var(--dur-theme) var(--ease-spring),
    --panda-from var(--dur-theme) var(--ease-spring),
    --panda-to var(--dur-theme) var(--ease-spring);
}
html.theme-ready body,
html.theme-ready [data-themed] {
  transition:
    background-color var(--dur-theme) var(--ease-spring),
    color var(--dur-theme) var(--ease-spring),
    border-color var(--dur-theme) var(--ease-spring);
}
```

- [ ] **Step 2: Create `src/styles/tokens/modes.css`** (surfaces/text/border/shadow per mode — dark from `design.md` `colors`, light from `colors-light`)

```css
[data-mode="dark"] {
  color-scheme: dark;
  --bg-base: #0a0a0a;
  --bg-card: #0d0d0c;
  --bg-input: #0f0f0e;
  --bg-elevated: #111110;
  --border: #2a2a2a;
  --border-strong: #3a3a3a;
  --text-primary: #f5f0e8;
  --text-secondary: #a8a59d;
  --text-muted: #888888;
  --text-faint: #666666;
  --card-shadow: none;
  --border-hair: 0.5px solid var(--border);
  --border-tint: 0.5px solid var(--accent-tint-20);
}

[data-mode="light"] {
  color-scheme: light;
  --bg-base: #eae3d6;
  --bg-card: #f1ebe0;
  --bg-input: #f6f1e8;
  --bg-elevated: #fbf7f0;
  --border: #d6cdbd;
  --border-strong: #c2b8a4;
  --text-primary: #1a1712;
  --text-secondary: #514c42;
  --text-muted: #6e6857;
  --text-faint: #8c8675;
  --card-shadow: 0 1px 3px rgb(0 0 0 / 0.04);
  --border-hair: 0.5px solid var(--border);
  --border-tint: 0.5px solid var(--accent-tint-20);
}

/* prefers-contrast: thicken hairlines */
@media (prefers-contrast: more) {
  [data-mode] {
    --border-hair: 1px solid var(--border);
    --border-tint: 1px solid var(--accent-tint-20);
  }
}
```

- [ ] **Step 3: Create `src/styles/tokens/schemes.css`** (accent/italic/tints/glow/panda per scheme; dark is the base value, light overrides the accent pair + panda. Tint/glow rgb channels follow the accent.)

```css
/* ---- BAMBUZAL (default) ---- */
[data-scheme="bambuzal"] {
  --accent: #5b8c3e;
  --accent-italic: #8fb872;
  --accent-tint-06: rgb(91 140 62 / 0.06);
  --accent-tint-12: rgb(91 140 62 / 0.12);
  --accent-tint-20: rgb(91 140 62 / 0.2);
  --accent-glow: rgb(91 140 62 / 0.55);
  --panda-from: #1a2818;
  --panda-to: #2a3d24;
}
[data-mode="light"][data-scheme="bambuzal"] {
  --accent: #4a7330;
  --accent-italic: #5b8c3e;
  --accent-tint-06: rgb(74 115 48 / 0.08);
  --accent-tint-12: rgb(74 115 48 / 0.14);
  --accent-tint-20: rgb(74 115 48 / 0.24);
  --accent-glow: rgb(74 115 48 / 0.18);
  --panda-from: #d6e0cc;
  --panda-to: #b8cba8;
}

/* ---- SAKURA ---- */
[data-scheme="sakura"] {
  --accent: #d9608a;
  --accent-italic: #e89ab5;
  --accent-tint-06: rgb(217 96 138 / 0.06);
  --accent-tint-12: rgb(217 96 138 / 0.12);
  --accent-tint-20: rgb(217 96 138 / 0.2);
  --accent-glow: rgb(217 96 138 / 0.55);
  --panda-from: #2a1820;
  --panda-to: #3d2430;
}
[data-mode="light"][data-scheme="sakura"] {
  --accent: #c24472;
  --accent-italic: #d9608a;
  --accent-tint-06: rgb(194 68 114 / 0.08);
  --accent-tint-12: rgb(194 68 114 / 0.14);
  --accent-tint-20: rgb(194 68 114 / 0.24);
  --accent-glow: rgb(194 68 114 / 0.18);
  --panda-from: #f0d6e0;
  --panda-to: #e0b8cb;
}

/* ---- GLACIAR ---- */
[data-scheme="glaciar"] {
  --accent: #5bb5d9;
  --accent-italic: #8fccdf;
  --accent-tint-06: rgb(91 181 217 / 0.06);
  --accent-tint-12: rgb(91 181 217 / 0.12);
  --accent-tint-20: rgb(91 181 217 / 0.2);
  --accent-glow: rgb(91 181 217 / 0.55);
  --panda-from: #16242a;
  --panda-to: #22363d;
}
[data-mode="light"][data-scheme="glaciar"] {
  --accent: #2f7c9e;
  --accent-italic: #4a9bbf;
  --accent-tint-06: rgb(47 124 158 / 0.08);
  --accent-tint-12: rgb(47 124 158 / 0.14);
  --accent-tint-20: rgb(47 124 158 / 0.24);
  --accent-glow: rgb(47 124 158 / 0.18);
  --panda-from: #ccdee6;
  --panda-to: #a8c7d4;
}

/* ---- CREPÚSCULO ---- */
[data-scheme="crepusculo"] {
  --accent: #9b5bd9;
  --accent-italic: #b889e5;
  --accent-tint-06: rgb(155 91 217 / 0.06);
  --accent-tint-12: rgb(155 91 217 / 0.12);
  --accent-tint-20: rgb(155 91 217 / 0.2);
  --accent-glow: rgb(155 91 217 / 0.55);
  --panda-from: #221830;
  --panda-to: #332445;
}
[data-mode="light"][data-scheme="crepusculo"] {
  --accent: #7e40ba;
  --accent-italic: #9b5bd9;
  --accent-tint-06: rgb(126 64 186 / 0.08);
  --accent-tint-12: rgb(126 64 186 / 0.14);
  --accent-tint-20: rgb(126 64 186 / 0.24);
  --accent-glow: rgb(126 64 186 / 0.18);
  --panda-from: #e0d6f0;
  --panda-to: #cbb8e0;
}

/* ---- PELAGEM ---- */
[data-scheme="pelagem"] {
  --accent: #d9a05b;
  --accent-italic: #e5bb7e;
  --accent-tint-06: rgb(217 160 91 / 0.06);
  --accent-tint-12: rgb(217 160 91 / 0.12);
  --accent-tint-20: rgb(217 160 91 / 0.2);
  --accent-glow: rgb(217 160 91 / 0.55);
  --panda-from: #2a2418;
  --panda-to: #3d3424;
}
[data-mode="light"][data-scheme="pelagem"] {
  --accent: #9a6b28;
  --accent-italic: #bc842f;
  --accent-tint-06: rgb(154 107 40 / 0.08);
  --accent-tint-12: rgb(154 107 40 / 0.14);
  --accent-tint-20: rgb(154 107 40 / 0.24);
  --accent-glow: rgb(154 107 40 / 0.18);
  --panda-from: #f0e6cc;
  --panda-to: #e0d0a8;
}

/* Legacy alias: data-theme="x" without data-mode == dark + that scheme */
[data-theme="bambuzal"] { --accent: #5b8c3e; --accent-italic: #8fb872; }
```

- [ ] **Step 4: Rewrite `src/styles.css`** to import the token files, keep the `@theme inline` map and base layer, add the `--card-shadow` exposure, and remove the now-moved `@property`/`@keyframes`/scheme blocks. Replace the whole file with:

```css
@import "tailwindcss";
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=DM+Serif+Display:ital@1&family=JetBrains+Mono:wght@400;500&display=swap");
@import "./styles/tokens/modes.css";
@import "./styles/tokens/schemes.css";
@import "./styles/tokens/animations.css";

@theme inline {
  /* Tipografia */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-serif: "DM Serif Display", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --font-weight-body: 400;
  --font-weight-display: 500;

  /* Escala de fonte */
  --text-hero: 108px;
  --text-display: 88px;
  --text-h1: 54px;
  --text-h2: 40px;
  --text-h3: 28px;
  --text-title: 22px;
  --text-lead: 16px;
  --text-body: 14px;
  --text-body-sm: 13px;
  --text-nav: 13.5px;
  --text-eyebrow: 11px;
  --text-meta: 10px;
  --text-micro: 9.5px;

  /* Tracking */
  --tracking-hero: -3.5px;
  --tracking-display: -2.5px;
  --tracking-h1: -2px;
  --tracking-tight: -0.5px;
  --tracking-eyebrow: 2px;
  --tracking-meta: 1.5px;

  /* Leading */
  --leading-display: 0.96;
  --leading-tight: 1.1;
  --leading-body: 1.6;

  /* Superfícies / texto / borda (trocados por data-mode) */
  --color-bg-base: var(--bg-base);
  --color-bg-card: var(--bg-card);
  --color-bg-input: var(--bg-input);
  --color-bg-elevated: var(--bg-elevated);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-text-faint: var(--text-faint);

  /* Accent / panda (trocados por data-scheme) */
  --color-accent: var(--accent);
  --color-accent-italic: var(--accent-italic);
  --color-accent-tint-06: var(--accent-tint-06);
  --color-accent-tint-12: var(--accent-tint-12);
  --color-accent-tint-20: var(--accent-tint-20);
  --color-accent-glow: var(--accent-glow);
  --color-panda-from: var(--panda-from);
  --color-panda-to: var(--panda-to);

  /* Marcas externas (fixas) */
  --color-brand-vscode: #4c8df6;
  --color-brand-steam: #9b6bd9;
  --color-brand-spotify: #1db954;

  /* Espaçamento */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 24px;
  --spacing-6: 32px;
  --spacing-7: 48px;
  --spacing-8: 64px;
  --spacing-9: 96px;
  --spacing-section-pad: 48px;
  --spacing-section-pad-sm: 28px;
  --spacing-section-gap: 96px;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 14px;
  --radius-pill: 9999px;

  /* Sombras — glow (dark) + card-shadow (light) */
  --shadow-glow-dot: 0 0 5px var(--accent-glow);
  --shadow-glow-soft: 0 0 12px var(--accent-tint-20);
  --shadow-card: var(--card-shadow);

  /* Motion */
  --ease-spring: cubic-bezier(0.2, 1, 0.3, 1);
  --dur-micro: 220ms;
  --dur-theme: 400ms;
  --dur-entrance: 600ms;
  --dur-loop: 2400ms;
  --animate-petros-stalk-in: petros-stalk-in var(--dur-entrance) var(--ease-spring) both;
  --animate-petros-pulse: petros-pulse var(--dur-loop) ease-in-out infinite;
  --animate-petros-fade-up: petros-fade-up var(--dur-entrance) var(--ease-spring) both;
  --animate-petros-swing: petros-swing 1600ms ease-in-out infinite;
}

@layer base {
  html {
    font-family: var(--font-sans);
    background-color: var(--bg-base);
    color: var(--text-primary);
  }
  body {
    background-color: var(--bg-base);
    color: var(--text-primary);
    font-size: var(--text-body);
    line-height: var(--leading-body);
    font-weight: 400;
  }
  hr,
  [role="separator"] {
    border: 0;
    border-top: var(--border-hair);
  }
  /* Visible accent focus everywhere */
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

- [ ] **Step 5: Verify build + dev render across a combo.** Temporarily set `data-mode="light" data-scheme="sakura"` on the `<html>` in `src/routes/__root.tsx` (you will wire this dynamically in Task 5), then:

Run: `pnpm check && pnpm build`
Expected: Biome passes, Vite build succeeds with no CSS errors.

Run: `pnpm dev` and open `http://localhost:3000`
Expected: page background is warm paper (`#eae3d6`), text is near-black; switching the attribute to `data-mode="dark"` shows `#0a0a0a` + cream. Revert the hardcoded attributes after checking.

- [ ] **Step 6: Commit**

```bash
pnpm check
git add src/styles.css src/styles/tokens
git commit -m "feat(theme): split tokens into data-mode x data-scheme with light palette

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Theme types & persistence helpers (TDD)

**Files:**
- Create: `src/theme/theme.ts`
- Test: `src/theme/theme.test.ts`

**Interfaces:**
- Produces:
  - `type Mode = 'dark' | 'light'`
  - `type Scheme = 'bambuzal' | 'sakura' | 'glaciar' | 'crepusculo' | 'pelagem'`
  - `type Lang = 'pt-BR' | 'en' | 'es'`
  - `type ThemeState = { mode: Mode; scheme: Scheme; lang: Lang }`
  - `const SCHEMES: Scheme[]`, `const LANGS: Lang[]`
  - `const STORAGE_KEY = 'petros-theme'`
  - `const DEFAULTS: ThemeState` (mode `'dark'`, scheme `'bambuzal'`, lang `'pt-BR'`)
  - `parseStored(raw: string | null): Partial<ThemeState>` — safe JSON parse, drops invalid keys
  - `resolveInitial(stored: Partial<ThemeState>, prefersDark: boolean): ThemeState` — stored wins; else mode from `prefersDark`, scheme/lang from defaults
  - `serialize(state: ThemeState): string`

- [ ] **Step 1: Write the failing test** (`src/theme/theme.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { DEFAULTS, parseStored, resolveInitial, serialize } from './theme'

describe('parseStored', () => {
  it('returns empty object for null', () => {
    expect(parseStored(null)).toEqual({})
  })
  it('returns empty object for malformed json', () => {
    expect(parseStored('{not json')).toEqual({})
  })
  it('keeps only valid keys/values', () => {
    const raw = JSON.stringify({ mode: 'light', scheme: 'nope', lang: 'es', x: 1 })
    expect(parseStored(raw)).toEqual({ mode: 'light', lang: 'es' })
  })
})

describe('resolveInitial', () => {
  it('uses prefersDark for mode when nothing stored', () => {
    expect(resolveInitial({}, true)).toEqual(DEFAULTS)
    expect(resolveInitial({}, false)).toEqual({ ...DEFAULTS, mode: 'light' })
  })
  it('stored values win over prefers-color-scheme', () => {
    expect(resolveInitial({ mode: 'light' }, true).mode).toBe('light')
    expect(resolveInitial({ scheme: 'sakura' }, true).scheme).toBe('sakura')
    expect(resolveInitial({ lang: 'en' }, false).lang).toBe('en')
  })
})

describe('serialize', () => {
  it('round-trips through parseStored', () => {
    const state = { mode: 'light', scheme: 'glaciar', lang: 'en' } as const
    expect(parseStored(serialize(state))).toEqual(state)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/theme/theme.test.ts`
Expected: FAIL — cannot resolve `./theme`.

- [ ] **Step 3: Write `src/theme/theme.ts`**

```ts
export type Mode = 'dark' | 'light'
export type Scheme = 'bambuzal' | 'sakura' | 'glaciar' | 'crepusculo' | 'pelagem'
export type Lang = 'pt-BR' | 'en' | 'es'
export type ThemeState = { mode: Mode; scheme: Scheme; lang: Lang }

export const MODES: Mode[] = ['dark', 'light']
export const SCHEMES: Scheme[] = ['bambuzal', 'sakura', 'glaciar', 'crepusculo', 'pelagem']
export const LANGS: Lang[] = ['pt-BR', 'en', 'es']

export const STORAGE_KEY = 'petros-theme'
export const DEFAULTS: ThemeState = { mode: 'dark', scheme: 'bambuzal', lang: 'pt-BR' }

export function parseStored(raw: string | null): Partial<ThemeState> {
  if (!raw) return {}
  let obj: unknown
  try {
    obj = JSON.parse(raw)
  } catch {
    return {}
  }
  if (typeof obj !== 'object' || obj === null) return {}
  const o = obj as Record<string, unknown>
  const out: Partial<ThemeState> = {}
  if (o.mode === 'dark' || o.mode === 'light') out.mode = o.mode
  if (SCHEMES.includes(o.scheme as Scheme)) out.scheme = o.scheme as Scheme
  if (LANGS.includes(o.lang as Lang)) out.lang = o.lang as Lang
  return out
}

export function resolveInitial(
  stored: Partial<ThemeState>,
  prefersDark: boolean,
): ThemeState {
  return {
    mode: stored.mode ?? (prefersDark ? 'dark' : 'light'),
    scheme: stored.scheme ?? DEFAULTS.scheme,
    lang: stored.lang ?? DEFAULTS.lang,
  }
}

export function serialize(state: ThemeState): string {
  return JSON.stringify(state)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/theme/theme.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
pnpm check
git add src/theme/theme.ts src/theme/theme.test.ts
git commit -m "feat(theme): typed state + persistence/resolution helpers

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: i18n config, resources & localized resolver (TDD for resolver)

**Files:**
- Create: `src/i18n/resources/pt.ts`, `src/i18n/resources/en.ts`, `src/i18n/resources/es.ts`
- Create: `src/i18n/config.ts`
- Create: `src/i18n/useLocalized.ts`
- Test: `src/i18n/useLocalized.test.ts`

**Interfaces:**
- Consumes: `Lang` from `@/theme/theme`.
- Produces:
  - Resource shape `type UIStrings` (inferred from `pt`); each resource default-exports an object with namespaced UI strings.
  - `localize<T>(field: { pt: T; en: T; es: T }, lang: Lang): T` — pure picker (maps `'pt-BR'`→`pt`).
  - `useLocalized(): <T>(field: { pt: T; en: T; es: T }) => T` — hook bound to the active i18n language.
  - `type L<T = string> = { pt: T; en: T; es: T }` (exported here; reused by all `src/data` files in later phases).
  - `i18n` instance default-exported from `config.ts`.

- [ ] **Step 1: Write the failing test** (`src/i18n/useLocalized.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { localize } from './useLocalized'

describe('localize', () => {
  const field = { pt: 'olá', en: 'hi', es: 'hola' }
  it('maps pt-BR to pt', () => {
    expect(localize(field, 'pt-BR')).toBe('olá')
  })
  it('maps en and es directly', () => {
    expect(localize(field, 'en')).toBe('hi')
    expect(localize(field, 'es')).toBe('hola')
  })
  it('works for non-string values', () => {
    expect(localize({ pt: [1], en: [2], es: [3] }, 'es')).toEqual([3])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/i18n/useLocalized.test.ts`
Expected: FAIL — cannot resolve `./useLocalized`.

- [ ] **Step 3: Create the three resource files.** Start minimal but real — only the keys Phase 1 needs (settings popover + nav + skip link). `src/i18n/resources/pt.ts`:

```ts
const pt = {
  skipToContent: 'Pular para o conteúdo',
  nav: {
    home: 'Início',
    about: 'Sobre',
    stack: 'Stack',
    projects: 'Projetos',
    trajectory: 'Trajetória',
  },
  settings: {
    title: 'Configurações',
    mode: 'Modo',
    modeDark: 'Escuro',
    modeLight: 'Claro',
    scheme: 'Esquema',
    language: 'Idioma',
    hint: '⌘+, para abrir · ESC para fechar',
  },
  schemes: {
    bambuzal: 'Bambuzal',
    sakura: 'Sakura',
    glaciar: 'Glaciar',
    crepusculo: 'Crepúsculo',
    pelagem: 'Pelagem',
  },
} as const

export type UIStrings = typeof pt
export default pt
```

`src/i18n/resources/en.ts` (same shape, English):

```ts
import type { UIStrings } from './pt'

const en: UIStrings = {
  skipToContent: 'Skip to content',
  nav: { home: 'Home', about: 'About', stack: 'Stack', projects: 'Projects', trajectory: 'Trajectory' },
  settings: {
    title: 'Settings',
    mode: 'Mode',
    modeDark: 'Dark',
    modeLight: 'Light',
    scheme: 'Scheme',
    language: 'Language',
    hint: '⌘+, to open · ESC to close',
  },
  schemes: {
    bambuzal: 'Bambuzal',
    sakura: 'Sakura',
    glaciar: 'Glacier',
    crepusculo: 'Twilight',
    pelagem: 'Pelage',
  },
}

export default en
```

`src/i18n/resources/es.ts` (same shape, Spanish):

```ts
import type { UIStrings } from './pt'

const es: UIStrings = {
  skipToContent: 'Saltar al contenido',
  nav: { home: 'Inicio', about: 'Sobre mí', stack: 'Stack', projects: 'Proyectos', trajectory: 'Trayectoria' },
  settings: {
    title: 'Ajustes',
    mode: 'Modo',
    modeDark: 'Oscuro',
    modeLight: 'Claro',
    scheme: 'Esquema',
    language: 'Idioma',
    hint: '⌘+, para abrir · ESC para cerrar',
  },
  schemes: {
    bambuzal: 'Bambuzal',
    sakura: 'Sakura',
    glaciar: 'Glaciar',
    crepusculo: 'Crepúsculo',
    pelagem: 'Pelaje',
  },
}

export default es
```

- [ ] **Step 4: Create `src/i18n/config.ts`**

```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULTS } from '@/theme/theme'
import en from './resources/en'
import es from './resources/es'
import pt from './resources/pt'

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: pt },
    en: { translation: en },
    es: { translation: es },
  },
  lng: DEFAULTS.lang,
  fallbackLng: 'pt-BR',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export default i18n
```

- [ ] **Step 5: Create `src/i18n/useLocalized.ts`**

```ts
import { useTranslation } from 'react-i18next'
import type { Lang } from '@/theme/theme'

export type L<T = string> = { pt: T; en: T; es: T }

export function localize<T>(field: L<T>, lang: Lang): T {
  if (lang === 'en') return field.en
  if (lang === 'es') return field.es
  return field.pt
}

export function useLocalized() {
  const { i18n } = useTranslation()
  return <T,>(field: L<T>): T => localize(field, i18n.language as Lang)
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm test src/i18n/useLocalized.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
pnpm add i18next react-i18next
pnpm check
git add src/i18n package.json pnpm-lock.yaml
git commit -m "feat(i18n): i18next config, pt/en/es resources, localized resolver

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: ThemeProvider, useTheme & pre-paint bootstrap script

**Files:**
- Create: `src/theme/ThemeProvider.tsx`

**Interfaces:**
- Consumes: `ThemeState`, `Mode`, `Scheme`, `Lang`, `STORAGE_KEY`, `serialize` from `@/theme/theme`; `i18n` from `@/i18n/config`.
- Produces:
  - `ThemeProvider({ children, initial }: { children: ReactNode; initial: ThemeState })` — context provider.
  - `useTheme(): { state: ThemeState; setMode(m: Mode): void; setScheme(s: Scheme): void; setLang(l: Lang): void }`.
  - `THEME_BOOTSTRAP: string` — IIFE source string for the pre-paint `<script>`; reads `localStorage`, applies `data-mode`/`data-scheme`/`lang` to `<html>` before paint, then adds `theme-ready` class on next frame.

- [ ] **Step 1: Create `src/theme/ThemeProvider.tsx`**

```tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import i18n from '@/i18n/config'
import {
  type Lang,
  type Mode,
  type Scheme,
  STORAGE_KEY,
  serialize,
  type ThemeState,
} from './theme'

type ThemeContextValue = {
  state: ThemeState
  setMode: (m: Mode) => void
  setScheme: (s: Scheme) => void
  setLang: (l: Lang) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function apply(state: ThemeState) {
  const el = document.documentElement
  el.dataset.mode = state.mode
  el.dataset.scheme = state.scheme
  el.lang = state.lang
}

export function ThemeProvider({
  children,
  initial,
}: {
  children: ReactNode
  initial: ThemeState
}) {
  const [state, setState] = useState<ThemeState>(initial)

  useEffect(() => {
    apply(state)
    localStorage.setItem(STORAGE_KEY, serialize(state))
    if (i18n.language !== state.lang) i18n.changeLanguage(state.lang)
  }, [state])

  const value: ThemeContextValue = {
    state,
    setMode: (mode) => setState((s) => ({ ...s, mode })),
    setScheme: (scheme) => setState((s) => ({ ...s, scheme })),
    setLang: (lang) => setState((s) => ({ ...s, lang })),
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

// Runs in <head> before paint. Mirrors resolveInitial() but inlined (no imports).
export const THEME_BOOTSTRAP = `(function(){try{
var SCHEMES=['bambuzal','sakura','glaciar','crepusculo','pelagem'];
var LANGS=['pt-BR','en','es'];
var raw=localStorage.getItem('petros-theme');var s={};
if(raw){try{s=JSON.parse(raw)||{}}catch(e){}}
var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
var mode=(s.mode==='dark'||s.mode==='light')?s.mode:(prefersDark?'dark':'light');
var scheme=SCHEMES.indexOf(s.scheme)>-1?s.scheme:'bambuzal';
var lang=LANGS.indexOf(s.lang)>-1?s.lang:'pt-BR';
var el=document.documentElement;
el.setAttribute('data-mode',mode);el.setAttribute('data-scheme',scheme);el.setAttribute('lang',lang);
requestAnimationFrame(function(){el.classList.add('theme-ready')});
}catch(e){}})()`
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
pnpm check
git add src/theme/ThemeProvider.tsx
git commit -m "feat(theme): ThemeProvider, useTheme, pre-paint bootstrap script

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: App shell — `__root.tsx` wiring

**Files:**
- Modify: `src/routes/__root.tsx`

**Interfaces:**
- Consumes: `THEME_BOOTSTRAP`, `ThemeProvider` from `@/theme/ThemeProvider`; `DEFAULTS`, `parseStored`, `resolveInitial`, `type ThemeState` from `@/theme/theme`; `@/i18n/config` (side-effect import to init i18n).
- Produces: `<html>` shell with bootstrap script in `<head>`, SEO meta + `hreflang` links, `ThemeProvider` wrapping the app at the `RootComponent` level.

- [ ] **Step 1: Replace `src/routes/__root.tsx`** with the wired shell. Keep the devtools block.

```tsx
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '@/i18n/config'
import appCss from '../styles.css?url'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { THEME_BOOTSTRAP } from '@/theme/ThemeProvider'
import { DEFAULTS, parseStored, resolveInitial } from '@/theme/theme'

const SITE_URL = 'https://petros.dev'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Petros. — Full Stack Developer' },
      {
        name: 'description',
        content:
          'Portfólio de João Pedro Carvalho dos Santos (Petros) — desenvolvedor full stack.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'alternate', hrefLang: 'pt-BR', href: SITE_URL },
      { rel: 'alternate', hrefLang: 'en', href: `${SITE_URL}/?lang=en` },
      { rel: 'alternate', hrefLang: 'es', href: `${SITE_URL}/?lang=es` },
      { rel: 'alternate', hrefLang: 'x-default', href: SITE_URL },
    ],
  }),
  notFoundComponent: () => (
    <main className='mx-auto max-w-md p-6 pt-16'>
      <h1 className='text-h2'>404</h1>
      <p className='text-text-secondary'>Página não encontrada.</p>
    </main>
  ),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  // SSR uses DEFAULTS; client reconciles from localStorage before paint via the
  // bootstrap script + the provider effect.
  const initial =
    typeof document === 'undefined'
      ? DEFAULTS
      : resolveInitial(
          parseStored(localStorage.getItem('petros-theme')),
          window.matchMedia('(prefers-color-scheme: dark)').matches,
        )
  return (
    <ThemeProvider initial={initial}>
      <Outlet />
    </ThemeProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR' data-mode='dark' data-scheme='bambuzal'>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: pre-paint theme bootstrap */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify dev render + persistence.**

Run: `pnpm typecheck && pnpm dev`
Then in the browser at `http://localhost:3000`:
- Expected: no FOUC flash; `<html>` has `data-mode`/`data-scheme`/`lang` set.
- In devtools console run `localStorage.setItem('petros-theme', JSON.stringify({mode:'light',scheme:'sakura',lang:'en'}))` and reload → page renders in light Sakura immediately on first paint.
- Reset: `localStorage.removeItem('petros-theme')`.

- [ ] **Step 3: Commit**

```bash
pnpm check
git add src/routes/__root.tsx
git commit -m "feat(shell): wire ThemeProvider, bootstrap script, SEO + hreflang

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Static primitives (Eyebrow, DotHeading, StatusPill, Tag, Brand, Card, Button, Input)

**Files:**
- Create: `src/components/primitives/Eyebrow.tsx`
- Create: `src/components/primitives/DotHeading.tsx`
- Create: `src/components/primitives/StatusPill.tsx`
- Create: `src/components/primitives/Tag.tsx`
- Create: `src/components/primitives/Brand.tsx`
- Create: `src/components/primitives/Card.tsx`
- Create: `src/components/primitives/Button.tsx`
- Create: `src/components/primitives/Input.tsx`
- Create: `src/components/primitives/index.ts`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`.
- Produces (all default `React.ComponentProps` spreads + `className` merge via `cn`):
  - `Eyebrow({ children, className })` — mono uppercase, optional leading glow bullet via `bullet?: boolean`.
  - `DotHeading({ children, className })` — headline with trailing accent dot + glow.
  - `StatusPill({ children, dotColor?, pulse?, className })` — pill with colored dot (defaults to accent).
  - `Tag({ children, className })` — mono micro tag.
  - `Brand({ size?, className })` — `Petros.` wordmark, accent period w/ glow; `size` scales font.
  - `Card({ accentBar?, interactive?, children, className })` — surface card; `interactive` adds hover lift + border-tint.
  - `Button({ variant?: 'primary' | 'secondary', ...buttonProps })` — accent fill / outline; ≥44px touch target.
  - `Input({ as?: 'input' | 'textarea', ... })` — bottom-border field; accent focus.

- [ ] **Step 1: Create `Eyebrow.tsx`**

```tsx
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Eyebrow({
  bullet = false,
  className,
  children,
  ...props
}: ComponentProps<'span'> & { bullet?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-eyebrow tracking-eyebrow text-text-faint uppercase',
        className,
      )}
      {...props}
    >
      {bullet && (
        <span
          aria-hidden
          className='size-1.5 rounded-pill bg-accent shadow-glow-dot'
        />
      )}
      {children}
    </span>
  )
}
```

- [ ] **Step 2: Create `DotHeading.tsx`**

```tsx
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function DotHeading({
  className,
  children,
  ...props
}: ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'font-sans font-medium text-h1 tracking-h1 text-text-primary',
        className,
      )}
      {...props}
    >
      {children}
      <span aria-hidden className='text-accent drop-shadow-[0_0_5px_var(--accent-glow)]'>
        .
      </span>
    </h2>
  )
}
```

- [ ] **Step 3: Create `StatusPill.tsx`**

```tsx
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function StatusPill({
  dotColor,
  pulse = false,
  className,
  children,
  ...props
}: ComponentProps<'span'> & { dotColor?: string; pulse?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border-[0.5px] border-border bg-accent-tint-06 px-3 py-1 font-mono text-meta tracking-meta uppercase text-text-secondary',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn('size-1.5 rounded-pill', pulse && 'animate-petros-pulse')}
        style={{ background: dotColor ?? 'var(--accent)' }}
      />
      {children}
    </span>
  )
}
```

- [ ] **Step 4: Create `Tag.tsx`**

```tsx
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Tag({ className, children, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border-[0.5px] border-border px-2 py-0.5 font-mono text-micro tracking-meta uppercase text-text-muted',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
```

- [ ] **Step 5: Create `Brand.tsx`**

```tsx
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Brand({
  size = 'text-title',
  className,
  ...props
}: ComponentProps<'span'> & { size?: string }) {
  return (
    <span
      className={cn('font-sans font-medium tracking-tight text-text-primary', size, className)}
      {...props}
    >
      Petros
      <span aria-hidden className='text-accent drop-shadow-[0_0_5px_var(--accent-glow)]'>
        .
      </span>
    </span>
  )
}
```

- [ ] **Step 6: Create `Card.tsx`**

```tsx
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Card({
  accentBar = false,
  interactive = false,
  className,
  children,
  ...props
}: ComponentProps<'div'> & { accentBar?: boolean; interactive?: boolean }) {
  return (
    <div
      data-themed
      className={cn(
        'relative rounded-md border-[0.5px] border-border bg-bg-card p-6 shadow-[var(--shadow-card)]',
        accentBar && 'before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-accent before:content-[""]',
        interactive &&
          'transition-all duration-[var(--dur-micro)] hover:-translate-y-0.5 hover:border-accent-tint-20',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 7: Create `Button.tsx`** (Petros primitive — distinct from the orphaned `ui/button.tsx`)

```tsx
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ComponentProps<'button'> & { variant?: 'primary' | 'secondary' }) {
  return (
    <button
      type='button'
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 font-sans text-body font-medium transition-all duration-[var(--dur-micro)]',
        variant === 'primary' &&
          'bg-accent text-[#0a0a0a] hover:brightness-110',
        variant === 'secondary' &&
          'border-[0.5px] border-border bg-transparent text-text-primary hover:border-accent-tint-20',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 8: Create `Input.tsx`**

```tsx
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type InputProps =
  | ({ as?: 'input' } & ComponentProps<'input'>)
  | ({ as: 'textarea' } & ComponentProps<'textarea'>)

export function Input({ as = 'input', className, ...props }: InputProps) {
  const base = cn(
    'w-full border-0 border-b-[0.5px] border-border bg-transparent py-2 font-sans text-body text-text-primary placeholder:text-text-faint focus:border-accent focus:outline-none focus:[box-shadow:0_1px_0_0_var(--accent)]',
    className,
  )
  if (as === 'textarea') {
    return <textarea className={base} {...(props as ComponentProps<'textarea'>)} />
  }
  return <input className={base} {...(props as ComponentProps<'input'>)} />
}
```

- [ ] **Step 9: Create the barrel `index.ts`**

```ts
export { Brand } from './Brand'
export { Button } from './Button'
export { Card } from './Card'
export { DotHeading } from './DotHeading'
export { Eyebrow } from './Eyebrow'
export { Input } from './Input'
export { StatusPill } from './StatusPill'
export { Tag } from './Tag'
```

- [ ] **Step 10: Typecheck + lint**

Run: `pnpm typecheck && pnpm check`
Expected: PASS, no errors.

- [ ] **Step 11: Smoke-render in the dev page.** Temporarily import a few primitives into `src/routes/index.tsx` and confirm they render with correct tokens (accent dot glows, card hover lifts). Remove the temporary imports after verifying.

Run: `pnpm dev`
Expected: `Petros.` wordmark with glowing accent period; card lifts 2px on hover; button has accent fill and ≥44px height.

- [ ] **Step 12: Commit**

```bash
pnpm check
git add src/components/primitives
git commit -m "feat(primitives): Eyebrow, DotHeading, StatusPill, Tag, Brand, Card, Button, Input

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: BambooIndicator primitive

**Files:**
- Create: `src/components/primitives/BambooIndicator.tsx`
- Modify: `src/components/primitives/index.ts` (add export)

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`.
- Produces: `BambooIndicator({ active, orientation?, className })` — 3 accent vertical segments (heights 5/7/4px) that animate in (`petros-stalk-in`) when `active`, with the central segment pulsing (`petros-pulse`). `orientation?: 'horizontal' | 'vertical'` (default horizontal; vertical used by the mobile drawer). When `active` is false, renders nothing/empty space.

- [ ] **Step 1: Create `BambooIndicator.tsx`**

```tsx
import { cn } from '@/lib/utils'

const HEIGHTS = [5, 7, 4]

export function BambooIndicator({
  active,
  orientation = 'horizontal',
  className,
}: {
  active: boolean
  orientation?: 'horizontal' | 'vertical'
  className?: string
}) {
  if (!active) return <span className={cn('block', className)} aria-hidden />
  return (
    <span
      aria-hidden
      className={cn(
        'flex items-end gap-0.5',
        orientation === 'vertical' && 'rotate-90',
        className,
      )}
    >
      {HEIGHTS.map((h, i) => (
        <span
          key={h}
          className={cn(
            'w-0.5 rounded-pill bg-accent shadow-glow-dot animate-petros-stalk-in',
            i === 1 && 'animate-petros-pulse',
          )}
          style={{ height: `${h}px`, animationDelay: `${i * 200}ms` }}
        />
      ))}
    </span>
  )
}
```

- [ ] **Step 2: Add export to `index.ts`**

```ts
export { BambooIndicator } from './BambooIndicator'
```

- [ ] **Step 3: Typecheck + lint**

Run: `pnpm typecheck && pnpm check`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
pnpm check
git add src/components/primitives/BambooIndicator.tsx src/components/primitives/index.ts
git commit -m "feat(primitives): BambooIndicator active stalk

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: SettingsPopover (Radix Popover) wired to theme

**Files:**
- Create: `src/theme/SettingsPopover.tsx`

**Interfaces:**
- Consumes: `useTheme` from `@/theme/ThemeProvider`; `SCHEMES`, `LANGS`, `MODES`, `type Scheme`, `type Lang` from `@/theme/theme`; `useTranslation` from `react-i18next`; `Popover` from `radix-ui`.
- Produces: `SettingsPopover()` — a gear trigger button (`aria-label`, 32px, ≥44px hit area via padding) opening a 280px popover with three groups: Mode (2 buttons), Scheme (5 rows: gradient circle + name + check), Language (3 rows: SVG flag placeholder + native name + mono code + check). Opens via `⌘+,` / `Ctrl+,`; closes on ESC / click-outside (Radix default). Active option marked with `aria-current` + accent check.

- [ ] **Step 1: Create `src/theme/SettingsPopover.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { IconSettings, IconCheck } from '@tabler/icons-react'
import { useTheme } from './ThemeProvider'
import { LANGS, MODES, SCHEMES, type Lang, type Scheme } from './theme'
import { cn } from '@/lib/utils'

const LANG_LABEL: Record<Lang, { name: string; code: string }> = {
  'pt-BR': { name: 'Português', code: 'PT-BR' },
  en: { name: 'English', code: 'EN' },
  es: { name: 'Español', code: 'ES' },
}

export function SettingsPopover() {
  const { state, setMode, setScheme, setLang } = useTheme()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={t('settings.title')}
        className='inline-flex size-11 items-center justify-center rounded-pill text-text-secondary hover:text-accent aria-expanded:text-accent'
      >
        <IconSettings size={18} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align='end'
          sideOffset={8}
          className='z-50 w-[280px] rounded-md border-[0.5px] border-border bg-bg-card p-4 shadow-[var(--shadow-card)]'
        >
          {/* Mode */}
          <p className='mb-2 font-mono text-micro tracking-eyebrow uppercase text-text-faint'>
            {t('settings.mode')}
          </p>
          <div className='mb-4 grid grid-cols-2 gap-2'>
            {MODES.map((m) => (
              <button
                key={m}
                type='button'
                aria-current={state.mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  'rounded-sm border-[0.5px] border-border py-2 text-body-sm',
                  state.mode === m
                    ? 'border-accent-tint-20 text-accent'
                    : 'text-text-secondary',
                )}
              >
                {m === 'dark' ? t('settings.modeDark') : t('settings.modeLight')}
              </button>
            ))}
          </div>

          {/* Scheme */}
          <p className='mb-2 font-mono text-micro tracking-eyebrow uppercase text-text-faint'>
            {t('settings.scheme')}
          </p>
          <ul className='mb-4 flex flex-col gap-1'>
            {SCHEMES.map((s) => (
              <SchemeRow
                key={s}
                scheme={s}
                active={state.scheme === s}
                label={t(`schemes.${s}`)}
                onSelect={() => setScheme(s)}
              />
            ))}
          </ul>

          {/* Language */}
          <p className='mb-2 font-mono text-micro tracking-eyebrow uppercase text-text-faint'>
            {t('settings.language')}
          </p>
          <ul className='flex flex-col gap-1'>
            {LANGS.map((l) => (
              <li key={l}>
                <button
                  type='button'
                  aria-current={state.lang === l}
                  onClick={() => setLang(l)}
                  className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-body-sm text-text-secondary hover:bg-bg-elevated'
                >
                  <span className='flex-1 text-left'>{LANG_LABEL[l].name}</span>
                  <span className='font-mono text-micro tracking-meta text-text-faint'>
                    {LANG_LABEL[l].code}
                  </span>
                  {state.lang === l && <IconCheck size={14} className='text-accent' />}
                </button>
              </li>
            ))}
          </ul>

          <p className='mt-4 font-mono text-micro tracking-meta text-text-faint'>
            {t('settings.hint')}
          </p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

function SchemeRow({
  scheme,
  active,
  label,
  onSelect,
}: {
  scheme: Scheme
  active: boolean
  label: string
  onSelect: () => void
}) {
  return (
    <li>
      <button
        type='button'
        aria-current={active}
        onClick={onSelect}
        data-scheme={scheme}
        className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-body-sm text-text-secondary hover:bg-bg-elevated'
      >
        <span
          aria-hidden
          className='size-4 rounded-pill'
          style={{
            background: 'linear-gradient(135deg, var(--panda-from), var(--accent))',
          }}
        />
        <span className='flex-1 text-left'>{label}</span>
        {active && <IconCheck size={14} className='text-accent' />}
      </button>
    </li>
  )
}
```

> The `SchemeRow` swatch sets `data-scheme` on the button so its `--panda-from`/`--accent` resolve to that scheme's colors regardless of the active scheme — giving each row a true preview.

- [ ] **Step 2: Typecheck + lint**

Run: `pnpm typecheck && pnpm check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
pnpm add @tabler/icons-react
pnpm check
git add src/theme/SettingsPopover.tsx package.json pnpm-lock.yaml
git commit -m "feat(theme): SettingsPopover with mode/scheme/language controls

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Shared hooks — useScrollSpy, useBrtClock, useCounter (TDD for pure logic)

**Files:**
- Create: `src/hooks/useScrollSpy.ts`
- Create: `src/hooks/useBrtClock.ts`
- Test: `src/hooks/useBrtClock.test.ts`
- Create: `src/hooks/useCounter.ts`
- Test: `src/hooks/useCounter.test.ts`

**Interfaces:**
- Produces:
  - `useScrollSpy(ids: string[], options?: { rootMargin?: string }): string | null` — returns the id of the section currently in view (IntersectionObserver, ~150ms debounce).
  - `formatBrt(date: Date): string` — pure; `HH:MM` in `America/Sao_Paulo`. `useBrtClock(): string` — ticks each minute.
  - `counterValue(from: number, to: number, t: number): number` — pure ease-out interpolation, `t` clamped 0..1. `useCounter(target: number, opts?: { duration?: number }): number` — animates 0→target, snaps to target under reduced-motion.

- [ ] **Step 1: Write failing tests** (`src/hooks/useBrtClock.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { formatBrt } from './useBrtClock'

describe('formatBrt', () => {
  it('formats a UTC date into BRT HH:MM (UTC-3)', () => {
    // 2026-06-28T15:30:00Z → 12:30 in America/Sao_Paulo
    expect(formatBrt(new Date('2026-06-28T15:30:00Z'))).toBe('12:30')
  })
  it('pads single digits', () => {
    // 2026-06-28T12:05:00Z → 09:05
    expect(formatBrt(new Date('2026-06-28T12:05:00Z'))).toBe('09:05')
  })
})
```

And (`src/hooks/useCounter.test.ts`):

```ts
import { describe, expect, it } from 'vitest'
import { counterValue } from './useCounter'

describe('counterValue', () => {
  it('returns from at t=0 and to at t=1', () => {
    expect(counterValue(0, 100, 0)).toBe(0)
    expect(counterValue(0, 100, 1)).toBe(100)
  })
  it('clamps t outside 0..1', () => {
    expect(counterValue(0, 100, -1)).toBe(0)
    expect(counterValue(0, 100, 2)).toBe(100)
  })
  it('eases out (past midpoint by t=0.5)', () => {
    expect(counterValue(0, 100, 0.5)).toBeGreaterThan(50)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/hooks`
Expected: FAIL — cannot resolve modules.

- [ ] **Step 3: Create `src/hooks/useBrtClock.ts`**

```ts
import { useEffect, useState } from 'react'

const fmt = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function formatBrt(date: Date): string {
  return fmt.format(date).replace('24:', '00:')
}

export function useBrtClock(): string {
  const [time, setTime] = useState(() => formatBrt(new Date()))
  useEffect(() => {
    const id = setInterval(() => setTime(formatBrt(new Date())), 60_000)
    return () => clearInterval(id)
  }, [])
  return time
}
```

- [ ] **Step 4: Create `src/hooks/useCounter.ts`**

```ts
import { useEffect, useState } from 'react'

export function counterValue(from: number, to: number, t: number): number {
  const clamped = Math.min(1, Math.max(0, t))
  const eased = 1 - (1 - clamped) ** 3
  return from + (to - from) * eased
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useCounter(target: number, opts?: { duration?: number }): number {
  const duration = opts?.duration ?? 1200
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target)
      return
    }
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const t = (now - start) / duration
      setValue(counterValue(0, target, t))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}
```

- [ ] **Step 5: Create `src/hooks/useScrollSpy.ts`**

```ts
import { useEffect, useRef, useState } from 'react'

export function useScrollSpy(
  ids: string[],
  options?: { rootMargin?: string },
): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setActive(visible.target.id), 150)
      },
      { rootMargin: options?.rootMargin ?? '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => {
      observer.disconnect()
      if (timer.current) clearTimeout(timer.current)
    }
  }, [ids, options?.rootMargin])

  return active
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm test src/hooks`
Expected: PASS (formatBrt + counterValue cases).

- [ ] **Step 7: Commit**

```bash
pnpm check
git add src/hooks
git commit -m "feat(hooks): useScrollSpy, useBrtClock, useCounter (+ pure-logic tests)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: App shell page — skip link, landmarks, Header stub, section anchors

**Files:**
- Modify: `src/routes/index.tsx`
- Create: `src/components/sections/Header.tsx`

**Interfaces:**
- Consumes: `SettingsPopover` from `@/theme/SettingsPopover`; `Brand`, `BambooIndicator` from `@/components/primitives`; `useScrollSpy` from `@/hooks/useScrollSpy`; `useTranslation` from `react-i18next`.
- Produces:
  - `Header()` — sticky top bar: `Brand` (left), nav with 5 items + `BambooIndicator` under the active one (driven by `useScrollSpy`), `SettingsPopover` (right). Backdrop-blur + hairline border after ~80px scroll. This is a **foundation stub**: nav links scroll to section anchors; the Lanyard pill and mobile drawer are added in later phases (leave a `{/* TODO Phase 4: Lanyard pill */}` marker and a TODO for the mobile drawer).
  - `index.tsx` route — `Header` + `<main id="main">` containing 5 empty `<section>` anchors (`home`, `trajectory`, `stack`, `projects`, `about`) plus a visually-hidden skip link as the first focusable element.

- [ ] **Step 1: Create `src/components/sections/Header.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Brand, BambooIndicator } from '@/components/primitives'
import { SettingsPopover } from '@/theme/SettingsPopover'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'

const NAV = [
  { id: 'home', key: 'nav.home' },
  { id: 'about', key: 'nav.about' },
  { id: 'stack', key: 'nav.stack' },
  { id: 'projects', key: 'nav.projects' },
  { id: 'trajectory', key: 'nav.trajectory' },
] as const

const IDS = NAV.map((n) => n.id)

export function Header() {
  const { t } = useTranslation()
  const active = useScrollSpy(IDS)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      data-themed
      className={cn(
        'sticky top-0 z-40 flex items-center justify-between px-section-pad-sm py-3 transition-all duration-[var(--dur-micro)] md:px-section-pad',
        scrolled && 'border-b-[0.5px] border-border bg-bg-base/70 backdrop-blur-[14px]',
      )}
    >
      <a href='#home'>
        <Brand />
      </a>

      <nav aria-label='Primary' className='hidden items-center gap-6 md:flex'>
        {NAV.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={active === item.id ? 'true' : undefined}
            className={cn(
              'flex flex-col items-center gap-1 font-sans text-nav text-text-secondary hover:text-text-primary',
              active === item.id && 'text-text-primary',
            )}
          >
            {t(item.key)}
            <BambooIndicator active={active === item.id} />
          </a>
        ))}
      </nav>

      <div className='flex items-center gap-3'>
        {/* TODO Phase 4: Lanyard live-status pill */}
        {/* TODO later: mobile hamburger + drawer nav */}
        <SettingsPopover />
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Replace `src/routes/index.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Header } from '@/components/sections/Header'

export const Route = createFileRoute('/')({ component: App })

const SECTIONS = ['home', 'about', 'stack', 'projects', 'trajectory'] as const

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
        {SECTIONS.map((id) => (
          <section
            key={id}
            id={id}
            aria-labelledby={`${id}-label`}
            className='flex min-h-screen items-center justify-center px-section-pad-sm'
          >
            <h2 id={`${id}-label`} className='font-mono text-eyebrow tracking-eyebrow uppercase text-text-faint'>
              {id}
            </h2>
          </section>
        ))}
      </main>
    </>
  )
}
```

> `sr-only` / `not-sr-only` are Tailwind built-ins (available in v4). The placeholder sections are replaced by real section components in Phases 2–3.

- [ ] **Step 3: Full verification.**

Run: `pnpm typecheck && pnpm check && pnpm build`
Expected: all pass.

Run: `pnpm dev`, open `http://localhost:3000`, and verify:
- Tab once from page load → skip link appears (accent bg), Enter jumps to `#main`.
- Header is transparent at top; after scrolling 80px gains blur + hairline border.
- Scrolling activates the BambooIndicator under the matching nav item (segments animate in, center pulses).
- Gear opens the settings popover; switching **mode** flips surfaces dark↔light with a 400ms ease; switching **scheme** animates the accent; switching **language** updates nav labels live; reload preserves all three (localStorage).
- Toggle OS reduced-motion → no looping/entrance animations; theme still switches (near-instant).

- [ ] **Step 4: Commit**

```bash
pnpm check
git add src/routes/index.tsx src/components/sections/Header.tsx
git commit -m "feat(shell): header stub, scroll-spy nav, skip link, section anchors

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Phase 1 — Self-Review (completed during planning)

**Spec coverage (Phase 1 scope):**
- Theme System (3-tier vars, 10 combos, persistence, prefers-color-scheme, 400ms transition, external brands fixed) → Tasks 1, 2, 4, 5, 8. ✅
- i18n (i18next, pt/en/es, dynamic `<html lang>`, content resolver, hreflang) → Tasks 3, 5. ✅
- Primitives (all 9: Brand, Card, Eyebrow, DotHeading, StatusPill, Tag, Button, Input, BambooIndicator) → Tasks 6, 7. ✅
- Settings popover (mode/scheme/lang, ⌘+,, ESC, click-outside, checks) → Task 8. ✅
- Shared hooks (scroll-spy, BRT clock, counter) → Task 9. ✅
- App shell (SSR shell, SEO, skip link, landmarks, focus styles, reduced-motion, header scroll behavior) → Tasks 5, 10. ✅
- Deferred to later phases (correctly out of Phase 1): Lanyard (`useLanyard`), contact + CV server functions, all section content, mobile drawer, project dialog. Marked with TODO comments where stubbed.

**Placeholder scan:** No "TBD"/"add error handling"/"similar to Task N" — every code step is complete. The two `{/* TODO Phase N */}` markers in the Header are intentional cross-phase boundaries, not missing implementation.

**Type consistency:** `ThemeState`/`Mode`/`Scheme`/`Lang` defined in Task 2 are consumed identically in Tasks 3–5, 8. `L<T>` defined in Task 3 (`useLocalized.ts`) is the shared content type for later phases. `localize`/`useLocalized`, `useScrollSpy`, `formatBrt`/`useBrtClock`, `counterValue`/`useCounter` signatures match between their definition and consumption. `BambooIndicator({ active })` prop matches its use in the Header.

---

## Next Phases (not in this plan)

- **P2 — Static sections:** Hero, Stack, Services, Trajectory, Footer + their `src/data/*.ts`.
- **P3 — Rich sections:** Projects (Radix Tabs + ProjectDialog carousel + prev/next), About.
- **P4 — Integrations:** `useLanyard` → Header pill + NOW panel; contact server fn + form; CV server fn + reactive CTA; EasterEgg.
- **P5 — Polish:** a11y sweep across 10 combos, reduced-motion/contrast, Lighthouse, Vercel deploy.

Return to the writing-plans skill to author each subsequent phase plan once the prior phase is executed and verified.
