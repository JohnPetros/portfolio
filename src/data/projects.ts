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
  {
    icon: 'IconCode',
    label: { pt: 'Arquitetura', en: 'Architecture', es: 'Arquitectura' },
  },
  {
    icon: 'IconDatabase',
    label: { pt: 'Modelagem de dados', en: 'Data modeling', es: 'Modelado de datos' },
  },
]
const SOFT: DetailSkill[] = [
  {
    icon: 'IconUsers',
    label: { pt: 'Trabalho em equipe', en: 'Teamwork', es: 'Trabajo en equipo' },
  },
  {
    icon: 'IconBulb',
    label: {
      pt: 'Resolução de problemas',
      en: 'Problem solving',
      es: 'Resolución de problemas',
    },
  },
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
      {
        pt: 'Funcionalidade principal.',
        en: 'Core feature.',
        es: 'Funcionalidad principal.',
      }, // TODO(petros)
    ],
    techGroups: [
      {
        label: { pt: 'Stack', en: 'Stack', es: 'Stack' },
        techs,
      },
    ],
    contributions: [
      {
        pt: 'Minha contribuição no projeto.',
        en: 'My contribution to the project.',
        es: 'Mi contribución al proyecto.',
      }, // TODO(petros)
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
    eyebrow: {
      pt: '2024/1 · FATEC SJC',
      en: '2024/1 · FATEC SJC',
      es: '2024/1 · FATEC SJC',
    },
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
    eyebrow: {
      pt: '2024/2 · FATEC SJC',
      en: '2024/2 · FATEC SJC',
      es: '2024/2 · FATEC SJC',
    },
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
    eyebrow: {
      pt: '2025/1 · Necto Systems',
      en: '2025/1 · Necto Systems',
      es: '2025/1 · Necto Systems',
    },
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
    eyebrow: {
      pt: '2022–2024 · Tese ETEC',
      en: '2022–2024 · ETEC Thesis',
      es: '2022–2024 · Tesis ETEC',
    },
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
    eyebrow: {
      pt: '2024 · Agente de IA',
      en: '2024 · AI Agent',
      es: '2024 · Agente de IA',
    },
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
    eyebrow: {
      pt: '2023–2024 · E-commerce mobile',
      en: '2023–2024 · Mobile e-commerce',
      es: '2023–2024 · E-commerce móvil',
    },
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
    eyebrow: {
      pt: '2023 · AWS Lambda',
      en: '2023 · AWS Lambda',
      es: '2023 · AWS Lambda',
    },
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
    eyebrow: {
      pt: '2023–2024 · E-commerce web',
      en: '2023–2024 · Web e-commerce',
      es: '2023–2024 · E-commerce web',
    },
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
