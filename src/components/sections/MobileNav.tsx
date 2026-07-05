import { IconMenu2, IconX } from '@tabler/icons-react'
import { Dialog } from 'radix-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Brand } from '@/components/primitives'
import { cn } from '@/lib/utils'

export function MobileNav({
  items,
  active,
}: {
  items: readonly { id: string; key: string }[]
  active: string | null
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type='button'
          aria-label={t('nav.menu')}
          className='flex size-9 items-center justify-center rounded-pill text-text-secondary transition-colors duration-[var(--dur-micro)] hover:text-accent aria-expanded:text-accent md:hidden'
        >
          <IconMenu2 size={20} stroke={1.5} aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          data-petros-overlay
          className='fixed inset-0 z-40 bg-[var(--dialog-overlay)] backdrop-blur-[6px] md:hidden'
        />
        <Dialog.Content
          data-themed
          data-petros-drawer
          aria-label={t('nav.menu')}
          className='fixed right-0 top-0 z-50 flex h-full w-[85vw] max-w-xs flex-col border-l-[0.5px] border-border bg-bg-card focus:outline-none md:hidden'
        >
          <div className='flex items-center justify-between border-b-[0.5px] border-border px-5 py-3'>
            <Brand />
            <Dialog.Close
              aria-label={t('easter.close')}
              className='flex size-9 items-center justify-center rounded-pill text-text-secondary transition-colors duration-[var(--dur-micro)] hover:text-accent'
            >
              <IconX size={20} stroke={1.5} aria-hidden />
            </Dialog.Close>
          </div>
          <nav aria-label='Primary' className='flex flex-col gap-1 p-4'>
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'border-l-2 px-4 py-3 font-sans text-nav text-text-secondary transition-colors hover:text-text-primary',
                  active === item.id
                    ? 'border-accent text-text-primary'
                    : 'border-transparent',
                )}
              >
                {t(item.key)}
              </a>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
