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
