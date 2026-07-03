import type { Lang } from '@/theme/theme'

const FILE: Record<Lang, string> = {
  'pt-BR': 'petros-cv-pt.pdf',
  en: 'petros-cv-en.pdf',
  es: 'petros-cv-es.pdf',
}

// TODO(petros): add 'en' / 'es' once those PDFs exist in /public.
export const CV_AVAILABLE: Lang[] = ['pt-BR']

export function cvFilename(lang: Lang): string {
  return CV_AVAILABLE.includes(lang) ? FILE[lang] : FILE['pt-BR']
}

export function cvHref(lang: Lang): string {
  return `/${cvFilename(lang)}`
}

export function isCvFallback(lang: Lang): boolean {
  return !CV_AVAILABLE.includes(lang)
}
