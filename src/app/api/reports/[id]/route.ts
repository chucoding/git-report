import { NextResponse } from 'next/server'
import { getReportById } from '@/lib/reportsRepo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const report = await getReportById(params.id)
  if (!report) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ report }, { headers: { 'Cache-Control': 'no-store' } })
}

