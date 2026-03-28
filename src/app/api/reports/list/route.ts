import { NextResponse } from 'next/server'
import { listReports } from '@/lib/reportsRepo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const reports = await listReports(30)
  return NextResponse.json({ reports }, { headers: { 'Cache-Control': 'no-store' } })
}

