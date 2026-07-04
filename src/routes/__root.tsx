import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '@/i18n/config'
import appCss from '../styles.css?url'
import { THEME_BOOTSTRAP, ThemeProvider } from '@/theme/ThemeProvider'
import { DEFAULTS, parseStored, resolveInitial } from '@/theme/theme'

const SITE_URL = 'https://petros.dev'

// Panda emoji as an inline SVG favicon (no image asset needed).
const PANDA_FAVICON =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐼</text></svg>',
  )

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Petros. — Full Stack Developer' },
      {
        name: 'description',
        content:
          'Portfólio de João Pedro Carvalho dos Santos (Petros) — desenvolvedor full stack.',
      },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: PANDA_FAVICON },
      { rel: 'stylesheet', href: appCss },
      { rel: 'alternate', hrefLang: 'pt-BR', href: SITE_URL },
      { rel: 'alternate', hrefLang: 'en', href: `${SITE_URL}/?lang=en` },
      { rel: 'alternate', hrefLang: 'es', href: `${SITE_URL}/?lang=es` },
      { rel: 'alternate', hrefLang: 'x-default', href: SITE_URL },
    ],
  }),
  notFoundComponent: () => (
    <main className='mx-auto max-w-md p-6 pt-16'>
      <h1 className='text-h2'>404</h1>
      <p className='text-text-secondary'>Página não encontrada.</p>
    </main>
  ),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  // SSR uses DEFAULTS; client reconciles from localStorage before paint via the
  // bootstrap script + the provider effect.
  const initial =
    typeof document === 'undefined'
      ? DEFAULTS
      : resolveInitial(
          parseStored(localStorage.getItem('petros-theme')),
          window.matchMedia('(prefers-color-scheme: dark)').matches,
        )
  return (
    <ThemeProvider initial={initial}>
      <Outlet />
    </ThemeProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR' data-mode='dark' data-scheme='bambuzal'>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: pre-paint theme bootstrap */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
        />
        <Scripts />
      </body>
    </html>
  )
}
