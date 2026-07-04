import { describe, expect, it } from 'vitest'
import { PROJECTS, projectNav, projectsByKind, unknownProjectTechIds } from './projects'

describe('PROJECTS', () => {
  it('has exactly 8 projects', () => {
    expect(PROJECTS).toHaveLength(8)
  })
  it('has 5 academic and 3 professional', () => {
    expect(PROJECTS.filter((p) => p.kind === 'academic')).toHaveLength(5)
    expect(PROJECTS.filter((p) => p.kind === 'professional')).toHaveLength(3)
  })
  it('has unique ids', () => {
    expect(new Set(PROJECTS.map((p) => p.id)).size).toBe(8)
  })
  it('order is unique within each kind', () => {
    for (const kind of ['academic', 'professional'] as const) {
      const orders = PROJECTS.filter((p) => p.kind === kind).map((p) => p.order)
      expect(new Set(orders).size).toBe(orders.length)
    }
  })
  it('every project references at least one tech and one gallery image', () => {
    for (const p of PROJECTS) {
      expect(p.techs.length).toBeGreaterThan(0)
      expect(p.gallery.length).toBeGreaterThan(0)
    }
  })
})

describe('projectsByKind', () => {
  it('returns academic projects sorted ascending by order', () => {
    const r = projectsByKind('academic')
    expect(r).toHaveLength(5)
    expect(r.map((p) => p.order)).toEqual(
      [...r.map((p) => p.order)].sort((a, b) => a - b),
    )
    expect(r.every((p) => p.kind === 'academic')).toBe(true)
  })
})

describe('projectNav', () => {
  it('first academic has no prev, has next', () => {
    const first = projectsByKind('academic')[0]
    const { prev, next } = projectNav(first)
    expect(prev).toBeNull()
    expect(next?.kind).toBe('academic')
  })
  it('last professional has next === null', () => {
    const pro = projectsByKind('professional')
    const { next } = projectNav(pro[pro.length - 1])
    expect(next).toBeNull()
  })
  it('a middle entry has both neighbors of the same kind', () => {
    const pro = projectsByKind('professional')
    const { prev, next } = projectNav(pro[1])
    expect(prev?.id).toBe(pro[0].id)
    expect(next?.id).toBe(pro[2].id)
  })
})

describe('unknownProjectTechIds', () => {
  it('every referenced techId exists in the stack', () => {
    expect(unknownProjectTechIds()).toEqual([])
  })
})
