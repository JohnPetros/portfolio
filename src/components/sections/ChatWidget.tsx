import {
  IconArrowUp,
  IconMessageChatbot,
  IconPlayerStopFilled,
  IconRefresh,
  IconX,
} from '@tabler/icons-react'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/primitives'
import { parseAnswer } from '@/components/sections/chatAnswer'
import { splitLinks } from '@/components/sections/chatLinks'
import { type ChatEntry, useLocalChat } from '@/hooks/useLocalChat'
import { cn } from '@/lib/utils'

function LinkedText({ text }: { text: string }) {
  return splitLinks(text).map((part, index) =>
    part.href ? (
      <a
        // biome-ignore lint/suspicious/noArrayIndexKey: parts never reorder
        key={index}
        href={part.href}
        target='_blank'
        rel='noopener noreferrer nofollow'
        className='underline hover:text-accent'
      >
        {part.text}
      </a>
    ) : (
      part.text
    ),
  )
}

function Message({ entry, thinking }: { entry: ChatEntry; thinking: boolean }) {
  const { t } = useTranslation()
  const isUser = entry.role === 'user'
  const lines = isUser ? [{ text: entry.text, bullet: false }] : parseAnswer(entry.text)
  return (
    <li className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'flex max-w-[90%] flex-col gap-[0.5rem] whitespace-pre-wrap break-words rounded-md px-3 py-2 font-sans text-body-sm leading-body',
          isUser ? 'bg-accent text-on-accent' : 'bg-bg-elevated text-text-primary',
        )}
      >
        {lines.length > 0
          ? lines.map((line, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: lines only grow at the end
              <p key={index} className={cn(line.bullet && 'relative pl-[1rem]')}>
                {line.bullet && (
                  <span aria-hidden className='absolute left-0 text-accent'>
                    •
                  </span>
                )}
                <LinkedText text={line.text} />
              </p>
            ))
          : thinking && <p>{t('chat.thinking')}</p>}
      </div>
    </li>
  )
}

export function ChatWidget() {
  const { t } = useTranslation()
  const chat = useLocalChat()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const logRef = useRef<HTMLUListElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const { entries, status, prepare } = chat

  useEffect(() => {
    if (open) prepare()
  }, [open, prepare])

  useEffect(() => {
    if (open && status === 'ready') inputRef.current?.focus()
  }, [open, status])

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on every new token
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [entries])

  const close = () => {
    setOpen(false)
    toggleRef.current?.focus()
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (chat.generating || !draft.trim()) return
    chat.send(draft)
    setDraft('')
  }

  const percent = Math.round(chat.progress * 100)
  const notice = 'flex flex-1 flex-col justify-center gap-3 p-5'
  const noticeText = 'font-sans text-body-sm leading-body text-text-secondary'

  return (
    <>
      {open && (
        <div
          role='dialog'
          aria-label={t('chat.title')}
          onKeyDown={(event) => {
            if (event.key === 'Escape') close()
          }}
          className='fixed bottom-32 right-4 z-30 flex h-[min(34rem,calc(100dvh-10rem))] w-[min(24rem,calc(100vw-2rem))] animate-[petros-fade-up_240ms_ease-out_both] flex-col overflow-hidden rounded-lg border-[0.5px] border-border bg-bg-card shadow-[var(--shadow-card)]'
        >
          <header className='flex items-center justify-between border-b-[0.5px] border-border px-4 py-3'>
            <h2 className='font-sans text-body font-medium text-text-primary'>
              {t('chat.title')}
            </h2>
            <button
              type='button'
              onClick={close}
              aria-label={t('chat.close')}
              className='flex size-[2rem] items-center justify-center rounded-sm text-text-secondary hover:text-accent'
            >
              <IconX size={18} stroke={1.5} aria-hidden />
            </button>
          </header>

          {status === 'unsupported' && (
            <div className={notice} role='status'>
              <p className={noticeText}>{t('chat.unsupported')}</p>
            </div>
          )}

          {status === 'consent' && (
            <div className={notice}>
              <p className={noticeText}>{t('chat.consentBody')}</p>
              <Button onClick={chat.start} className='mt-2'>
                {t('chat.consentAccept')}
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className={notice} aria-live='polite'>
              <p className={noticeText}>{t('chat.loading', { percent })}</p>
              <div
                role='progressbar'
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                className='h-1 overflow-hidden rounded-full bg-bg-elevated'
              >
                <div className='h-full bg-accent' style={{ width: `${percent}%` }} />
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className={notice} role='alert'>
              <p className={noticeText}>{t('chat.errorLoad')}</p>
              <Button onClick={chat.start} variant='secondary'>
                <IconRefresh size={16} stroke={1.5} aria-hidden />
                {t('chat.retry')}
              </Button>
            </div>
          )}

          {status === 'ready' && (
            <>
              <ul
                ref={logRef}
                role='log'
                aria-busy={chat.generating}
                className='flex flex-1 flex-col gap-3 overflow-y-auto p-4'
              >
                {entries.length === 0 && (
                  <li className='font-sans text-body-sm leading-body text-text-muted'>
                    {t('chat.empty')}
                  </li>
                )}
                {entries.map((entry) => (
                  <Message key={entry.id} entry={entry} thinking={chat.generating} />
                ))}
              </ul>
              <form
                onSubmit={submit}
                className='flex items-center gap-2 border-t-[0.5px] border-border p-3'
              >
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={300}
                  placeholder={t('chat.placeholder')}
                  aria-label={t('chat.placeholder')}
                  className='min-w-0 flex-1 bg-transparent font-sans text-body-sm text-text-primary outline-none placeholder:text-text-faint'
                />
                {chat.generating ? (
                  <button
                    type='button'
                    onClick={chat.stop}
                    aria-label={t('chat.stop')}
                    className='flex size-[2.25rem] shrink-0 items-center justify-center rounded-sm bg-bg-elevated text-text-primary'
                  >
                    <IconPlayerStopFilled size={16} aria-hidden />
                  </button>
                ) : (
                  <button
                    type='submit'
                    aria-label={t('chat.send')}
                    disabled={!draft.trim()}
                    className='flex size-[2.25rem] shrink-0 items-center justify-center rounded-sm bg-accent text-on-accent disabled:opacity-40'
                  >
                    <IconArrowUp size={18} stroke={1.75} aria-hidden />
                  </button>
                )}
              </form>
              <p className='px-3 pb-2 font-mono text-micro tracking-meta text-text-faint'>
                {t('chat.disclaimer')}
              </p>
            </>
          )}
        </div>
      )}

      <button
        ref={toggleRef}
        type='button'
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? t('chat.close') : t('chat.open')}
        className='fixed bottom-[4.5rem] right-4 z-30 flex size-11 items-center justify-center rounded-md border-[0.5px] border-border bg-bg-card text-text-secondary shadow-[var(--shadow-card)] transition-colors duration-[var(--dur-micro)] hover:border-accent hover:text-accent'
      >
        {open ? (
          <IconX size={20} stroke={1.5} aria-hidden />
        ) : (
          <IconMessageChatbot size={20} stroke={1.5} aria-hidden />
        )}
      </button>
    </>
  )
}
