'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  const md = (markdown || '').trim()
  if (!md) return <div className="text-sm text-text-muted">내용이 없습니다.</div>

  return (
    <article className="prose max-w-none prose-headings:font-display prose-headings:text-text-primary prose-p:text-text-primary/90 prose-li:text-text-primary/90 prose-a:text-primary prose-strong:text-text-primary prose-code:font-mono prose-code:text-text-primary prose-pre:rounded-xl prose-pre:border prose-pre:border-base-border prose-pre:bg-base-surface2/70 prose-pre:shadow-surface">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {md}
      </ReactMarkdown>
    </article>
  )
}
