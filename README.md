# git-report

GitHub URL/브랜치/기간(KST 고정)을 입력하면 커밋 diff를 수집하고 OpenAI로 분석해 리포트를 생성·공유하는 Next.js 웹앱입니다.

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
- `GITHUB_TOKEN_DEFAULT`

3) 실행

```bash
pnpm dev
```

## Vercel 배포
Vercel 프로젝트에 아래 환경변수를 설정한 뒤 배포하면 동작합니다.
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Notes
- 기간 입력은 KST 기준으로 00:00~23:59로 고정됩니다.
- GitHub Token은 입력 시에만 사용되며 저장되지 않습니다.
