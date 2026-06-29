import { Fragment } from 'react'
import { cn } from '@/lib/utils'

export type RichToken = { kind: 'text' | 'bold' | 'italic'; value: string }

// Matches **bold** (group 1) or *italic* (group 2). Bold precedes italic.
const RICH_RE = /\*\*([^*]+)\*\*|\*([^*]+)\*/g

export function tokenizeRich(input: string): RichToken[] {
  if (!input) return []
  const tokens: RichToken[] = []
  let last = 0
  for (const m of input.matchAll(RICH_RE)) {
    const start = m.index
    if (start > last) tokens.push({ kind: 'text', value: input.slice(last, start) })
    if (m[1] !== undefined) tokens.push({ kind: 'bold', value: m[1] })
    else if (m[2] !== undefined) tokens.push({ kind: 'italic', value: m[2] })
    last = start + m[0].length
  }
  if (last < input.length) tokens.push({ kind: 'text', value: input.slice(last) })
  return tokens
}

export function RichText({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const tokens = tokenizeRich(children)
  return (
    <span className={className}>
      {tokens.map((tok, i) => {
        if (tok.kind === 'bold')
          return (
            <strong key={i} className={cn('font-medium text-text-primary')}>
              {tok.value}
            </strong>
          )
        if (tok.kind === 'italic')
          return (
            <em key={i} className={cn('font-serif italic text-accent-italic')}>
              {tok.value}
            </em>
          )
        return <Fragment key={i}>{tok.value}</Fragment>
      })}
    </span>
  )
}
