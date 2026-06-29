import { useTranslation } from 'react-i18next'
import type { Lang } from '@/theme/theme'

export type L<T = string> = { pt: T; en: T; es: T }

export function localize<T>(field: L<T>, lang: Lang): T {
  if (lang === 'en') return field.en
  if (lang === 'es') return field.es
  return field.pt
}

export function useLocalized() {
  const { i18n } = useTranslation()
  return <T>(field: L<T>): T => localize(field, i18n.language as Lang)
}
