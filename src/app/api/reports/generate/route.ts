import { NextResponse } from 'next/server'
import { GenerateReportSchema } from '@/lib/schemas'
import { generateReportCard } from '@/lib/reportGenerator'
import { insertReport, insertRunLog } from '@/lib/reportsRepo'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const json = (await req.json()) as unknown
    const body = GenerateReportSchema.parse(json)

    const placeholder = await insertReport({
      repoUrl: body.repoUrl,
      branch: body.branch,
      fromKst: `${body.fromDate} 00:00`,
      toKst: `${body.toDate} 23:59`,
      card: {
        title: 'Generating report…',
        contributors: [],
        mermaid: 'graph TD\n  A["Generating"] --> B["Please wait"]',
        markdown: 'Generating report…'
      }
    })

    await insertRunLog({ reportId: placeholder.id, stage: 'start', message: 'Started' })

    const { fromKst, toKst, card } = await generateReportCard({
      repoUrl: body.repoUrl,
      branch: body.branch,
      fromDate: body.fromDate,
      toDate: body.toDate
    })

    await insertRunLog({ reportId: placeholder.id, stage: 'done', message: 'Generated' })

    const sb = (await import('@/lib/supabaseServer')).getSupabaseServerClient()
    const { error } = await sb
      .from('reports')
      .update({ from_kst: fromKst, to_kst: toKst, card })
      .eq('id', placeholder.id)
    if (error) throw new Error(error.message)

    return NextResponse.json({ id: placeholder.id })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 400 }
    )
  }
}
