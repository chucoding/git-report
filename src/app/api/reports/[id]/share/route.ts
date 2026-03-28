import { NextResponse } from 'next/server'
import { ensureShareSlug } from '@/lib/reportsRepo'

export const runtime = 'nodejs'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const slug = await ensureShareSlug(params.id)
    const url = new URL(req.url)
    const shareUrl = `${url.origin}/share/${slug}`
    return NextResponse.json({ shareUrl }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : '알 수 없는 오류' },
      { status: 400 }
    )
  }
}
