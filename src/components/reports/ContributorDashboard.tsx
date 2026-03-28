import { type ContributorStat } from '@/lib/types'

export default function ContributorDashboard({
  contributors
}: {
  contributors: ContributorStat[]
}) {
  const max = Math.max(1, ...contributors.map((c) => c.commits))

  return (
    <div className="space-y-3">
      {contributors.length === 0 ? (
        <div className="text-sm text-text-muted">No contributors found.</div>
      ) : null}
      {contributors.map((c) => (
        <div key={c.login} className="flex items-center gap-3">
          <img
            src={c.avatarUrl}
            alt={c.login}
            className="h-9 w-9 rounded-full border border-base-border"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="truncate text-sm font-medium">{c.login}</div>
              <div className="text-xs text-text-muted">{c.commits} commits</div>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/5">
              <div
                className="h-2 rounded-full bg-accent"
                style={{ width: `${Math.round((c.commits / max) * 100)}%` }}
              />
            </div>
            <div className="mt-1 text-[11px] text-text-muted">
              +{c.additions} / -{c.deletions}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

