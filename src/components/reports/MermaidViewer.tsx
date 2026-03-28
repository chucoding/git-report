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
      theme: 'dark'
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
    return <div className="text-sm text-text-muted">No diagram.</div>
  }

  if (!svg) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-base-border bg-base-bg/30 px-3 py-2 text-sm text-danger">
          Diagram render failed. Showing source.
        </div>
        <pre className="overflow-auto rounded-lg border border-base-border bg-base-bg/30 p-3 text-xs leading-5">
          {normalized}
        </pre>
      </div>
    )
  }

  return (
    <div className="overflow-auto rounded-lg border border-base-border bg-base-bg/30 p-3">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  )
}

