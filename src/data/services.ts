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
    title: {
      pt: 'APIs & Integrações',
      en: 'APIs & Integrations',
      es: 'APIs e Integraciones',
    },
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
