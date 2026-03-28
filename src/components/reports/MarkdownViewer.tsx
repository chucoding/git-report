'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  const md = (markdown || '').trim()
  if (!md) return <div className="text-sm text-text-muted">No content.</div>

  return (
    <article className="prose prose-invert max-w-none prose-pre:bg-base-bg/50 prose-pre:border prose-pre:border-base-border prose-a:text-accent">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {md}
      </ReactMarkdown>
    </article>
  )
}

