import { NextResponse } from 'next/server'
import { CompareSchema } from '@/lib/schemas'
import { getReportById } from '@/lib/reportsRepo'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const json = (await req.json()) as unknown
    const body = CompareSchema.parse(json)
    const left = await getReportById(body.leftReportId)
    const right = await getReportById(body.rightReportId)
    if (!left || !right) {
      return NextResponse.json(
        { error: '리포트를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const leftC = left.card.contributors.length
    const rightC = right.card.contributors.length
    const markdown = [
      `왼쪽: ${left.card.title}`,
      `오른쪽: ${right.card.title}`,
      '',
      `Repo: ${left.repoUrl}`,
      `기간: ${left.fromKst} → ${left.toKst} / ${right.fromKst} → ${right.toKst}`,
      '',
      `기여자 수: ${leftC} / ${rightC}`
    ].join('\n')

    return NextResponse.json({ markdown }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : '알 수 없는 오류' },
      { status: 400 }
    )
  }
}
