import { notFound } from 'next/navigation'
import AppShell from '@/components/shell/AppShell'
import ReportView from '@/components/reports/ReportView'
import { getPublicReportBySlug } from '@/lib/reportsRepo'

export const dynamic = 'force-dynamic'

export default async function SharePage({
  params
}: {
  params: { slug: string }
}) {
  const report = await getPublicReportBySlug(params.slug)
  if (!report) return notFound()

  return (
    <AppShell>
      <ReportView report={report} mode="share" />
    </AppShell>
  )
}

