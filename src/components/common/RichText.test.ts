import { describe, expect, it } from 'vitest'
import { stripRich, tokenizeRich } from './RichText'

describe('tokenizeRich', () => {
  it('returns a single text token for plain input', () => {
    expect(tokenizeRich('hello world')).toEqual([{ kind: 'text', value: 'hello world' }])
  })
  it('parses a bold run', () => {
    expect(tokenizeRich('a **b** c')).toEqual([
      { kind: 'text', value: 'a ' },
      { kind: 'bold', value: 'b' },
      { kind: 'text', value: ' c' },
    ])
  })
  it('parses an italic run', () => {
    expect(tokenizeRich('a *b* c')).toEqual([
      { kind: 'text', value: 'a ' },
      { kind: 'italic', value: 'b' },
      { kind: 'text', value: ' c' },
    ])
  })
  it('parses bold and italic in the same string', () => {
    expect(tokenizeRich('**x** and *y*')).toEqual([
      { kind: 'bold', value: 'x' },
      { kind: 'text', value: ' and ' },
      { kind: 'italic', value: 'y' },
    ])
  })
  it('does not treat ** as italic (bold precedence)', () => {
    expect(tokenizeRich('**bold**')).toEqual([{ kind: 'bold', value: 'bold' }])
  })
  it('returns empty array for empty string', () => {
    expect(tokenizeRich('')).toEqual([])
  })
})

describe('stripRich', () => {
  it('removes bold and italic markers', () => {
    expect(stripRich('App **nativo** e *rápido*.')).toBe('App nativo e rápido.')
  })
  it('leaves plain text unchanged', () => {
    expect(stripRich('hello')).toBe('hello')
  })
})
