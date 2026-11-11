import type { Lang } from '@/theme/theme'

type Availability = 'unavailable' | 'downloadable' | 'downloading' | 'available'
type LanguageOptions = {
  expectedInputs: { type: 'text'; languages: string[] }[]
  expectedOutputs: { type: 'text'; languages: string[] }[]
}
type Monitor = {
  addEventListener: (
    type: 'downloadprogress',
    cb: (e: { loaded: number }) => void,
  ) => void
}
export type ChatSession = {
  promptStreaming: (
    text: string,
    options: { signal: AbortSignal },
  ) => AsyncIterable<string>
  destroy: () => void
}
type LanguageModelApi = {
  availability: (options: LanguageOptions) => Promise<Availability>
  create: (
    options: LanguageOptions & {
      initialPrompts: { role: 'system' | 'user' | 'assistant'; content: string }[]
      monitor: (monitor: Monitor) => void
    },
  ) => Promise<ChatSession>
}

export type ModelState = 'unsupported' | 'needs-download' | 'ready'

function api(): LanguageModelApi | null {
  return (self as unknown as { LanguageModel?: LanguageModelApi }).LanguageModel ?? null
}

function languageOptions(language: string): LanguageOptions {
  return {
    expectedInputs: [{ type: 'text', languages: [language] }],
    expectedOutputs: [{ type: 'text', languages: [language] }],
  }
}

/**
 * Chrome doesn't officially list Portuguese yet. English is declared as the
 * fallback; the system prompt still tells the model which language to answer in.
 */
async function findLanguage(model: LanguageModelApi, lang: Lang) {
  const candidates = [lang === 'pt-BR' ? 'pt' : lang, 'en']
  for (const language of candidates) {
    try {
      const availability = await model.availability(languageOptions(language))
      if (availability !== 'unavailable') return { language, availability }
    } catch {
      // Chrome rejects language tags it doesn't know; try the next one.
    }
  }
  return null
}

export async function checkModel(lang: Lang): Promise<ModelState> {
  const model = api()
  if (!model) return 'unsupported'
  const found = await findLanguage(model, lang)
  if (!found) return 'unsupported'
  return found.availability === 'available' ? 'ready' : 'needs-download'
}

export async function createSession({
  lang,
  systemPrompt,
  context,
  onProgress,
}: {
  lang: Lang
  systemPrompt: string
  context: string
  onProgress: (fraction: number) => void
}): Promise<ChatSession> {
  const model = api()
  const found = model && (await findLanguage(model, lang))
  if (!model || !found) throw new Error('The Prompt API is not available')
  return model.create({
    ...languageOptions(found.language),
    initialPrompts: [
      { role: 'system', content: `${systemPrompt}\n\nPORTFOLIO DOCUMENT:\n${context}` },
    ],
    monitor: (monitor) => {
      monitor.addEventListener('downloadprogress', (event) => onProgress(event.loaded))
    },
  })
}
