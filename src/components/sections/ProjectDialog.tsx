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
import type { L } from '@/i18n/useLocalized'
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

function SkillChips({ skills }: { skills: { icon: string; label: L }[] }) {
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
          className='fixed inset-0 z-40 bg-[var(--dialog-overlay)] backdrop-blur-[8px]'
        />
        <Dialog.Content
          data-petros-dialog
          data-themed
          className='fixed inset-0 z-50 mx-auto flex h-full w-full max-w-4xl flex-col overflow-y-auto bg-bg-card focus:outline-none'
        >
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

            <SectionHeading>{t('projects.detailAbout')}</SectionHeading>
            <p className='mt-3 font-sans text-body leading-body text-text-secondary'>
              <RichText>{localize(project.detail.about)}</RichText>
            </p>

            <SectionHeading>{t('projects.detailFeatures')}</SectionHeading>
            <ul className='mt-3 flex flex-col gap-2'>
              {project.detail.features.map((f) => (
                <li
                  key={localize(f)}
                  className='flex gap-2 font-sans text-body leading-body text-text-secondary'
                >
                  <span
                    aria-hidden
                    className='mt-2 size-1.5 shrink-0 rounded-pill bg-accent'
                  />
                  <RichText>{localize(f)}</RichText>
                </li>
              ))}
            </ul>

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

            <SectionHeading>{t('projects.detailContributions')}</SectionHeading>
            <ul className='mt-3 flex flex-col gap-2'>
              {project.detail.contributions.map((c) => (
                <li
                  key={localize(c)}
                  className='flex gap-2 font-sans text-body leading-body text-text-secondary'
                >
                  <span
                    aria-hidden
                    className='mt-2 size-1.5 shrink-0 rounded-pill bg-accent'
                  />
                  <RichText>{localize(c)}</RichText>
                </li>
              ))}
            </ul>

            <SectionHeading>{t('projects.detailLessons')}</SectionHeading>
            <ul className='mt-3 flex flex-col gap-2'>
              {project.detail.lessons.map((l) => (
                <li
                  key={localize(l)}
                  className='flex gap-2 font-sans text-body leading-body text-text-secondary'
                >
                  <span
                    aria-hidden
                    className='mt-2 size-1.5 shrink-0 rounded-pill bg-accent'
                  />
                  <RichText>{localize(l)}</RichText>
                </li>
              ))}
            </ul>

            <SectionHeading>{t('projects.detailHardSkills')}</SectionHeading>
            <SkillChips skills={project.detail.hardSkills} />

            <SectionHeading>{t('projects.detailSoftSkills')}</SectionHeading>
            <SkillChips skills={project.detail.softSkills} />
          </div>

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
