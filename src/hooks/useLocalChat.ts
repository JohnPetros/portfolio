import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type ChatSession, checkModel, createSession } from '@/lib/chat/promptService'
import { buildSystemPrompt } from '@/lib/chat/systemPrompt'
import type { Lang } from '@/theme/theme'

export type ChatEntry = { id: number; role: 'user' | 'assistant'; text: string }
export type ChatStatus =
  | 'idle'
  | 'unsupported'
  | 'consent'
  | 'loading'
  | 'ready'
  | 'error'

export function useLocalChat() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Lang
  const [status, setStatus] = useState<ChatStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [entries, setEntries] = useState<ChatEntry[]>([])
  const [generating, setGenerating] = useState(false)
  const sessionRef = useRef<Promise<ChatSession> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const nextIdRef = useRef(0)

  // The session holds the portfolio in one language, so a switch starts over.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only when lang changes
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      sessionRef.current?.then(
        (session) => session.destroy(),
        () => {},
      )
      sessionRef.current = null
      setStatus('idle')
      setEntries([])
    }
  }, [lang])

  const openSession = useCallback(() => {
    const load = async () => {
      const response = await fetch(`/llms.txt?lang=${encodeURIComponent(lang)}`)
      if (!response.ok) throw new Error(`llms.txt responded ${response.status}`)
      return createSession({
        lang,
        systemPrompt: buildSystemPrompt(lang, t('chat.noInfo')),
        context: await response.text(),
        onProgress: setProgress,
      })
    }
    const pending = load()
    sessionRef.current = pending
    return pending
  }, [lang, t])

  const failToLoad = useCallback((error: unknown) => {
    console.error('Chat model failed to load', error)
    setStatus('error')
  }, [])

  /** Used for downloads and retries, which show their progress. */
  const start = useCallback(async () => {
    setStatus('loading')
    setProgress(0)
    try {
      await openSession()
      setStatus('ready')
    } catch (error) {
      failToLoad(error)
    }
  }, [failToLoad, openSession])

  /** Runs when the panel opens: nothing is checked or loaded before that. */
  const prepare = useCallback(async () => {
    if (status !== 'idle') return
    const state = await checkModel(lang).catch(() => 'unsupported' as const)
    if (state === 'unsupported') setStatus('unsupported')
    else if (state === 'needs-download') setStatus('consent')
    else {
      // The model is already installed, so the chat opens while it warms up.
      setStatus('ready')
      openSession().catch(failToLoad)
    }
  }, [failToLoad, lang, openSession, status])

  const updateAnswer = useCallback((id: number, text: string) => {
    setEntries((all) => all.map((e) => (e.id === id ? { ...e, text } : e)))
  }, [])

  const send = useCallback(
    async (rawQuestion: string) => {
      const question = rawQuestion.trim()
      const pendingSession = sessionRef.current
      if (!question || !pendingSession || generating) return

      const answerId = nextIdRef.current + 1
      nextIdRef.current += 2
      setEntries((all) => [
        ...all,
        { id: answerId - 1, role: 'user', text: question },
        { id: answerId, role: 'assistant', text: '' },
      ])

      const controller = new AbortController()
      abortRef.current = controller
      setGenerating(true)
      let answer = ''
      try {
        const session = await pendingSession
        controller.signal.throwIfAborted()
        const stream = session.promptStreaming(question, { signal: controller.signal })
        for await (const chunk of stream) {
          if (!chunk) continue
          answer += chunk
          updateAnswer(answerId, answer)
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          if (!answer) updateAnswer(answerId, t('chat.stopped'))
        } else {
          console.error('Chat model failed to answer', error)
          updateAnswer(answerId, t('chat.errorGenerate'))
        }
      } finally {
        abortRef.current = null
        setGenerating(false)
      }
    },
    [generating, t, updateAnswer],
  )

  const stop = useCallback(() => abortRef.current?.abort(), [])

  return { status, progress, entries, generating, prepare, start, send, stop }
}
