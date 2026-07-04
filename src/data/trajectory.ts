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
      pt: 'Construindo **plataformas SaaS** para clientes corporativos. Stack **Next.js** + **FastAPI** + **PostgreSQL**, com foco em *DX limpa* e deploy contínuo.',
      en: 'Building **SaaS platforms** for enterprise clients. Stack: **Next.js** + **FastAPI** + **PostgreSQL**, focused on *clean DX* and continuous deployment.',
      es: 'Construyendo **plataformas SaaS** para clientes corporativos. Stack **Next.js** + **FastAPI** + **PostgreSQL**, con foco en *DX limpia* y deploy continuo.',
    },
    techs: ['typescript', 'nextjs', 'fastapi', 'postgresql', 'aws'],
  },
  {
    id: 'design-liquido',
    type: 'professional',
    period: { start: '2025', end: '05/2026' },
    org: { pt: 'Design Líquido', en: 'Design Líquido', es: 'Design Líquido' },
    role: {
      pt: 'Contribuidor — Linguagem Delégua',
      en: 'Contributor — Delégua Language',
      es: 'Contribuidor — Lenguaje Delégua',
    },
    description: {
      pt: 'Contribuição direta para **Delégua**, linguagem de programação *100% em português* baseada em TypeScript. Base técnica do TCC **StarDust**.',
      en: 'Direct contributions to **Delégua**, a *100% Portuguese* programming language built on TypeScript. Technical foundation of the **StarDust** thesis.',
      es: 'Contribución directa a **Delégua**, lenguaje de programación *100% en portugués* basado en TypeScript. Base técnica de la tesis **StarDust**.',
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
    org: {
      pt: 'FATEC São José dos Campos',
      en: 'FATEC São José dos Campos',
      es: 'FATEC São José dos Campos',
    },
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
    org: {
      pt: 'Extensão Acadêmica',
      en: 'Academic Extension',
      es: 'Extensión Académica',
    },
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
    org: {
      pt: 'ETEC São José dos Campos',
      en: 'ETEC São José dos Campos',
      es: 'ETEC São José dos Campos',
    },
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
