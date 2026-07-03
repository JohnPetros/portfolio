import type { L } from '@/i18n/useLocalized'

export type Channel = {
  id: string
  icon: string
  label: L
  handle: string
  href: string
}

// TODO(petros): replace '#' hrefs with real profile URLs before launch.
export const CONTACT_CHANNELS: Channel[] = [
  {
    id: 'email',
    icon: 'IconMail',
    label: { pt: 'mais formal', en: 'more formal', es: 'más formal' },
    handle: 'joaopcarvalho.cds@gmail.com',
    href: 'mailto:joaopcarvalho.cds@gmail.com',
  },
  {
    id: 'linkedin',
    icon: 'IconBrandLinkedin',
    label: {
      pt: 'rede profissional',
      en: 'professional network',
      es: 'red profesional',
    },
    handle: 'in/joaopedro-carvalho',
    href: '#',
  },
  {
    id: 'github',
    icon: 'IconBrandGithub',
    label: { pt: 'open source', en: 'open source', es: 'open source' },
    handle: '@JohnPetros',
    href: '#',
  },
  {
    id: 'discord',
    icon: 'IconBrandDiscord',
    label: { pt: 'papo casual', en: 'casual chat', es: 'charla casual' },
    handle: '@johnpetros',
    href: '#',
  },
]
