import Link from 'next/link'
import AppShell from '@/components/shell/AppShell'
import Card from '@/components/ui/Card'

export default function NotFound() {
  return (
    <AppShell>
      <Card>
        <h1 className="text-xl font-semibold">Not found</h1>
        <p className="mt-2 text-sm text-text-muted">
          The requested page does not exist.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-md bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
        >
          Go home
        </Link>
      </Card>
    </AppShell>
  )
}

