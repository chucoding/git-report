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
    <div className="space-y-7 sm:space-y-8">
      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="text-xs font-medium tracking-[0.22em] text-text-muted">
              리포트
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {top.title}
            </h1>
          </div>
          {mode === 'full' ? <ShareActions reportId={report.id} /> : null}
        </div>

        <div className="flex flex-col gap-2 text-sm text-text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
          <div className="min-w-0 truncate font-mono text-[12px]">
            {report.repoUrl}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-base-border bg-base-surface2/70 px-2 py-0.5 text-[12px] text-text-primary">
              브랜치: <span className="font-mono">{report.branch}</span>
            </span>
            <span className="rounded-full border border-base-border bg-base-surface2/70 px-2 py-0.5 text-[12px] text-text-primary">
              기간: <span className="font-mono">{report.fromKst}</span> →{' '}
              <span className="font-mono">{report.toKst}</span> (KST)
            </span>
            <span className="rounded-full border border-base-border bg-base-surface2/70 px-2 py-0.5 text-[12px] text-text-primary">
              ID: <span className="font-mono">{report.id}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card
          className="animate-fade-in-up motion-reduce:animate-none lg:col-span-2"
          style={{ animationDelay: '40ms' }}
        >
          <h2 className="text-xs font-semibold tracking-[0.18em] text-text-muted">
            기여자
          </h2>
          <div className="mt-3">
            <ContributorDashboard contributors={top.contributors} />
          </div>
        </Card>
        <Card
          className="animate-fade-in-up motion-reduce:animate-none"
          style={{ animationDelay: '90ms' }}
        >
          <h2 className="text-xs font-semibold tracking-[0.18em] text-text-muted">
            성능
          </h2>
          <div className="mt-3">
            <PerfPanel perf={top.perf} />
          </div>
        </Card>
      </div>

      <Card
        className="animate-fade-in-up motion-reduce:animate-none"
        style={{ animationDelay: '130ms' }}
      >
        <h2 className="text-xs font-semibold tracking-[0.18em] text-text-muted">
          플로우
        </h2>
        <div className="mt-3">
          <MermaidViewer code={top.mermaid} />
        </div>
      </Card>

      <Card
        className="animate-fade-in-up motion-reduce:animate-none"
        style={{ animationDelay: '170ms' }}
      >
        <h2 className="text-xs font-semibold tracking-[0.18em] text-text-muted">
          리포트 본문
        </h2>
        <div className="mt-3">
          <MarkdownViewer markdown={top.markdown} />
        </div>
      </Card>

      <Card
        className="animate-fade-in-up motion-reduce:animate-none"
        style={{ animationDelay: '210ms' }}
      >
        <h2 className="text-xs font-semibold tracking-[0.18em] text-text-muted">
          벤치마크 비교
        </h2>
        <div className="mt-3">
          <BenchmarkPanel items={top.benchmarks} />
        </div>
      </Card>
    </div>
  )
}
