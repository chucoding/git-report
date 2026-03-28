export type ContributorStat = {
  login: string
  avatarUrl: string
  commits: number
  additions: number
  deletions: number
}

export type PerfMetric =
  | {
      status: 'no_change'
    }
  | {
      status: 'changed'
      cpu: string
      memory: string
      bundle: string
    }

export type BenchmarkItem = {
  name: string
  url: string
  previewImageUrl?: string
  summary: string
}

export type ReportCard = {
  title: string
  contributors: ContributorStat[]
  mermaid: string
  markdown: string
  perf?: PerfMetric
  benchmarks?: BenchmarkItem[]
}

export type Report = {
  id: string
  repoUrl: string
  branch: string
  fromKst: string
  toKst: string
  isPublic: boolean
  shareSlug?: string | null
  createdAt: string
  card: ReportCard
}

export type ReportSummary = {
  id: string
  title: string
  repoUrl: string
  branch: string
  fromKst: string
  toKst: string
  createdAt: string
}

