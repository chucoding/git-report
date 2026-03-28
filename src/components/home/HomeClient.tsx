'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AppShell from '@/components/shell/AppShell'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { type ReportSummary } from '@/lib/types'
import { parseRepoUrl } from '@/lib/repoUrl'
import { isValidIsoDate } from '@/lib/kst'

type Stage =
  | 'idle'
  | 'loading-branches'
  | 'generating'
  | 'error'
  | 'done'

export default function HomeClient() {
  const [repoUrl, setRepoUrl] = useState('')
  const [githubToken, setGithubToken] = useState('')
  const [branches, setBranches] = useState<string[]>([])
  const [branch, setBranch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [stage, setStage] = useState<Stage>('idle')
  const [error, setError] = useState<string>('')
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [compareLeft, setCompareLeft] = useState('')
  const [compareRight, setCompareRight] = useState('')
  const [compareMarkdown, setCompareMarkdown] = useState('')

  const canLoadBranches = useMemo(() => {
    try {
      parseRepoUrl(repoUrl)
      return true
    } catch {
      return false
    }
  }, [repoUrl])

  const canGenerate = useMemo(() => {
    return (
      canLoadBranches &&
      branch.length > 0 &&
      isValidIsoDate(fromDate) &&
      isValidIsoDate(toDate)
    )
  }, [branch, canLoadBranches, fromDate, toDate])

  useEffect(() => {
    void refreshReports()
  }, [])

  async function refreshReports() {
    const res = await fetch('/api/reports/list', { cache: 'no-store' })
    if (!res.ok) return
    const data = (await res.json()) as { reports: ReportSummary[] }
    setReports(data.reports)
  }

  async function loadBranches() {
    setError('')
    setStage('loading-branches')
    setBranches([])
    setBranch('')
    try {
      const res = await fetch('/api/github/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, githubToken: githubToken || undefined })
      })
      const data = (await res.json()) as {
        branches?: string[]
        error?: string
      }
      if (!res.ok) throw new Error(data.error || 'Failed to load branches')
      setBranches(data.branches || [])
      setBranch(data.branches?.[0] || '')
      setStage('idle')
    } catch (e) {
      setStage('error')
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  async function generateReport() {
    if (!canGenerate) return
    setError('')
    setStage('generating')
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl,
          branch,
          fromDate,
          toDate,
          githubToken: githubToken || undefined
        })
      })
      const data = (await res.json()) as { id?: string; error?: string }
      if (!res.ok) throw new Error(data.error || 'Failed to generate report')
      setStage('done')
      await refreshReports()
      if (data.id) {
        window.location.href = `/reports/${data.id}`
      }
    } catch (e) {
      setStage('error')
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  async function runCompare() {
    setCompareMarkdown('')
    if (!compareLeft || !compareRight || compareLeft === compareRight) return
    const res = await fetch('/api/reports/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leftReportId: compareLeft, rightReportId: compareRight })
    })
    const data = (await res.json()) as { markdown?: string; error?: string }
    if (!res.ok) {
      setCompareMarkdown(data.error || 'Compare failed')
      return
    }
    setCompareMarkdown(data.markdown || '')
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Generate a GitHub diff report
          </h1>
          <p className="text-sm text-text-muted">
            Date range is fixed to 00:00–23:59 KST.
          </p>
        </div>

        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-text-muted">GitHub repo URL</label>
              <Input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/org/repo"
                inputMode="url"
              />
              <p className="text-xs text-text-muted">
                Public repos work without token. Private repos need a GitHub PAT.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-text-muted">GitHub token (optional)</label>
              <Input
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_..."
                type="password"
              />
              <p className="text-xs text-text-muted">Token is not stored.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-text-muted">Branch</label>
              <div className="flex gap-2">
                <Select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  disabled={branches.length === 0}
                >
                  {branches.length === 0 ? (
                    <option value="">Load branches first</option>
                  ) : (
                    branches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))
                  )}
                </Select>
                <Button
                  type="button"
                  onClick={loadBranches}
                  disabled={!canLoadBranches || stage === 'loading-branches'}
                >
                  {stage === 'loading-branches' ? 'Loading…' : 'Load'}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-text-muted">From (KST)</label>
                <Input
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">To (KST)</label>
                <Input
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  type="date"
                />
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-text-muted">
              KST fixed: 00:00 → 23:59
            </div>
            <Button
              variant="primary"
              onClick={generateReport}
              disabled={!canGenerate || stage === 'generating'}
            >
              {stage === 'generating' ? 'Generating…' : 'Generate report'}
            </Button>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Reports</h2>
              <Button variant="ghost" onClick={refreshReports}>
                Refresh
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              {reports.length === 0 ? (
                <div className="rounded-lg border border-base-border bg-white/5 px-3 py-6 text-center text-sm text-text-muted">
                  No reports yet.
                </div>
              ) : (
                reports.map((r) => (
                  <Link
                    key={r.id}
                    href={`/reports/${r.id}`}
                    className="block rounded-lg border border-base-border bg-white/5 px-3 py-3 transition hover:bg-white/10"
                  >
                    <div className="text-sm font-medium">{r.title}</div>
                    <div className="mt-1 text-xs text-text-muted">
                      {r.repoUrl} · {r.branch}
                    </div>
                    <div className="mt-1 text-xs text-text-muted">
                      {r.fromKst} → {r.toKst}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold">Compare</h2>
            <p className="mt-1 text-sm text-text-muted">
              Pick two reports to get a quick comparison summary.
            </p>
            <div className="mt-4 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Select
                  value={compareLeft}
                  onChange={(e) => setCompareLeft(e.target.value)}
                >
                  <option value="">Left report</option>
                  {reports.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </Select>
                <Select
                  value={compareRight}
                  onChange={(e) => setCompareRight(e.target.value)}
                >
                  <option value="">Right report</option>
                  {reports.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </Select>
              </div>
              <Button onClick={runCompare} disabled={!compareLeft || !compareRight}>
                Compare
              </Button>
              {compareMarkdown ? (
                <div className="rounded-lg border border-base-border bg-base-bg/30 p-3 text-sm text-text-primary">
                  <pre className="whitespace-pre-wrap break-words text-xs leading-5 text-text-primary">
                    {compareMarkdown}
                  </pre>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

