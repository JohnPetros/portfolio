import { zodResolver } from '@hookform/resolvers/zod'
import {
  IconArrowRight,
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  type IconProps,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/common/Reveal'
import { DotHeading, Eyebrow, StatusPill } from '@/components/primitives'
import { CONTACT_CHANNELS } from '@/data/channels'
import { useLocalized } from '@/i18n/useLocalized'
import { cn } from '@/lib/utils'
import { sendContact } from '@/server/contact'
import { type ContactInput, contactSchema } from '@/server/contact.schema'

const CHANNEL_ICONS: Record<string, ComponentType<IconProps>> = {
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandDiscord,
}

type Status = { state: 'idle' } | { state: 'sending' } | { state: 'done'; key: string }

export function Contact() {
  const { t } = useTranslation()
  const localize = useLocalized()
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '', website: '' },
  })

  const messageLen = watch('message')?.length ?? 0

  const onSubmit = handleSubmit(async (values) => {
    setStatus({ state: 'sending' })
    try {
      const res = await sendContact({ data: values })
      if (res.ok) {
        reset()
        setStatus({ state: 'done', key: 'contact.success' })
      } else {
        setStatus({
          state: 'done',
          key: res.reason === 'rate' ? 'contact.errorRate' : 'contact.errorServer',
        })
      }
    } catch {
      setStatus({ state: 'done', key: 'contact.errorNetwork' })
    }
  })

  const counterTone =
    messageLen > 480
      ? 'text-accent font-medium'
      : messageLen >= 400
        ? 'text-accent'
        : 'text-text-faint'

  return (
    <section
      id='contact'
      aria-labelledby='contact-label'
      data-themed
      className='mx-auto max-w-6xl px-section-pad-sm py-section-gap md:px-section-pad'
    >
      <Reveal>
        <Eyebrow bullet>{t('contact.eyebrow')}</Eyebrow>
        <DotHeading id='contact-label' className='mt-4'>
          {t('contact.title')}{' '}
          <span className='font-serif italic text-accent-italic'>
            {t('contact.titleAccent')}
          </span>
        </DotHeading>
        <p className='mt-6 font-sans text-h2 font-medium tracking-tight text-text-primary'>
          {t('contact.closer')}{' '}
          <span className='font-sans text-body text-text-muted'>
            {t('contact.closerNote')}
          </span>
        </p>
        <div className='mt-6 flex flex-wrap gap-3'>
          <StatusPill pulse>{t('contact.statusOpen')}</StatusPill>
          <StatusPill>{t('contact.statusReply')}</StatusPill>
        </div>
      </Reveal>

      <div className='mt-12 grid items-start gap-10 md:grid-cols-2'>
        {/* form */}
        <form
          onSubmit={onSubmit}
          noValidate
          className='relative rounded-md border-l-2 border-accent bg-bg-card p-6 shadow-[var(--shadow-card)]'
        >
          {/* honeypot — must stay empty */}
          <input
            type='text'
            tabIndex={-1}
            autoComplete='off'
            aria-hidden
            className='sr-only'
            {...register('website')}
          />

          <label className='block'>
            <span className='font-sans text-body-sm text-text-secondary'>
              {t('contact.nameLabel')}
            </span>
            <input
              type='text'
              autoComplete='name'
              placeholder={t('contact.namePlaceholder')}
              className='mt-1 w-full border-b-[0.5px] border-border bg-transparent py-2 font-sans text-body text-text-primary outline-none transition-colors focus:border-accent'
              {...register('name')}
            />
            {errors.name && (
              <span className='mt-1 block font-mono text-micro tracking-meta uppercase text-accent'>
                {t('contact.errorName')}
              </span>
            )}
          </label>

          <label className='mt-5 block'>
            <span className='font-sans text-body-sm text-text-secondary'>
              {t('contact.emailLabel')}
            </span>
            <input
              type='email'
              autoComplete='email'
              placeholder={t('contact.emailPlaceholder')}
              className='mt-1 w-full border-b-[0.5px] border-border bg-transparent py-2 font-sans text-body text-text-primary outline-none transition-colors focus:border-accent'
              {...register('email')}
            />
            {errors.email && (
              <span className='mt-1 block font-mono text-micro tracking-meta uppercase text-accent'>
                {t('contact.errorEmail')}
              </span>
            )}
          </label>

          <label className='mt-5 block'>
            <span className='font-sans text-body-sm text-text-secondary'>
              {t('contact.messageLabel')}
            </span>
            <textarea
              rows={4}
              maxLength={500}
              placeholder={t('contact.messagePlaceholder')}
              className='mt-1 w-full resize-none border-b-[0.5px] border-border bg-transparent py-2 font-sans text-body text-text-primary outline-none transition-colors focus:border-accent'
              {...register('message')}
            />
            <div className='mt-1 flex items-center justify-between'>
              {errors.message ? (
                <span className='font-mono text-micro tracking-meta uppercase text-accent'>
                  {messageLen > 500
                    ? t('contact.errorMessageMax')
                    : t('contact.errorMessage')}
                </span>
              ) : (
                <span />
              )}
              <span className={cn('font-mono text-micro tracking-meta', counterTone)}>
                {t('contact.counter', { count: messageLen })}
              </span>
            </div>
          </label>

          <button
            type='submit'
            disabled={status.state === 'sending'}
            className='group mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm bg-accent px-5 font-sans text-body font-medium text-[#0a0a0a] transition-all duration-[var(--dur-micro)] hover:gap-3 hover:brightness-110 disabled:opacity-60 max-sm:w-full'
          >
            {status.state === 'sending' ? t('contact.sending') : t('contact.submit')}
            <IconArrowRight
              size={18}
              stroke={1.5}
              aria-hidden
              className='transition-transform group-hover:translate-x-0.5'
            />
          </button>

          <p
            aria-live='polite'
            className='mt-3 min-h-5 font-mono text-micro tracking-meta uppercase text-text-secondary'
          >
            {status.state === 'done' ? t(status.key) : ''}
          </p>

          <p className='mt-2 font-serif text-body-sm italic text-accent-italic'>
            {t('contact.spamNote')}
          </p>
        </form>

        {/* channels */}
        <div>
          <p className='font-mono text-meta tracking-meta uppercase text-text-muted'>
            {t('contact.channelsTitle')}
          </p>
          <div className='mt-4 grid gap-3'>
            {CONTACT_CHANNELS.map((c) => {
              const Icon = CHANNEL_ICONS[c.icon] ?? IconMail
              const external = !c.href.startsWith('mailto:')
              return (
                <a
                  key={c.id}
                  href={c.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className='group flex items-center gap-4 rounded-md border-l-2 border-transparent bg-bg-card p-4 shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:-translate-y-0.5 hover:border-accent'
                >
                  <Icon
                    size={22}
                    stroke={1.5}
                    aria-hidden
                    className='text-text-secondary group-hover:text-accent'
                  />
                  <span className='flex flex-1 flex-col'>
                    <span className='font-sans text-body text-text-primary'>
                      {c.handle}
                    </span>
                    <span className='font-mono text-micro tracking-meta uppercase text-text-muted'>
                      {localize(c.label)}
                    </span>
                  </span>
                  <IconArrowRight
                    size={16}
                    stroke={1.5}
                    aria-hidden
                    className='text-text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent'
                  />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
