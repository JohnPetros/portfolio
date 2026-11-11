import { describe, expect, it } from 'vitest'
import { parseAnswer } from '@/components/sections/chatAnswer'
import { splitLinks } from '@/components/sections/chatLinks'
import { PROJECTS } from '@/data/projects'
import { buildLlmsTxt } from './llms'
import { buildSystemPrompt, parseLang } from './systemPrompt'

describe('buildLlmsTxt', () => {
  const pt = buildLlmsTxt('pt-BR')

  it('covers every project without markdown emphasis', () => {
    for (const project of PROJECTS) expect(pt).toContain(`### ${project.title}`)
    expect(pt).not.toContain('**')
  })
  it('includes project links and contact channels', () => {
    expect(pt).toContain('https://github.com/CtrI-Alt-Del/stocker')
    expect(pt).toContain('joaopcarvalho.cds@gmail.com')
    expect(pt).not.toContain('mailto:')
  })
  it('follows the requested language', () => {
    expect(pt).toContain('## Trajetória')
    expect(buildLlmsTxt('en')).toContain('## Trajectory')
    expect(buildLlmsTxt('es')).toContain('## Trayectoria')
  })
})

describe('parseLang', () => {
  it('accepts supported languages and defaults to pt-BR', () => {
    expect(parseLang('en')).toBe('en')
    expect(parseLang('fr')).toBe('pt-BR')
    expect(parseLang(null)).toBe('pt-BR')
  })
})

describe('buildSystemPrompt', () => {
  it('names the reply language and the exact refusal', () => {
    const prompt = buildSystemPrompt('es', 'NOPE')
    expect(prompt).toContain('reply exactly: NOPE')
    expect(prompt).toContain('Always reply in Spanish')
  })
})

describe('parseAnswer', () => {
  it('turns markdown list items into bullets without their indentation', () => {
    expect(parseAnswer('Em 2026:\n\n*   **Lumetis:** HMS.\n  - Ancra: SEO.')).toEqual([
      { text: 'Em 2026:', bullet: false },
      { text: 'Lumetis: HMS.', bullet: true },
      { text: 'Ancra: SEO.', bullet: true },
    ])
  })
  it('drops a list marker that is still streaming', () => {
    expect(parseAnswer('Frase\n* ')).toEqual([{ text: 'Frase', bullet: false }])
    expect(parseAnswer('Frase\n*')).toEqual([{ text: 'Frase', bullet: false }])
  })
  it('keeps hyphens that are not list markers', () => {
    expect(parseAnswer('full-stack\n-5 graus')).toEqual([
      { text: 'full-stack', bullet: false },
      { text: '-5 graus', bullet: false },
    ])
  })
})

describe('splitLinks', () => {
  it('turns URLs into links and trims trailing punctuation', () => {
    expect(splitLinks('Veja https://a.com/x. Fim')).toEqual([
      { text: 'Veja ' },
      { text: 'https://a.com/x', href: 'https://a.com/x' },
      { text: '. Fim' },
    ])
  })
  it('never links other schemes', () => {
    expect(splitLinks('javascript:alert(1)')).toEqual([{ text: 'javascript:alert(1)' }])
  })
  it('keeps a markdown link target clean', () => {
    const parts = splitLinks('[site](https://a.com)')
    expect(parts.find((p) => p.href)?.href).toBe('https://a.com')
  })
})
