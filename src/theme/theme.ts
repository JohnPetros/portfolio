export type Mode = 'dark' | 'light'
export type Scheme = 'bambuzal' | 'sakura' | 'glaciar' | 'crepusculo' | 'pelagem'
export type Lang = 'pt-BR' | 'en' | 'es'
export type ThemeState = { mode: Mode; scheme: Scheme; lang: Lang }

export const MODES: Mode[] = ['dark', 'light']
export const SCHEMES: Scheme[] = [
  'bambuzal',
  'sakura',
  'glaciar',
  'crepusculo',
  'pelagem',
]
export const LANGS: Lang[] = ['pt-BR', 'en', 'es']

export const STORAGE_KEY = 'petros-theme'
export const DEFAULTS: ThemeState = { mode: 'dark', scheme: 'bambuzal', lang: 'pt-BR' }

export function parseStored(raw: string | null): Partial<ThemeState> {
  if (!raw) return {}
  let obj: unknown
  try {
    obj = JSON.parse(raw)
  } catch {
    return {}
  }
  if (typeof obj !== 'object' || obj === null) return {}
  const o = obj as Record<string, unknown>
  const out: Partial<ThemeState> = {}
  if (o.mode === 'dark' || o.mode === 'light') out.mode = o.mode
  if (SCHEMES.includes(o.scheme as Scheme)) out.scheme = o.scheme as Scheme
  if (LANGS.includes(o.lang as Lang)) out.lang = o.lang as Lang
  return out
}

export function resolveInitial(
  stored: Partial<ThemeState>,
  prefersDark: boolean,
): ThemeState {
  return {
    mode: stored.mode ?? (prefersDark ? 'dark' : 'light'),
    scheme: stored.scheme ?? DEFAULTS.scheme,
    lang: stored.lang ?? DEFAULTS.lang,
  }
}

export function serialize(state: ThemeState): string {
  return JSON.stringify(state)
}
