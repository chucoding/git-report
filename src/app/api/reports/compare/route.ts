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
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    const leftC = left.card.contributors.length
    const rightC = right.card.contributors.length
    const markdown = [
      `Left: ${left.card.title}`,
      `Right: ${right.card.title}`,
      '',
      `Repo: ${left.repoUrl}`,
      `Range: ${left.fromKst} → ${left.toKst} vs ${right.fromKst} → ${right.toKst}`,
      '',
      `Contributors listed: ${leftC} vs ${rightC}`
    ].join('\n')

    return NextResponse.json({ markdown }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 400 }
    )
  }
}

