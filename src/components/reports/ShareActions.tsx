'use client'

import { useMemo, useState } from 'react'
import Button from '@/components/ui/Button'

export default function ShareActions({ reportId }: { reportId: string }) {
  const [shareUrl, setShareUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const canCopy = useMemo(() => shareUrl.length > 0, [shareUrl])

  async function createShare() {
    setBusy(true)
    try {
      const res = await fetch(`/api/reports/${reportId}/share`, {
        method: 'POST'
      })
      const data = (await res.json()) as { shareUrl?: string; error?: string }
      if (!res.ok) throw new Error(data.error || 'Failed to create share link')
      setShareUrl(data.shareUrl || '')
    } finally {
      setBusy(false)
    }
  }

  async function copy() {
    if (!canCopy) return
    await navigator.clipboard.writeText(shareUrl)
  }

  async function downloadMarkdown() {
    const res = await fetch(`/api/reports/${reportId}`)
    if (!res.ok) return
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
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={createShare} disabled={busy}>
        {busy ? 'Working…' : 'Create share URL'}
      </Button>
      <Button onClick={copy} disabled={!canCopy}>
        Copy
      </Button>
      <Button onClick={downloadMarkdown}>Download Markdown</Button>
      {shareUrl ? (
        <a
          className="max-w-[18rem] truncate text-sm text-accent hover:underline"
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
        >
          {shareUrl}
        </a>
      ) : null}
    </div>
  )
}

