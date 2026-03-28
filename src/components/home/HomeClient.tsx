'use client'

import { useEffect, useMemo, useState } from 'react'
import AppShell from '@/components/shell/AppShell'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { parseRepoUrl } from '@/lib/repoUrl'
import { isValidIsoDate } from '@/lib/kst'

function RepoUrlCard(props: {
  repoUrl: string
  onChange: (value: string) => void
}) {
  return (
    <Card>
      <div className="space-y-2">
        <label className="flex items-baseline justify-between text-xs font-medium tracking-[0.16em] text-text-muted">
          <span>GitHub URL</span>
          <span className="font-mono text-[10px] text-text-muted/70">01</span>
        </label>
        <Input
          value={props.repoUrl}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="https://github.com/org/repo"
          inputMode="url"
          className="font-mono"
        />
      </div>
    </Card>
  )
}

function BranchSelectCard(props: {
  branches: string[]
  branch: string
  isLoading: boolean
  disabled: boolean
  onChange: (value: string) => void
}) {
  return (
    <Card>
      <div className="space-y-2">
        <label className="flex items-baseline justify-between text-xs font-medium tracking-[0.16em] text-text-muted">
          <span>브랜치</span>
          <span className="font-mono text-[10px] text-text-muted/70">02</span>
        </label>
        <Select
          value={props.branch}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
        >
          {props.isLoading ? (
            <option value="">Loading…</option>
          ) : props.branches.length === 0 ? (
            <option value="">브랜치를 불러올 수 없습니다</option>
          ) : (
            props.branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))
          )}
        </Select>
      </div>
    </Card>
  )
}

function DateRangeCard(props: {
  fromDate: string
  toDate: string
  onChangeFrom: (value: string) => void
  onChangeTo: (value: string) => void
  canSubmit: boolean
  isSubmitting: boolean
  onSubmit: () => void
  error: string
}) {
  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="flex items-baseline justify-between text-xs font-medium tracking-[0.16em] text-text-muted">
            <span>시작 날짜</span>
            <span className="font-mono text-[10px] text-text-muted/70">03</span>
          </label>
          <Input
            value={props.fromDate}
            onChange={(e) => props.onChangeFrom(e.target.value)}
            type="date"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-baseline justify-between text-xs font-medium tracking-[0.16em] text-text-muted">
            <span>끝 날짜</span>
            <span className="font-mono text-[10px] text-text-muted/70">04</span>
          </label>
          <Input
            value={props.toDate}
            onChange={(e) => props.onChangeTo(e.target.value)}
            type="date"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-base-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-text-muted">
          시간은 00:00 ~ 23:59 KST 고정
        </div>
        <Button
          variant="primary"
          onClick={props.onSubmit}
          disabled={!props.canSubmit || props.isSubmitting}
        >
          {props.isSubmitting ? 'Generating…' : 'Generate report'}
        </Button>
      </div>

      {props.error ? (
        <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {props.error}
        </div>
      ) : null}
    </Card>
  )
}

export default function HomeClient() {
  const [repoUrl, setRepoUrl] = useState('')
  const [branches, setBranches] = useState<string[]>([])
  const [branch, setBranch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [isLoadingBranches, setIsLoadingBranches] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string>('')

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
    setError('')
    if (!canLoadBranches) {
      setBranches([])
      setBranch('')
      return
    }

    const t = setTimeout(() => {
      void (async () => {
        setIsLoadingBranches(true)
        setBranches([])
        setBranch('')
        try {
          const res = await fetch('/api/github/branches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repoUrl })
          })
          const data = (await res.json()) as {
            branches?: string[]
            error?: string
          }
          if (!res.ok) throw new Error(data.error || 'Failed to load branches')
          const list = data.branches || []
          setBranches(list)
          setBranch(list[0] || '')
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Unknown error')
        } finally {
          setIsLoadingBranches(false)
        }
      })()
    }, 400)

    return () => clearTimeout(t)
  }, [canLoadBranches, repoUrl])

  async function generateReport() {
    if (!canGenerate) return
    setError('')
    setIsGenerating(true)
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl,
          branch,
          fromDate,
          toDate
        })
      })
      const data = (await res.json()) as { id?: string; error?: string }
      if (!res.ok) throw new Error(data.error || 'Failed to generate report')
      if (data.id) {
        window.location.href = `/reports/${data.id}`
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AppShell>
      <div className="space-y-7 sm:space-y-8">
        <RepoUrlCard repoUrl={repoUrl} onChange={setRepoUrl} />

        {canLoadBranches ? (
          <div className="animate-fade-in-up">
            <BranchSelectCard
              branches={branches}
              branch={branch}
              isLoading={isLoadingBranches}
              disabled={isLoadingBranches || branches.length === 0}
              onChange={setBranch}
            />
          </div>
        ) : null}

        <DateRangeCard
          fromDate={fromDate}
          toDate={toDate}
          onChangeFrom={setFromDate}
          onChangeTo={setToDate}
          canSubmit={canGenerate}
          isSubmitting={isGenerating}
          onSubmit={generateReport}
          error={error}
        />
      </div>
    </AppShell>
  )
}
