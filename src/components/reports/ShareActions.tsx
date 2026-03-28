'use client'

import { useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import { Check, Copy, Download, Link2, Loader2 } from 'lucide-react'

export default function ShareActions({ reportId }: { reportId: string }) {
  const [shareUrl, setShareUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const canCopy = useMemo(() => shareUrl.length > 0, [shareUrl])

  async function createShare() {
    setError('')
    setBusy(true)
    try {
      const res = await fetch(`/api/reports/${reportId}/share`, {
        method: 'POST'
      })
      const data = (await res.json()) as { shareUrl?: string; error?: string }
      if (!res.ok)
        throw new Error(data.error || '공유 링크 생성에 실패했습니다.')
      setShareUrl(data.shareUrl || '')
    } catch (e) {
      setError(e instanceof Error ? e.message : '공유 링크 생성에 실패했습니다.')
    } finally {
      setBusy(false)
    }
  }

  async function copy() {
    if (!canCopy) return
    setError('')
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setError('클립보드 복사에 실패했습니다.')
    }
  }

  async function downloadMarkdown() {
    setError('')
    const res = await fetch(`/api/reports/${reportId}`)
    if (!res.ok) {
      setError('마크다운을 불러오지 못했습니다.')
      return
    }
    const data = (await res.json()) as { report?: { card?: { markdown?: string } } }
    const md = data.report?.card?.markdown || ''
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${reportId}.md`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" onClick={createShare} disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              링크 생성 중…
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              공유 링크 만들기
            </>
          )}
        </Button>
        <Button variant="secondary" onClick={copy} disabled={!canCopy}>
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              복사됨
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              복사
            </>
          )}
        </Button>
        <Button variant="secondary" onClick={downloadMarkdown}>
          <Download className="h-4 w-4" />
          마크다운 저장
        </Button>
      </div>
      {shareUrl ? (
        <a
          className="max-w-[22rem] truncate text-sm text-primary hover:underline"
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
        >
          {shareUrl}
        </a>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-danger/25 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </div>
      ) : null}
    </div>
  )
}
