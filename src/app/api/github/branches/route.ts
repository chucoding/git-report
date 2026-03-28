import { NextResponse } from 'next/server'
import { z } from 'zod'
import { fetchBranches } from '@/lib/github'

export const runtime = 'nodejs'

const Body = z.object({
  repoUrl: z.string().url()
})

export async function POST(req: Request) {
  try {
    const json = (await req.json()) as unknown
    const body = Body.parse(json)
    const branches = await fetchBranches(body.repoUrl)
    return NextResponse.json({ branches })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : '알 수 없는 오류' },
      { status: 400 }
    )
  }
}
