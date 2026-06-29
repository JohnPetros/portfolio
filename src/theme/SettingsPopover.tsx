import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { IconCheck, IconSettings } from '@tabler/icons-react'
import { useTheme } from './ThemeProvider'
import { LANGS, MODES, SCHEMES, type Lang, type Scheme } from './theme'
import { cn } from '@/lib/utils'

const LANG_LABEL: Record<Lang, { name: string; code: string }> = {
  'pt-BR': { name: 'Português', code: 'PT-BR' },
  en: { name: 'English', code: 'EN' },
  es: { name: 'Español', code: 'ES' },
}

export function SettingsPopover() {
  const { state, setMode, setScheme, setLang } = useTheme()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={t('settings.title')}
        className='inline-flex size-11 items-center justify-center rounded-pill text-text-secondary hover:text-accent aria-expanded:text-accent'
      >
        <IconSettings size={18} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align='end'
          sideOffset={8}
          className='z-50 w-[280px] rounded-md border-[0.5px] border-border bg-bg-card p-4 shadow-[var(--shadow-card)]'
        >
          {/* Mode */}
          <p className='mb-2 font-mono text-micro tracking-eyebrow uppercase text-text-faint'>
            {t('settings.mode')}
          </p>
          <div className='mb-4 grid grid-cols-2 gap-2'>
            {MODES.map((m) => (
              <button
                key={m}
                type='button'
                aria-current={state.mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  'rounded-sm border-[0.5px] border-border py-2 text-body-sm',
                  state.mode === m
                    ? 'border-accent-tint-20 text-accent'
                    : 'text-text-secondary',
                )}
              >
                {m === 'dark' ? t('settings.modeDark') : t('settings.modeLight')}
              </button>
            ))}
          </div>

          {/* Scheme */}
          <p className='mb-2 font-mono text-micro tracking-eyebrow uppercase text-text-faint'>
            {t('settings.scheme')}
          </p>
          <ul className='mb-4 flex flex-col gap-1'>
            {SCHEMES.map((s) => (
              <SchemeRow
                key={s}
                scheme={s}
                active={state.scheme === s}
                label={t(`schemes.${s}`)}
                onSelect={() => setScheme(s)}
              />
            ))}
          </ul>

          {/* Language */}
          <p className='mb-2 font-mono text-micro tracking-eyebrow uppercase text-text-faint'>
            {t('settings.language')}
          </p>
          <ul className='flex flex-col gap-1'>
            {LANGS.map((l) => (
              <li key={l}>
                <button
                  type='button'
                  aria-current={state.lang === l}
                  onClick={() => setLang(l)}
                  className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-body-sm text-text-secondary hover:bg-bg-elevated'
                >
                  <span className='flex-1 text-left'>{LANG_LABEL[l].name}</span>
                  <span className='font-mono text-micro tracking-meta text-text-faint'>
                    {LANG_LABEL[l].code}
                  </span>
                  {state.lang === l && <IconCheck size={14} className='text-accent' />}
                </button>
              </li>
            ))}
          </ul>

          <p className='mt-4 font-mono text-micro tracking-meta text-text-faint'>
            {t('settings.hint')}
          </p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

function SchemeRow({
  scheme,
  active,
  label,
  onSelect,
}: {
  scheme: Scheme
  active: boolean
  label: string
  onSelect: () => void
}) {
  return (
    <li>
      <button
        type='button'
        aria-current={active}
        onClick={onSelect}
        data-scheme={scheme}
        className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-body-sm text-text-secondary hover:bg-bg-elevated'
      >
        <span
          aria-hidden
          className='size-4 rounded-pill'
          style={{
            background: 'linear-gradient(135deg, var(--panda-from), var(--accent))',
          }}
        />
        <span className='flex-1 text-left'>{label}</span>
        {active && <IconCheck size={14} className='text-accent' />}
      </button>
    </li>
  )
}
