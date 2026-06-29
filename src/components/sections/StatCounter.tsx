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
  const display = stat.value.includes(',') ? count.toLocaleString('en-US') : String(count)

  return (
    <div ref={ref}>
      <p className='font-sans text-display font-medium tracking-tight text-text-primary'>
        {display}
        {stat.suffix}
        <span aria-hidden className='text-accent'>
          .
        </span>
      </p>
      <p className='mt-1 font-mono text-meta tracking-meta uppercase text-text-muted'>
        {localize(stat.label)}
      </p>
    </div>
  )
}
