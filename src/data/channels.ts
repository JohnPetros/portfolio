import type { L } from '@/i18n/useLocalized'

export type Channel = {
  id: string
  icon: string
  platform: string
  color: string
  label: L
  handle: string
  href: string
}

export const CONTACT_CHANNELS: Channel[] = [
  {
    id: 'email',
    icon: 'IconMail',
    platform: 'Email',
    color: '#e04a4a',
    label: { pt: 'mais formal', en: 'more formal', es: 'más formal' },
    handle: 'joaopcarvalho.cds@gmail.com',
    href: 'mailto:joaopcarvalho.cds@gmail.com',
  },
  {
    id: 'linkedin',
    icon: 'IconBrandLinkedin',
    platform: 'LinkedIn',
    color: '#0a66c2',
    label: {
      pt: 'rede profissional',
      en: 'professional network',
      es: 'red profesional',
    },
    handle: 'in/joaopedro-carvalho',
    href: 'https://www.linkedin.com/in/jo%C3%A3o-pedro-carvalho-dos-santos-42a0ab222/',
  },
  {
    id: 'github',
    icon: 'IconBrandGithub',
    platform: 'GitHub',
    color: '#c9d1d9',
    label: {
      pt: 'código aberto',
      en: 'open source',
      es: 'código abierto',
    },
    handle: '@JohnPetros',
    href: 'https://github.com/JohnPetros',
  },
  {
    id: 'discord',
    icon: 'IconBrandDiscord',
    platform: 'Discord',
    color: '#5865f2',
    label: {
      pt: 'papo informal',
      en: 'casual chat',
      es: 'charla informal',
    },
    handle: '@johnpetros',
    href: 'https://discord.com/users/905944456472195123',
  },
]
