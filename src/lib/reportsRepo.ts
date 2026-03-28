import { nanoid } from 'nanoid'
import { getSupabaseServerClient } from './supabaseServer'
import { type Report, type ReportSummary } from './types'

type DbReportRow = {
  id: string
  repo_url: string
  branch: string
  from_kst: string
  to_kst: string
  is_public: boolean
  share_slug: string | null
  created_at: string
  card: unknown
}

function mapRow(row: DbReportRow): Report {
  return {
    id: row.id,
    repoUrl: row.repo_url,
    branch: row.branch,
    fromKst: row.from_kst,
    toKst: row.to_kst,
    isPublic: row.is_public,
    shareSlug: row.share_slug,
    createdAt: row.created_at,
    card: row.card as Report['card']
  }
}

export async function insertReport(input: {
  repoUrl: string
  branch: string
  fromKst: string
  toKst: string
  card: Report['card']
}): Promise<Report> {
  const sb = getSupabaseServerClient()
  const { data, error } = await sb
    .from('reports')
    .insert({
      repo_url: input.repoUrl,
      branch: input.branch,
      from_kst: input.fromKst,
      to_kst: input.toKst,
      is_public: false,
      card: input.card
    })
    .select('*')
    .single()

  if (error || !data) throw new Error(error?.message || 'Insert failed')
  return mapRow(data as DbReportRow)
}

export async function listReports(limit = 20): Promise<ReportSummary[]> {
  const sb = getSupabaseServerClient()
  const { data, error } = await sb
    .from('reports')
    .select('id, repo_url, branch, from_kst, to_kst, created_at, card')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  const rows = (data || []) as DbReportRow[]
  return rows.map((r) => {
    const card = r.card as { title?: string } | undefined
    return {
      id: r.id,
      title: card?.title || 'Untitled report',
      repoUrl: r.repo_url,
      branch: r.branch,
      fromKst: r.from_kst,
      toKst: r.to_kst,
      createdAt: r.created_at
    }
  })
}

export async function getReportById(id: string): Promise<Report | null> {
  const sb = getSupabaseServerClient()
  const { data, error } = await sb.from('reports').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return mapRow(data as DbReportRow)
}

export async function getPublicReportBySlug(slug: string): Promise<Report | null> {
  const sb = getSupabaseServerClient()
  const { data, error } = await sb
    .from('reports')
    .select('*')
    .eq('share_slug', slug)
    .eq('is_public', true)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return mapRow(data as DbReportRow)
}

export async function ensureShareSlug(id: string): Promise<string> {
  const sb = getSupabaseServerClient()
  const { data, error } = await sb
    .from('reports')
    .select('id, share_slug')
    .eq('id', id)
    .single()
  if (error || !data) throw new Error(error?.message || '찾을 수 없습니다.')

  const existing = (data as { share_slug: string | null }).share_slug
  if (existing) {
    const { error: updErr } = await sb
      .from('reports')
      .update({ is_public: true })
      .eq('id', id)
    if (updErr) throw new Error(updErr.message)
    return existing
  }

  const slug = nanoid(10)
  const { error: updErr } = await sb
    .from('reports')
    .update({ is_public: true, share_slug: slug })
    .eq('id', id)

  if (updErr) throw new Error(updErr.message)
  return slug
}

export async function insertRunLog(input: {
  reportId: string
  stage: string
  message: string
}) {
  const sb = getSupabaseServerClient()
  const { error } = await sb.from('report_run_logs').insert({
    report_id: input.reportId,
    stage: input.stage,
    message: input.message
  })
  if (error) throw new Error(error.message)
}
