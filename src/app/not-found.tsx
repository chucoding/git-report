import Link from 'next/link'
import AppShell from '@/components/shell/AppShell'
import Card from '@/components/ui/Card'

export default function NotFound() {
  return (
    <AppShell>
      <Card>
        <h1 className="font-display text-2xl font-semibold">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm text-text-muted">
          요청하신 페이지가 존재하지 않습니다.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-xl border border-base-border bg-base-surface2/70 px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-base-surface2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
        >
          홈으로 가기
        </Link>
      </Card>
    </AppShell>
  )
}
