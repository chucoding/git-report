import Card from '@/components/ui/Card'
import ShareActions from './ShareActions'
import ContributorDashboard from './ContributorDashboard'
import MermaidViewer from './MermaidViewer'
import MarkdownViewer from './MarkdownViewer'
import PerfPanel from './PerfPanel'
import BenchmarkPanel from './BenchmarkPanel'
import { type Report } from '@/lib/types'

export default function ReportView({
  report,
  mode
}: {
  report: Report
  mode: 'full' | 'share'
}) {
  const top = report.card

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {top.title}
        </h1>
        <div className="flex flex-col gap-1 text-sm text-text-muted sm:flex-row sm:items-center sm:gap-3">
          <div className="truncate">{report.repoUrl}</div>
          <div className="hidden sm:block">·</div>
          <div>Branch: {report.branch}</div>
          <div className="hidden sm:block">·</div>
          <div>
            {report.fromKst} → {report.toKst} (KST)
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-text-muted">
          Report ID: {report.id}
        </div>
        {mode === 'full' ? <ShareActions reportId={report.id} /> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-text-muted">Contributors</h2>
          <div className="mt-3">
            <ContributorDashboard contributors={top.contributors} />
          </div>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-text-muted">Performance</h2>
          <div className="mt-3">
            <PerfPanel perf={top.perf} />
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-text-muted">Flow</h2>
        <div className="mt-3">
          <MermaidViewer code={top.mermaid} />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-text-muted">Report</h2>
        <div className="mt-3">
          <MarkdownViewer markdown={top.markdown} />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-text-muted">Benchmark comparison</h2>
        <div className="mt-3">
          <BenchmarkPanel items={top.benchmarks} />
        </div>
      </Card>
    </div>
  )
}

