import { createFileRoute } from '@tanstack/react-router'
import { buildLlmsTxt } from '@/lib/chat/llms'
import { parseLang } from '@/lib/chat/systemPrompt'

// The site summary AI assistants read, also the context of the on-site chat.
export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const lang = parseLang(new URL(request.url).searchParams.get('lang'))
        return new Response(buildLlmsTxt(lang), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
      },
    },
  },
})
