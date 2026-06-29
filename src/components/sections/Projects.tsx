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
