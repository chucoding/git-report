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
        title: '리포트 생성 중…',
        contributors: [],
        mermaid: 'graph TD\n  A["생성 중"] --> B["잠시만 기다려 주세요"]',
        markdown: '리포트를 생성하고 있습니다…'
      }
    })

    await insertRunLog({ reportId: placeholder.id, stage: 'start', message: '시작' })

    const { fromKst, toKst, card } = await generateReportCard({
      repoUrl: body.repoUrl,
      branch: body.branch,
      fromDate: body.fromDate,
      toDate: body.toDate
    })

    await insertRunLog({ reportId: placeholder.id, stage: 'done', message: '완료' })

    const sb = (await import('@/lib/supabaseServer')).getSupabaseServerClient()
    const { error } = await sb
      .from('reports')
      .update({ from_kst: fromKst, to_kst: toKst, card })
      .eq('id', placeholder.id)
    if (error) throw new Error(error.message)

    return NextResponse.json({ id: placeholder.id })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : '알 수 없는 오류' },
      { status: 400 }
    )
  }
}
