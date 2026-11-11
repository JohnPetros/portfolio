import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLocalChat } from './useLocalChat'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'pt-BR' } }),
}))

type Availability = 'unavailable' | 'downloadable' | 'available'

function fakeModel(availability: (language: string) => Availability) {
  const session = {
    promptStreaming: vi.fn(),
    destroy: vi.fn(),
  }
  const model = {
    availability: vi.fn(async (o: { expectedInputs: { languages: string[] }[] }) =>
      availability(o.expectedInputs[0].languages[0]),
    ),
    create: vi.fn(async () => session),
  }
  vi.stubGlobal('LanguageModel', model)
  return { model, session }
}

async function* chunks(...parts: string[]) {
  yield* parts
}

async function readyChat() {
  const fake = fakeModel(() => 'available')
  const view = renderHook(() => useLocalChat())
  await act(() => view.result.current.prepare())
  await waitFor(() => expect(fake.model.create).toHaveBeenCalled())
  return { ...fake, view }
}

const last = (view: { result: { current: ReturnType<typeof useLocalChat> } }) =>
  view.result.current.entries.at(-1)?.text

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response('# Petros doc')),
  )
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('useLocalChat', () => {
  it('reports unsupported browsers', async () => {
    const { result } = renderHook(() => useLocalChat())
    await act(() => result.current.prepare())
    expect(result.current.status).toBe('unsupported')
  })

  it('asks before downloading, and only then creates the session', async () => {
    const { model } = fakeModel(() => 'downloadable')
    const { result } = renderHook(() => useLocalChat())
    await act(() => result.current.prepare())
    expect(result.current.status).toBe('consent')
    expect(model.create).not.toHaveBeenCalled()

    await act(() => result.current.start())
    expect(model.create).toHaveBeenCalledOnce()
    expect(result.current.status).toBe('ready')
  })

  it('falls back to declaring English when Portuguese is rejected', async () => {
    const { model } = fakeModel((language) =>
      language === 'pt' ? 'unavailable' : 'available',
    )
    const { result } = renderHook(() => useLocalChat())
    await act(() => result.current.prepare())
    expect(result.current.status).toBe('ready')
    await waitFor(() =>
      expect(model.create).toHaveBeenCalledWith(
        expect.objectContaining({
          expectedOutputs: [{ type: 'text', languages: ['en'] }],
        }),
      ),
    )
  })

  it('opens the chat at once when the model is installed, and queues early questions', async () => {
    const { model, session } = fakeModel(() => 'available')
    let finishLoading = () => {}
    model.create.mockReturnValue(
      new Promise((resolve) => {
        finishLoading = () => resolve(session)
      }),
    )
    session.promptStreaming.mockReturnValue(chunks('Resposta'))

    const view = renderHook(() => useLocalChat())
    await act(() => view.result.current.prepare())
    expect(view.result.current.status).toBe('ready')

    act(() => {
      view.result.current.send('Pergunta')
    })
    await waitFor(() => expect(model.create).toHaveBeenCalled())
    expect(last(view)).toBe('')
    expect(view.result.current.generating).toBe(true)
    expect(session.promptStreaming).not.toHaveBeenCalled()

    await act(async () => finishLoading())
    await waitFor(() => expect(last(view)).toBe('Resposta'))
    expect(view.result.current.generating).toBe(false)
  })

  it('shows a retryable error when the background load fails', async () => {
    const { model } = fakeModel(() => 'available')
    model.create.mockRejectedValue(new Error('no memory'))
    const { result } = renderHook(() => useLocalChat())
    await act(() => result.current.prepare())
    await waitFor(() => expect(result.current.status).toBe('error'))

    model.create.mockImplementation(async () => ({
      promptStreaming: vi.fn(),
      destroy: vi.fn(),
    }))
    await act(() => result.current.start())
    expect(result.current.status).toBe('ready')
  })

  it('passes llms.txt and the system prompt to the session', async () => {
    const { model } = await readyChat()
    const [options] = model.create.mock.calls[0] as unknown as [
      { initialPrompts: { role: string; content: string }[] },
    ]
    expect(options.initialPrompts[0].role).toBe('system')
    expect(options.initialPrompts[0].content).toContain('# Petros doc')
    expect(options.initialPrompts[0].content).toContain('chat.noInfo')
  })

  it('shows a retryable error when llms.txt fails', async () => {
    fakeModel(() => 'available')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('', { status: 500 })),
    )
    const { result } = renderHook(() => useLocalChat())
    await act(() => result.current.prepare())
    await waitFor(() => expect(result.current.status).toBe('error'))
  })

  it('streams the answer as it arrives', async () => {
    const { view, session } = await readyChat()
    session.promptStreaming.mockReturnValue(chunks('Ele ', '', 'criou.'))
    await act(() => view.result.current.send('O que ele fez?'))
    expect(last(view)).toBe('Ele criou.')
    expect(view.result.current.generating).toBe(false)
  })

  it('keeps the partial answer when stopped', async () => {
    const { view, session } = await readyChat()
    session.promptStreaming.mockImplementation(async function* (
      _: string,
      { signal }: { signal: AbortSignal },
    ) {
      yield 'Parcial'
      await new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () =>
          reject(new DOMException('stopped', 'AbortError')),
        )
      })
    })
    let done: Promise<void> = Promise.resolve()
    act(() => {
      done = view.result.current.send('Pergunta')
    })
    await waitFor(() => expect(last(view)).toBe('Parcial'))
    await act(async () => {
      view.result.current.stop()
      await done
    })
    expect(last(view)).toBe('Parcial')
    expect(view.result.current.generating).toBe(false)
  })

  it('shows an error when generation fails', async () => {
    const { view, session } = await readyChat()
    session.promptStreaming.mockImplementation(async function* () {
      yield ''
      throw new Error('device lost')
    })
    await act(() => view.result.current.send('Pergunta'))
    expect(last(view)).toBe('chat.errorGenerate')
  })
})
