import { describe, expect, it } from 'vitest'
import { GenerateReportSchema } from './schemas'

describe('GenerateReportSchema', () => {
  it('accepts valid payload', () => {
    const v = GenerateReportSchema.parse({
      repoUrl: 'https://github.com/org/repo',
      branch: 'main',
      fromDate: '2026-03-01',
      toDate: '2026-03-02'
    })
    expect(v.branch).toBe('main')
  })

  it('rejects invalid dates', () => {
    expect(() =>
      GenerateReportSchema.parse({
        repoUrl: 'https://github.com/org/repo',
        branch: 'main',
        fromDate: '2026/03/01',
        toDate: '2026-03-02'
      })
    ).toThrow()
  })
})

