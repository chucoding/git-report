'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import mermaid from 'mermaid'

export default function MermaidViewer({ code }: { code: string }) {
  const id = useId()
  const [svg, setSvg] = useState<string>('')
  const normalized = useMemo(() => (code || '').trim(), [code])

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'neutral'
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!normalized) {
        setSvg('')
        return
      }
      try {
        const result = await mermaid.render(`m-${id.replace(/:/g, '')}`, normalized)
        if (!cancelled) setSvg(result.svg)
      } catch {
        if (!cancelled) setSvg('')
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [id, normalized])

  if (!normalized) {
    return <div className="text-sm text-text-muted">다이어그램이 없습니다.</div>
  }

  if (!svg) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          다이어그램 렌더링에 실패했습니다. 소스를 표시합니다.
        </div>
        <pre className="overflow-auto rounded-lg border border-base-border bg-base-surface2/70 p-3 text-xs leading-5">
          {normalized}
        </pre>
      </div>
    )
  }

  return (
    <div className="overflow-auto rounded-lg border border-base-border bg-base-surface2/70 p-3">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  )
}
