import type { ReactNode } from 'react'
import { Tooltip as RadixTooltip } from 'radix-ui'

export function Tooltip({
  label,
  side = 'top',
  children,
}: {
  label: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  children: ReactNode
}) {
  return (
    <RadixTooltip.Provider delayDuration={150}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={6}
            className='z-50 rounded-sm border-[0.5px] border-border bg-bg-elevated px-2 py-1 font-mono text-micro tracking-meta uppercase text-text-secondary shadow-[var(--shadow-card)]'
          >
            {label}
            <RadixTooltip.Arrow className='fill-bg-elevated' />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
