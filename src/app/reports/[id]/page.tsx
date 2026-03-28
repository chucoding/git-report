import { notFound } from 'next/navigation'
import AppShell from '@/components/shell/AppShell'
import ReportView from '@/components/reports/ReportView'
import { getReportById } from '@/lib/reportsRepo'

export const dynamic = 'force-dynamic'

export default async function ReportPage({
  params
}: {
  params: { id: string }
}) {
  const report = await getReportById(params.id)
  if (!report) return notFound()

  return (
    <AppShell>
      <ReportView report={report} mode="full" />
    </AppShell>
  )
}

