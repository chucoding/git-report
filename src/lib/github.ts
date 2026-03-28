import { parseRepoUrl } from './repoUrl'

type GitHubCommit = {
  sha: string
  commit: {
    message: string
    author?: { name?: string; date?: string }
  }
  author?: { login?: string; avatar_url?: string }
  parents: { sha: string }[]
}

type GitHubCompare = {
  files?: {
    filename: string
    additions: number
    deletions: number
    changes: number
    patch?: string
    status?: string
  }[]
}

type TokenSource = 'input' | 'env' | 'none'

function resolveToken(inputToken?: string): { token?: string; source: TokenSource } {
  if (inputToken) return { token: inputToken, source: 'input' }
  const envToken = process.env.GITHUB_TOKEN
  if (envToken) return { token: envToken, source: 'env' }
  return { source: 'none' }
}

function buildHeaders(token?: string) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

export async function fetchBranches(repoUrl: string, token?: string) {
  const { owner, repo } = parseRepoUrl(repoUrl)
  const url = `https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`
  const resolved = resolveToken(token)

  const res = await fetch(url, { headers: buildHeaders(resolved.token) })
  if (res.status === 401 && resolved.source === 'env') {
    const retry = await fetch(url, { headers: buildHeaders(undefined) })
    if (retry.ok) {
      const data = (await retry.json()) as { name: string }[]
      return data.map((d) => d.name)
    }
  }

  if (!res.ok) {
    const text = await res.text()
    if (res.status === 401) {
      if (resolved.source === 'none') {
        throw new Error(
          'GitHub 인증 실패(401). Private 레포라면 Vercel 환경변수 GITHUB_TOKEN이 필요합니다.'
        )
      }
      if (resolved.source === 'env') {
        throw new Error(
          'GitHub 인증 실패(401). Vercel의 GITHUB_TOKEN이 만료/폐기되었거나 권한이 부족합니다.'
        )
      }
    }
    throw new Error(`GitHub branches error: ${res.status} ${text}`)
  }
  const data = (await res.json()) as { name: string }[]
  return data.map((d) => d.name)
}

export async function fetchCommitsInRange(input: {
  repoUrl: string
  branch: string
  sinceIso: string
  untilIso: string
  token?: string
  maxCommits?: number
}) {
  const { owner, repo } = parseRepoUrl(input.repoUrl)
  const commits: GitHubCommit[] = []
  const maxCommits = input.maxCommits ?? 200
  const resolved = resolveToken(input.token)

  for (let page = 1; page <= 10; page++) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(
      input.branch
    )}&since=${encodeURIComponent(input.sinceIso)}&until=${encodeURIComponent(
      input.untilIso
    )}&per_page=100&page=${page}`

    const res = await fetch(url, { headers: buildHeaders(resolved.token) })
    let finalRes = res
    if (res.status === 401 && resolved.source === 'env') {
      const retry = await fetch(url, { headers: buildHeaders(undefined) })
      finalRes = retry
    }

    if (!finalRes.ok) {
      const text = await finalRes.text()
      if (finalRes.status === 401) {
        if (resolved.source === 'none') {
          throw new Error(
            'GitHub 인증 실패(401). Private 레포라면 Vercel 환경변수 GITHUB_TOKEN이 필요합니다.'
          )
        }
        if (resolved.source === 'env') {
          throw new Error(
            'GitHub 인증 실패(401). Vercel의 GITHUB_TOKEN이 만료/폐기되었거나 권한이 부족합니다.'
          )
        }
      }
      throw new Error(`GitHub commits error: ${finalRes.status} ${text}`)
    }

    const data = (await finalRes.json()) as GitHubCommit[]
    commits.push(...data)
    if (data.length < 100) break
    if (commits.length >= maxCommits) break
  }
  return commits.slice(0, maxCommits)
}

export async function fetchCompareFiles(input: {
  repoUrl: string
  baseSha: string
  headSha: string
  token?: string
}) {
  const { owner, repo } = parseRepoUrl(input.repoUrl)
  const url = `https://api.github.com/repos/${owner}/${repo}/compare/${input.baseSha}...${input.headSha}`
  const resolved = resolveToken(input.token)

  const res = await fetch(url, { headers: buildHeaders(resolved.token) })
  let finalRes = res
  if (res.status === 401 && resolved.source === 'env') {
    const retry = await fetch(url, { headers: buildHeaders(undefined) })
    finalRes = retry
  }

  if (!finalRes.ok) {
    const text = await finalRes.text()
    if (finalRes.status === 401) {
      if (resolved.source === 'none') {
        throw new Error(
          'GitHub 인증 실패(401). Private 레포라면 Vercel 환경변수 GITHUB_TOKEN이 필요합니다.'
        )
      }
      if (resolved.source === 'env') {
        throw new Error(
          'GitHub 인증 실패(401). Vercel의 GITHUB_TOKEN이 만료/폐기되었거나 권한이 부족합니다.'
        )
      }
    }
    throw new Error(`GitHub compare error: ${finalRes.status} ${text}`)
  }
  const data = (await finalRes.json()) as GitHubCompare
  return data.files || []
}

export function buildContributorStats(commits: GitHubCommit[]) {
  const map = new Map<
    string,
    {
      login: string
      avatarUrl: string
      commits: number
      additions: number
      deletions: number
    }
  >()
  for (const c of commits) {
    const login = c.author?.login || c.commit?.author?.name || 'unknown'
    const avatarUrl = c.author?.avatar_url || `https://avatars.githubusercontent.com/${login}?v=4`
    const cur = map.get(login) || {
      login,
      avatarUrl,
      commits: 0,
      additions: 0,
      deletions: 0
    }
    cur.commits += 1
    map.set(login, cur)
  }

  return Array.from(map.values()).sort((a, b) => b.commits - a.commits)
}

export function compactDiffFromFiles(files: {
  filename: string
  status?: string
  patch?: string
  additions: number
  deletions: number
}[]) {
  const parts: string[] = []
  for (const f of files) {
    const header = `File: ${f.filename} (${f.status || 'modified'}) +${f.additions}/-${f.deletions}`
    const patch = (f.patch || '').trim()
    parts.push(header)
    if (patch) parts.push(patch)
    parts.push('')
  }
  return parts.join('\n')
}
