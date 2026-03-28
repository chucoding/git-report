import { type PerfMetric } from '@/lib/types'

function Chip({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-base-border bg-white/5 px-3 py-2">
      <div className="text-[11px] text-text-muted">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  )
}

export default function PerfPanel({ perf }: { perf?: PerfMetric }) {
  if (!perf || perf.status === 'no_change') {
    return (
      <div className="rounded-lg border border-base-border bg-white/5 px-3 py-4 text-sm text-text-muted">
        No performance-related changes detected.
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      <Chip label="CPU" value={perf.cpu} />
      <Chip label="Memory" value={perf.memory} />
      <Chip label="Bundle" value={perf.bundle} />
    </div>
  )
}

