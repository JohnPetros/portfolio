import {
  IconArrowUpRight,
  IconBrandGithub,
  IconExternalLink,
} from '@tabler/icons-react'
import { Popover } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { Eyebrow, Tag } from '@/components/primitives'
import type { Project } from '@/data/projects'
import { getTech } from '@/data/stack'
import { useCarousel } from '@/hooks/useCarousel'
import { useLocalized } from '@/i18n/useLocalized'

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
  const { index } = useCarousel(project.gallery.length, { intervalMs: 2500 })
  const currentSrc = project.gallery[index] ?? project.cover

  return (
    <div
      data-themed
      className='group relative flex h-full flex-col overflow-hidden rounded-lg border-[0.5px] border-border bg-bg-card shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:-translate-y-0.5 hover:border-accent-tint-20'
    >
      {/* full-bleed cover */}
      <div className='relative aspect-video w-full overflow-hidden bg-bg-elevated'>
        {isMobile ? (
          <>
            <img
              key={`bg-${currentSrc}`}
              src={currentSrc}
              alt=''
              aria-hidden
              className='absolute inset-0 size-full scale-125 object-cover opacity-40 blur-2xl'
            />
            <img
              key={currentSrc}
              src={currentSrc}
              alt={localize(project.tagline)}
              loading='lazy'
              className='relative mx-auto h-full w-auto object-contain motion-safe:animate-[petros-fade_400ms_ease-out]'
            />
          </>
        ) : (
          <img
            key={currentSrc}
            src={currentSrc}
            alt={localize(project.tagline)}
            loading='lazy'
            className='size-full object-cover motion-safe:animate-[petros-fade_400ms_ease-out]'
          />
        )}
        {isMobile && (
          <span className='absolute left-3 top-3 rounded-pill bg-bg-elevated/90 px-2 py-0.5 font-mono text-micro tracking-meta uppercase text-text-muted backdrop-blur-sm'>
            {t('projects.mobileLabel')}
          </span>
        )}
        <button
          type='button'
          onClick={onOpen}
          className='absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-pill border-[0.5px] border-border bg-bg-elevated/85 px-3 py-1.5 font-mono text-micro tracking-meta uppercase text-text-primary shadow-[var(--shadow-card)] backdrop-blur-sm transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent'
        >
          {t('projects.viewDetails')}
          <IconArrowUpRight size={14} stroke={1.75} aria-hidden />
        </button>
      </div>

      {/* content */}
      <div className='flex flex-1 flex-col gap-3 p-6'>
        <Eyebrow>{localize(project.eyebrow)}</Eyebrow>

        <h3 className='font-sans text-title font-medium tracking-tight text-text-primary'>
          {project.title}
          <span
            aria-hidden
            className='text-accent drop-shadow-[0_0_5px_var(--accent-glow)]'
          >
            .
          </span>
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

        {(project.links?.code || project.links?.live) && (
          <div className='mt-auto flex items-center gap-2 border-t-[0.5px] border-border pt-4'>
            {project.links?.code && (
              <a
                href={project.links.code}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex h-10 items-center gap-2 rounded-md border-[0.5px] border-border bg-bg-card px-3.5 font-sans text-body-sm text-text-secondary transition-all duration-[var(--dur-micro)] hover:-translate-y-px hover:border-accent-tint-20 hover:bg-bg-elevated hover:text-text-primary'
              >
                <IconBrandGithub size={16} stroke={1.6} aria-hidden className='text-text-muted' />
                {t('projects.code')}
              </a>
            )}
            {project.links?.live && (
              <a
                href={project.links.live}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex h-10 items-center gap-2 rounded-md border-[0.5px] border-accent-tint-20 bg-accent-tint-12 px-3.5 font-sans text-body-sm font-medium text-text-primary transition-all duration-[var(--dur-micro)] hover:-translate-y-px hover:border-accent hover:text-accent'
              >
                <IconExternalLink size={16} stroke={1.6} aria-hidden className='text-accent' />
                {t('projects.live')}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
