import { IconX } from '@tabler/icons-react'
import { Dialog } from 'radix-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eyebrow } from '@/components/primitives'

function PandaFallback() {
  return (
    <span className='flex aspect-square w-full items-center justify-center rounded-md bg-gradient-to-b from-panda-from to-panda-to text-[88px]'>
      🐼
    </span>
  )
}

export function EasterEgg({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          data-petros-overlay
          className='fixed inset-0 z-40 bg-[var(--dialog-overlay)] backdrop-blur-[6px]'
        />
        <Dialog.Content
          data-petros-dialog
          data-themed
          className='fixed left-1/2 top-1/2 z-50 w-[300px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border-[0.5px] border-border bg-bg-card p-6 shadow-[var(--shadow-card)] focus:outline-none md:w-[340px]'
        >
          {/* bamboo hill bg */}
          <div
            aria-hidden
            className='pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-[0.12]'
            style={{
              background:
                'radial-gradient(120% 100% at 50% 100%, var(--accent) 0%, transparent 70%)',
            }}
          />
          <div className='relative'>
            <div className='flex items-center justify-between'>
              <Eyebrow bullet>{t('easter.eyebrow')}</Eyebrow>
              <Dialog.Close
                aria-label={t('easter.close')}
                className='flex size-9 items-center justify-center rounded-sm border-[0.5px] border-border text-text-secondary transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent'
              >
                <IconX size={16} stroke={1.5} aria-hidden />
              </Dialog.Close>
            </div>

            <Dialog.Title className='sr-only'>{t('easter.alt')}</Dialog.Title>

            <div className='mt-4'>
              {failed ? (
                <PandaFallback />
              ) : (
                <img
                  src='/panda.gif'
                  alt={t('easter.alt')}
                  onError={() => setFailed(true)}
                  className='aspect-square w-full rounded-md object-cover motion-reduce:[image-rendering:pixelated]'
                />
              )}
            </div>

            <p className='mt-4 text-center font-serif text-body italic text-accent-italic'>
              {t('easter.caption')}
            </p>
            <p className='mt-2 text-center font-mono text-micro tracking-meta uppercase text-text-faint'>
              {t('easter.meta')}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
