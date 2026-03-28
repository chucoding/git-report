import { describe, expect, it } from 'vitest'
import { parseRepoUrl } from './repoUrl'

describe('parseRepoUrl', () => {
  it('parses owner/repo from github.com URL', () => {
    expect(parseRepoUrl('https://github.com/vercel/next.js')).toEqual({
      owner: 'vercel',
      repo: 'next.js'
    })
  })

  it('strips .git suffix', () => {
    expect(parseRepoUrl('https://github.com/org/repo.git')).toEqual({
      owner: 'org',
      repo: 'repo'
    })
  })

  it('rejects non-github.com URL', () => {
    expect(() => parseRepoUrl('https://example.com/a/b')).toThrow()
  })
})

