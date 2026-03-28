import { type PerfMetric } from '@/lib/types'

function Chip({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-base-border bg-base-surface2/70 px-3 py-2">
      <div className="text-[11px] text-text-muted">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  )
}

export default function PerfPanel({ perf }: { perf?: PerfMetric }) {
  if (!perf || perf.status === 'no_change') {
    return (
      <div className="rounded-xl border border-base-border bg-base-surface2/70 px-3 py-4 text-sm text-text-muted">
        성능 관련 변경 사항이 감지되지 않았습니다.
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      <Chip label="CPU" value={perf.cpu} />
      <Chip label="메모리" value={perf.memory} />
      <Chip label="번들" value={perf.bundle} />
    </div>
  )
}
