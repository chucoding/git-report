'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  const md = (markdown || '').trim()
  if (!md) return <div className="text-sm text-text-muted">No content.</div>

  return (
    <article className="prose prose-invert max-w-none prose-headings:font-display prose-a:text-accent prose-strong:text-text-primary prose-code:font-mono prose-pre:rounded-xl prose-pre:border prose-pre:border-base-border prose-pre:bg-base-bg/35 prose-pre:shadow-surface">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {md}
      </ReactMarkdown>
    </article>
  )
}
