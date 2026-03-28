import { kstRangeToUtcIso } from './kst'
import {
  buildContributorStats,
  compactDiffFromFiles,
  fetchCommitsInRange,
  fetchCompareFiles
} from './github'
import { type BenchmarkItem, type ContributorStat, type PerfMetric, type ReportCard } from './types'
import { openaiJson } from './openaiClient'

type ChunkInsight = {
  summaryBullets: string[]
  flowSteps: string[]
  perfHint?: { cpu?: string; memory?: string; bundle?: string; status?: 'changed' | 'no_change' }
  benchmarks?: { name: string; url: string; summary: string; previewImageUrl?: string }[]
}

async function fetchOpenGraphImage(pageUrl: string): Promise<string | undefined> {
  try {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 4000)
    const res = await fetch(pageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'git-report/0.1'
      }
    })
    clearTimeout(t)
    if (!res.ok) return undefined
    const html = await res.text()
    const match = html.match(
      /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']\s*\/?\s*>/i
    )
    const content = match?.[1]
    if (!content) return undefined
    return new URL(content, pageUrl).toString()
  } catch {
    return undefined
  }
}

function chunkText(input: string, maxChars: number) {
  const chunks: string[] = []
  let idx = 0
  while (idx < input.length) {
    chunks.push(input.slice(idx, idx + maxChars))
    idx += maxChars
  }
  return chunks
}

function safeMermaid(flowSteps: string[]) {
  const nodes = flowSteps.slice(0, 8)
  if (nodes.length === 0) {
    return 'graph TD\n  A["Changes"] --> B["Report"]'
  }
  const lines: string[] = ['graph TD']
  for (let i = 0; i < nodes.length; i++) {
    const a = `N${i}`
    const label = nodes[i].replace(/[\[\]"]+/g, '').slice(0, 80)
    lines.push(`  ${a}["${label}"]`)
    if (i > 0) lines.push(`  N${i - 1} --> ${a}`)
  }
  return lines.join('\n')
}

export async function generateReportCard(input: {
  repoUrl: string
  branch: string
  fromDate: string
  toDate: string
}): Promise<{
  fromKst: string
  toKst: string
  card: ReportCard
}> {
  const { sinceIso, untilIso, fromKstLabel, toKstLabel } = kstRangeToUtcIso(
    input.fromDate,
    input.toDate
  )
  const commits = await fetchCommitsInRange({
    repoUrl: input.repoUrl,
    branch: input.branch,
    sinceIso,
    untilIso
  })

  const contributorsBase = buildContributorStats(commits)
  const contributors: ContributorStat[] = contributorsBase.slice(0, 8).map((c) => ({
    login: c.login,
    avatarUrl: c.avatarUrl,
    commits: c.commits,
    additions: 0,
    deletions: 0
  }))

  const diffTexts: string[] = []
  for (const c of commits.slice(0, 40)) {
    const parent = c.parents?.[0]?.sha
    if (!parent) continue
    const files = await fetchCompareFiles({
      repoUrl: input.repoUrl,
      baseSha: parent,
      headSha: c.sha
    })
    const text = compactDiffFromFiles(
      files.map((f) => ({
        filename: f.filename,
        status: f.status,
        patch: f.patch,
        additions: f.additions,
        deletions: f.deletions
      }))
    )
    diffTexts.push(`Commit ${c.sha}\n${c.commit?.message || ''}\n${text}`)

    for (const f of files) {
      const login = c.author?.login || c.commit?.author?.name || 'unknown'
      const found = contributors.find((x) => x.login === login)
      if (found) {
        found.additions += f.additions || 0
        found.deletions += f.deletions || 0
      }
    }
  }

  const corpus = diffTexts.join('\n\n').slice(0, 180_000)
  const chunks = chunkText(corpus, 18_000).slice(0, 6)
  const fastModel = process.env.OPENAI_MODEL_FAST || 'gpt-4o-mini'
  const reportModel = process.env.OPENAI_MODEL_REPORT || 'gpt-4o'

  const insights: ChunkInsight[] = []
  for (const chunk of chunks) {
    const insight = await openaiJson<ChunkInsight>({
      model: fastModel,
      system:
        'You analyze Git diffs and extract key changes. Return JSON only with fields: summaryBullets(string[]), flowSteps(string[]), perfHint(optional object), benchmarks(optional array).',
      user:
        `Repo: ${input.repoUrl}\nBranch: ${input.branch}\nRange(KST): ${fromKstLabel} to ${toKstLabel}\n\nDiff chunk:\n${chunk}`
    })
    insights.push(insight)
  }

  const mergedBullets = insights.flatMap((i) => i.summaryBullets || []).slice(0, 16)
  const mergedFlow = insights.flatMap((i) => i.flowSteps || []).slice(0, 12)
  const perfHint = insights.map((i) => i.perfHint).find(Boolean)
  const benchItems: BenchmarkItem[] = (insights.flatMap((i) => i.benchmarks || []) || [])
    .slice(0, 4)
    .map((b) => ({
      name: b.name,
      url: b.url,
      summary: b.summary,
      previewImageUrl: b.previewImageUrl
    }))

  for (const it of benchItems) {
    if (!it.previewImageUrl) {
      it.previewImageUrl = await fetchOpenGraphImage(it.url)
    }
  }

  const titleResp = await openaiJson<{ title: string; reportMarkdown: string; expectedImpact: string }>({
    model: reportModel,
    system:
      'You produce a high-quality, news-style title and a concise report in Markdown. Return JSON only with fields: title, reportMarkdown, expectedImpact.',
    user:
      `Generate a report for GitHub diff analysis.\nRepo: ${input.repoUrl}\nBranch: ${input.branch}\nRange(KST): ${fromKstLabel} to ${toKstLabel}\n\nKey bullets:\n${mergedBullets
        .map((b) => `- ${b}`)
        .join('\n')}\n\nFlow steps:\n${mergedFlow.map((s) => `- ${s}`).join('\n')}\n\nInclude: 4-5 test cases section, improvements vs previous commit (if none say no changes), marketing/impact section, and benchmark comparison section with links if available.`
  })

  const perf: PerfMetric | undefined = perfHint?.status
    ? perfHint.status === 'no_change'
      ? { status: 'no_change' }
      : {
          status: 'changed',
          cpu: perfHint.cpu || 'Potential CPU improvements',
          memory: perfHint.memory || 'Potential memory improvements',
          bundle: perfHint.bundle || 'Potential bundle improvements'
        }
    : { status: 'no_change' }

  const mermaid = safeMermaid(mergedFlow)
  const markdown = `${titleResp.reportMarkdown}\n\n## Expected impact\n${titleResp.expectedImpact}`

  const card: ReportCard = {
    title: titleResp.title,
    contributors,
    mermaid,
    markdown,
    perf,
    benchmarks: benchItems
  }

  return { fromKst: fromKstLabel, toKst: toKstLabel, card }
}
