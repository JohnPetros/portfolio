import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  type IconProps,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { Brand } from '@/components/primitives'
import { Tooltip } from '@/components/common/Tooltip'
import { CONTACT_CHANNELS } from '@/data/channels'

const FOOTER_META: Record<string, { labelKey: string; Icon: ComponentType<IconProps> }> =
  {
    email: { labelKey: 'footer.socialEmail', Icon: IconMail },
    linkedin: { labelKey: 'footer.socialLinkedin', Icon: IconBrandLinkedin },
    github: { labelKey: 'footer.socialGithub', Icon: IconBrandGithub },
    discord: { labelKey: 'footer.socialDiscord', Icon: IconBrandDiscord },
  }

// Hrefs come from CONTACT_CHANNELS so the footer and Contact never drift apart.
const SOCIALS = CONTACT_CHANNELS.filter((c) => c.id in FOOTER_META).map((c) => ({
  id: c.id,
  href: c.href,
  ...FOOTER_META[c.id],
}))

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer
      data-themed
      className='mx-auto max-w-6xl px-section-pad-sm py-section-gap md:px-section-pad'
    >
      <div className='flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:justify-between md:text-left'>
        <div>
          <Brand withMascot size='text-h3' className='justify-center md:justify-start' />
          <p className='mt-3 font-mono text-meta tracking-meta uppercase text-text-muted'>
            {t('footer.tagline')}
          </p>
          <p className='mt-1 font-serif text-body italic text-accent-italic'>
            {t('footer.signature')}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {SOCIALS.map(({ id, labelKey, href, Icon }) => (
            <Tooltip key={id} label={t(labelKey)}>
              <a
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel='noopener noreferrer'
                aria-label={t(labelKey)}
                className='flex size-10 items-center justify-center rounded-md border-[0.5px] border-border bg-bg-card text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent'
              >
                <Icon size={18} stroke={1.5} aria-hidden />
              </a>
            </Tooltip>
          ))}
        </div>
      </div>

      <hr className='my-6' />

      <p className='text-center font-mono text-meta tracking-meta uppercase text-text-faint'>
        {t('footer.madeWith')} <span className='text-accent'>♥</span> &{' '}
        <span className='[filter:saturate(0.7)]'>🐼</span>
      </p>
    </footer>
  )
}
