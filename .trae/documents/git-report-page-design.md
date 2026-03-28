# Page Design Specification (Desktop-first, Responsive)

## Global Styles
- Layout system: CSS Grid + Flex 혼합(대시보드/카드=Grid, 폼/툴바=Flex). 반응형은 desktop-first로 구성 후 1024px/768px 기준으로 재배치.
- Breakpoints(권장): 1280+ (Desktop), 1024 (Small Desktop), 768 (Tablet), 375 (Mobile).
- Design tokens
  - Background: #0B1220, Surface: #111B2E, Border: rgba(255,255,255,0.08)
  - Text: Primary #E6EDF7, Muted #9FB0CC
  - Accent: #6AA6FF, Success #34D399, Danger #F87171
  - Typography: H1 28/36, H2 22/30, Body 14/22, Mono(코드) 13/20
  - Buttons: primary(Accent), secondary(Surface), hover는 밝기 +6%, disabled는 opacity 0.5
  - Links: Accent, hover 시 underline
- Interaction
  - 로딩: 상단 progress bar + 카드 skeleton
  - 에러: 페이지 상단 inline alert + 재시도 버튼
  - Mermaid 렌더 실패: 코드블록으로 폴백 + “다이어그램 렌더링 실패” 안내

## Page 1) 홈(리포트 생성/대시보드)
### Meta Information
- Title: Git Report | 커밋 diff 분석 리포트
- Description: GitHub 커밋 diff를 요약·시각화·비교하는 리포트 생성기
- OG: og:title/description, og:type=website

### Page Structure
- 상단 App Header(고정): 좌측 로고/앱명, 우측 외부 링크(README), 테마(옵션)
- 메인 컨텐츠(최대폭 1200px, 중앙 정렬)
  1) 입력 패널(카드)
  2) 생성 상태/로그 패널(접이식)
  3) 리포트 목록 + 비교 패널(2열 그리드)

### Sections & Components
1. 입력 패널
- 필드: GitHub URL, Branch, 기간 From/To(캘린더+시간), 안내 텍스트 “KST 기준”
- 옵션: GitHub Token(비공개 입력, “저장되지 않음” 배지)
- CTA: [리포트 생성]

2. 진행 상태
- 단계 배지: “수집 → 분석 → 카드 생성 → 저장”
- SSE/폴링 상태 텍스트, 실패 시 “재시도”

3. 리포트 목록
- 리스트 아이템: repo/branch/기간, 생성일, [상세 보기]

4. 비교 패널
- 2개 리포트 선택(드롭다운/라디오)
- 버튼: [성능 비교], [벤치마크 비교]
- 결과 영역: 요약 카드 2개(Performance / Benchmark), Markdown 미리보기

### Responsive
- 1024px 이하: 입력 패널/목록/비교를 1열 스택
- 768px 이하: 헤더 우측 메뉴를 overflow 메뉴로 축약

## Page 2) 리포트 상세 (/reports/:id)
### Meta Information
- Title: {repo} 리포트 | Git Report
- Description: 커밋 diff 분석 요약 및 시각화
- OG: og:title=리포트 제목, og:type=article

### Page Structure
- 상단 Breadcrumb: 홈 > 리포트
- 상단 요약 바(Sticky 옵션): 기간/브랜치, 공유/다운로드 CTA
- 본문: 카드 그리드(요약/기여자/비교) + Mermaid 섹션 + Markdown 섹션

### Sections & Components
1. Summary Cards (Grid 3열)
- 제목 카드, 기여자 카드(Top N 표), 핵심 변경(짧은 bullet)

2. Mermaid Section
- 탭: [다이어그램] [코드]
- 다이어그램 렌더(스크롤/줌), 코드 복사 버튼

3. Markdown Section
- 렌더링(헤딩/표/코드블록), 우측 목차(Desktop)

4. Actions
- [공유 링크 생성] → 생성 후 URL 표시+복사
- [Markdown 다운로드]

### Responsive
- Desktop: 3열 카드 + 우측 목차
- Tablet/Mobile: 1열 스택, 목차는 상단 드롭다운

## Page 3) 공유 리포트(읽기 전용) (/share/:slug)
### Meta Information
- Title: 공유 리포트 | Git Report
- Description: 공유된 분석 리포트(읽기 전용)
- OG: 공유 링크 미리보기(제목/요약)

### Page Structure & Components
- 상단: “읽기 전용” 배지 + 원본 앱으로 이동 CTA
- 본문: 리포트 상세와 동일 레이아웃이나 편집/생성/비교 액션 제거
- Footer: 생성 시각, 출처 표기(Repo URL)

### Responsive
- 리포트 상세와 동일 규칙 적용
