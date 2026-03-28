export function parseRepoUrl(repoUrl: string): {
  owner: string
  repo: string
} {
  const url = new URL(repoUrl)
  if (url.hostname !== 'github.com') {
    throw new Error('Only github.com URLs are supported')
  }
  const parts = url.pathname.split('/').filter(Boolean)
  if (parts.length < 2) throw new Error('Invalid repo URL')
  return { owner: parts[0], repo: parts[1].replace(/\.git$/, '') }
}

