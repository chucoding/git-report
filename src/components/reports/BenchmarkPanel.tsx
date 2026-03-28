import { type BenchmarkItem } from '@/lib/types'

export default function BenchmarkPanel({
  items
}: {
  items?: BenchmarkItem[]
}) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-base-border bg-white/5 px-3 py-4 text-sm text-text-muted">
        No benchmark items.
      </div>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((it) => (
        <a
          key={it.url}
          href={it.url}
          target="_blank"
          rel="noreferrer"
          className="block rounded-lg border border-base-border bg-white/5 p-3 transition hover:bg-white/10"
        >
          <div className="text-sm font-medium">{it.name}</div>
          <div className="mt-1 line-clamp-2 text-xs text-text-muted">
            {it.summary}
          </div>
          {it.previewImageUrl ? (
            <img
              src={it.previewImageUrl}
              alt="Preview"
              className="mt-3 aspect-[16/9] w-full rounded-md border border-base-border object-cover"
              loading="lazy"
            />
          ) : null}
          <div className="mt-2 truncate text-xs text-accent">{it.url}</div>
        </a>
      ))}
    </div>
  )
}

