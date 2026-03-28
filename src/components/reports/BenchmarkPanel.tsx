import { type BenchmarkItem } from '@/lib/types'

export default function BenchmarkPanel({
  items
}: {
  items?: BenchmarkItem[]
}) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-base-border bg-base-surface2/70 px-3 py-4 text-sm text-text-muted">
        벤치마크 항목이 없습니다.
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
          className="block rounded-xl border border-base-border bg-base-surface2/70 p-3 transition hover:bg-base-surface2"
        >
          <div className="text-sm font-medium">{it.name}</div>
          <div className="mt-1 line-clamp-2 text-xs text-text-muted">
            {it.summary}
          </div>
          {it.previewImageUrl ? (
            <img
              src={it.previewImageUrl}
              alt="미리보기"
              className="mt-3 aspect-[16/9] w-full rounded-lg border border-base-border object-cover"
              loading="lazy"
            />
          ) : null}
          <div className="mt-2 truncate text-xs text-primary">{it.url}</div>
        </a>
      ))}
    </div>
  )
}
