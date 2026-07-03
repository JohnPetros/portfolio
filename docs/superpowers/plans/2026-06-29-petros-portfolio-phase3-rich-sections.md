# Petros Portfolio — Phase 3 (Rich Sections) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the two interactive sections — **Projects** (Academic/Professional tabs + full-screen `ProjectDialog` with carousel + prev/next) and **About** (bio, stat counters, NOW-panel shell) — plus their `src/data/{projects,bio}.ts` content layer, a `RichText` renderer, and a `useCarousel` hook, composed into `index.tsx` against the Phase 1/2 foundation.

**Architecture:** Content lives in `src/data/*.ts` as typed `{ pt, en, es }` (`L<T>`) objects read via `useLocalized()`; pure helpers (project filtering, prev/next navigation, tech-id integrity, rich-text tokenizing, carousel index math) are TDD'd with Vitest. Section components are presentational and token-driven (no raw hex). The dialog/tabs/popover use **radix-ui** primitives for focus-trap/aria only; the carousel is a small custom hook + transform slider (no new dependency). Entrances reuse Phase 2's `Reveal`/`useReveal` mechanism (extended with an optional `animation` prop for directional fades); the Spotify equalizer and dialog open are pure-CSS keyframes. **No Framer Motion, no react-hook-form, no zod** are added this phase (Contact + Lanyard wiring are Phase 4).

**Tech Stack:** TanStack Start (React 19), Tailwind CSS v4, i18next + react-i18next, radix-ui (Dialog, Tabs, Popover, Tooltip), `@tabler/icons-react`, Vitest + Testing Library, Biome.

## Global Constraints

- **Package manager:** `pnpm`. Scripts: `pnpm dev`, `pnpm build`, `pnpm typecheck` (`tsc --noEmit`), `pnpm check` (`biome check --write .`), `pnpm test` (`vitest run`).
- **Code style (Biome):** 2-space indent, line width 90, single quotes, single JSX quotes, semicolons **as-needed** (omit unless required), self-closing elements. Run `pnpm check` before every commit.
- **Path alias:** `@/*` → `./src/*`.
- **TypeScript:** `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (use `import type` for type-only imports).
- **No new runtime dependencies.** Everything needed (`radix-ui`, `@tabler/icons-react`, i18next) is already installed. Do **not** add `motion`/Framer Motion, `react-hook-form`, or `zod` — those belong to Phase 4. The carousel is a custom hook; entrances use `Reveal` + the existing/new `animate-petros-*` CSS keyframes.
- **Color authority:** Components reference CSS-var-backed Tailwind tokens only (`bg-bg-card`, `text-text-secondary`, `border-border`, `text-accent`, `bg-accent-tint-12`, `from-panda-from`, …) — **never raw hex**. The **only** exceptions are external brand colors (tech monograms) and the `text-[#0a0a0a]` accent-button foreground already used in Phase 1/2.
- **Hairlines:** structural borders are `border-[0.5px] border-border`; interactive hover warms to `hover:border-accent-tint-20` and lifts `hover:-translate-y-0.5`. Never heavier than 0.5px.
- **Accessibility:** visible `--accent` focus is global (Phase 1 `:focus-visible`). Touch targets ≥ 44×44px (`min-h-11`). Icon-only controls need `aria-label`. `aria-live="polite"` on the carousel counter. Radix Dialog provides `role="dialog"` + `aria-modal` + focus-trap + focus-return; Radix Tabs provides `role=tablist/tab/tabpanel`. Respect `prefers-reduced-motion` (handled globally — keyframes snap; use `motion-safe:` for loops).
- **Reduced-motion / SSR safety:** the reveal mechanism must never hide content when JS is disabled. Hidden-until-revealed is gated behind `html.theme-ready` (Phase 1 bootstrap), so no-JS and crawler renders show all content (rule already in `animations.css`).
- **i18n split:** UI chrome (tab labels, button text, dialog section headings, NOW labels, stat labels) → `src/i18n/resources/{pt,en,es}.ts`. Content collections (projects, bio) → `src/data/*.ts` as `L<T>`.
- **Editorial emphasis convention:** content paragraphs use `**bold**` (→ `--text-primary`) and `*italic*` (→ serif-italic `--accent-italic`), rendered by the `RichText` component (Task 4). No raw JSX in data files.
- **Content is a later pass.** Real project detail copy and confirmed stats are the user's to author. Data files this phase ship the **factual skeleton from the PRD** (ids, kind, order, title, layout, techs, periods/orgs) with **drafted `// TODO(petros)` trilingual copy**. Tests validate structure + tech-id integrity, **never** copy. Do not invent specific factual claims about real projects — keep drafts generic until confirmed.
- **Commit cadence:** one commit per task (end of each task). Append the trailer:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

## File Structure (Phase 3)

```
src/
  data/
    projects.ts                    # CREATE: Project type, 11 entries, projectsByKind/projectNav/unknownProjectTechIds (TDD)
    projects.test.ts               # CREATE
    bio.ts                         # CREATE: BIO ({paragraphs, photoCaption, stats}) + STATS integrity (TDD)
    bio.test.ts                    # CREATE
  hooks/
    useCarousel.ts                 # CREATE: index math (nextIndex/prevIndex pure) + auto-loop hook
    useCarousel.test.ts            # CREATE
  components/
    common/
      RichText.tsx                 # CREATE: render **bold**/*italic* tokens
      RichText.test.ts             # CREATE (pure tokenizer)
      Reveal.tsx                   # MODIFY: add optional `animation` prop (default fade-up)
    sections/
      Projects.tsx                 # CREATE: Radix Tabs + BambooIndicator + card grid + dialog wiring
      ProjectCard.tsx              # CREATE: cover, eyebrow, dot title, tagline, tags(+N popover), links
      ProjectDialog.tsx            # CREATE: Radix Dialog, carousel, 7 detail sections, prev/next
      Carousel.tsx                 # CREATE: transform slider (uses useCarousel), arrows/counter/thumbs/keys/swipe
      About.tsx                    # CREATE: bio (RichText) + photo + stat counters + NOW-panel shell
      NowPanel.tsx                 # CREATE: 3-row Lanyard shell (offline placeholder + equalizer)
      StatCounter.tsx              # CREATE: single rolling stat (uses useCounter + useReveal trigger)
  i18n/resources/
    pt.ts  en.ts  es.ts            # MODIFY: add projects/about/now chrome strings
  styles/tokens/animations.css     # MODIFY: add fade-left/right, dialog-in, overlay-in, equalizer keyframes
  routes/index.tsx                 # MODIFY: replace #projects/#about placeholders with <Projects/> <About/>
```

**Section order & ids** (unchanged from Phase 2 composition; `#contact` remains a placeholder until Phase 4):
`#home` (Hero) → `#trajectory` → `#stack` → `#services` → `#projects` (Projects) → `#about` (About) → `#contact` (placeholder) → Footer.

> The Header scroll-spy observes `home/about/stack/projects/trajectory`. After this phase, `#projects` and `#about` resolve to real sections, so the BambooIndicator lights for every nav item except `#contact` (still placeholder, which is fine — it exists as an anchor).

---

## Task 1: Projects data — 11 projects + filter/nav/integrity helpers (TDD)

**Files:**
- Create: `src/data/projects.ts`
- Test: `src/data/projects.test.ts`

**Interfaces:**
- Consumes: `type L` from `@/i18n/useLocalized`; `getTech` from `@/data/stack`.
- Produces:
  - `type ProjectKind = 'academic' | 'professional'`
  - `type ProjectLayout = 'web' | 'mobile'`
  - `type DetailSkill = { icon: string; label: L }`
  - `type ProjectDetail = { about: L; features: L[]; techGroups: { label: L; techs: string[] }[]; contributions: L[]; lessons: L[]; hardSkills: DetailSkill[]; softSkills: DetailSkill[] }`
  - `type Project = { id: string; kind: ProjectKind; order: number; eyebrow: L; title: string; tagline: L; layout: ProjectLayout; cover: string; gallery: string[]; techs: string[]; links?: { code?: string; live?: string }; detail: ProjectDetail }`
  - `const PROJECTS: Project[]` (11 entries: 5 academic + 6 professional).
  - `function projectsByKind(kind: ProjectKind): Project[]` — entries of that kind sorted ascending by `order`.
  - `function projectNav(project: Project): { prev: Project | null; next: Project | null }` — neighbors within the same kind by `order`; `null` at extremes.
  - `function unknownProjectTechIds(): string[]` — every `techId` across all `techs` and `detail.techGroups[].techs` that does not resolve via `getTech` (must be empty).

- [ ] **Step 1: Write the failing test** (`src/data/projects.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { PROJECTS, projectNav, projectsByKind, unknownProjectTechIds } from './projects'

describe('PROJECTS', () => {
  it('has exactly 11 projects', () => {
    expect(PROJECTS).toHaveLength(11)
  })
  it('has 5 academic and 6 professional', () => {
    expect(PROJECTS.filter((p) => p.kind === 'academic')).toHaveLength(5)
    expect(PROJECTS.filter((p) => p.kind === 'professional')).toHaveLength(6)
  })
  it('has unique ids', () => {
    expect(new Set(PROJECTS.map((p) => p.id)).size).toBe(11)
  })
  it('order is unique within each kind', () => {
    for (const kind of ['academic', 'professional'] as const) {
      const orders = PROJECTS.filter((p) => p.kind === kind).map((p) => p.order)
      expect(new Set(orders).size).toBe(orders.length)
    }
  })
  it('every project references at least one tech and one gallery image', () => {
    for (const p of PROJECTS) {
      expect(p.techs.length).toBeGreaterThan(0)
      expect(p.gallery.length).toBeGreaterThan(0)
    }
  })
})

describe('projectsByKind', () => {
  it('returns academic projects sorted ascending by order', () => {
    const r = projectsByKind('academic')
    expect(r).toHaveLength(5)
    expect(r.map((p) => p.order)).toEqual([...r.map((p) => p.order)].sort((a, b) => a - b))
    expect(r.every((p) => p.kind === 'academic')).toBe(true)
  })
})

describe('projectNav', () => {
  it('first academic has no prev, has next', () => {
    const first = projectsByKind('academic')[0]
    const { prev, next } = projectNav(first)
    expect(prev).toBeNull()
    expect(next?.kind).toBe('academic')
  })
  it('last professional has next === null', () => {
    const pro = projectsByKind('professional')
    const { next } = projectNav(pro[pro.length - 1])
    expect(next).toBeNull()
  })
  it('a middle entry has both neighbors of the same kind', () => {
    const pro = projectsByKind('professional')
    const { prev, next } = projectNav(pro[1])
    expect(prev?.id).toBe(pro[0].id)
    expect(next?.id).toBe(pro[2].id)
  })
})

describe('unknownProjectTechIds', () => {
  it('every referenced techId exists in the stack', () => {
    expect(unknownProjectTechIds()).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/data/projects.test.ts`
Expected: FAIL — cannot resolve `./projects`.

- [ ] **Step 3: Write `src/data/projects.ts`**

> Factual fields (id/kind/order/title/layout, and the period+org in `eyebrow`) come from PRD §Projects. `techs` are reasonable guesses tied to real `stack.ts` ids; all copy is drafted and `// TODO(petros)`-marked for the content pass. `cover`/`gallery` point at `/projects/<id>/*` placeholder paths (assets added in the content pass; the Carousel hides arrows/counter when a single image is present, and `<img>` simply 404s harmlessly in dev). Keep every `techs`/`techGroups` id resolvable in `stack.ts` so `unknownProjectTechIds()` stays empty — if you add an id not in the stack, either add the tech to `stack.ts` or use an existing id.

```ts
import type { L } from '@/i18n/useLocalized'
import { getTech } from './stack'

export type ProjectKind = 'academic' | 'professional'
export type ProjectLayout = 'web' | 'mobile'

export type DetailSkill = { icon: string; label: L }

export type ProjectDetail = {
  about: L
  features: L[]
  techGroups: { label: L; techs: string[] }[]
  contributions: L[]
  lessons: L[]
  hardSkills: DetailSkill[]
  softSkills: DetailSkill[]
}

export type Project = {
  id: string
  kind: ProjectKind
  order: number
  eyebrow: L
  title: string
  tagline: L
  layout: ProjectLayout
  cover: string
  gallery: string[]
  techs: string[]
  links?: { code?: string; live?: string }
  detail: ProjectDetail
}

// Shared drafted skill chips — replace labels/icons in the content pass.
// TODO(petros): confirm hard/soft skills per project.
const HARD: DetailSkill[] = [
  { icon: 'IconCode', label: { pt: 'Arquitetura', en: 'Architecture', es: 'Arquitectura' } },
  { icon: 'IconDatabase', label: { pt: 'Modelagem de dados', en: 'Data modeling', es: 'Modelado de datos' } },
]
const SOFT: DetailSkill[] = [
  { icon: 'IconUsers', label: { pt: 'Trabalho em equipe', en: 'Teamwork', es: 'Trabajo en equipo' } },
  { icon: 'IconBulb', label: { pt: 'Resolução de problemas', en: 'Problem solving', es: 'Resolución de problemas' } },
]

// Minimal drafted detail factory keeps the 11 entries readable.
// TODO(petros): replace every line below with the real project story.
function draftDetail(techs: string[]): ProjectDetail {
  return {
    about: {
      pt: 'Descrição do projeto em **uma ou duas frases**.', // TODO(petros)
      en: 'Project description in **one or two sentences**.',
      es: 'Descripción del proyecto en **una o dos frases**.',
    },
    features: [
      { pt: 'Funcionalidade principal.', en: 'Core feature.', es: 'Funcionalidad principal.' }, // TODO(petros)
    ],
    techGroups: [
      {
        label: { pt: 'Stack', en: 'Stack', es: 'Stack' },
        techs,
      },
    ],
    contributions: [
      { pt: 'Minha contribuição no projeto.', en: 'My contribution to the project.', es: 'Mi contribución al proyecto.' }, // TODO(petros)
    ],
    lessons: [
      { pt: 'O que aprendi.', en: 'What I learned.', es: 'Lo que aprendí.' }, // TODO(petros)
    ],
    hardSkills: HARD,
    softSkills: SOFT,
  }
}

export const PROJECTS: Project[] = [
  // ── Academic (5) ── order = semester sequence
  {
    id: 'smart-farming',
    kind: 'academic',
    order: 1,
    eyebrow: { pt: '2024/1 · FATEC SJC', en: '2024/1 · FATEC SJC', es: '2024/1 · FATEC SJC' },
    title: 'Smart Farming',
    tagline: {
      pt: 'Agricultura inteligente — projeto de 1º semestre.', // TODO(petros)
      en: 'Smart agriculture — 1st-semester project.',
      es: 'Agricultura inteligente — proyecto de 1.º semestre.',
    },
    layout: 'web',
    cover: '/projects/smart-farming/cover.jpg',
    gallery: ['/projects/smart-farming/01.jpg'],
    techs: ['react', 'nodejs', 'postgresql'],
    detail: draftDetail(['react', 'nodejs', 'postgresql']),
  },
  {
    id: 'stocker',
    kind: 'academic',
    order: 2,
    eyebrow: { pt: '2024/2 · FATEC SJC', en: '2024/2 · FATEC SJC', es: '2024/2 · FATEC SJC' },
    title: 'Stocker',
    tagline: {
      pt: 'Controle de estoque — projeto de 2º semestre.', // TODO(petros)
      en: 'Inventory control — 2nd-semester project.',
      es: 'Control de inventario — proyecto de 2.º semestre.',
    },
    layout: 'web',
    cover: '/projects/stocker/cover.jpg',
    gallery: ['/projects/stocker/01.jpg'],
    techs: ['react', 'nestjs', 'postgresql'],
    detail: draftDetail(['react', 'nestjs', 'postgresql']),
  },
  {
    id: 'chronos',
    kind: 'academic',
    order: 3,
    eyebrow: { pt: '2025/1 · Necto Systems', en: '2025/1 · Necto Systems', es: '2025/1 · Necto Systems' },
    title: 'Chronos',
    tagline: {
      pt: 'Gestão de tempo — projeto de 3º semestre.', // TODO(petros)
      en: 'Time management — 3rd-semester project.',
      es: 'Gestión del tiempo — proyecto de 3.º semestre.',
    },
    layout: 'web',
    cover: '/projects/chronos/cover.jpg',
    gallery: ['/projects/chronos/01.jpg'],
    techs: ['nextjs', 'typescript', 'postgresql'],
    detail: draftDetail(['nextjs', 'typescript', 'postgresql']),
  },
  {
    id: 'gaia',
    kind: 'academic',
    order: 4,
    eyebrow: { pt: '2025/2 · Tecsus', en: '2025/2 · Tecsus', es: '2025/2 · Tecsus' },
    title: 'Gaia',
    tagline: {
      pt: 'Sustentabilidade — projeto de 4º semestre.', // TODO(petros)
      en: 'Sustainability — 4th-semester project.',
      es: 'Sostenibilidad — proyecto de 4.º semestre.',
    },
    layout: 'web',
    cover: '/projects/gaia/cover.jpg',
    gallery: ['/projects/gaia/01.jpg'],
    techs: ['react', 'fastapi', 'postgresql'],
    detail: draftDetail(['react', 'fastapi', 'postgresql']),
  },
  {
    id: 'animus',
    kind: 'academic',
    order: 5,
    eyebrow: { pt: '2026/1 · Xertica', en: '2026/1 · Xertica', es: '2026/1 · Xertica' },
    title: 'Animus',
    tagline: {
      pt: 'Projeto de 5º semestre.', // TODO(petros)
      en: '5th-semester project.',
      es: 'Proyecto de 5.º semestre.',
    },
    layout: 'web',
    cover: '/projects/animus/cover.jpg',
    gallery: ['/projects/animus/01.jpg'],
    techs: ['nextjs', 'gemini', 'qdrant'],
    detail: draftDetail(['nextjs', 'gemini', 'qdrant']),
  },
  // ── Professional (6) ──
  {
    id: 'stardust',
    kind: 'professional',
    order: 1,
    eyebrow: { pt: '2022–2024 · Tese ETEC', en: '2022–2024 · ETEC Thesis', es: '2022–2024 · Tesis ETEC' },
    title: 'StarDust',
    tagline: {
      pt: 'Tese sobre a linguagem **Delégua**.', // TODO(petros)
      en: 'Thesis on the **Delégua** language.',
      es: 'Tesis sobre el lenguaje **Delégua**.',
    },
    layout: 'web',
    cover: '/projects/stardust/cover.jpg',
    gallery: ['/projects/stardust/01.jpg'],
    techs: ['typescript', 'react', 'nodejs'],
    links: { code: '#' }, // TODO(petros): repo URL
    detail: draftDetail(['typescript', 'react', 'nodejs']),
  },
  {
    id: 'pulo-do-gato-news',
    kind: 'professional',
    order: 2,
    eyebrow: { pt: '2024 · Blog SEO', en: '2024 · SEO Blog', es: '2024 · Blog SEO' },
    title: 'Pulo do Gato News',
    tagline: {
      pt: 'Blog com foco em **SEO técnico**.', // TODO(petros)
      en: 'Blog focused on **technical SEO**.',
      es: 'Blog con foco en **SEO técnico**.',
    },
    layout: 'web',
    cover: '/projects/pulo-do-gato-news/cover.jpg',
    gallery: ['/projects/pulo-do-gato-news/01.jpg'],
    techs: ['astro', 'typescript'],
    links: { live: '#' }, // TODO(petros): live URL
    detail: draftDetail(['astro', 'typescript']),
  },
  {
    id: 'news-ai',
    kind: 'professional',
    order: 3,
    eyebrow: { pt: '2024 · Agente de IA', en: '2024 · AI Agent', es: '2024 · Agente de IA' },
    title: 'News AI',
    tagline: {
      pt: 'Agente de IA para curadoria de notícias.', // TODO(petros)
      en: 'AI agent for news curation.',
      es: 'Agente de IA para curaduría de noticias.',
    },
    layout: 'web',
    cover: '/projects/news-ai/cover.jpg',
    gallery: ['/projects/news-ai/01.jpg'],
    techs: ['python', 'agno', 'qdrant', 'gemini'],
    detail: draftDetail(['python', 'agno', 'qdrant', 'gemini']),
  },
  {
    id: 'sertton-mobile',
    kind: 'professional',
    order: 4,
    eyebrow: { pt: '2023–2024 · E-commerce mobile', en: '2023–2024 · Mobile e-commerce', es: '2023–2024 · E-commerce móvil' },
    title: 'Sertton',
    tagline: {
      pt: 'E-commerce mobile.', // TODO(petros)
      en: 'Mobile e-commerce.',
      es: 'E-commerce móvil.',
    },
    layout: 'mobile',
    cover: '/projects/sertton-mobile/cover.jpg',
    gallery: ['/projects/sertton-mobile/01.jpg'],
    techs: ['react-native', 'expo', 'nodejs'],
    detail: draftDetail(['react-native', 'expo', 'nodejs']),
  },
  {
    id: 'serverless-shipping',
    kind: 'professional',
    order: 5,
    eyebrow: { pt: '2023 · AWS Lambda', en: '2023 · AWS Lambda', es: '2023 · AWS Lambda' },
    title: 'Serverless Shipping',
    tagline: {
      pt: 'Cálculo de frete serverless na **AWS**.', // TODO(petros)
      en: 'Serverless shipping calculation on **AWS**.',
      es: 'Cálculo de envío serverless en **AWS**.',
    },
    layout: 'web',
    cover: '/projects/serverless-shipping/cover.jpg',
    gallery: ['/projects/serverless-shipping/01.jpg'],
    techs: ['aws', 'nodejs', 'typescript'],
    detail: draftDetail(['aws', 'nodejs', 'typescript']),
  },
  {
    id: 'sertton-industrial',
    kind: 'professional',
    order: 6,
    eyebrow: { pt: '2023–2024 · E-commerce web', en: '2023–2024 · Web e-commerce', es: '2023–2024 · E-commerce web' },
    title: 'Sertton Industrial',
    tagline: {
      pt: 'E-commerce web industrial.', // TODO(petros)
      en: 'Industrial web e-commerce.',
      es: 'E-commerce web industrial.',
    },
    layout: 'web',
    cover: '/projects/sertton-industrial/cover.jpg',
    gallery: ['/projects/sertton-industrial/01.jpg'],
    techs: ['nextjs', 'nodejs', 'postgresql'],
    detail: draftDetail(['nextjs', 'nodejs', 'postgresql']),
  },
]

export function projectsByKind(kind: ProjectKind): Project[] {
  return PROJECTS.filter((p) => p.kind === kind).sort((a, b) => a.order - b.order)
}

export function projectNav(project: Project): {
  prev: Project | null
  next: Project | null
} {
  const siblings = projectsByKind(project.kind)
  const i = siblings.findIndex((p) => p.id === project.id)
  return {
    prev: i > 0 ? siblings[i - 1] : null,
    next: i >= 0 && i < siblings.length - 1 ? siblings[i + 1] : null,
  }
}

export function unknownProjectTechIds(): string[] {
  const ids = PROJECTS.flatMap((p) => [
    ...p.techs,
    ...p.detail.techGroups.flatMap((g) => g.techs),
  ])
  return ids.filter((id) => !getTech(id))
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/data/projects.test.ts`
Expected: PASS. If `unknownProjectTechIds` is non-empty, fix the offending id to match a `stack.ts` id (or add the tech to the stack) — do not weaken the test.

- [ ] **Step 5: Commit**

```bash
pnpm check
git add src/data/projects.ts src/data/projects.test.ts
git commit -m "feat(data): projects — 11 entries + byKind/nav/integrity helpers

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Bio data — paragraphs, caption, 4 stats (TDD)

**Files:**
- Create: `src/data/bio.ts`
- Test: `src/data/bio.test.ts`

**Interfaces:**
- Consumes: `type L` from `@/i18n/useLocalized`.
- Produces:
  - `type Stat = { value: string; suffix: string; label: L }`
  - `type Bio = { paragraphs: L[]; photoCaption: L; stats: Stat[] }`
  - `const BIO: Bio`.
  - `function statTarget(stat: Stat): number` — parses the numeric portion of `value` (strips thousands separators) for the rolling counter; returns `0` if non-numeric.

- [ ] **Step 1: Write the failing test** (`src/data/bio.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { BIO, statTarget } from './bio'

describe('BIO', () => {
  it('has exactly 4 bio paragraphs', () => {
    expect(BIO.paragraphs).toHaveLength(4)
  })
  it('has exactly 4 stats', () => {
    expect(BIO.stats).toHaveLength(4)
  })
  it('every stat has a label in all 3 languages', () => {
    for (const s of BIO.stats) {
      expect(s.label.pt).toBeTruthy()
      expect(s.label.en).toBeTruthy()
      expect(s.label.es).toBeTruthy()
    }
  })
})

describe('statTarget', () => {
  it('parses a plain integer', () => {
    expect(statTarget({ value: '100', suffix: '%', label: { pt: '', en: '', es: '' } })).toBe(100)
  })
  it('parses a value with a thousands separator', () => {
    expect(statTarget({ value: '2,154', suffix: '', label: { pt: '', en: '', es: '' } })).toBe(2154)
  })
  it('parses a leading-number value like "5+"', () => {
    expect(statTarget({ value: '5', suffix: '+', label: { pt: '', en: '', es: '' } })).toBe(5)
  })
  it('returns 0 for a non-numeric value', () => {
    expect(statTarget({ value: '∞', suffix: '', label: { pt: '', en: '', es: '' } })).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/data/bio.test.ts`
Expected: FAIL — cannot resolve `./bio`.

- [ ] **Step 3: Write `src/data/bio.ts`**

> Paragraph copy is drafted from PRD §About (almost-engineering → accounting → Python automating spreadsheets → JS/web → ETEC → FATEC → Lumetis) and `// TODO(petros)`-marked. The Duolingo streak value needs confirmation (PRD assumption `2,154`).

```ts
import type { L } from '@/i18n/useLocalized'

export type Stat = { value: string; suffix: string; label: L }
export type Bio = { paragraphs: L[]; photoCaption: L; stats: Stat[] }

export const BIO: Bio = {
  paragraphs: [
    {
      // TODO(petros): confirm wording
      pt: 'Quase fui *engenheiro*, passei pela **contabilidade**, e foi automatizando planilhas com **Python** que me apaixonei por programar.',
      en: 'I almost became an *engineer*, passed through **accounting**, and it was automating spreadsheets with **Python** that made me fall in love with programming.',
      es: 'Casi fui *ingeniero*, pasé por la **contabilidad**, y fue automatizando hojas de cálculo con **Python** que me enamoré de programar.',
    },
    {
      pt: 'De Python para **JavaScript** e a **web**, descobri que podia construir produtos inteiros do zero.', // TODO(petros)
      en: 'From Python to **JavaScript** and the **web**, I found I could build whole products from scratch.',
      es: 'De Python a **JavaScript** y la **web**, descubrí que podía construir productos enteros desde cero.',
    },
    {
      pt: 'Na **ETEC** veio a base; na **FATEC**, a profundidade — e a pesquisa que virou a tese *StarDust*.', // TODO(petros)
      en: 'At **ETEC** came the foundation; at **FATEC**, the depth — and the research that became the *StarDust* thesis.',
      es: 'En la **ETEC** llegó la base; en la **FATEC**, la profundidad — y la investigación que se volvió la tesis *StarDust*.',
    },
    {
      pt: 'Hoje, na **Lumetis**, transformo ideias em produtos *full stack* todos os dias.', // TODO(petros)
      en: 'Today, at **Lumetis**, I turn ideas into *full stack* products every day.',
      es: 'Hoy, en **Lumetis**, transformo ideas en productos *full stack* todos los días.',
    },
  ],
  photoCaption: {
    // TODO(petros): the panda explanation
    pt: 'O panda? Uma *longa* história — pergunte quando nos falarmos.',
    en: 'The panda? A *long* story — ask me when we talk.',
    es: '¿El panda? Una *larga* historia — pregúntame cuando hablemos.',
  },
  stats: [
    {
      value: '2,154', // TODO(petros): confirm exact Duolingo streak
      suffix: '',
      label: { pt: 'dias de Duolingo', en: 'days of Duolingo', es: 'días de Duolingo' },
    },
    {
      value: '100',
      suffix: '%',
      label: { pt: 'de presença desde o 1º ano', en: 'attendance since 1st year', es: 'de asistencia desde 1.er año' },
    },
    {
      value: '5',
      suffix: '+',
      label: { pt: 'anos de lofi diário', en: 'years of daily lofi', es: 'años de lofi diario' },
    },
    {
      value: '3',
      suffix: '+',
      label: { pt: 'anos de software', en: 'years of software', es: 'años de software' },
    },
  ],
}

export function statTarget(stat: Stat): number {
  const digits = stat.value.replace(/[^0-9]/g, '')
  return digits ? Number.parseInt(digits, 10) : 0
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/data/bio.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
pnpm check
git add src/data/bio.ts src/data/bio.test.ts
git commit -m "feat(data): bio — paragraphs, caption, 4 stats + statTarget parser

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: i18n chrome strings for Projects + About

**Files:**
- Modify: `src/i18n/resources/pt.ts`
- Modify: `src/i18n/resources/en.ts`
- Modify: `src/i18n/resources/es.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: extended `UIStrings` shape (inferred from `pt`) with new top-level keys `projects`, `about`, `now`. `en`/`es` are typed `UIStrings` and must mirror the shape exactly.

- [ ] **Step 1: Append the new groups to `src/i18n/resources/pt.ts`** (inside the `pt` object, after `footer`):

```ts
  projects: {
    eyebrow: 'PROJETOS',
    title: 'O que eu já',
    titleAccent: 'construí',
    tabAcademic: 'ACADÊMICOS',
    tabProfessional: 'PROFISSIONAIS',
    viewDetails: 'VER DETALHES',
    mobileLabel: 'MOBILE',
    code: 'Código',
    live: 'Ver online',
    moreTechs: '+{{count}}',
    counter: '{{current}} / {{total}}',
    prev: 'Anterior',
    next: 'Próximo',
    detailAbout: 'SOBRE',
    detailFeatures: 'FUNCIONALIDADES',
    detailTech: 'TECNOLOGIAS',
    detailContributions: 'CONTRIBUIÇÕES',
    detailLessons: 'APRENDIZADOS',
    detailHardSkills: 'HARD SKILLS',
    detailSoftSkills: 'SOFT SKILLS',
    close: 'Fechar',
    prevImage: 'Imagem anterior',
    nextImage: 'Próxima imagem',
    goToImage: 'Ir para a imagem {{index}}',
  },
  about: {
    eyebrow: 'SOBRE MIM',
    title: 'Um pouco da minha',
    titleAccent: 'história',
    continueReading: 'Continuar lendo',
    photoLabel: 'JP & 🐼',
  },
  now: {
    title: 'AGORA',
    coding: 'Programando',
    playing: 'Jogando',
    listening: 'Ouvindo',
    offline: 'Offline',
    idle: 'Nada por agora',
  },
```

- [ ] **Step 2: Append the matching `en` groups to `src/i18n/resources/en.ts`** (inside the `en` object):

```ts
  projects: {
    eyebrow: 'PROJECTS',
    title: 'What I have',
    titleAccent: 'built',
    tabAcademic: 'ACADEMIC',
    tabProfessional: 'PROFESSIONAL',
    viewDetails: 'VIEW DETAILS',
    mobileLabel: 'MOBILE',
    code: 'Code',
    live: 'View live',
    moreTechs: '+{{count}}',
    counter: '{{current}} / {{total}}',
    prev: 'Previous',
    next: 'Next',
    detailAbout: 'ABOUT',
    detailFeatures: 'FEATURES',
    detailTech: 'TECHNOLOGIES',
    detailContributions: 'CONTRIBUTIONS',
    detailLessons: 'LESSONS',
    detailHardSkills: 'HARD SKILLS',
    detailSoftSkills: 'SOFT SKILLS',
    close: 'Close',
    prevImage: 'Previous image',
    nextImage: 'Next image',
    goToImage: 'Go to image {{index}}',
  },
  about: {
    eyebrow: 'ABOUT ME',
    title: 'A bit of my',
    titleAccent: 'story',
    continueReading: 'Continue reading',
    photoLabel: 'JP & 🐼',
  },
  now: {
    title: 'NOW',
    coding: 'Coding',
    playing: 'Playing',
    listening: 'Listening',
    offline: 'Offline',
    idle: 'Nothing right now',
  },
```

- [ ] **Step 3: Append the matching `es` groups to `src/i18n/resources/es.ts`** (inside the `es` object):

```ts
  projects: {
    eyebrow: 'PROYECTOS',
    title: 'Lo que ya',
    titleAccent: 'construí',
    tabAcademic: 'ACADÉMICOS',
    tabProfessional: 'PROFESIONALES',
    viewDetails: 'VER DETALLES',
    mobileLabel: 'MÓVIL',
    code: 'Código',
    live: 'Ver online',
    moreTechs: '+{{count}}',
    counter: '{{current}} / {{total}}',
    prev: 'Anterior',
    next: 'Siguiente',
    detailAbout: 'SOBRE',
    detailFeatures: 'FUNCIONALIDADES',
    detailTech: 'TECNOLOGÍAS',
    detailContributions: 'CONTRIBUCIONES',
    detailLessons: 'APRENDIZAJES',
    detailHardSkills: 'HARD SKILLS',
    detailSoftSkills: 'SOFT SKILLS',
    close: 'Cerrar',
    prevImage: 'Imagen anterior',
    nextImage: 'Imagen siguiente',
    goToImage: 'Ir a la imagen {{index}}',
  },
  about: {
    eyebrow: 'SOBRE MÍ',
    title: 'Un poco de mi',
    titleAccent: 'historia',
    continueReading: 'Seguir leyendo',
    photoLabel: 'JP & 🐼',
  },
  now: {
    title: 'AHORA',
    coding: 'Programando',
    playing: 'Jugando',
    listening: 'Escuchando',
    offline: 'Offline',
    idle: 'Nada por ahora',
  },
```

- [ ] **Step 4: Typecheck** (confirms `en`/`es` match the `pt`-inferred `UIStrings` shape exactly)

Run: `pnpm typecheck`
Expected: PASS. If it fails, a key is missing or misspelled in `en`/`es` — align it with `pt`.

- [ ] **Step 5: Commit**

```bash
pnpm check
git add src/i18n/resources
git commit -m "feat(i18n): chrome strings for projects/about/now

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: RichText component (TDD tokenizer)

**Files:**
- Create: `src/components/common/RichText.tsx`
- Test: `src/components/common/RichText.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type RichToken = { kind: 'text' | 'bold' | 'italic'; value: string }`
  - `function tokenizeRich(input: string): RichToken[]` — splits on `**bold**` and `*italic*` (bold takes precedence; non-greedy). Plain runs become `text` tokens.
  - `RichText({ children, className })` — renders the tokens: `bold` → `<strong class="font-medium text-text-primary">`, `italic` → `<em class="font-serif italic text-accent-italic">`, `text` → bare string.

> The tokenizer is the testable unit. The component is a thin map over `tokenizeRich`. Keep the regex simple: match `**...**` first, then `*...*`, then literal text.

- [ ] **Step 1: Write the failing test** (`src/components/common/RichText.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { tokenizeRich } from './RichText'

describe('tokenizeRich', () => {
  it('returns a single text token for plain input', () => {
    expect(tokenizeRich('hello world')).toEqual([{ kind: 'text', value: 'hello world' }])
  })
  it('parses a bold run', () => {
    expect(tokenizeRich('a **b** c')).toEqual([
      { kind: 'text', value: 'a ' },
      { kind: 'bold', value: 'b' },
      { kind: 'text', value: ' c' },
    ])
  })
  it('parses an italic run', () => {
    expect(tokenizeRich('a *b* c')).toEqual([
      { kind: 'text', value: 'a ' },
      { kind: 'italic', value: 'b' },
      { kind: 'text', value: ' c' },
    ])
  })
  it('parses bold and italic in the same string', () => {
    expect(tokenizeRich('**x** and *y*')).toEqual([
      { kind: 'bold', value: 'x' },
      { kind: 'text', value: ' and ' },
      { kind: 'italic', value: 'y' },
    ])
  })
  it('does not treat ** as italic (bold precedence)', () => {
    expect(tokenizeRich('**bold**')).toEqual([{ kind: 'bold', value: 'bold' }])
  })
  it('returns empty array for empty string', () => {
    expect(tokenizeRich('')).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/common/RichText.test.ts`
Expected: FAIL — cannot resolve `./RichText`.

- [ ] **Step 3: Write `src/components/common/RichText.tsx`**

```tsx
import { Fragment } from 'react'
import { cn } from '@/lib/utils'

export type RichToken = { kind: 'text' | 'bold' | 'italic'; value: string }

// Matches **bold** (group 1) or *italic* (group 2). Bold precedes italic.
const RICH_RE = /\*\*([^*]+)\*\*|\*([^*]+)\*/g

export function tokenizeRich(input: string): RichToken[] {
  if (!input) return []
  const tokens: RichToken[] = []
  let last = 0
  for (const m of input.matchAll(RICH_RE)) {
    const start = m.index
    if (start > last) tokens.push({ kind: 'text', value: input.slice(last, start) })
    if (m[1] !== undefined) tokens.push({ kind: 'bold', value: m[1] })
    else if (m[2] !== undefined) tokens.push({ kind: 'italic', value: m[2] })
    last = start + m[0].length
  }
  if (last < input.length) tokens.push({ kind: 'text', value: input.slice(last) })
  return tokens
}

export function RichText({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const tokens = tokenizeRich(children)
  return (
    <span className={className}>
      {tokens.map((tok, i) => {
        if (tok.kind === 'bold')
          return (
            <strong key={i} className={cn('font-medium text-text-primary')}>
              {tok.value}
            </strong>
          )
        if (tok.kind === 'italic')
          return (
            <em key={i} className={cn('font-serif italic text-accent-italic')}>
              {tok.value}
            </em>
          )
        return <Fragment key={i}>{tok.value}</Fragment>
      })}
    </span>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/common/RichText.test.ts`
Expected: PASS (all 6 cases).

- [ ] **Step 5: Typecheck + lint**

Run: `pnpm typecheck && pnpm check`
Expected: PASS. (Biome may warn about the array-index `key`; that's acceptable for a static, never-reordered token list — if Biome errors, switch to `key={`${tok.kind}-${i}`}`.)

- [ ] **Step 6: Commit**

```bash
git add src/components/common/RichText.tsx src/components/common/RichText.test.ts
git commit -m "feat(common): RichText — bold/italic editorial tokenizer + renderer

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: `useCarousel` hook (TDD index math)

**Files:**
- Create: `src/hooks/useCarousel.ts`
- Test: `src/hooks/useCarousel.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `function nextIndex(i: number, length: number): number` — wraps to `0` after the last.
  - `function prevIndex(i: number, length: number): number` — wraps to `length - 1` before the first.
  - `function useCarousel(length: number, opts?: { intervalMs?: number; auto?: boolean }): { index: number; next: () => void; prev: () => void; goTo: (i: number) => void; paused: boolean; pause: () => void; resume: () => void }` — holds the active index, advances every `intervalMs` (default 6000) while not paused and `length > 1`, and clamps `index` when `length` changes.

> Only the pure `nextIndex`/`prevIndex` helpers are unit-tested. The timer logic is verified in the dev smoke-test (Task 7).

- [ ] **Step 1: Write the failing test** (`src/hooks/useCarousel.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { nextIndex, prevIndex } from './useCarousel'

describe('nextIndex', () => {
  it('advances within range', () => {
    expect(nextIndex(0, 3)).toBe(1)
    expect(nextIndex(1, 3)).toBe(2)
  })
  it('wraps to 0 after the last', () => {
    expect(nextIndex(2, 3)).toBe(0)
  })
  it('stays at 0 for a single item', () => {
    expect(nextIndex(0, 1)).toBe(0)
  })
})

describe('prevIndex', () => {
  it('goes back within range', () => {
    expect(prevIndex(2, 3)).toBe(1)
  })
  it('wraps to the last before the first', () => {
    expect(prevIndex(0, 3)).toBe(2)
  })
  it('stays at 0 for a single item', () => {
    expect(prevIndex(0, 1)).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/hooks/useCarousel.test.ts`
Expected: FAIL — cannot resolve `./useCarousel`.

- [ ] **Step 3: Write `src/hooks/useCarousel.ts`**

```ts
import { useCallback, useEffect, useRef, useState } from 'react'

export function nextIndex(i: number, length: number): number {
  if (length <= 1) return 0
  return (i + 1) % length
}

export function prevIndex(i: number, length: number): number {
  if (length <= 1) return 0
  return (i - 1 + length) % length
}

export function useCarousel(
  length: number,
  opts?: { intervalMs?: number; auto?: boolean },
) {
  const intervalMs = opts?.intervalMs ?? 6000
  const auto = opts?.auto ?? true
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // Clamp when the source length shrinks (e.g. switching projects).
  useEffect(() => {
    setIndex((i) => (i >= length ? 0 : i))
  }, [length])

  const next = useCallback(() => setIndex((i) => nextIndex(i, length)), [length])
  const prev = useCallback(() => setIndex((i) => prevIndex(i, length)), [length])
  const goTo = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(i, length - 1))),
    [length],
  )
  const pause = useCallback(() => setPaused(true), [])
  const resume = useCallback(() => setPaused(false), [])

  const nextRef = useRef(next)
  nextRef.current = next

  useEffect(() => {
    if (!auto || paused || length <= 1) return
    const id = setInterval(() => nextRef.current(), intervalMs)
    return () => clearInterval(id)
  }, [auto, paused, length, intervalMs])

  return { index, next, prev, goTo, paused, pause, resume }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/hooks/useCarousel.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
pnpm check
git add src/hooks/useCarousel.ts src/hooks/useCarousel.test.ts
git commit -m "feat(hooks): useCarousel — wrapping index math + pausable auto-loop

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: `ProjectCard` component

**Files:**
- Create: `src/components/sections/ProjectCard.tsx`

**Interfaces:**
- Consumes: `type Project` from `@/data/projects`; `getTech` from `@/data/stack`; `Card`, `Eyebrow`, `Tag`, `Button` from `@/components/primitives`; `useLocalized` from `@/i18n/useLocalized`; `useTranslation` from `react-i18next`; `Popover` from `radix-ui`; `IconCode`, `IconExternalLink` from `@tabler/icons-react`; `cn` from `@/lib/utils`.
- Produces: `ProjectCard({ project, onOpen })` — a `Card` showing the cover (16:9 web / 9:16 mobile-framed), an `Eyebrow`, a title with an accent dot, the localized tagline, up to 5 tech `Tag`s + a `+N` Popover for the rest, optional Code/Live link buttons, and a `VIEW DETAILS` button calling `onOpen`.

> `MAX_TAGS = 5`. The `+N` chip is a Radix Popover listing the remaining tech names. Cover image scales `1→1.02` on hover via `group-hover:scale-[1.02]` on the `<img>`; the card itself uses the `Card` primitive's `interactive` lift. Mobile-layout projects wrap the cover in a `aspect-[9/16] max-w-[200px] mx-auto` frame with a `MOBILE` label.

- [ ] **Step 1: Create `src/components/sections/ProjectCard.tsx`**

```tsx
import { IconCode, IconExternalLink } from '@tabler/icons-react'
import { Popover } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { Button, Card, Eyebrow, Tag } from '@/components/primitives'
import type { Project } from '@/data/projects'
import { getTech } from '@/data/stack'
import { useLocalized } from '@/i18n/useLocalized'
import { cn } from '@/lib/utils'

const MAX_TAGS = 5

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: () => void
}) {
  const { t } = useTranslation()
  const localize = useLocalized()
  const visible = project.techs.slice(0, MAX_TAGS)
  const rest = project.techs.slice(MAX_TAGS)
  const isMobile = project.layout === 'mobile'

  return (
    <Card interactive className='group flex flex-col gap-4'>
      <div
        className={cn(
          'relative overflow-hidden rounded-sm',
          isMobile ? 'mx-auto aspect-[9/16] w-full max-w-[200px]' : 'aspect-video w-full',
        )}
      >
        <img
          src={project.cover}
          alt={localize(project.tagline)}
          loading='lazy'
          className='size-full object-cover transition-transform duration-[var(--dur-micro)] group-hover:scale-[1.02]'
        />
        {isMobile && (
          <span className='absolute left-2 top-2 rounded-pill bg-bg-elevated px-2 py-0.5 font-mono text-micro tracking-meta uppercase text-text-muted'>
            {t('projects.mobileLabel')}
          </span>
        )}
      </div>

      <Eyebrow>{localize(project.eyebrow)}</Eyebrow>

      <h3 className='flex items-center gap-2 font-sans text-title font-medium tracking-tight text-text-primary'>
        <span aria-hidden className='size-1.5 rounded-pill bg-accent shadow-glow-dot' />
        {project.title}
      </h3>

      <p className='font-sans text-body leading-body text-text-secondary'>
        {localize(project.tagline)}
      </p>

      <div className='flex flex-wrap gap-1.5'>
        {visible.map((id) => (
          <Tag key={id}>{getTech(id)?.name ?? id}</Tag>
        ))}
        {rest.length > 0 && (
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                type='button'
                aria-label={t('projects.moreTechs', { count: rest.length })}
                className='inline-flex items-center rounded-pill border-[0.5px] border-border px-2 py-0.5 font-mono text-micro tracking-meta uppercase text-text-muted transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-text-primary'
              >
                {t('projects.moreTechs', { count: rest.length })}
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                sideOffset={6}
                className='z-50 flex max-w-[220px] flex-wrap gap-1.5 rounded-sm border-[0.5px] border-border bg-bg-elevated p-2 shadow-[var(--shadow-card)]'
              >
                {rest.map((id) => (
                  <Tag key={id}>{getTech(id)?.name ?? id}</Tag>
                ))}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )}
      </div>

      <div className='mt-auto flex flex-wrap items-center gap-2 pt-2'>
        <Button onClick={onOpen}>{t('projects.viewDetails')}</Button>
        {project.links?.code && (
          <a
            href={project.links.code}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={t('projects.code')}
            className='inline-flex size-11 items-center justify-center rounded-sm border-[0.5px] border-border text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent'
          >
            <IconCode size={18} stroke={1.5} aria-hidden />
          </a>
        )}
        {project.links?.live && (
          <a
            href={project.links.live}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={t('projects.live')}
            className='inline-flex size-11 items-center justify-center rounded-sm border-[0.5px] border-border text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent'
          >
            <IconExternalLink size={18} stroke={1.5} aria-hidden />
          </a>
        )}
      </div>
    </Card>
  )
}
```

- [ ] **Step 2: Verify the Tabler icon names resolve.**

Run: `node -e "const i=require('@tabler/icons-react'); console.log(['IconCode','IconExternalLink'].map(n=>n+':'+(n in i)))"`
Expected: both `:true`. Substitute a present alternative for any `false` (e.g. `IconLink` for `IconExternalLink`).

- [ ] **Step 3: Typecheck + lint**

Run: `pnpm typecheck && pnpm check`
Expected: PASS. (`ProjectCard` is not yet mounted; it renders in Task 9.)

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ProjectCard.tsx
git commit -m "feat(section): ProjectCard — cover, dot title, tags +N popover, links

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: `Carousel` component

**Files:**
- Create: `src/components/sections/Carousel.tsx`

**Interfaces:**
- Consumes: `useCarousel` from `@/hooks/useCarousel`; `useTranslation` from `react-i18next`; `IconChevronLeft`, `IconChevronRight` from `@tabler/icons-react`; `cn` from `@/lib/utils`.
- Produces: `Carousel({ images, layout, alt })` — a transform-based slider over `images`. Shows prev/next arrows, an `aria-live` counter (`NN / NN`), and a thumbnail row when `images.length > 1` (otherwise hidden). Supports ←/→ keys (when focused), pointer swipe, and a 6s pausable auto-loop (pauses on pointer-enter/focus, resumes on leave/blur).

> `layout` controls the frame aspect (`aspect-video` web / `aspect-[9/16]` mobile). A single-image gallery hides arrows, counter and thumbnails (PRD edge case). Swipe: track `pointerdown` X, compare on `pointerup`, threshold 40px.

- [ ] **Step 1: Create `src/components/sections/Carousel.tsx`**

```tsx
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProjectLayout } from '@/data/projects'
import { useCarousel } from '@/hooks/useCarousel'
import { cn } from '@/lib/utils'

export function Carousel({
  images,
  layout,
  alt,
}: {
  images: string[]
  layout: ProjectLayout
  alt: string
}) {
  const { t } = useTranslation()
  const { index, next, prev, goTo, pause, resume } = useCarousel(images.length)
  const startX = useRef<number | null>(null)
  const multiple = images.length > 1

  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX
  }
  function onPointerUp(e: React.PointerEvent) {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    if (dx > 40) prev()
    else if (dx < -40) next()
    startX.current = null
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') prev()
    else if (e.key === 'ArrowRight') next()
  }

  return (
    <div
      className='flex flex-col gap-3'
      onPointerEnter={pause}
      onPointerLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      {/* viewport */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: keyboard handler is paired with the arrow buttons below for AT users */}
      <div
        role='group'
        aria-roledescription='carousel'
        aria-label={alt}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className={cn(
          'relative overflow-hidden rounded-md border-[0.5px] border-border bg-bg-card',
          layout === 'mobile' ? 'mx-auto aspect-[9/16] w-full max-w-[260px]' : 'aspect-video w-full',
        )}
      >
        <div
          className='flex size-full transition-transform duration-[var(--dur-theme)]'
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${alt} — ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className='size-full shrink-0 object-cover'
            />
          ))}
        </div>

        {multiple && (
          <>
            <button
              type='button'
              onClick={prev}
              aria-label={t('projects.prevImage')}
              className='absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-pill border-[0.5px] border-border bg-bg-elevated text-text-secondary shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent'
            >
              <IconChevronLeft size={18} stroke={1.5} aria-hidden />
            </button>
            <button
              type='button'
              onClick={next}
              aria-label={t('projects.nextImage')}
              className='absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-pill border-[0.5px] border-border bg-bg-elevated text-text-secondary shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent'
            >
              <IconChevronRight size={18} stroke={1.5} aria-hidden />
            </button>
            <span
              aria-live='polite'
              className='absolute bottom-2 right-2 rounded-pill bg-bg-elevated px-2 py-0.5 font-mono text-micro tracking-meta uppercase text-text-muted'
            >
              {t('projects.counter', { current: index + 1, total: images.length })}
            </span>
          </>
        )}
      </div>

      {multiple && (
        <div className='flex flex-wrap gap-2'>
          {images.map((src, i) => (
            <button
              key={src}
              type='button'
              onClick={() => goTo(i)}
              aria-label={t('projects.goToImage', { index: i + 1 })}
              aria-current={i === index}
              className={cn(
                'size-12 overflow-hidden rounded-sm border-[0.5px] transition-all duration-[var(--dur-micro)]',
                i === index ? 'border-accent-tint-20' : 'border-border opacity-60 hover:opacity-100',
              )}
            >
              <img src={src} alt='' loading='lazy' className='size-full object-cover' />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify the Tabler icon names resolve.**

Run: `node -e "const i=require('@tabler/icons-react'); console.log(['IconChevronLeft','IconChevronRight'].map(n=>n+':'+(n in i)))"`
Expected: both `:true`.

- [ ] **Step 3: Typecheck + lint**

Run: `pnpm typecheck && pnpm check`
Expected: PASS. If Biome flags the `noStaticElementInteractions`/keyboard rule despite the suppression, confirm the rule name in the Biome output and update the `biome-ignore` comment to the exact rule it reports.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Carousel.tsx
git commit -m "feat(section): Carousel — slider with arrows, counter, thumbs, keys, swipe

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: `ProjectDialog` component

**Files:**
- Create: `src/components/sections/ProjectDialog.tsx`
- Modify: `src/styles/tokens/animations.css`

**Interfaces:**
- Consumes: `type Project`, `projectNav` from `@/data/projects`; `getTech` from `@/data/stack`; `Eyebrow`, `Tag` from `@/components/primitives`; `RichText` from `@/components/common/RichText`; `Carousel` from `./Carousel`; `useLocalized` from `@/i18n/useLocalized`; `useTranslation` from `react-i18next`; `Dialog` from `radix-ui`; `IconX`, `IconChevronLeft`, `IconChevronRight`, `type IconProps` and the skill icons from `@tabler/icons-react`; `cn` from `@/lib/utils`.
- Produces: `ProjectDialog({ project, open, onOpenChange, onNavigate })` — a Radix Dialog. When `project` is non-null and `open`, renders a full-screen panel: sticky header (eyebrow + close), `Carousel`, the 7 detail sections, and a footer with ← Previous / Next → buttons (disabled at extremes) that call `onNavigate(nextProject)`.

> The 7 sections in PRD order: About, Features, Technologies (sub-grouped), Contributions, Lessons, Hard skills (icon chips), Soft skills (icon chips). The detail-skill icons are resolved from a small map keyed by the `icon` string (same pattern as Services). The Carousel is keyed by `project.id` so it resets to the first image on prev/next. Radix Dialog supplies ESC/backdrop close + focus trap + focus return. `Dialog.Title` is required for a11y — render the project title there (visually it lives in the panel; we also expose it as the accessible title).

- [ ] **Step 1: Add dialog/overlay keyframes to `src/styles/tokens/animations.css`** (append at the end):

```css
/* Project dialog: overlay fade + panel zoom-in (motion-safe; snap under reduced-motion) */
@keyframes petros-overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes petros-dialog-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@media (prefers-reduced-motion: no-preference) {
  [data-petros-overlay][data-state='open'] {
    animation: petros-overlay-in var(--dur-micro) ease-out;
  }
  [data-petros-dialog][data-state='open'] {
    animation: petros-dialog-in var(--dur-micro) ease-out;
  }
}
```

- [ ] **Step 2: Create `src/components/sections/ProjectDialog.tsx`**

```tsx
import {
  IconBulb,
  IconChevronLeft,
  IconChevronRight,
  IconCode,
  IconDatabase,
  type IconProps,
  IconUsers,
  IconX,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'
import { Dialog } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { RichText } from '@/components/common/RichText'
import { Eyebrow, Tag } from '@/components/primitives'
import { type Project, projectNav } from '@/data/projects'
import { getTech } from '@/data/stack'
import { useLocalized } from '@/i18n/useLocalized'
import { Carousel } from './Carousel'

const SKILL_ICONS: Record<string, ComponentType<IconProps>> = {
  IconCode,
  IconDatabase,
  IconUsers,
  IconBulb,
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h3 className='mt-8 font-mono text-meta tracking-meta uppercase text-text-muted'>
      {children}
    </h3>
  )
}

function SkillChips({
  skills,
}: {
  skills: { icon: string; label: import('@/i18n/useLocalized').L }[]
}) {
  const localize = useLocalized()
  return (
    <div className='mt-3 flex flex-wrap gap-2'>
      {skills.map((s) => {
        const Icon = SKILL_ICONS[s.icon] ?? IconCode
        return (
          <span
            key={s.icon + localize(s.label)}
            className='inline-flex items-center gap-2 rounded-sm border-[0.5px] border-border bg-bg-card px-3 py-1.5 font-sans text-body-sm text-text-secondary'
          >
            <Icon size={16} stroke={1.5} aria-hidden className='text-accent' />
            {localize(s.label)}
          </span>
        )
      })}
    </div>
  )
}

export function ProjectDialog({
  project,
  open,
  onOpenChange,
  onNavigate,
}: {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (project: Project) => void
}) {
  const { t } = useTranslation()
  const localize = useLocalized()
  if (!project) return null
  const { prev, next } = projectNav(project)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          data-petros-overlay
          className='fixed inset-0 z-40 bg-[rgba(10,10,10,0.92)] backdrop-blur-[8px] data-[mode=light]:bg-[rgba(245,240,232,0.92)]'
        />
        <Dialog.Content
          data-petros-dialog
          data-themed
          className='fixed inset-0 z-50 mx-auto flex h-full w-full max-w-4xl flex-col overflow-y-auto bg-bg-card focus:outline-none'
        >
          {/* sticky header */}
          <div className='sticky top-0 z-10 flex items-center justify-between border-b-[0.5px] border-border bg-bg-card px-section-pad-sm py-4 md:px-section-pad'>
            <Eyebrow bullet>{localize(project.eyebrow)}</Eyebrow>
            <Dialog.Close
              aria-label={t('projects.close')}
              className='flex size-11 items-center justify-center rounded-sm border-[0.5px] border-border text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent'
            >
              <IconX size={18} stroke={1.5} aria-hidden />
            </Dialog.Close>
          </div>

          <div className='px-section-pad-sm py-6 md:px-section-pad'>
            <Dialog.Title className='font-sans text-h3 font-medium tracking-tight text-text-primary'>
              {project.title}
            </Dialog.Title>
            <Dialog.Description className='mt-1 font-sans text-body text-text-secondary'>
              {localize(project.tagline)}
            </Dialog.Description>

            <div className='mt-6'>
              <Carousel
                key={project.id}
                images={project.gallery}
                layout={project.layout}
                alt={project.title}
              />
            </div>

            {/* About */}
            <SectionHeading>{t('projects.detailAbout')}</SectionHeading>
            <p className='mt-3 font-sans text-body leading-body text-text-secondary'>
              <RichText>{localize(project.detail.about)}</RichText>
            </p>

            {/* Features */}
            <SectionHeading>{t('projects.detailFeatures')}</SectionHeading>
            <ul className='mt-3 flex flex-col gap-2'>
              {project.detail.features.map((f) => (
                <li
                  key={localize(f)}
                  className='flex gap-2 font-sans text-body leading-body text-text-secondary'
                >
                  <span aria-hidden className='mt-2 size-1.5 shrink-0 rounded-pill bg-accent' />
                  <RichText>{localize(f)}</RichText>
                </li>
              ))}
            </ul>

            {/* Technologies (sub-grouped) */}
            <SectionHeading>{t('projects.detailTech')}</SectionHeading>
            <div className='mt-3 flex flex-col gap-4'>
              {project.detail.techGroups.map((g) => (
                <div key={localize(g.label)}>
                  <p className='font-mono text-micro tracking-meta uppercase text-text-faint'>
                    {localize(g.label)}
                  </p>
                  <div className='mt-2 flex flex-wrap gap-1.5'>
                    {g.techs.map((id) => (
                      <Tag key={id}>{getTech(id)?.name ?? id}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contributions */}
            <SectionHeading>{t('projects.detailContributions')}</SectionHeading>
            <ul className='mt-3 flex flex-col gap-2'>
              {project.detail.contributions.map((c) => (
                <li
                  key={localize(c)}
                  className='flex gap-2 font-sans text-body leading-body text-text-secondary'
                >
                  <span aria-hidden className='mt-2 size-1.5 shrink-0 rounded-pill bg-accent' />
                  <RichText>{localize(c)}</RichText>
                </li>
              ))}
            </ul>

            {/* Lessons */}
            <SectionHeading>{t('projects.detailLessons')}</SectionHeading>
            <ul className='mt-3 flex flex-col gap-2'>
              {project.detail.lessons.map((l) => (
                <li
                  key={localize(l)}
                  className='flex gap-2 font-sans text-body leading-body text-text-secondary'
                >
                  <span aria-hidden className='mt-2 size-1.5 shrink-0 rounded-pill bg-accent' />
                  <RichText>{localize(l)}</RichText>
                </li>
              ))}
            </ul>

            {/* Hard skills */}
            <SectionHeading>{t('projects.detailHardSkills')}</SectionHeading>
            <SkillChips skills={project.detail.hardSkills} />

            {/* Soft skills */}
            <SectionHeading>{t('projects.detailSoftSkills')}</SectionHeading>
            <SkillChips skills={project.detail.softSkills} />
          </div>

          {/* prev / next footer */}
          <div className='sticky bottom-0 mt-auto flex items-center justify-between gap-2 border-t-[0.5px] border-border bg-bg-card px-section-pad-sm py-4 md:px-section-pad'>
            <button
              type='button'
              disabled={!prev}
              onClick={() => prev && onNavigate(prev)}
              className='inline-flex min-h-11 items-center gap-2 rounded-sm border-[0.5px] border-border px-4 font-mono text-meta tracking-meta uppercase text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40'
            >
              <IconChevronLeft size={16} stroke={1.5} aria-hidden />
              {t('projects.prev')}
            </button>
            <button
              type='button'
              disabled={!next}
              onClick={() => next && onNavigate(next)}
              className='inline-flex min-h-11 items-center gap-2 rounded-sm border-[0.5px] border-border px-4 font-mono text-meta tracking-meta uppercase text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40'
            >
              {t('projects.next')}
              <IconChevronRight size={16} stroke={1.5} aria-hidden />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

- [ ] **Step 3: Verify the Tabler icon names resolve.**

Run: `node -e "const i=require('@tabler/icons-react'); console.log(['IconX','IconChevronLeft','IconChevronRight','IconCode','IconDatabase','IconUsers','IconBulb'].map(n=>n+':'+(n in i)))"`
Expected: all `:true`. Substitute any `false` name in both the import and `SKILL_ICONS`, and update `projects.ts`'s `icon` fields to match.

- [ ] **Step 4: Confirm the light-mode overlay selector.** The overlay uses `data-[mode=light]:bg-[...]`, which only works if `data-mode` is set on (or above) the overlay element. Since the overlay is portaled to `<body>` and `data-mode` lives on `<html>`, this Tailwind variant won't match. Replace the overlay background with a CSS-var approach instead: add a `--dialog-overlay` token. In `src/styles/tokens/modes.css`, add `--dialog-overlay: rgba(10,10,10,0.92);` under the dark block and `--dialog-overlay: rgba(245,240,232,0.92);` under the light block, then set the overlay className background to `bg-[var(--dialog-overlay)]` (drop the `data-[mode=light]:` variant). Confirm the token resolves by checking `modes.css` for the existing dark/light selectors and mirroring them.

> Apply this fix now (it is part of this task), not later — the `data-[mode=light]:` variant is known not to match a body-portaled overlay.

- [ ] **Step 5: Typecheck + lint**

Run: `pnpm typecheck && pnpm check`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/ProjectDialog.tsx src/styles/tokens/animations.css src/styles/tokens/modes.css
git commit -m "feat(section): ProjectDialog — carousel, 7 detail sections, prev/next

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: `Projects` section (tabs + grid + dialog wiring)

**Files:**
- Create: `src/components/sections/Projects.tsx`

**Interfaces:**
- Consumes: `type Project`, `type ProjectKind`, `projectsByKind` from `@/data/projects`; `Eyebrow`, `DotHeading`, `BambooIndicator` from `@/components/primitives`; `Reveal` from `@/components/common/Reveal`; `ProjectCard` from `./ProjectCard`; `ProjectDialog` from `./ProjectDialog`; `useTranslation` from `react-i18next`; `Tabs` from `radix-ui`; `cn` from `@/lib/utils`.
- Produces: `Projects()` — section `#projects` with Radix Tabs (Academic / Professional), a `BambooIndicator` on the active tab, a responsive card grid per tab, and one shared `ProjectDialog` controlled by `activeProject` + `open` state. Opening a card sets `activeProject`; prev/next swaps `activeProject` in place.

> `BambooIndicator` is the Phase 1 active-stalk primitive. Confirm its props before wiring (Step 2): it likely takes an `active`/`isActive` boolean. If its API doesn't fit a per-tab indicator cleanly, render the active stalk as a simple `<span>` matching the Phase 1 nav style — but prefer reusing the primitive.

- [ ] **Step 1: Create `src/components/sections/Projects.tsx`**

```tsx
import { Tabs } from 'radix-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/common/Reveal'
import { DotHeading, Eyebrow } from '@/components/primitives'
import { type Project, type ProjectKind, projectsByKind } from '@/data/projects'
import { cn } from '@/lib/utils'
import { ProjectCard } from './ProjectCard'
import { ProjectDialog } from './ProjectDialog'

const TABS: { kind: ProjectKind; key: string }[] = [
  { kind: 'academic', key: 'projects.tabAcademic' },
  { kind: 'professional', key: 'projects.tabProfessional' },
]

export function Projects() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<ProjectKind>('academic')
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [open, setOpen] = useState(false)

  function openProject(project: Project) {
    setActiveProject(project)
    setOpen(true)
  }

  return (
    <section
      id='projects'
      aria-labelledby='projects-label'
      data-themed
      className='mx-auto max-w-6xl px-section-pad-sm py-section-gap md:px-section-pad'
    >
      <Reveal>
        <Eyebrow bullet>{t('projects.eyebrow')}</Eyebrow>
        <DotHeading id='projects-label' className='mt-4'>
          {t('projects.title')}{' '}
          <span className='font-serif italic text-accent-italic'>
            {t('projects.titleAccent')}
          </span>
        </DotHeading>
      </Reveal>

      <Tabs.Root
        value={tab}
        onValueChange={(v) => setTab(v as ProjectKind)}
        className='mt-8'
      >
        <Tabs.List
          aria-label={t('projects.eyebrow')}
          className='flex gap-2 overflow-x-auto'
        >
          {TABS.map((tabDef) => {
            const isActive = tab === tabDef.kind
            return (
              <Tabs.Trigger
                key={tabDef.kind}
                value={tabDef.kind}
                className={cn(
                  'relative inline-flex min-h-11 items-center rounded-pill border-[0.5px] px-4 font-mono text-meta tracking-meta uppercase transition-all duration-[var(--dur-micro)]',
                  isActive
                    ? 'border-accent-tint-20 bg-accent-tint-12 text-text-primary'
                    : 'border-border text-text-muted hover:text-text-primary',
                )}
              >
                {t(tabDef.key)}
                {isActive && (
                  <span
                    aria-hidden
                    className='absolute -bottom-2 left-1/2 h-2 w-0.5 -translate-x-1/2 rounded-pill bg-accent motion-safe:animate-petros-stalk-in'
                  />
                )}
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>

        {TABS.map((tabDef) => (
          <Tabs.Content
            key={tabDef.kind}
            value={tabDef.kind}
            className='mt-10 focus:outline-none motion-safe:animate-petros-fade-up'
          >
            <div className='grid gap-5 md:grid-cols-2'>
              {projectsByKind(tabDef.kind).map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={() => openProject(project)}
                />
              ))}
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>

      <ProjectDialog
        project={activeProject}
        open={open}
        onOpenChange={setOpen}
        onNavigate={setActiveProject}
      />
    </section>
  )
}
```

- [ ] **Step 2: Confirm `BambooIndicator` usage.** Open `src/components/primitives/BambooIndicator.tsx` and check its props. This plan renders the active stalk inline (a `<span>` using `animate-petros-stalk-in`) rather than the primitive, because the primitive is tuned for the Header nav. If `BambooIndicator` accepts a simple `active` boolean and renders standalone, you may swap the inline `<span>` for `<BambooIndicator active />`. Either is acceptable; keep whichever typechecks cleanly and matches the Phase 1 visual.

- [ ] **Step 3: Temporarily mount in `index.tsx` to smoke-test** — add `import { Projects } from '@/components/sections/Projects'` and render `<Projects />` in place of the `projects` placeholder section (final composition is Task 11).

Run: `pnpm typecheck && pnpm dev`
Expected at `http://localhost:3000` (scroll to Projects): eyebrow + "O que eu já *construí.*" heading; two tabs (ACADEMIC active by default) with an accent stalk under the active tab; switching tabs fades the grid in and shows the other set (5 vs 6 cards); each card shows cover (broken-image placeholder is fine — assets are a content-pass item), eyebrow, dotted title, tagline, ≤5 tech tags + a `+N` popover where applicable, and `VIEW DETAILS`. Clicking `VIEW DETAILS` opens the full-screen dialog with the carousel + 7 sections; ← Previous / Next → walk within the tab and disable at the ends; ESC / X / backdrop close and return focus to the card.

- [ ] **Step 4: Lint**

Run: `pnpm check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Projects.tsx
git commit -m "feat(section): Projects — tabs, card grid, dialog wiring

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: `About` section + `NowPanel` + `StatCounter`

**Files:**
- Create: `src/components/sections/StatCounter.tsx`
- Create: `src/components/sections/NowPanel.tsx`
- Create: `src/components/sections/About.tsx`
- Modify: `src/components/common/Reveal.tsx` (add optional `animation` prop)
- Modify: `src/styles/tokens/animations.css` (add fade-left/right + equalizer keyframes)

**Interfaces:**
- Consumes: `BIO`, `statTarget`, `type Stat` from `@/data/bio`; `RichText` from `@/components/common/RichText`; `Reveal` from `@/components/common/Reveal`; `Eyebrow`, `DotHeading`, `StatusPill` from `@/components/primitives`; `useCounter` from `@/hooks/useCounter`; `useReveal` from `@/hooks/useReveal`; `useLocalized` from `@/i18n/useLocalized`; `useTranslation` from `react-i18next`; `cn` from `@/lib/utils`.
- Produces:
  - `Reveal` extended: `Reveal(props: ComponentProps<'div'> & { delay?: number; animation?: string })` — `animation` defaults to `'animate-petros-fade-up'`; when shown, that class is applied.
  - `StatCounter({ stat })` — a single stat that rolls from 0 → `statTarget(stat)` once revealed, rendering `value` + accent period + `suffix` + label.
  - `NowPanel()` — the 3-row Lanyard shell (Coding / Playing / Listening) in an offline placeholder state with a pulsing bullet and a CSS equalizer; **no live data** (Phase 4 wires `useLanyard`).
  - `About()` — section `#about`: bio paragraphs (RichText) fading in from the left, a 3:4 photo with accent brackets + `JP & 🐼` label fading in from the right, a 4-stat counter row, and the `NowPanel`.

- [ ] **Step 1: Extend `src/components/common/Reveal.tsx`** to accept an `animation` prop:

```tsx
import type { ComponentProps } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

export function Reveal({
  delay = 0,
  animation = 'animate-petros-fade-up',
  className,
  style,
  children,
  ...props
}: ComponentProps<'div'> & { delay?: number; animation?: string }) {
  const { ref, shown } = useReveal()
  return (
    <div
      ref={ref}
      data-reveal={shown ? 'shown' : 'pending'}
      className={cn(shown && animation, className)}
      style={{ ...style, animationDelay: shown ? `${delay}ms` : undefined }}
      {...props}
    >
      {children}
    </div>
  )
}
```

> This is backward-compatible: every existing `<Reveal>` keeps the fade-up default. Phase 2 sections are unaffected.

- [ ] **Step 2: Add directional fade + equalizer keyframes to `src/styles/tokens/animations.css`** (append at the end):

```css
/* Directional entrance fades (About) */
@keyframes petros-fade-left {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes petros-fade-right {
  from { opacity: 0; transform: translateX(16px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-petros-fade-left { animation: petros-fade-left var(--dur-entrance) ease-out both; }
.animate-petros-fade-right { animation: petros-fade-right var(--dur-entrance) ease-out both; }

/* NOW-panel Spotify equalizer (desynchronized bars) */
@keyframes petros-equalizer {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}
.animate-petros-equalizer { transform-origin: bottom; animation: petros-equalizer var(--dur-loop) ease-in-out infinite; }
```

> Confirm `--dur-entrance` and `--dur-loop` exist in `animations.css` (Phase 1 defined them: 600ms / 2400ms). If a name differs, use the actual token.

- [ ] **Step 3: Create `src/components/sections/StatCounter.tsx`**

```tsx
import { useReveal } from '@/hooks/useReveal'
import { useCounter } from '@/hooks/useCounter'
import { type Stat, statTarget } from '@/data/bio'
import { useLocalized } from '@/i18n/useLocalized'

export function StatCounter({ stat }: { stat: Stat }) {
  const localize = useLocalized()
  const { ref, shown } = useReveal()
  const target = statTarget(stat)
  const count = useCounter(shown ? target : 0)
  // Preserve thousands grouping if the source value had it.
  const display = stat.value.includes(',') ? count.toLocaleString('en-US') : String(count)

  return (
    <div ref={ref}>
      <p className='font-sans text-display font-medium tracking-tight text-text-primary'>
        {display}
        {stat.suffix}
        <span aria-hidden className='text-accent'>
          .
        </span>
      </p>
      <p className='mt-1 font-mono text-meta tracking-meta uppercase text-text-muted'>
        {localize(stat.label)}
      </p>
    </div>
  )
}
```

> `useReveal` returns `ref` typed as `RefObject<HTMLDivElement | null>` by default — it attaches to the wrapping `<div>`. `useCounter(target)` rolls to `target`; passing `0` until `shown` keeps it at rest, then it animates once revealed.

- [ ] **Step 4: Create `src/components/sections/NowPanel.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

// Phase 4 wires useLanyard; this is the static offline shell.
const ROWS: { key: string }[] = [
  { key: 'now.coding' },
  { key: 'now.playing' },
  { key: 'now.listening' },
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
  return (
    <div className='rounded-md border-[0.5px] border-border bg-accent-tint-06 p-5 shadow-[var(--shadow-card)]'>
      <p className='font-mono text-meta tracking-meta uppercase text-text-muted'>
        <span aria-hidden className='mr-2 inline-block size-1.5 rounded-pill bg-accent align-middle motion-safe:animate-petros-pulse' />
        {t('now.title')}
      </p>
      <ul className='mt-4 flex flex-col gap-3'>
        {ROWS.map((row) => (
          <li key={row.key} className='flex items-center justify-between gap-3'>
            <span className='font-sans text-body-sm text-text-secondary'>
              {t(row.key)}
            </span>
            <span className={cn('flex items-center gap-2 font-mono text-micro tracking-meta uppercase text-text-faint')}>
              {row.key === 'now.listening' ? <Equalizer /> : null}
              {t('now.offline')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 5: Create `src/components/sections/About.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/common/Reveal'
import { RichText } from '@/components/common/RichText'
import { DotHeading, Eyebrow } from '@/components/primitives'
import { BIO } from '@/data/bio'
import { useLocalized } from '@/i18n/useLocalized'
import { NowPanel } from './NowPanel'
import { StatCounter } from './StatCounter'

function PhotoFallback() {
  return (
    <span className='flex size-full items-center justify-center rounded-md bg-gradient-to-b from-panda-from to-panda-to font-sans text-display font-medium tracking-tight text-accent'>
      JP
    </span>
  )
}

export function About() {
  const { t } = useTranslation()
  const localize = useLocalized()

  return (
    <section
      id='about'
      aria-labelledby='about-label'
      data-themed
      className='mx-auto max-w-6xl px-section-pad-sm py-section-gap md:px-section-pad'
    >
      <Reveal>
        <Eyebrow bullet>{t('about.eyebrow')}</Eyebrow>
        <DotHeading id='about-label' className='mt-4'>
          {t('about.title')}{' '}
          <span className='font-serif italic text-accent-italic'>
            {t('about.titleAccent')}
          </span>
        </DotHeading>
      </Reveal>

      <div className='mt-12 grid items-start gap-10 md:grid-cols-[60fr_40fr]'>
        {/* bio fades in from the left */}
        <Reveal animation='animate-petros-fade-left' className='flex flex-col gap-4'>
          {BIO.paragraphs.map((p) => (
            <p
              key={localize(p)}
              className='font-sans text-body leading-body text-text-secondary'
            >
              <RichText>{localize(p)}</RichText>
            </p>
          ))}
        </Reveal>

        {/* photo fades in from the right */}
        <Reveal animation='animate-petros-fade-right' className='mx-auto w-full max-w-[280px]'>
          <div className='group relative aspect-[3/4] w-full'>
            <span aria-hidden className='absolute -left-2 -top-2 size-6 border-l-2 border-t-2 border-accent' />
            <span aria-hidden className='absolute -right-2 -top-2 size-6 border-r-2 border-t-2 border-accent' />
            <span aria-hidden className='absolute -bottom-2 -left-2 size-6 border-b-2 border-l-2 border-accent' />
            <span aria-hidden className='absolute -bottom-2 -right-2 size-6 border-b-2 border-r-2 border-accent' />
            <PhotoFallback />
            <span className='absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-pill border-[0.5px] border-border bg-bg-elevated px-3 py-1 font-mono text-micro tracking-meta uppercase text-text-secondary'>
              {t('about.photoLabel')}
            </span>
          </div>
          <p className='mt-6 text-center font-serif text-body italic text-accent-italic'>
            <RichText>{localize(BIO.photoCaption)}</RichText>
          </p>
        </Reveal>
      </div>

      {/* stats */}
      <div className='mt-14 grid grid-cols-2 gap-6 md:grid-cols-4'>
        {BIO.stats.map((stat) => (
          <StatCounter key={localize(stat.label)} stat={stat} />
        ))}
      </div>

      {/* NOW panel */}
      <div className='mt-12 max-w-md'>
        <NowPanel />
      </div>
    </section>
  )
}
```

> The "Continue reading" gradient-fade for a >5-6 paragraph bio (PRD) is **not** built — the bio has exactly 4 paragraphs, so it's below the threshold. If the content pass grows the bio past 6 paragraphs, add the gradient + toggle then. The `about.continueReading` string is pre-seeded for that future use.

- [ ] **Step 6: Smoke-test in dev** — temporarily render `<About />` in `index.tsx` in place of the `about` placeholder.

Run: `pnpm typecheck && pnpm dev`
Expected: eyebrow + "Um pouco da minha *história.*" heading; 4 bio paragraphs on the left (bold → primary text, italic → serif accent) fading in from the left as you scroll; a 3:4 `JP` panel with accent brackets + `JP & 🐼` label fading in from the right, serif-italic caption beneath; a 4-stat row whose numbers roll up from 0 once in view (e.g. `2,154`, `100%`, `5+`, `3+`) each with an accent period; a NOW panel with a pulsing bullet, 3 rows in "Offline" state, and an oscillating equalizer on the Listening row. Under reduced-motion the counters snap and the equalizer/pulse stop.

- [ ] **Step 7: Lint**

Run: `pnpm check`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/About.tsx src/components/sections/NowPanel.tsx src/components/sections/StatCounter.tsx src/components/common/Reveal.tsx src/styles/tokens/animations.css
git commit -m "feat(section): About — bio, rolling stats, NOW-panel shell

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Compose Projects + About into `index.tsx` + full verification

**Files:**
- Modify: `src/routes/index.tsx`

**Interfaces:**
- Consumes: `Hero`, `Trajectory`, `Stack`, `Services`, `Projects`, `About`, `Footer` from `@/components/sections/*`; existing `Header`.
- Produces: the assembled single-page route with Projects + About as real sections and only `#contact` remaining a placeholder.

- [ ] **Step 1: Replace `src/routes/index.tsx`** with the composed page (remove any temporary Projects/About mounts from Tasks 9–10):

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { About } from '@/components/sections/About'
import { Footer } from '@/components/sections/Footer'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Services } from '@/components/sections/Services'
import { Stack } from '@/components/sections/Stack'
import { Trajectory } from '@/components/sections/Trajectory'

export const Route = createFileRoute('/')({ component: App })

// Contact is built in Phase 4 — kept as a labeled anchor so the in-page link resolves.
const PLACEHOLDERS = ['contact'] as const

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
        {PLACEHOLDERS.map((id) => (
          <section
            key={id}
            id={id}
            aria-labelledby={`${id}-label`}
            className='flex min-h-screen items-center justify-center px-section-pad-sm'
          >
            <h2
              id={`${id}-label`}
              className='font-mono text-eyebrow tracking-eyebrow uppercase text-text-faint'
            >
              {id}
            </h2>
          </section>
        ))}
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Full test + typecheck + lint + build**

Run: `pnpm test && pnpm typecheck && pnpm check && pnpm build`
Expected: all Vitest suites pass (stack, services, trajectory, projects, bio, richtext, carousel, plus Phase 1 suites); no TS errors; Biome clean (pre-existing Phase 1 warnings about `prototype.html` size, the `__root.tsx` suppression comment, and the `!important` reduced-motion block are acceptable and not introduced by this phase); Vite build succeeds with no CSS/SSR errors.

- [ ] **Step 3: Dev render — full-page walkthrough across themes**

Run: `pnpm dev` and open `http://localhost:3000`
Expected:
- Sections in order: Hero → Trajectory → Stack → Services → **Projects** → **About** → contact placeholder → Footer.
- Header scroll-spy lights the BambooIndicator for home/stack/trajectory/projects/about as you scroll; nav anchors jump correctly.
- Projects: tabs switch (5 academic / 6 professional); `VIEW DETAILS` opens the full-screen dialog with carousel (arrows/counter/thumbs/keys/swipe/6s auto-loop pausing on hover) + 7 sections + working prev/next; ESC/X/backdrop close and restore focus.
- About: bio fades from the left, photo from the right, stats roll up on entry, NOW panel shows the offline shell + equalizer.
- Open SettingsPopover (`⌘+,`): switch mode dark↔light (dialog overlay swaps via `--dialog-overlay`) and scheme across all 5 (accent + panda gradient swap); switch language pt/en/es — all chrome strings and section content update.
- No console errors; no FOUC on reload.

- [ ] **Step 4: Confirm reduced-motion** — in devtools, emulate `prefers-reduced-motion: reduce`, reload.
Expected: entrance fades skipped (content shown immediately), stat counters snap to final, equalizer/pulse stop, dialog open is instant, carousel auto-loop still advances (timer is not motion-gated) but you can stop it by hovering.

- [ ] **Step 5: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat(shell): compose Projects + About into page

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Phase 3 Done — Definition of Complete

- [ ] `src/data/{projects,bio}.ts` exist with passing TDD helper suites (byKind/nav/integrity, statTarget).
- [ ] `RichText` tokenizer + `useCarousel` index math are unit-tested and green.
- [ ] Projects renders Academic/Professional tabs with an active stalk, a card grid, and a full-screen `ProjectDialog` (carousel + 7 sections + prev/next) using Radix Dialog/Tabs/Popover — no new runtime deps.
- [ ] About renders bio (RichText), a 3:4 bracketed photo, 4 rolling stat counters, and the NOW-panel shell.
- [ ] All chrome strings localized in pt/en/es; section content localized via `useLocalized`.
- [ ] `pnpm test && pnpm typecheck && pnpm check && pnpm build` all green.
- [ ] Verified across representative mode×scheme combos + all 3 languages + reduced-motion.
- [ ] Outstanding `TODO(petros)` items (project detail copy, real cover/gallery images, confirmed Duolingo streak, bio wording, repo/live URLs) flagged for a content pass — not blockers for Phase 3 structural completion.

## Deferred to later phases (do NOT build here)

- `useLanyard` wired to the Header pill + About NOW panel (P4) — NOW panel is a static offline shell this phase.
- Contact section (form + React Hook Form + Zod + Resend server fn + 4 channel cards) (P4).
- CV server function + per-language reactive download (P4).
- Panda EasterEgg dialog (P4) — Hero "See my panda" button remains inert.
- "Continue reading" bio gradient-fade — only needed if the bio grows past 6 paragraphs.
- Mobile hamburger drawer nav (Header TODO).
- a11y sweep across all 10 combos, Lighthouse, Vercel deploy (P5).
