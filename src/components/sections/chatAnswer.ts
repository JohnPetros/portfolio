export type AnswerLine = { text: string; bullet: boolean }

const LIST_MARKER = /^\s*[*+-](\s+|$)/

/** Gemini Nano answers in markdown, but the chat bubble shows plain text. */
export function parseAnswer(answer: string): AnswerLine[] {
  return answer.split('\n').flatMap((line) => {
    const text = line.replace(LIST_MARKER, '').replace(/\*+/g, '').trim()
    return text ? [{ text, bullet: LIST_MARKER.test(line) }] : []
  })
}
