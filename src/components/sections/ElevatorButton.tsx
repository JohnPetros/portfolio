import { IconArrowBarToUp } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useElevator } from '@/hooks/useElevator'

export function ElevatorButton() {
  const { t } = useTranslation()
  const { visible, start } = useElevator()

  if (!visible) return null

  return (
    <button
      type='button'
      onClick={start}
      aria-label={t('backToTop')}
      className='fixed bottom-4 right-4 z-30 flex size-11 animate-[petros-fade-up_240ms_ease-out_both] items-center justify-center rounded-md border-[0.5px] border-border bg-bg-card text-text-secondary shadow-[var(--shadow-card)] transition-colors duration-[var(--dur-micro)] hover:border-accent hover:text-accent'
    >
      <IconArrowBarToUp size={20} stroke={1.5} aria-hidden />
    </button>
  )
}
