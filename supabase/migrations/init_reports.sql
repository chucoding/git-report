create extension if not exists pgcrypto;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  repo_url text not null,
  branch text not null,
  from_kst text not null,
  to_kst text not null,
  is_public boolean not null default false,
  share_slug text,
  card jsonb not null,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_reports_share_slug on public.reports(share_slug);
create index if not exists idx_reports_created_at on public.reports(created_at desc);

create table if not exists public.report_run_logs (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null,
  stage text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_report_run_logs_report_id on public.report_run_logs(report_id);

grant select on public.reports to anon;
grant all privileges on public.reports to authenticated;
grant select on public.report_run_logs to anon;
grant all privileges on public.report_run_logs to authenticated;

