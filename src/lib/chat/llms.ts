import { BIO } from '@/data/bio'
import { CONTACT_CHANNELS } from '@/data/channels'
import { PROJECTS, type Project } from '@/data/projects'
import { SERVICES } from '@/data/services'
import { getTech, groupByCategory, TECHS } from '@/data/stack'
import { TRAJECTORY, type TrajectoryEntry } from '@/data/trajectory'
import { type L, localize } from '@/i18n/useLocalized'
import type { Lang } from '@/theme/theme'

const SITE_URL = 'https://john-petros.com'

const HEADINGS = {
  summary: {
    pt: 'Desenvolvedor full stack de São José dos Campos, Brasil. Este arquivo resume o portfólio para assistentes de IA.',
    en: 'Full stack developer from São José dos Campos, Brazil. This file summarizes the portfolio for AI assistants.',
    es: 'Desarrollador full stack de São José dos Campos, Brasil. Este archivo resume el portafolio para asistentes de IA.',
  },
  about: { pt: 'Sobre', en: 'About', es: 'Sobre' },
  trajectory: { pt: 'Trajetória', en: 'Trajectory', es: 'Trayectoria' },
  stack: { pt: 'Stack', en: 'Stack', es: 'Stack' },
  services: { pt: 'Serviços', en: 'Services', es: 'Servicios' },
  academic: {
    pt: 'Projetos acadêmicos',
    en: 'Academic projects',
    es: 'Proyectos académicos',
  },
  professional: {
    pt: 'Projetos profissionais',
    en: 'Professional projects',
    es: 'Proyectos profesionales',
  },
  contact: { pt: 'Contato', en: 'Contact', es: 'Contacto' },
  technologies: { pt: 'Tecnologias', en: 'Technologies', es: 'Tecnologías' },
  contribution: {
    pt: 'Contribuição de Petros',
    en: 'Petros’s contribution',
    es: 'Contribución de Petros',
  },
  code: { pt: 'Código', en: 'Code', es: 'Código' },
  live: { pt: 'Online', en: 'Live', es: 'En línea' },
  present: { pt: 'atual', en: 'present', es: 'actual' },
} satisfies Record<string, L>

function plain(text: string): string {
  return text.replace(/\*+/g, '').replace(/\s+/g, ' ').trim()
}

function techNames(ids: string[]): string {
  return ids.map((id) => getTech(id)?.name ?? id).join(', ')
}

export function buildLlmsTxt(lang: Lang): string {
  const label = (key: keyof typeof HEADINGS) => localize(HEADINGS[key], lang)
  const text = (field: L) => plain(localize(field, lang))

  const trajectoryLine = (entry: TrajectoryEntry) => {
    const end = entry.period.end === 'present' ? label('present') : entry.period.end
    return `- ${text(entry.org)} — ${text(entry.role)} (${entry.period.start} – ${end}): ${text(entry.description)}`
  }

  const projectBlock = (project: Project) => {
    const links = [
      project.links?.code && `${label('code')}: ${project.links.code}`,
      project.links?.live && `${label('live')}: ${project.links.live}`,
    ].filter(Boolean)
    return [
      `### ${project.title} (${text(project.eyebrow)})`,
      text(project.detail.about),
      `${label('contribution')}: ${project.detail.contributions.map(text).join(' ')}`,
      `${label('technologies')}: ${techNames(project.techs)}.`,
      ...links,
    ].join('\n')
  }

  const projects = (kind: Project['kind']) =>
    PROJECTS.filter((p) => p.kind === kind)
      .sort((a, b) => a.order - b.order)
      .map(projectBlock)

  return [
    '# João Pedro Carvalho dos Santos (Petros)',
    `> ${label('summary')} ${SITE_URL}`,
    `## ${label('about')}`,
    BIO.milestones.map((m) => `- ${text(m.title)}: ${text(m.body)}`).join('\n'),
    `## ${label('trajectory')}`,
    TRAJECTORY.map(trajectoryLine).join('\n'),
    `## ${label('stack')}`,
    groupByCategory(TECHS)
      .map((g) => `- ${g.category}: ${g.techs.map((t) => t.name).join(', ')}`)
      .join('\n'),
    `## ${label('services')}`,
    SERVICES.map((s) => `- ${text(s.title)}: ${text(s.description)}`).join('\n'),
    `## ${label('professional')}`,
    ...projects('professional'),
    `## ${label('academic')}`,
    ...projects('academic'),
    `## ${label('contact')}`,
    CONTACT_CHANNELS.map((c) => `- ${c.platform}: ${c.href.replace('mailto:', '')}`).join(
      '\n',
    ),
  ].join('\n\n')
}
