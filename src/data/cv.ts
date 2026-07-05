import type { Lang } from '@/theme/theme'

const FILE: Record<Lang, string> = {
  'pt-BR': 'petros-cv-ptbr.pdf',
  en: 'petros-cv-en.pdf',
  es: 'petros-cv-es.pdf',
}

export const CV_AVAILABLE: Lang[] = ['pt-BR', 'en', 'es']

export function cvFilename(lang: Lang): string {
  return CV_AVAILABLE.includes(lang) ? FILE[lang] : FILE['pt-BR']
}

export function cvHref(lang: Lang): string {
  return `/pdfs/${cvFilename(lang)}`
}

export function isCvFallback(lang: Lang): boolean {
  return !CV_AVAILABLE.includes(lang)
}
