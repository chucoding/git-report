import { describe, expect, it } from 'vitest'
import { kstRangeToUtcIso } from './kst'

describe('kstRangeToUtcIso', () => {
  it('converts KST day range into UTC ISO bounds', () => {
    const r = kstRangeToUtcIso('2026-03-01', '2026-03-01')
    expect(r.sinceIso).toMatch(/T15:00:00\.000Z$/)
    expect(r.untilIso).toMatch(/T14:59:00\.000Z$/)
    expect(r.fromKstLabel).toBe('2026-03-01 00:00')
    expect(r.toKstLabel).toBe('2026-03-01 23:59')
  })

  it('rejects inverted ranges', () => {
    expect(() => kstRangeToUtcIso('2026-03-02', '2026-03-01')).toThrow()
  })
})

