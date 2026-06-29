# Petros Portfolio — Phase 2 (Static Sections) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the five static sections — Hero, Trajectory, Stack, Services, Footer — and their `src/data/*.ts` content layer, composed into `index.tsx` against the Phase 1 foundation.

**Architecture:** Content collections live in `src/data/*.ts` as typed `{ pt, en, es }` (`L<T>`) objects read via `useLocalized()`; pure data-derivation helpers (group-by-category, trajectory filter/counts) are TDD'd with Vitest. Section components are presentational, token-driven (no raw hex), and verified by typecheck + Biome + build + dev render. Scroll-triggered entrances reuse Phase 1's CSS keyframes through a small `useReveal` IntersectionObserver hook — **no Framer Motion** is added; the panda swing is a pure-CSS loop (`petros-swing`). UI chrome strings extend the i18n resources; section content lives in data files.

**Tech Stack:** TanStack Start (React 19), Tailwind CSS v4, i18next + react-i18next, radix-ui (Tooltip), `@tabler/icons-react`, Vitest + Testing Library, Biome.

## Global Constraints

- **Package manager:** `pnpm`. Scripts: `pnpm dev`, `pnpm build`, `pnpm typecheck` (`tsc --noEmit`), `pnpm check` (`biome check --write .`), `pnpm test` (`vitest run`).
- **Code style (Biome):** 2-space indent, line width 90, single quotes, single JSX quotes, semicolons **as-needed** (omit unless required), self-closing elements. Run `pnpm check` before every commit.
- **Path alias:** `@/*` → `./src/*`.
- **TypeScript:** `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (use `import type` for type-only imports).
- **No new runtime dependencies.** Everything needed (radix-ui, `@tabler/icons-react`, i18next) is already installed. Do **not** add `motion`/Framer Motion. Entrances use the `useReveal` hook + the existing `animate-petros-*` CSS keyframes from `src/styles/tokens/animations.css`.
- **Color authority:** Components reference CSS-var-backed Tailwind tokens only (`bg-bg-card`, `text-text-secondary`, `border-border`, `text-accent`, `bg-accent-tint-12`, `from-panda-from`, …) — **never raw hex**. The **only** exception is external brand colors (tech monograms, future Lanyard), which are intentionally non-thematic and applied via inline `style`.
- **Hairlines:** structural borders are `border-[0.5px] border-border`; interactive hover warms to `hover:border-accent-tint-20` and lifts `hover:-translate-y-0.5`. Never heavier than 0.5px, never a grey box-shadow (light mode's hairline shadow comes from `shadow-[var(--shadow-card)]`).
- **Accessibility:** visible `--accent` focus is global (Phase 1 `:focus-visible`). Touch targets ≥ 44×44px. Icon-only controls need `aria-label`. `aria-live="polite"` on the BRT clock. Respect `prefers-reduced-motion` (handled globally — keyframes snap to final state).
- **Reduced-motion / SSR safety:** the reveal mechanism must never hide content when JS is disabled. Hidden-until-revealed is gated behind `html.theme-ready` (added post-hydration by the Phase 1 bootstrap), so no-JS and crawler renders show all content.
- **i18n split:** UI chrome (eyebrows, headings, filter labels, footer copy) → `src/i18n/resources/{pt,en,es}.ts`. Section content collections (techs, services, trajectory entries) → `src/data/*.ts` as `L<T>`.
- **Commit cadence:** one commit per task (end of each task). Append the trailer:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

## File Structure (Phase 2)

```
src/
  data/
    stack.ts                       # CREATE: Tech type, 35 techs, CATEGORIES, groupByCategory() (TDD)
    stack.test.ts                  # CREATE
    services.ts                    # CREATE: Service type, 6 services, techIdsExist() guard (TDD)
    services.test.ts               # CREATE
    trajectory.ts                  # CREATE: TrajectoryEntry type, 7 entries, filterTrajectory()/counts() (TDD)
    trajectory.test.ts             # CREATE
  hooks/
    useReveal.ts                   # CREATE: IntersectionObserver scroll-reveal
  components/
    common/
      Reveal.tsx                   # CREATE: fade-up-on-scroll wrapper (uses useReveal + CSS keyframe)
      Tooltip.tsx                  # CREATE: thin Radix Tooltip wrapper
    sections/
      Hero.tsx                     # CREATE
      Trajectory.tsx               # CREATE
      Stack.tsx                    # CREATE
      Services.tsx                 # CREATE
      Footer.tsx                   # CREATE
      PandaMascot.tsx              # CREATE: swinging panda on the trajectory spine
  i18n/resources/
    pt.ts  en.ts  es.ts            # MODIFY: add hero/trajectory/stack/services/footer chrome strings
  styles/tokens/animations.css     # MODIFY: add reveal hidden-state rule
  routes/index.tsx                 # MODIFY: compose Hero→Trajectory→Stack→Services→(placeholders)→Footer
```

**Section order & ids** (matches PRD section numbering; About/Projects/Contact/EasterEgg are later phases and remain placeholder `<section>`s this phase):
`#home` (Hero) → `#trajectory` → `#stack` → `#services` → `#projects` (placeholder) → `#about` (placeholder) → `#contact` (placeholder) → Footer.

> The Header nav from Phase 1 observes `home/about/stack/projects/trajectory`. Leave it unchanged — `useScrollSpy` simply ignores ids whose elements don't exist yet (about/projects placeholders DO exist, so the indicator works for every nav item).

---

## Task 1: Stack data — 35 techs + `groupByCategory` (TDD helper)

**Files:**
- Create: `src/data/stack.ts`
- Test: `src/data/stack.test.ts`

**Interfaces:**
- Consumes: nothing (leaf data module).
- Produces:
  - `type Category = 'frontend' | 'backend' | 'mobile' | 'databases' | 'cloud' | 'ai'`
  - `type Tech = { id: string; name: string; brandColor: string; monogram: string; docsUrl: string; category: Category }`
  - `const CATEGORIES: Category[]` (display order)
  - `const TECHS: Tech[]` (35 entries)
  - `function getTech(id: string): Tech | undefined`
  - `function groupByCategory(techs: Tech[]): { category: Category; techs: Tech[] }[]` — preserves `CATEGORIES` order, drops empty categories.

- [ ] **Step 1: Write the failing test** (`src/data/stack.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { CATEGORIES, TECHS, getTech, groupByCategory } from './stack'

describe('TECHS', () => {
  it('has exactly 35 techs', () => {
    expect(TECHS).toHaveLength(35)
  })
  it('has unique ids', () => {
    const ids = TECHS.map((t) => t.id)
    expect(new Set(ids).size).toBe(35)
  })
  it('every tech has a category in CATEGORIES', () => {
    for (const t of TECHS) expect(CATEGORIES).toContain(t.category)
  })
  it('every brandColor is a hex string', () => {
    for (const t of TECHS) expect(t.brandColor).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })
})

describe('getTech', () => {
  it('finds by id', () => {
    expect(getTech('react')?.name).toBe('React')
  })
  it('returns undefined for unknown id', () => {
    expect(getTech('nope')).toBeUndefined()
  })
})

describe('groupByCategory', () => {
  it('groups all techs, preserving CATEGORIES order', () => {
    const groups = groupByCategory(TECHS)
    expect(groups.map((g) => g.category)).toEqual(CATEGORIES)
    expect(groups.reduce((n, g) => n + g.techs.length, 0)).toBe(35)
  })
  it('drops empty categories', () => {
    const groups = groupByCategory(TECHS.filter((t) => t.category === 'mobile'))
    expect(groups).toHaveLength(1)
    expect(groups[0].category).toBe('mobile')
    expect(groups[0].techs).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/data/stack.test.ts`
Expected: FAIL — cannot resolve `./stack`.

- [ ] **Step 3: Write `src/data/stack.ts`**

> Monochrome brands (Next.js, Fastify, Flask, Expo, Vercel, Inngest) use a neutral `#A0A0A0` so the monogram stays visible in both modes; all other colors are the official brand hue.

```ts
export type Category =
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'databases'
  | 'cloud'
  | 'ai'

export type Tech = {
  id: string
  name: string
  brandColor: string
  monogram: string
  docsUrl: string
  category: Category
}

export const CATEGORIES: Category[] = [
  'frontend',
  'backend',
  'mobile',
  'databases',
  'cloud',
  'ai',
]

export const TECHS: Tech[] = [
  // ── Frontend (7) ──
  { id: 'typescript', name: 'TypeScript', brandColor: '#3178C6', monogram: 'TS', docsUrl: 'https://www.typescriptlang.org/docs/', category: 'frontend' },
  { id: 'react', name: 'React', brandColor: '#61DAFB', monogram: 'Re', docsUrl: 'https://react.dev/', category: 'frontend' },
  { id: 'nextjs', name: 'Next.js', brandColor: '#A0A0A0', monogram: 'Nx', docsUrl: 'https://nextjs.org/docs', category: 'frontend' },
  { id: 'astro', name: 'Astro', brandColor: '#FF5D01', monogram: 'As', docsUrl: 'https://docs.astro.build/', category: 'frontend' },
  { id: 'tailwind', name: 'Tailwind', brandColor: '#38BDF8', monogram: 'Tw', docsUrl: 'https://tailwindcss.com/docs', category: 'frontend' },
  { id: 'vue', name: 'Vue', brandColor: '#42B883', monogram: 'Vue', docsUrl: 'https://vuejs.org/guide/introduction.html', category: 'frontend' },
  { id: 'sass', name: 'Sass', brandColor: '#CC6699', monogram: 'Sa', docsUrl: 'https://sass-lang.com/documentation/', category: 'frontend' },
  // ── Backend (7) ──
  { id: 'nodejs', name: 'Node.js', brandColor: '#5FA04E', monogram: 'No', docsUrl: 'https://nodejs.org/docs/latest/api/', category: 'backend' },
  { id: 'python', name: 'Python', brandColor: '#3776AB', monogram: 'Py', docsUrl: 'https://docs.python.org/3/', category: 'backend' },
  { id: 'fastapi', name: 'FastAPI', brandColor: '#009688', monogram: 'Fa', docsUrl: 'https://fastapi.tiangolo.com/', category: 'backend' },
  { id: 'fastify', name: 'Fastify', brandColor: '#A0A0A0', monogram: 'Ft', docsUrl: 'https://fastify.dev/docs/latest/', category: 'backend' },
  { id: 'nestjs', name: 'NestJS', brandColor: '#E0234E', monogram: 'Ne', docsUrl: 'https://docs.nestjs.com/', category: 'backend' },
  { id: 'spring', name: 'Java Spring', brandColor: '#6DB33F', monogram: 'Sp', docsUrl: 'https://spring.io/projects/spring-boot', category: 'backend' },
  { id: 'flask', name: 'Flask', brandColor: '#A0A0A0', monogram: 'Fk', docsUrl: 'https://flask.palletsprojects.com/', category: 'backend' },
  // ── Mobile (3) ──
  { id: 'react-native', name: 'React Native', brandColor: '#61DAFB', monogram: 'RN', docsUrl: 'https://reactnative.dev/docs/getting-started', category: 'mobile' },
  { id: 'expo', name: 'Expo', brandColor: '#A0A0A0', monogram: 'Ex', docsUrl: 'https://docs.expo.dev/', category: 'mobile' },
  { id: 'flutter', name: 'Flutter', brandColor: '#02569B', monogram: 'Fl', docsUrl: 'https://docs.flutter.dev/', category: 'mobile' },
  // ── Databases (7) ──
  { id: 'postgresql', name: 'PostgreSQL', brandColor: '#4169E1', monogram: 'Pg', docsUrl: 'https://www.postgresql.org/docs/', category: 'databases' },
  { id: 'mongodb', name: 'MongoDB', brandColor: '#47A248', monogram: 'Mo', docsUrl: 'https://www.mongodb.com/docs/', category: 'databases' },
  { id: 'mysql', name: 'MySQL', brandColor: '#4479A1', monogram: 'My', docsUrl: 'https://dev.mysql.com/doc/', category: 'databases' },
  { id: 'redis', name: 'Redis', brandColor: '#FF4438', monogram: 'Rd', docsUrl: 'https://redis.io/docs/latest/', category: 'databases' },
  { id: 'supabase', name: 'Supabase', brandColor: '#3FCF8E', monogram: 'Su', docsUrl: 'https://supabase.com/docs', category: 'databases' },
  { id: 'firebase', name: 'Firebase', brandColor: '#FFCA28', monogram: 'Fb', docsUrl: 'https://firebase.google.com/docs', category: 'databases' },
  { id: 'turso', name: 'Turso', brandColor: '#4FF8D2', monogram: 'Tu', docsUrl: 'https://docs.turso.tech/', category: 'databases' },
  // ── Cloud / DevOps (6) ──
  { id: 'aws', name: 'AWS', brandColor: '#FF9900', monogram: 'AWS', docsUrl: 'https://docs.aws.amazon.com/', category: 'cloud' },
  { id: 'docker', name: 'Docker', brandColor: '#2496ED', monogram: 'Dk', docsUrl: 'https://docs.docker.com/', category: 'cloud' },
  { id: 'terraform', name: 'Terraform', brandColor: '#7B42BC', monogram: 'Tf', docsUrl: 'https://developer.hashicorp.com/terraform/docs', category: 'cloud' },
  { id: 'pulumi', name: 'Pulumi', brandColor: '#8A3391', monogram: 'Pu', docsUrl: 'https://www.pulumi.com/docs/', category: 'cloud' },
  { id: 'gcp', name: 'GCP', brandColor: '#4285F4', monogram: 'GCP', docsUrl: 'https://cloud.google.com/docs', category: 'cloud' },
  { id: 'vercel', name: 'Vercel', brandColor: '#A0A0A0', monogram: 'Vc', docsUrl: 'https://vercel.com/docs', category: 'cloud' },
  // ── AI & Automation (5) ──
  { id: 'agno', name: 'Agno', brandColor: '#00BFA5', monogram: 'Ag', docsUrl: 'https://docs.agno.com/', category: 'ai' },
  { id: 'gemini', name: 'Gemini', brandColor: '#8E75F8', monogram: 'Ge', docsUrl: 'https://ai.google.dev/gemini-api/docs', category: 'ai' },
  { id: 'google-adk', name: 'Google ADK', brandColor: '#4285F4', monogram: 'ADK', docsUrl: 'https://google.github.io/adk-docs/', category: 'ai' },
  { id: 'qdrant', name: 'Qdrant', brandColor: '#DC244C', monogram: 'Qd', docsUrl: 'https://qdrant.tech/documentation/', category: 'ai' },
  { id: 'inngest', name: 'Inngest', brandColor: '#A0A0A0', monogram: 'In', docsUrl: 'https://www.inngest.com/docs', category: 'ai' },
]

export function getTech(id: string): Tech | undefined {
  return TECHS.find((t) => t.id === id)
}

export function groupByCategory(
  techs: Tech[],
): { category: Category; techs: Tech[] }[] {
  return CATEGORIES.map((category) => ({
    category,
    techs: techs.filter((t) => t.category === category),
  })).filter((g) => g.techs.length > 0)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/data/stack.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
pnpm check
git add src/data/stack.ts src/data/stack.test.ts
git commit -m "feat(data): stack — 35 techs across 6 categories + groupByCategory

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Services data — 6 services + tech-id integrity guard (TDD)

**Files:**
- Create: `src/data/services.ts`
- Test: `src/data/services.test.ts`

**Interfaces:**
- Consumes: `type Tech`, `getTech` from `@/data/stack`; `type L` from `@/i18n/useLocalized`.
- Produces:
  - `type Service = { id: string; icon: string; title: L; description: L; techIds: string[] }` (`icon` is a `@tabler/icons-react` component name resolved in the Services component).
  - `const SERVICES: Service[]` (6 entries).
  - `function unknownTechIds(): string[]` — returns any `techId` across all services that does not resolve via `getTech` (must be empty).

- [ ] **Step 1: Write the failing test** (`src/data/services.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { SERVICES, unknownTechIds } from './services'

describe('SERVICES', () => {
  it('has exactly 6 services', () => {
    expect(SERVICES).toHaveLength(6)
  })
  it('has unique ids', () => {
    expect(new Set(SERVICES.map((s) => s.id)).size).toBe(6)
  })
  it('every service references at least one tech', () => {
    for (const s of SERVICES) expect(s.techIds.length).toBeGreaterThan(0)
  })
})

describe('unknownTechIds', () => {
  it('every referenced techId exists in the stack', () => {
    expect(unknownTechIds()).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/data/services.test.ts`
Expected: FAIL — cannot resolve `./services`.

- [ ] **Step 3: Write `src/data/services.ts`**

```ts
import type { L } from '@/i18n/useLocalized'
import { getTech } from './stack'

export type Service = {
  id: string
  icon: string
  title: L
  description: L
  techIds: string[]
}

export const SERVICES: Service[] = [
  {
    id: 'fullstack-web',
    icon: 'IconBrowserCheck',
    title: { pt: 'Web Full Stack', en: 'Full Stack Web', es: 'Web Full Stack' },
    description: {
      pt: 'Aplicações web completas, do banco à interface, com arquitetura limpa e performance.',
      en: 'Complete web apps, from database to interface, with clean architecture and performance.',
      es: 'Aplicaciones web completas, de la base de datos a la interfaz, con arquitectura limpia.',
    },
    techIds: ['react', 'nextjs', 'nodejs'],
  },
  {
    id: 'mobile-apps',
    icon: 'IconDeviceMobile',
    title: { pt: 'Apps Mobile', en: 'Mobile Apps', es: 'Apps Móviles' },
    description: {
      pt: 'Aplicativos nativos e multiplataforma para iOS e Android, com UX fluida.',
      en: 'Native and cross-platform apps for iOS and Android, with fluid UX.',
      es: 'Aplicaciones nativas y multiplataforma para iOS y Android, con UX fluida.',
    },
    techIds: ['react-native', 'flutter', 'expo'],
  },
  {
    id: 'apis-integrations',
    icon: 'IconPlugConnected',
    title: { pt: 'APIs & Integrações', en: 'APIs & Integrations', es: 'APIs e Integraciones' },
    description: {
      pt: 'APIs REST e GraphQL, integrações com serviços externos e webhooks confiáveis.',
      en: 'REST and GraphQL APIs, third-party integrations and reliable webhooks.',
      es: 'APIs REST y GraphQL, integraciones con servicios externos y webhooks confiables.',
    },
    techIds: ['fastapi', 'nestjs', 'fastify'],
  },
  {
    id: 'cloud-devops',
    icon: 'IconCloudComputing',
    title: { pt: 'Cloud & DevOps', en: 'Cloud & DevOps', es: 'Cloud & DevOps' },
    description: {
      pt: 'Infraestrutura como código, containers e deploys automatizados na nuvem.',
      en: 'Infrastructure as code, containers and automated cloud deployments.',
      es: 'Infraestructura como código, contenedores y despliegues automatizados en la nube.',
    },
    techIds: ['aws', 'gcp', 'terraform', 'docker'],
  },
  {
    id: 'ai-agents',
    icon: 'IconRobot',
    title: { pt: 'Agentes de IA', en: 'AI Agents', es: 'Agentes de IA' },
    description: {
      pt: 'Agentes inteligentes com busca vetorial e automações orientadas a LLM.',
      en: 'Intelligent agents with vector search and LLM-driven automations.',
      es: 'Agentes inteligentes con búsqueda vectorial y automatizaciones con LLM.',
    },
    techIds: ['gemini', 'agno', 'qdrant'],
  },
  {
    id: 'technical-seo',
    icon: 'IconSeo',
    title: { pt: 'SEO Técnico', en: 'Technical SEO', es: 'SEO Técnico' },
    description: {
      pt: 'Sites rápidos e indexáveis: dados estruturados e Core Web Vitals no verde.',
      en: 'Fast, indexable sites: structured data and Core Web Vitals in the green.',
      es: 'Sitios rápidos e indexables: datos estructurados y Core Web Vitals en verde.',
    },
    techIds: ['astro', 'nextjs'],
  },
]

export function unknownTechIds(): string[] {
  return SERVICES.flatMap((s) => s.techIds).filter((id) => !getTech(id))
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/data/services.test.ts`
Expected: PASS.

> If `unknownTechIds` is non-empty, fix the offending id in `services.ts` to match a `stack.ts` id — do not weaken the test.

- [ ] **Step 5: Commit**

```bash
pnpm check
git add src/data/services.ts src/data/services.test.ts
git commit -m "feat(data): services — 6 offerings with tech-id integrity guard

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Trajectory data — 7 entries + filter/counts helpers (TDD)

**Files:**
- Create: `src/data/trajectory.ts`
- Test: `src/data/trajectory.test.ts`

**Interfaces:**
- Consumes: `type L` from `@/i18n/useLocalized`.
- Produces:
  - `type TrajectoryType = 'professional' | 'academic'`
  - `type TrajectoryFilter = 'all' | TrajectoryType`
  - `type TrajectoryEntry = { id: string; type: TrajectoryType; current?: boolean; period: { start: string; end: string | 'present' }; org: L; role: L; description: L; techs: string[]; info?: L }`
  - `const TRAJECTORY: TrajectoryEntry[]` (7 entries, reverse-chronological).
  - `function filterTrajectory(entries: TrajectoryEntry[], filter: TrajectoryFilter): TrajectoryEntry[]`
  - `function trajectoryCounts(entries: TrajectoryEntry[]): { all: number; professional: number; academic: number }`

> Org names, periods and types are factual (from PRD). Role/description copy is drafted; lines marked `// TODO(petros)` need your confirmation before launch — they do not block implementation.

- [ ] **Step 1: Write the failing test** (`src/data/trajectory.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { TRAJECTORY, filterTrajectory, trajectoryCounts } from './trajectory'

describe('TRAJECTORY', () => {
  it('has 7 entries', () => {
    expect(TRAJECTORY).toHaveLength(7)
  })
  it('has unique ids', () => {
    expect(new Set(TRAJECTORY.map((e) => e.id)).size).toBe(7)
  })
  it('exactly one entry is marked current professional (Lumetis)', () => {
    const current = TRAJECTORY.filter((e) => e.current)
    expect(current.length).toBeGreaterThanOrEqual(1)
    expect(TRAJECTORY[0].id).toBe('lumetis')
    expect(TRAJECTORY[0].current).toBe(true)
  })
})

describe('trajectoryCounts', () => {
  it('counts 7 total, 4 professional, 3 academic', () => {
    expect(trajectoryCounts(TRAJECTORY)).toEqual({
      all: 7,
      professional: 4,
      academic: 3,
    })
  })
})

describe('filterTrajectory', () => {
  it('all returns every entry in order', () => {
    expect(filterTrajectory(TRAJECTORY, 'all')).toEqual(TRAJECTORY)
  })
  it('professional returns only professional entries', () => {
    const r = filterTrajectory(TRAJECTORY, 'professional')
    expect(r).toHaveLength(4)
    expect(r.every((e) => e.type === 'professional')).toBe(true)
  })
  it('academic returns only academic entries', () => {
    const r = filterTrajectory(TRAJECTORY, 'academic')
    expect(r).toHaveLength(3)
    expect(r.every((e) => e.type === 'academic')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/data/trajectory.test.ts`
Expected: FAIL — cannot resolve `./trajectory`.

- [ ] **Step 3: Write `src/data/trajectory.ts`**

```ts
import type { L } from '@/i18n/useLocalized'

export type TrajectoryType = 'professional' | 'academic'
export type TrajectoryFilter = 'all' | TrajectoryType

export type TrajectoryEntry = {
  id: string
  type: TrajectoryType
  current?: boolean
  period: { start: string; end: string | 'present' }
  org: L
  role: L
  description: L
  techs: string[]
  info?: L
}

export const TRAJECTORY: TrajectoryEntry[] = [
  {
    id: 'lumetis',
    type: 'professional',
    current: true,
    period: { start: '05/2026', end: 'present' },
    org: { pt: 'Lumetis', en: 'Lumetis', es: 'Lumetis' },
    role: {
      pt: 'Desenvolvedor Full Stack', // TODO(petros): confirm exact role title
      en: 'Full Stack Developer',
      es: 'Desarrollador Full Stack',
    },
    description: {
      pt: 'Construindo produtos web full stack com **React**, **Node.js** e nuvem.', // TODO(petros)
      en: 'Building full stack web products with **React**, **Node.js** and cloud.',
      es: 'Construyendo productos web full stack con **React**, **Node.js** y nube.',
    },
    techs: ['react', 'nodejs', 'typescript', 'aws'],
  },
  {
    id: 'design-liquido',
    type: 'professional',
    period: { start: '2025', end: '05/2026' },
    org: { pt: 'Design Líquido', en: 'Design Líquido', es: 'Design Líquido' },
    role: {
      pt: 'Desenvolvedor Full Stack',
      en: 'Full Stack Developer',
      es: 'Desarrollador Full Stack',
    },
    description: {
      pt: 'Trabalho com **Delégua** e o início da pesquisa que virou a tese *StarDust*.', // TODO(petros)
      en: 'Worked with **Delégua** and the seed of the research that became the *StarDust* thesis.',
      es: 'Trabajo con **Delégua** y el inicio de la investigación que se volvió la tesis *StarDust*.',
    },
    techs: ['typescript', 'react', 'nodejs'],
    info: {
      pt: 'Delégua é uma linguagem de programação brasileira.',
      en: 'Delégua is a Brazilian programming language.',
      es: 'Delégua es un lenguaje de programación brasileño.',
    },
  },
  {
    id: 'fatec-sjc',
    type: 'academic',
    current: true,
    period: { start: '2024', end: 'present' },
    org: { pt: 'FATEC São José dos Campos', en: 'FATEC São José dos Campos', es: 'FATEC São José dos Campos' },
    role: {
      pt: 'Tecnólogo em Desenvolvimento de Software — 5º semestre',
      en: 'Software Development Technologist — 5th semester',
      es: 'Tecnólogo en Desarrollo de Software — 5º semestre',
    },
    description: {
      pt: 'Graduação em desenvolvimento de software multiplataforma, com **100% de presença**.', // TODO(petros)
      en: 'Multiplatform software development degree, with **100% attendance**.',
      es: 'Grado en desarrollo de software multiplataforma, con **100% de asistencia**.',
    },
    techs: ['typescript', 'python', 'java'],
  },
  {
    id: 'ancra',
    type: 'professional',
    period: { start: '2024', end: 'present' },
    org: { pt: 'Ancra', en: 'Ancra', es: 'Ancra' },
    role: {
      pt: 'Desenvolvedor & SEO Técnico',
      en: 'Developer & Technical SEO',
      es: 'Desarrollador & SEO Técnico',
    },
    description: {
      pt: 'Blog e presença web com foco em **SEO técnico** e **Core Web Vitals**.', // TODO(petros)
      en: 'Blog and web presence focused on **technical SEO** and **Core Web Vitals**.',
      es: 'Blog y presencia web con foco en **SEO técnico** y **Core Web Vitals**.',
    },
    techs: ['astro', 'typescript'],
  },
  {
    id: 'sertton',
    type: 'professional',
    period: { start: '2023', end: '2024' },
    org: { pt: 'Sertton', en: 'Sertton', es: 'Sertton' },
    role: {
      pt: 'Desenvolvedor Freelancer',
      en: 'Freelance Developer',
      es: 'Desarrollador Freelance',
    },
    description: {
      pt: 'Projetos freelance de desenvolvimento web sob demanda.', // TODO(petros)
      en: 'On-demand freelance web development projects.',
      es: 'Proyectos freelance de desarrollo web bajo demanda.',
    },
    techs: ['react', 'nodejs'],
  },
  {
    id: 'academic-extension',
    type: 'academic',
    period: { start: '2022', end: '2023' },
    org: { pt: 'Extensão Acadêmica', en: 'Academic Extension', es: 'Extensión Académica' },
    role: {
      pt: 'Projeto de Extensão',
      en: 'Extension Project',
      es: 'Proyecto de Extensión',
    },
    description: {
      pt: 'Projeto de extensão acadêmica aplicando software a problemas reais.', // TODO(petros)
      en: 'Academic extension project applying software to real problems.',
      es: 'Proyecto de extensión académica aplicando software a problemas reales.',
    },
    techs: ['python'],
  },
  {
    id: 'etec-sjc',
    type: 'academic',
    period: { start: '2022', end: '2023' },
    org: { pt: 'ETEC São José dos Campos', en: 'ETEC São José dos Campos', es: 'ETEC São José dos Campos' },
    role: {
      pt: 'Técnico em Informática',
      en: 'Technical Diploma in IT',
      es: 'Técnico en Informática',
    },
    description: {
      pt: 'Formação técnica em informática — onde a **programação** começou.', // TODO(petros)
      en: 'Technical IT education — where **programming** began.',
      es: 'Formación técnica en informática — donde empezó la **programación**.',
    },
    techs: ['python', 'mysql'],
  },
]

export function filterTrajectory(
  entries: TrajectoryEntry[],
  filter: TrajectoryFilter,
): TrajectoryEntry[] {
  if (filter === 'all') return entries
  return entries.filter((e) => e.type === filter)
}

export function trajectoryCounts(entries: TrajectoryEntry[]): {
  all: number
  professional: number
  academic: number
} {
  return {
    all: entries.length,
    professional: entries.filter((e) => e.type === 'professional').length,
    academic: entries.filter((e) => e.type === 'academic').length,
  }
}
```

> Note: `techs: ['java']` on `fatec-sjc` references an id not in `stack.ts` (the stack has `spring`, not bare `java`). Trajectory tech tags render as plain labels and are **not** integrity-checked against the stack (unlike services), so this is fine — but if you prefer strict resolution, change it to `'spring'`. Left as `'java'` to read truthfully as "the Java language".

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/data/trajectory.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
pnpm check
git add src/data/trajectory.ts src/data/trajectory.test.ts
git commit -m "feat(data): trajectory — 7 entries + filter/counts helpers

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: i18n chrome strings for the five sections

**Files:**
- Modify: `src/i18n/resources/pt.ts`
- Modify: `src/i18n/resources/en.ts`
- Modify: `src/i18n/resources/es.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: extended `UIStrings` shape (inferred from `pt`) with new top-level keys `hero`, `trajectory`, `stack`, `services`, `footer`. `en`/`es` are typed `UIStrings` and must mirror the shape exactly.

- [ ] **Step 1: Append the new groups to `src/i18n/resources/pt.ts`** (inside the `pt` object, after `schemes`):

```ts
  hero: {
    statusPill: 'FULL STACK · LUMETIS · DESDE 05/2026',
    location: 'SÃO JOSÉ DOS CAMPOS · SP — BR',
    byline: 'construindo',
    role: 'Desenvolvedor Full Stack',
    description:
      'Transformo ideias em produtos web e mobile — da arquitetura ao pixel, com foco em performance e cuidado editorial.',
    tagFatec: 'FATEC · 5º SEM',
    tagAka: 'a.k.a. Petros',
    downloadCv: 'Baixar CV',
    seePanda: 'Ver meu panda 🐼',
    scrollCue: 'role para explorar',
  },
  trajectory: {
    eyebrow: 'TRAJETÓRIA',
    title: 'Como cheguei',
    titleAccent: 'aqui',
    filterAll: 'TODAS',
    filterProfessional: 'PROFISSIONAL',
    filterAcademic: 'ACADÊMICA',
    current: 'ATUAL',
    inProgress: 'EM ANDAMENTO',
    expand: '+ {{count}} ENTRADAS ANTERIORES',
    collapse: '− MOSTRAR MENOS',
    present: 'atual',
  },
  stack: {
    eyebrow: 'STACK',
    title: 'Ferramentas que',
    titleAccent: 'domino',
    categoryFrontend: 'Frontend',
    categoryBackend: 'Backend',
    categoryMobile: 'Mobile',
    categoryDatabases: 'Bancos de Dados',
    categoryCloud: 'Cloud / DevOps',
    categoryAi: 'IA & Automação',
    footerCount: '35 TECNOLOGIAS · 6 DOMÍNIOS',
    footerUpdated: '↻ ATUALIZADO HOJE',
    docs: 'Documentação',
  },
  services: {
    eyebrow: 'SERVIÇOS',
    title: 'O que posso',
    titleAccent: 'construir',
  },
  footer: {
    tagline: 'FULL STACK DEVELOPER · DESDE 2022',
    signature: 'por João Pedro Carvalho dos Santos',
    madeWith: 'feito com',
    socialEmail: 'E-mail',
    socialLinkedin: 'LinkedIn',
    socialGithub: 'GitHub',
    socialDiscord: 'Discord',
  },
```

- [ ] **Step 2: Append the matching `en` groups to `src/i18n/resources/en.ts`** (inside the `en` object):

```ts
  hero: {
    statusPill: 'FULL STACK · LUMETIS · SINCE 05/2026',
    location: 'SÃO JOSÉ DOS CAMPOS · SP — BR',
    byline: 'building',
    role: 'Full Stack Developer',
    description:
      'I turn ideas into web and mobile products — from architecture to pixel, with a focus on performance and editorial care.',
    tagFatec: 'FATEC · 5TH SEM',
    tagAka: 'a.k.a. Petros',
    downloadCv: 'Download CV',
    seePanda: 'See my panda 🐼',
    scrollCue: 'scroll to explore',
  },
  trajectory: {
    eyebrow: 'TRAJECTORY',
    title: 'How I got',
    titleAccent: 'here',
    filterAll: 'ALL',
    filterProfessional: 'PROFESSIONAL',
    filterAcademic: 'ACADEMIC',
    current: 'CURRENT',
    inProgress: 'IN PROGRESS',
    expand: '+ {{count}} PREVIOUS ENTRIES',
    collapse: '− SHOW LESS',
    present: 'present',
  },
  stack: {
    eyebrow: 'STACK',
    title: 'Tools I',
    titleAccent: 'master',
    categoryFrontend: 'Frontend',
    categoryBackend: 'Backend',
    categoryMobile: 'Mobile',
    categoryDatabases: 'Databases',
    categoryCloud: 'Cloud / DevOps',
    categoryAi: 'AI & Automation',
    footerCount: '35 TECHNOLOGIES · 6 DOMAINS',
    footerUpdated: '↻ UPDATED TODAY',
    docs: 'Documentation',
  },
  services: {
    eyebrow: 'SERVICES',
    title: 'What I can',
    titleAccent: 'build',
  },
  footer: {
    tagline: 'FULL STACK DEVELOPER · SINCE 2022',
    signature: 'by João Pedro Carvalho dos Santos',
    madeWith: 'made with',
    socialEmail: 'Email',
    socialLinkedin: 'LinkedIn',
    socialGithub: 'GitHub',
    socialDiscord: 'Discord',
  },
```

- [ ] **Step 3: Append the matching `es` groups to `src/i18n/resources/es.ts`** (inside the `es` object):

```ts
  hero: {
    statusPill: 'FULL STACK · LUMETIS · DESDE 05/2026',
    location: 'SÃO JOSÉ DOS CAMPOS · SP — BR',
    byline: 'construyendo',
    role: 'Desarrollador Full Stack',
    description:
      'Convierto ideas en productos web y móviles — de la arquitectura al pixel, con foco en rendimiento y cuidado editorial.',
    tagFatec: 'FATEC · 5º SEM',
    tagAka: 'a.k.a. Petros',
    downloadCv: 'Descargar CV',
    seePanda: 'Ver mi panda 🐼',
    scrollCue: 'desplázate para explorar',
  },
  trajectory: {
    eyebrow: 'TRAYECTORIA',
    title: 'Cómo llegué',
    titleAccent: 'aquí',
    filterAll: 'TODAS',
    filterProfessional: 'PROFESIONAL',
    filterAcademic: 'ACADÉMICA',
    current: 'ACTUAL',
    inProgress: 'EN CURSO',
    expand: '+ {{count}} ENTRADAS ANTERIORES',
    collapse: '− MOSTRAR MENOS',
    present: 'actual',
  },
  stack: {
    eyebrow: 'STACK',
    title: 'Herramientas que',
    titleAccent: 'domino',
    categoryFrontend: 'Frontend',
    categoryBackend: 'Backend',
    categoryMobile: 'Mobile',
    categoryDatabases: 'Bases de Datos',
    categoryCloud: 'Cloud / DevOps',
    categoryAi: 'IA & Automatización',
    footerCount: '35 TECNOLOGÍAS · 6 DOMINIOS',
    footerUpdated: '↻ ACTUALIZADO HOY',
    docs: 'Documentación',
  },
  services: {
    eyebrow: 'SERVICIOS',
    title: 'Lo que puedo',
    titleAccent: 'construir',
  },
  footer: {
    tagline: 'FULL STACK DEVELOPER · DESDE 2022',
    signature: 'por João Pedro Carvalho dos Santos',
    madeWith: 'hecho con',
    socialEmail: 'Correo',
    socialLinkedin: 'LinkedIn',
    socialGithub: 'GitHub',
    socialDiscord: 'Discord',
  },
```

- [ ] **Step 4: Typecheck** (confirms `en`/`es` match the `pt`-inferred `UIStrings` shape exactly)

Run: `pnpm typecheck`
Expected: PASS. If it fails, a key is missing or misspelled in `en`/`es` — align it with `pt`.

- [ ] **Step 5: Commit**

```bash
pnpm check
git add src/i18n/resources
git commit -m "feat(i18n): chrome strings for hero/trajectory/stack/services/footer

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: `useReveal` hook + `Reveal` wrapper + `Tooltip` common component

**Files:**
- Create: `src/hooks/useReveal.ts`
- Create: `src/components/common/Reveal.tsx`
- Create: `src/components/common/Tooltip.tsx`
- Modify: `src/styles/tokens/animations.css`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`; `Tooltip` from `radix-ui`.
- Produces:
  - `useReveal<T extends HTMLElement>(opts?): { ref: RefObject<T | null>; shown: boolean }` — sets `shown` true once the element enters the viewport (one-shot), then disconnects.
  - `Reveal(props: ComponentProps<'div'> & { delay?: number })` — wraps children in a div that fades up (`animate-petros-fade-up`) when scrolled into view; hidden state gated behind `html.theme-ready` for SSR/no-JS safety. `delay` (ms) staggers grids via `animationDelay`.
  - `Tooltip({ label, children, side? })` — accessible Radix tooltip; `children` is the trigger.

- [ ] **Step 1: Create `src/hooks/useReveal.ts`**

```ts
import { useEffect, useRef, useState } from 'react'

export function useReveal<T extends HTMLElement = HTMLDivElement>(opts?: {
  rootMargin?: string
}) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: opts?.rootMargin ?? '0px 0px -10% 0px', threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [opts?.rootMargin])

  return { ref, shown }
}
```

- [ ] **Step 2: Create `src/components/common/Reveal.tsx`**

```tsx
import type { ComponentProps } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

export function Reveal({
  delay = 0,
  className,
  style,
  children,
  ...props
}: ComponentProps<'div'> & { delay?: number }) {
  const { ref, shown } = useReveal()
  return (
    <div
      ref={ref}
      data-reveal={shown ? 'shown' : 'pending'}
      className={cn(shown && 'animate-petros-fade-up', className)}
      style={{ ...style, animationDelay: shown ? `${delay}ms` : undefined }}
      {...props}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Add the SSR-safe hidden-state rule to `src/styles/tokens/animations.css`** (append at the end; content is invisible only once JS has hydrated and marked `theme-ready`, so crawlers/no-JS see everything):

```css
/* Reveal-on-scroll: hide pending items only after hydration (avoids no-JS hiding) */
html.theme-ready [data-reveal='pending'] {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  html.theme-ready [data-reveal='pending'] {
    opacity: 1;
  }
}
```

- [ ] **Step 4: Create `src/components/common/Tooltip.tsx`**

```tsx
import type { ReactNode } from 'react'
import { Tooltip as RadixTooltip } from 'radix-ui'

export function Tooltip({
  label,
  side = 'top',
  children,
}: {
  label: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  children: ReactNode
}) {
  return (
    <RadixTooltip.Provider delayDuration={150}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={6}
            className='z-50 rounded-sm border-[0.5px] border-border bg-bg-elevated px-2 py-1 font-mono text-micro tracking-meta uppercase text-text-secondary shadow-[var(--shadow-card)]'
          >
            {label}
            <RadixTooltip.Arrow className='fill-bg-elevated' />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
```

- [ ] **Step 5: Typecheck + lint**

Run: `pnpm typecheck && pnpm check`
Expected: PASS, no errors.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useReveal.ts src/components/common src/styles/tokens/animations.css
git commit -m "feat(common): useReveal scroll-reveal, Reveal wrapper, Tooltip

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Stack section

**Files:**
- Create: `src/components/sections/Stack.tsx`

**Interfaces:**
- Consumes: `CATEGORIES`, `groupByCategory`, `TECHS`, `type Category`, `type Tech` from `@/data/stack`; `Eyebrow`, `DotHeading` from `@/components/primitives`; `Reveal` from `@/components/common/Reveal`; `Tooltip` from `@/components/common/Tooltip`; `useTranslation` from `react-i18next`; `cn` from `@/lib/utils`.
- Produces: `Stack()` — section `#stack` rendering 6 category groups; each tech is an anchor to its docs (new tab) with a brand-color monogram + name, wrapped in a Tooltip showing the docs label. Footer line with count + "updated today".

> The monogram background is 8% of the brand color via an 8-digit hex (`${brandColor}14`, `0x14` ≈ 8%); the glyph text uses the full brand color. Both are inline-styled because brand colors are intentionally non-thematic.

- [ ] **Step 1: Create `src/components/sections/Stack.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { DotHeading, Eyebrow } from '@/components/primitives'
import { Reveal } from '@/components/common/Reveal'
import { Tooltip } from '@/components/common/Tooltip'
import { type Category, type Tech, TECHS, groupByCategory } from '@/data/stack'
import { cn } from '@/lib/utils'

const CATEGORY_KEY: Record<Category, string> = {
  frontend: 'stack.categoryFrontend',
  backend: 'stack.categoryBackend',
  mobile: 'stack.categoryMobile',
  databases: 'stack.categoryDatabases',
  cloud: 'stack.categoryCloud',
  ai: 'stack.categoryAi',
}

function TechItem({ tech, docsLabel }: { tech: Tech; docsLabel: string }) {
  return (
    <Tooltip label={docsLabel}>
      <a
        href={tech.docsUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='group flex min-h-11 items-center gap-3 rounded-md border-[0.5px] border-border bg-bg-card px-3 py-2 shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:-translate-y-0.5 hover:border-accent-tint-20'
      >
        <span
          aria-hidden
          className='flex size-8 shrink-0 items-center justify-center rounded-sm font-mono text-body-sm font-medium transition-transform duration-[var(--dur-micro)] group-hover:scale-105'
          style={{ background: `${tech.brandColor}14`, color: tech.brandColor }}
        >
          {tech.monogram}
        </span>
        <span className='truncate font-sans text-body-sm text-text-primary'>
          {tech.name}
        </span>
      </a>
    </Tooltip>
  )
}

export function Stack() {
  const { t } = useTranslation()
  const groups = groupByCategory(TECHS)

  return (
    <section
      id='stack'
      aria-labelledby='stack-label'
      data-themed
      className='mx-auto max-w-6xl px-section-pad-sm py-section-gap md:px-section-pad'
    >
      <Reveal>
        <Eyebrow bullet>{t('stack.eyebrow')}</Eyebrow>
        <DotHeading id='stack-label' className='mt-4'>
          {t('stack.title')}{' '}
          <span className='font-serif italic text-accent-italic'>
            {t('stack.titleAccent')}
          </span>
        </DotHeading>
      </Reveal>

      <div className='mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3'>
        {groups.map((group, gi) => (
          <Reveal key={group.category} delay={gi * 80}>
            <h3 className='font-mono text-meta tracking-meta uppercase text-text-muted'>
              {t(CATEGORY_KEY[group.category])}
            </h3>
            <div className='mt-4 flex flex-col gap-2'>
              {group.techs.map((tech) => (
                <TechItem key={tech.id} tech={tech} docsLabel={t('stack.docs')} />
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <div
        className={cn(
          'mt-12 flex flex-wrap items-center justify-between gap-2 border-t-[0.5px] border-border pt-4',
          'font-mono text-meta tracking-meta uppercase text-text-faint',
        )}
      >
        <span>{t('stack.footerCount')}</span>
        <span className='text-accent'>{t('stack.footerUpdated')}</span>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Temporarily mount in `index.tsx` to smoke-test** — add `import { Stack } from '@/components/sections/Stack'` and render `<Stack />` inside `<main>` in place of the `stack` placeholder section (you will finalize composition in Task 11).

Run: `pnpm typecheck && pnpm dev`
Expected at `http://localhost:3000` (scroll to Stack): 6 category columns; monograms show brand colors (e.g. TypeScript blue, React cyan); cards lift 2px and warm their border on hover; hovering a tech shows a "DOCUMENTATION" tooltip; clicking opens docs in a new tab; footer reads "35 TECHNOLOGIES · 6 DOMAINS" with an accent "UPDATED TODAY". Toggle `data-mode="light"` via SettingsPopover — paper surfaces + hairline shadow appear, monograms unchanged.

- [ ] **Step 3: Lint**

Run: `pnpm check`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Stack.tsx
git commit -m "feat(section): Stack — 6 categories, brand-color monograms, docs tooltips

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Services section

**Files:**
- Create: `src/components/sections/Services.tsx`

**Interfaces:**
- Consumes: `SERVICES`, `type Service` from `@/data/services`; `getTech` from `@/data/stack`; `Eyebrow`, `DotHeading`, `Tag` from `@/components/primitives`; `Reveal` from `@/components/common/Reveal`; `useLocalized` from `@/i18n/useLocalized`; `useTranslation` from `react-i18next`; named icon set from `@tabler/icons-react`.
- Produces: `Services()` — section `#services` with 6 informational (non-interactive) cards: icon in an `--accent-tint-12` rounded square, localized title + description, and the service's techs as `Tag`s.

> Icons are resolved from a small map keyed by the `icon` string in the data, so the data file stays serializable while the component owns the JSX import.

- [ ] **Step 1: Create `src/components/sections/Services.tsx`**

```tsx
import {
  IconBrowserCheck,
  IconCloudComputing,
  IconDeviceMobile,
  IconPlugConnected,
  IconRobot,
  IconSeo,
  type IconProps,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { DotHeading, Eyebrow, Tag } from '@/components/primitives'
import { Reveal } from '@/components/common/Reveal'
import { type Service, SERVICES } from '@/data/services'
import { getTech } from '@/data/stack'
import { useLocalized } from '@/i18n/useLocalized'

const ICONS: Record<string, ComponentType<IconProps>> = {
  IconBrowserCheck,
  IconDeviceMobile,
  IconPlugConnected,
  IconCloudComputing,
  IconRobot,
  IconSeo,
}

function ServiceCard({ service, delay }: { service: Service; delay: number }) {
  const localize = useLocalized()
  const Icon = ICONS[service.icon] ?? IconBrowserCheck
  return (
    <Reveal
      delay={delay}
      className='group flex h-full flex-col rounded-md border-[0.5px] border-border bg-bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:-translate-y-0.5 hover:border-accent-tint-20'
    >
      <span className='flex size-12 items-center justify-center rounded-[10px] bg-accent-tint-12 text-accent transition-transform duration-[var(--dur-micro)] group-hover:scale-105'>
        <Icon size={22} stroke={1.5} aria-hidden />
      </span>
      <h3 className='mt-5 font-sans text-title font-medium tracking-tight text-text-primary'>
        {localize(service.title)}
      </h3>
      <p className='mt-2 font-sans text-body leading-body text-text-secondary'>
        {localize(service.description)}
      </p>
      <div className='mt-4 flex flex-wrap gap-1.5'>
        {service.techIds.map((id) => {
          const tech = getTech(id)
          return tech ? <Tag key={id}>{tech.name}</Tag> : null
        })}
      </div>
    </Reveal>
  )
}

export function Services() {
  const { t } = useTranslation()
  return (
    <section
      id='services'
      aria-labelledby='services-label'
      data-themed
      className='mx-auto max-w-6xl px-section-pad-sm py-section-gap md:px-section-pad'
    >
      <Reveal>
        <Eyebrow bullet>{t('services.eyebrow')}</Eyebrow>
        <DotHeading id='services-label' className='mt-4'>
          {t('services.title')}{' '}
          <span className='font-serif italic text-accent-italic'>
            {t('services.titleAccent')}
          </span>
        </DotHeading>
      </Reveal>

      <div className='mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
        {SERVICES.map((service, i) => (
          <ServiceCard key={service.id} service={service} delay={i * 100} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify the Tabler icon names resolve.** If `pnpm typecheck` reports a missing export (e.g. `IconSeo`), find the correct name:

Run: `node -e "const i=require('@tabler/icons-react'); console.log(['IconBrowserCheck','IconDeviceMobile','IconPlugConnected','IconCloudComputing','IconRobot','IconSeo'].map(n=>n+':'+(n in i)))"`
Expected: every name prints `:true`. If `IconSeo:false`, substitute a present alternative (e.g. `IconSearch`) in **both** the import and the `ICONS` map and update `services.ts`'s `icon` field to match.

- [ ] **Step 3: Smoke-test in dev** — temporarily render `<Services />` in `index.tsx`.

Run: `pnpm typecheck && pnpm dev`
Expected: 6 cards (3-col desktop, 1-col mobile); each icon sits in an accent-tinted square; cards lift + warm border + icon scales on hover; tech tags render under each card; no click navigation. Cards are not links (informational).

- [ ] **Step 4: Lint**

Run: `pnpm check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Services.tsx
git commit -m "feat(section): Services — 6 informational cards with Tabler icons

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: PandaMascot + Trajectory section

**Files:**
- Create: `src/components/sections/PandaMascot.tsx`
- Create: `src/components/sections/Trajectory.tsx`

**Interfaces:**
- Consumes: `TRAJECTORY`, `filterTrajectory`, `trajectoryCounts`, `type TrajectoryEntry`, `type TrajectoryFilter` from `@/data/trajectory`; `getTech` from `@/data/stack`; `Eyebrow`, `DotHeading`, `Tag`, `StatusPill` from `@/components/primitives`; `Reveal` from `@/components/common/Reveal`; `Tooltip` from `@/components/common/Tooltip`; `useLocalized` from `@/i18n/useLocalized`; `useTranslation` from `react-i18next`; `IconInfoCircle` from `@tabler/icons-react`; `cn` from `@/lib/utils`.
- Produces:
  - `PandaMascot({ className })` — an emoji panda 🐼 on a gradient disc that swings via the `animate-petros-swing` CSS loop.
  - `Trajectory()` — section `#trajectory`: filter tabs (ALL/PROFESSIONAL/ACADEMIC with live counts), gradient spine + bullet markers, first-3-then-expand collapse, each card with eyebrow/period/org+info/role/description/tech tags. The swinging panda hangs on the spine.

- [ ] **Step 1: Create `src/components/sections/PandaMascot.tsx`**

```tsx
import { cn } from '@/lib/utils'

export function PandaMascot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-9 origin-top items-center justify-center rounded-pill bg-gradient-to-b from-panda-from to-panda-to text-[18px] motion-safe:animate-petros-swing',
        className,
      )}
    >
      🐼
    </span>
  )
}
```

- [ ] **Step 2: Create `src/components/sections/Trajectory.tsx`**

```tsx
import { IconInfoCircle } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DotHeading, Eyebrow, StatusPill, Tag } from '@/components/primitives'
import { Reveal } from '@/components/common/Reveal'
import { Tooltip } from '@/components/common/Tooltip'
import { PandaMascot } from './PandaMascot'
import { getTech } from '@/data/stack'
import {
  TRAJECTORY,
  type TrajectoryEntry,
  type TrajectoryFilter,
  filterTrajectory,
  trajectoryCounts,
} from '@/data/trajectory'
import { useLocalized } from '@/i18n/useLocalized'
import { cn } from '@/lib/utils'

const VISIBLE = 3

const FILTERS: { id: TrajectoryFilter; key: string; countKey: keyof ReturnType<typeof trajectoryCounts> }[] = [
  { id: 'all', key: 'trajectory.filterAll', countKey: 'all' },
  { id: 'professional', key: 'trajectory.filterProfessional', countKey: 'professional' },
  { id: 'academic', key: 'trajectory.filterAcademic', countKey: 'academic' },
]

function periodLabel(entry: TrajectoryEntry, present: string): string {
  const end = entry.period.end === 'present' ? present : entry.period.end
  return `${entry.period.start} — ${end}`
}

function EntryCard({ entry }: { entry: TrajectoryEntry }) {
  const { t } = useTranslation()
  const localize = useLocalized()
  return (
    <Reveal className='relative pl-10'>
      <span
        aria-hidden
        className='absolute left-[5px] top-1.5 size-3 rounded-pill bg-accent shadow-glow-dot'
      />
      <div className='rounded-md border-[0.5px] border-border bg-bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:-translate-y-0.5 hover:border-accent-tint-20'>
        <div className='flex flex-wrap items-center gap-3'>
          <Eyebrow>{periodLabel(entry, t('trajectory.present'))}</Eyebrow>
          {entry.current && (
            <StatusPill pulse>
              {entry.type === 'academic'
                ? t('trajectory.inProgress')
                : t('trajectory.current')}
            </StatusPill>
          )}
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <h3 className='font-sans text-title font-medium tracking-tight text-text-primary'>
            {localize(entry.org)}
          </h3>
          {entry.info && (
            <Tooltip label={localize(entry.info)}>
              <button
                type='button'
                aria-label={localize(entry.info)}
                className='flex size-5 items-center justify-center rounded-pill text-text-faint hover:text-accent'
              >
                <IconInfoCircle size={15} stroke={1.5} aria-hidden />
              </button>
            </Tooltip>
          )}
        </div>
        <p className='mt-1 font-sans text-body text-accent'>{localize(entry.role)}</p>
        <p className='mt-2 font-sans text-body leading-body text-text-secondary'>
          {localize(entry.description)}
        </p>
        <div className='mt-4 flex flex-wrap gap-1.5'>
          {entry.techs.map((id) => (
            <Tag key={id}>{getTech(id)?.name ?? id}</Tag>
          ))}
        </div>
      </div>
    </Reveal>
  )
}

export function Trajectory() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<TrajectoryFilter>('all')
  const [expanded, setExpanded] = useState(false)
  const counts = useMemo(() => trajectoryCounts(TRAJECTORY), [])
  const filtered = useMemo(() => filterTrajectory(TRAJECTORY, filter), [filter])
  const shown = expanded ? filtered : filtered.slice(0, VISIBLE)
  const hidden = filtered.length - VISIBLE

  return (
    <section
      id='trajectory'
      aria-labelledby='trajectory-label'
      data-themed
      className='mx-auto max-w-4xl px-section-pad-sm py-section-gap md:px-section-pad'
    >
      <Reveal>
        <Eyebrow bullet>{t('trajectory.eyebrow')}</Eyebrow>
        <DotHeading id='trajectory-label' className='mt-4'>
          {t('trajectory.title')}{' '}
          <span className='font-serif italic text-accent-italic'>
            {t('trajectory.titleAccent')}
          </span>
        </DotHeading>
      </Reveal>

      <div
        role='tablist'
        aria-label={t('trajectory.eyebrow')}
        className='mt-8 flex flex-wrap gap-2'
      >
        {FILTERS.map((f) => {
          const isActive = filter === f.id
          return (
            <button
              key={f.id}
              type='button'
              role='tab'
              aria-selected={isActive}
              onClick={() => {
                setFilter(f.id)
                setExpanded(false)
              }}
              className={cn(
                'inline-flex min-h-11 items-center gap-2 rounded-pill border-[0.5px] px-4 font-mono text-meta tracking-meta uppercase transition-all duration-[var(--dur-micro)]',
                isActive
                  ? 'border-accent-tint-20 bg-accent-tint-12 text-text-primary'
                  : 'border-border text-text-muted hover:text-text-primary',
              )}
            >
              {t(f.key)}
              <span className='text-text-faint'>{counts[f.countKey]}</span>
            </button>
          )
        })}
      </div>

      <div className='relative mt-10'>
        <span
          aria-hidden
          className='absolute left-1.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent to-transparent'
        />
        <PandaMascot className='absolute -left-3 -top-2 z-10' />
        <div className='flex flex-col gap-6'>
          {shown.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>

      {hidden > 0 && (
        <button
          type='button'
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className='mt-8 inline-flex min-h-11 items-center rounded-pill border-[0.5px] border-border px-5 font-mono text-meta tracking-meta uppercase text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-text-primary'
        >
          {expanded
            ? t('trajectory.collapse')
            : t('trajectory.expand', { count: hidden })}
        </button>
      )}
    </section>
  )
}
```

- [ ] **Step 3: Smoke-test in dev** — temporarily render `<Trajectory />` in `index.tsx`.

Run: `pnpm typecheck && pnpm dev`
Expected: eyebrow + "Como cheguei *aqui.*" heading; three filter pills showing counts ALL 7 / PROFESSIONAL 4 / ACADEMIC 3; gradient spine on the left with a swinging panda at the top (still under reduced-motion); first 3 cards visible with bullets, period eyebrow, "CURRENT"/"IN PROGRESS" pill on Lumetis/FATEC, accent role, description, tech tags; clicking a filter updates the list + counts and collapses back to 3; "+ 4 PREVIOUS ENTRIES" expands the rest; the "i" on Design Líquido shows the Delégua tooltip.

- [ ] **Step 4: Lint**

Run: `pnpm check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/PandaMascot.tsx src/components/sections/Trajectory.tsx
git commit -m "feat(section): Trajectory — filters, spine, swinging panda, expand

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Hero section

**Files:**
- Create: `src/components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `Brand`, `Button`, `StatusPill`, `Tag` from `@/components/primitives`; `useBrtClock` from `@/hooks/useBrtClock`; `useTranslation` from `react-i18next`; `cn` from `@/lib/utils`.
- Produces: `Hero()` — section `#home`, min-height 90vh: top metadata row (status pill left, location + live BRT clock right), 60/40 grid (name `Petros.` + serif byline + role pill + description on the left; photo with accent corner brackets + floating tags on the right, JP-initials fallback), two CTAs (Download CV primary, See my panda secondary), a mono tech-list bottom line, and a subtle accent background grid.

> CV download and the panda easter-egg are **Phase 4**. This phase renders the CTAs as styled controls: "Download CV" is an `<a download>` pointing at the static `/petros-cv-pt.pdf` placeholder path; "See my panda" is a `<button>` with a `TODO Phase 4` comment (no handler). No photo asset is assumed — the fallback (JP initials) renders unless `/petros.jpg` exists.

- [ ] **Step 1: Create `src/components/sections/Hero.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { Brand, Button, StatusPill, Tag } from '@/components/primitives'
import { useBrtClock } from '@/hooks/useBrtClock'

const TECH_LINE = ['TS', 'PYTHON', 'REACT', 'NEXT.JS', 'FLUTTER', 'AWS']

function PhotoFallback() {
  return (
    <span className='flex size-full items-center justify-center rounded-md bg-gradient-to-b from-panda-from to-panda-to font-sans text-display font-medium tracking-tight text-accent'>
      JP
    </span>
  )
}

export function Hero() {
  const { t } = useTranslation()
  const clock = useBrtClock()

  return (
    <section
      id='home'
      aria-labelledby='home-label'
      data-themed
      className='relative flex min-h-[90vh] flex-col justify-center overflow-hidden px-section-pad-sm py-section-gap md:px-section-pad'
    >
      {/* subtle accent vertical grid */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, var(--accent) 0 1px, transparent 1px 80px)',
        }}
      />

      <div className='relative mx-auto w-full max-w-6xl'>
        {/* top metadata */}
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <StatusPill pulse>{t('hero.statusPill')}</StatusPill>
          <div className='flex items-center gap-3 font-mono text-meta tracking-meta uppercase text-text-muted'>
            <span>{t('hero.location')}</span>
            <span aria-hidden>·</span>
            <span aria-live='polite' className='text-text-secondary'>
              {clock} BRT
            </span>
          </div>
        </div>

        {/* main block */}
        <div className='mt-12 grid items-center gap-10 md:grid-cols-[60fr_40fr]'>
          <div className='animate-petros-fade-up'>
            <h1 id='home-label' className='font-sans font-medium leading-tight'>
              <Brand size='text-hero' className='tracking-hero' />
            </h1>
            <p className='mt-4 font-serif text-h3 italic text-accent-italic'>
              {t('hero.byline')}
            </p>
            <div className='mt-5'>
              <StatusPill>{t('hero.role')}</StatusPill>
            </div>
            <p className='mt-6 max-w-md font-sans text-lead leading-body text-text-secondary'>
              {t('hero.description')}
            </p>
            <div className='mt-8 flex flex-wrap gap-3'>
              {/* Phase 4: a server fn will serve the per-language PDF; for now a
                  static placeholder path. Styled as the primary button — the
                  Phase 1 Button renders a <button>, so the CTA is an <a> that
                  mirrors its classes (no <a> nested in <button>). */}
              <a
                href='/petros-cv-pt.pdf'
                download
                className='inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-accent px-5 font-sans text-body font-medium text-[#0a0a0a] transition-all duration-[var(--dur-micro)] hover:brightness-110 max-sm:w-full'
              >
                {t('hero.downloadCv')}
              </a>
              {/* TODO Phase 4: open EasterEgg dialog */}
              <Button variant='secondary' className='max-sm:w-full'>
                {t('hero.seePanda')}
              </Button>
            </div>
          </div>

          {/* photo + brackets + floating tags */}
          <div className='group relative mx-auto aspect-[4/5] w-full max-w-xs'>
            <span aria-hidden className='absolute -left-2 -top-2 size-6 border-l-2 border-t-2 border-accent transition-all duration-[var(--dur-micro)] group-hover:-left-3 group-hover:-top-3' />
            <span aria-hidden className='absolute -right-2 -top-2 size-6 border-r-2 border-t-2 border-accent transition-all duration-[var(--dur-micro)] group-hover:-right-3 group-hover:-top-3' />
            <span aria-hidden className='absolute -bottom-2 -left-2 size-6 border-b-2 border-l-2 border-accent transition-all duration-[var(--dur-micro)] group-hover:-bottom-3 group-hover:-left-3' />
            <span aria-hidden className='absolute -bottom-2 -right-2 size-6 border-b-2 border-r-2 border-accent transition-all duration-[var(--dur-micro)] group-hover:-bottom-3 group-hover:-right-3' />
            <PhotoFallback />
            <Tag className='absolute -left-4 top-6 bg-bg-elevated'>{t('hero.tagFatec')}</Tag>
            <Tag className='absolute -right-4 bottom-10 bg-bg-elevated'>{t('hero.tagAka')}</Tag>
          </div>
        </div>

        {/* bottom tech line */}
        <div className='mt-14 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-meta tracking-meta uppercase text-text-faint'>
          {TECH_LINE.map((tech, i) => (
            <span key={tech} className='flex items-center gap-3'>
              {i > 0 && <span aria-hidden>·</span>}
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Sanity-check the primitive APIs used.** Open `src/components/primitives/Button.tsx` and confirm the secondary CTA usage matches: `Button` is a plain `<button>` taking `variant?: 'primary' | 'secondary'` + native button props (it does **not** support an `asChild`/polymorphic prop — which is why the primary CTA is a hand-styled `<a download>`, not a `Button`). Confirm `Brand` accepts `size?: string` and `StatusPill` accepts `pulse?: boolean`. If any signature differs, adjust the Hero usage to match the real prop names.

- [ ] **Step 3: Smoke-test in dev** — temporarily render `<Hero />` in `index.tsx` as the first section.

Run: `pnpm typecheck && pnpm dev`
Expected: full-viewport hero; status pill top-left with pulsing dot, location + a live `HH:MM BRT` clock top-right; huge `Petros.` wordmark with glowing accent period; serif-italic byline; role pill; description; two CTAs (accent fill + outline, full-width on mobile); a 4:5 panel showing `JP` initials with four accent corner brackets that push outward on hover and two floating tags; faint vertical accent grid behind; mono tech line at the bottom. Resize to mobile: grid stacks to 1 column, CTAs go full-width.

- [ ] **Step 4: Lint**

Run: `pnpm check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat(section): Hero — BRT clock, brackets, CTAs, tech line, bg grid

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Footer section

**Files:**
- Create: `src/components/sections/Footer.tsx`

**Interfaces:**
- Consumes: `Brand` from `@/components/primitives`; `Tooltip` from `@/components/common/Tooltip`; `useTranslation` from `react-i18next`; `IconMail`, `IconBrandLinkedin`, `IconBrandGithub`, `IconBrandDiscord` from `@tabler/icons-react`.
- Produces: `Footer()` — `<footer>` with brand block (🐼 `Petros.` + tagline + serif signature), 4 social squares (36×36, icon-only, tooltip, new-tab `rel="noopener"`), divider, and a `made with ♥ & 🐼` bottom line.

> Social URLs are personal — left as `TODO(petros)` placeholders (`#`). Fill them before launch; the layout and a11y are complete without them.

- [ ] **Step 1: Create `src/components/sections/Footer.tsx`**

```tsx
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  type IconProps,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { Brand } from '@/components/primitives'
import { Tooltip } from '@/components/common/Tooltip'

// TODO(petros): replace '#' with real profile URLs before launch
const SOCIALS: {
  id: string
  labelKey: string
  href: string
  Icon: ComponentType<IconProps>
}[] = [
  { id: 'email', labelKey: 'footer.socialEmail', href: 'mailto:joaopcarvalho.cds@gmail.com', Icon: IconMail },
  { id: 'linkedin', labelKey: 'footer.socialLinkedin', href: '#', Icon: IconBrandLinkedin },
  { id: 'github', labelKey: 'footer.socialGithub', href: '#', Icon: IconBrandGithub },
  { id: 'discord', labelKey: 'footer.socialDiscord', href: '#', Icon: IconBrandDiscord },
]

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer
      data-themed
      className='mx-auto max-w-6xl px-section-pad-sm py-section-gap md:px-section-pad'
    >
      <div className='flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left'>
        <div>
          <div className='flex items-center justify-center gap-2 md:justify-start'>
            <span aria-hidden className='text-title'>🐼</span>
            <Brand size='text-h3' />
          </div>
          <p className='mt-3 font-mono text-meta tracking-meta uppercase text-text-muted'>
            {t('footer.tagline')}
          </p>
          <p className='mt-1 font-serif text-body italic text-accent-italic'>
            {t('footer.signature')}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {SOCIALS.map(({ id, labelKey, href, Icon }) => (
            <Tooltip key={id} label={t(labelKey)}>
              <a
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel='noopener noreferrer'
                aria-label={t(labelKey)}
                className='flex size-9 items-center justify-center rounded-sm border-[0.5px] border-border bg-bg-card text-text-secondary shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent'
              >
                <Icon size={18} stroke={1.5} aria-hidden />
              </a>
            </Tooltip>
          ))}
        </div>
      </div>

      <hr className='my-6' />

      <p className='text-center font-mono text-meta tracking-meta uppercase text-text-faint'>
        {t('footer.madeWith')} <span className='text-accent'>♥</span> &{' '}
        <span className='[filter:saturate(0.7)]'>🐼</span>
      </p>
    </footer>
  )
}
```

- [ ] **Step 2: Verify Tabler brand icon names** (these can differ between versions):

Run: `node -e "const i=require('@tabler/icons-react'); console.log(['IconMail','IconBrandLinkedin','IconBrandGithub','IconBrandDiscord'].map(n=>n+':'+(n in i)))"`
Expected: all `:true`. Substitute any `false` name (e.g. `IconBrandLinkedinFilled`) in the import + `SOCIALS` array.

- [ ] **Step 3: Smoke-test in dev** — temporarily render `<Footer />` at the end of `index.tsx`.

Run: `pnpm typecheck && pnpm dev`
Expected: brand block with panda + `Petros.` (glowing period) + mono tagline + serif signature; 4 social squares that warm border + turn the icon accent on hover, each showing a tooltip; a hairline divider; `made with ♥ & 🐼` centered with an accent heart. On mobile the brand stacks above centered socials.

- [ ] **Step 4: Lint**

Run: `pnpm check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Footer.tsx
git commit -m "feat(section): Footer — colophon, social squares, made-with line

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Compose sections into `index.tsx` + full verification

**Files:**
- Modify: `src/routes/index.tsx`

**Interfaces:**
- Consumes: `Hero`, `Trajectory`, `Stack`, `Services`, `Footer` from `@/components/sections/*`; existing `Header`.
- Produces: the assembled single-page route with real sections in PRD order and placeholder sections for the later phases.

- [ ] **Step 1: Replace `src/routes/index.tsx`** with the composed page (remove any temporary section imports added during Tasks 6–10):

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { Trajectory } from '@/components/sections/Trajectory'
import { Stack } from '@/components/sections/Stack'
import { Services } from '@/components/sections/Services'
import { Footer } from '@/components/sections/Footer'

export const Route = createFileRoute('/')({ component: App })

// Sections still to be built (Phase 3/4) — kept as labeled anchors so the
// Header scroll-spy + in-page links resolve.
const PLACEHOLDERS = ['projects', 'about', 'contact'] as const

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
Expected: all Vitest suites pass (stack, services, trajectory, plus Phase 1 suites); no TS errors; Biome clean; Vite build succeeds with no CSS/SSR errors.

- [ ] **Step 3: Dev render — full-page walkthrough across themes**

Run: `pnpm dev` and open `http://localhost:3000`
Expected:
- Sections appear in order: Hero → Trajectory → Stack → Services → projects/about/contact placeholders → Footer.
- Header scroll-spy lights the BambooIndicator for home/stack/trajectory/about/projects as you scroll; nav anchors jump correctly.
- Scroll-reveal: sections/cards fade up as they enter the viewport; nothing is permanently hidden.
- Open SettingsPopover (`⌘+,`): switch mode dark↔light and scheme across all 5 — surfaces/text swap with mode, accent + panda gradient swap with scheme, tech monograms stay fixed. Switch language pt/en/es — all chrome strings and section content update.
- No console errors; no FOUC on reload.

- [ ] **Step 4: Confirm reduced-motion** — in devtools, emulate `prefers-reduced-motion: reduce`, reload.
Expected: panda stops swinging, entrance fades are skipped (content shown immediately), clock still ticks.

- [ ] **Step 5: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat(shell): compose Hero, Trajectory, Stack, Services, Footer into page

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Phase 2 Done — Definition of Complete

- [ ] `src/data/{stack,services,trajectory}.ts` exist with passing TDD helper suites.
- [ ] Five sections (Hero, Trajectory, Stack, Services, Footer) render against Phase 1 tokens with no raw hex except non-thematic brand colors.
- [ ] All chrome strings localized in pt/en/es; section content localized via `useLocalized`.
- [ ] `pnpm test && pnpm typecheck && pnpm check && pnpm build` all green.
- [ ] Verified across representative mode×scheme combos + all 3 languages + reduced-motion.
- [ ] Outstanding `TODO(petros)` items (social URLs, trajectory role/description wording, real photo + CV PDF) flagged for a content pass — not blockers for Phase 2 structural completion.

## Deferred to later phases (do NOT build here)

- Lanyard live-status pill in Header + About NOW panel (P4).
- CV server function + per-language reactive download (P4) — Hero CTA currently points at a static placeholder path.
- Panda EasterEgg dialog (P4) — Hero "See my panda" button is currently inert.
- Projects (tabs + dialog + carousel), About (bio + stats + NOW shell), Contact (form) — Phase 3/4; remain placeholder anchors.
- Mobile hamburger drawer nav (Header TODO).
