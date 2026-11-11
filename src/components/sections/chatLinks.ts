export type TextPart = { text: string; href?: string }

const URL_RE = /https?:\/\/[^\s)\]<>"']+/g

/** Splits model output so only real http(s) URLs become links. */
export function splitLinks(input: string): TextPart[] {
  const parts: TextPart[] = []
  let cursor = 0
  for (const match of input.matchAll(URL_RE)) {
    const href = match[0].replace(/[.,;:!?]+$/, '')
    if (match.index > cursor) parts.push({ text: input.slice(cursor, match.index) })
    parts.push({ text: href, href })
    cursor = match.index + href.length
  }
  if (cursor < input.length) parts.push({ text: input.slice(cursor) })
  return parts
}
