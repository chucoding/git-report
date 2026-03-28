# git-report

GitHub URL/브랜치/기간(KST 고정)을 입력하면 커밋 diff를 수집하고 OpenAI로 분석해 리포트를 생성·공유하는 Next.js 웹앱입니다.

## Docs
- 프로젝트 설명서: [docs/PROJECT.md](file:///c:/Users/hssuh/side_project/git-report/docs/PROJECT.md)

## Routes
- `/`: 리포트 생성(Repo URL/브랜치/기간) + 리포트 목록 + 간단 비교
- `/reports/[id]`: 리포트 상세(기여자/머메이드/마크다운/공유 URL)
- `/share/[slug]`: 공유 리포트(읽기 전용)

## Local setup
1) 의존성 설치

```bash
pnpm install
```

2) 환경변수 설정

`.env.example`을 참고해 로컬 환경변수를 구성하세요.

필수:
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

선택:
- `GITHUB_TOKEN`

3) 실행

```bash
pnpm dev
```

## Requirements
- Node.js >= 20
- pnpm (packageManager: pnpm@10)

## Vercel 배포
Vercel 프로젝트에 아래 환경변수를 설정한 뒤 배포하면 동작합니다.
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Roadmap
- GitHub OAuth 로그인 및 리포트 권한(Private repo 안정 지원)
- 비동기 생성 파이프라인(진행 상태/재시도/실패 로그 UI)
- 비교 기능 강화(지표화/트렌드/차이점 중심 비교)

## Notes
- 기간 입력은 KST 기준으로 00:00~23:59로 고정됩니다.
- GitHub Token은 환경변수로만 사용하며 저장되지 않습니다.
