import type { Lang } from '@/theme/theme'

type Copy = {
  title: string
  intro: string
  workLead: string
  workLine: string
  sourceLead: string
  sourceUrl: string
  linkedinLead: string
  linkedinUrl: string
  farewell: string
}

const COPY: Record<Lang, Copy> = {
  'pt-BR': {
    title: '🐼  Ei, dev — bem-vindo ao meu terminal',
    intro: 'Você é do tipo que abre o DevTools nos sites dos outros. Respeito.',
    workLead: '💼  Bora trabalhar junto? Ou só puxar um papo técnico?',
    workLine: 'joaopcarvalho.cds@gmail.com',
    sourceLead: '📦  Código-fonte deste site:',
    sourceUrl: 'https://github.com/JohnPetros/portfolio',
    linkedinLead: '🔗  LinkedIn:',
    linkedinUrl:
      'https://www.linkedin.com/in/joão-pedro-carvalho-dos-santos-42a0ab222/',
    farewell: 'Menos hype, mais deploy.  🚀',
  },
  en: {
    title: '🐼  Hey, dev — welcome to my terminal',
    intro: 'You’re the kind who cracks open DevTools on other sites. Respect.',
    workLead: '💼  Wanna work together? Or just a tech chat?',
    workLine: 'joaopcarvalho.cds@gmail.com',
    sourceLead: '📦  Source code of this site:',
    sourceUrl: 'https://github.com/JohnPetros/portfolio',
    linkedinLead: '🔗  LinkedIn:',
    linkedinUrl:
      'https://www.linkedin.com/in/joão-pedro-carvalho-dos-santos-42a0ab222/',
    farewell: 'Less hype, more deploy.  🚀',
  },
  es: {
    title: '🐼  Hey, dev — bienvenido a mi terminal',
    intro: 'Eres del tipo que abre DevTools en sitios ajenos. Respeto.',
    workLead: '💼  ¿Trabajamos juntos? ¿O solo una charla técnica?',
    workLine: 'joaopcarvalho.cds@gmail.com',
    sourceLead: '📦  Código-fuente de este sitio:',
    sourceUrl: 'https://github.com/JohnPetros/portfolio',
    linkedinLead: '🔗  LinkedIn:',
    linkedinUrl:
      'https://www.linkedin.com/in/joão-pedro-carvalho-dos-santos-42a0ab222/',
    farewell: 'Menos hype, más deploy.  🚀',
  },
}

// Fixed-width so the ASCII rule always looks tidy regardless of the copy.
const RULE = '━'.repeat(56)
const INDENT = '   '

function resolveLang(input: string): Lang {
  if (input.startsWith('en')) return 'en'
  if (input.startsWith('es')) return 'es'
  return 'pt-BR'
}

// Module-level guard so React 19 StrictMode's double-mount in dev doesn't
// double-log the greeting.
let greeted = false

// Dev: plain text, keeps the TanStack Devtools log panel readable (it doesn't
// render %c format specifiers). Prod: styled with %c because only the real
// browser DevTools console sees the log, and it renders styles nicely.
function logPlain(c: (typeof COPY)['pt-BR']) {
  const banner = [
    '',
    RULE,
    c.title,
    RULE,
    '',
    c.intro,
    '',
    c.workLead,
    INDENT + c.workLine,
    '',
    c.sourceLead,
    INDENT + c.sourceUrl,
    '',
    c.linkedinLead,
    INDENT + c.linkedinUrl,
    '',
    c.farewell,
    '',
  ].join('\n')
  /* biome-ignore lint/suspicious/noConsole: intentional easter-egg greeting */
  console.log(banner)
}

const TITLE_STYLE =
  'color:#7fbf5a;font-size:22px;font-weight:700;padding:6px 0;letter-spacing:-0.01em'
const INTRO_STYLE = 'color:#e5e5e5;font-size:14px;padding:2px 0 6px'
const LEAD_STYLE = 'color:#e5e5e5;font-size:13px;font-weight:600'
const DIM_STYLE = 'color:#9a9a9a;font-size:12px'
const FAREWELL_STYLE =
  'color:#7fbf5a;font-size:13px;font-style:italic;padding:6px 0 4px'

function logStyled(c: (typeof COPY)['pt-BR']) {
  /* biome-ignore-start lint/suspicious/noConsole: intentional easter-egg greeting */
  console.log(`%c${c.title}`, TITLE_STYLE)
  console.log(`%c${c.intro}`, INTRO_STYLE)
  console.log(`%c${c.workLead}`, LEAD_STYLE)
  console.log(`%c${INDENT}${c.workLine}`, DIM_STYLE)
  console.log(`%c${c.sourceLead}`, LEAD_STYLE)
  console.log(INDENT + c.sourceUrl)
  console.log(`%c${c.linkedinLead}`, LEAD_STYLE)
  console.log(INDENT + c.linkedinUrl)
  console.log(`%c${c.farewell}`, FAREWELL_STYLE)
  /* biome-ignore-end lint/suspicious/noConsole: intentional easter-egg greeting */
}

export function logConsoleGreeting(lang: string) {
  if (typeof window === 'undefined' || greeted) return
  greeted = true

  const c = COPY[resolveLang(lang)]
  if (import.meta.env.PROD) {
    logStyled(c)
  } else {
    logPlain(c)
  }
}
