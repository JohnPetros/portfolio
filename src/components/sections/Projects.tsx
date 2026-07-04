import { Tabs } from 'radix-ui'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Reveal } from '@/components/common/Reveal'
import { BambooIndicator, DotHeading, Eyebrow } from '@/components/primitives'
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
        <p className='mt-4 max-w-2xl font-sans text-body leading-body text-text-secondary'>
          <Trans
            i18nKey='projects.subtitle'
            components={{ b: <strong className='font-semibold text-text-primary' /> }}
          />
        </p>
      </Reveal>

      <Tabs.Root
        value={tab}
        onValueChange={(v) => setTab(v as ProjectKind)}
        className='mt-10'
      >
        <Tabs.List
          aria-label={t('projects.eyebrow')}
          className='flex gap-8 overflow-x-auto'
        >
          {TABS.map((tabDef) => {
            const isActive = tab === tabDef.kind
            const count = projectsByKind(tabDef.kind).length
            return (
              <Tabs.Trigger
                key={tabDef.kind}
                value={tabDef.kind}
                className={cn(
                  'relative inline-flex min-h-11 flex-col items-center justify-center gap-1 font-mono text-meta tracking-meta uppercase transition-colors duration-[var(--dur-micro)]',
                  isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-primary',
                )}
              >
                <span className='inline-flex items-baseline gap-2'>
                  {t(tabDef.key)}
                  <span
                    className={cn(
                      'font-semibold',
                      isActive ? 'text-accent' : 'text-text-faint',
                    )}
                  >
                    {count}
                  </span>
                </span>
                <BambooIndicator active={isActive} className='h-1.5' />
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>

        {TABS.map((tabDef) => (
          <Tabs.Content
            key={tabDef.kind}
            value={tabDef.kind}
            className='mt-10 focus:outline-none'
          >
            <div className='grid gap-5 md:grid-cols-2'>
              {projectsByKind(tabDef.kind).map((project, i) => (
                <Reveal
                  key={project.id}
                  animation='animate-petros-rise'
                  delay={Math.min(i, 3) * 90}
                  className='h-full'
                >
                  <ProjectCard
                    project={project}
                    onOpen={() => openProject(project)}
                  />
                </Reveal>
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
