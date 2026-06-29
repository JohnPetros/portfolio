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
