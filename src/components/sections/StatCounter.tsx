import { RichText } from '@/components/common/RichText'
import { type Stat, statTarget } from '@/data/bio'
import { useCounter } from '@/hooks/useCounter'
import { useReveal } from '@/hooks/useReveal'
import { useLocalized } from '@/i18n/useLocalized'

export function StatCounter({ stat }: { stat: Stat }) {
  const localize = useLocalized()
  const { ref, shown } = useReveal()
  const target = statTarget(stat)
  const raw = useCounter(shown ? target : 0)
  const count = Math.round(raw)
  const useThousands = stat.value.includes(',') || stat.value.includes('.')
  const display = useThousands
    ? count.toLocaleString('pt-BR')
    : String(count)

  return (
    <div
      ref={ref}
      className='flex flex-col rounded-lg border-[0.5px] border-border bg-bg-card p-6 shadow-[var(--shadow-card)]'
    >
      <p className='font-sans text-h1 font-medium leading-none tracking-tight text-text-primary'>
        {display}
        {stat.suffix ? (
          <span className='text-accent drop-shadow-[0_0_5px_var(--accent-glow)]'>
            {stat.suffix}
          </span>
        ) : (
          <span
            aria-hidden
            className='text-accent drop-shadow-[0_0_5px_var(--accent-glow)]'
          >
            .
          </span>
        )}
      </p>
      <p className='mt-4 font-sans text-body leading-body text-text-secondary'>
        <RichText>{localize(stat.label)}</RichText>
      </p>
      <p className='mt-auto pt-4 font-mono text-micro tracking-meta uppercase text-text-faint'>
        {localize(stat.meta)}
      </p>
    </div>
  )
}
