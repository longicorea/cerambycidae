# Cerambycidae API Worker (Cloudflare D1)

Google Sheets 대신 Cloudflare D1을 사용하는 API 서버입니다.

## 셋업 가이드

### 1. Wrangler CLI 설치 (이미 설치되어 있으면 건너뛰기)

```bash
npm install -g wrangler
```

### 2. Cloudflare 로그인

```bash
wrangler login
```

### 3. D1 데이터베이스 생성

```bash
cd worker
npm install

# D1 데이터베이스 생성
wrangler d1 create cerambycidae-db
```

생성된 데이터베이스 ID를 `wrangler.toml`의 `database_id`에 입력하세요:

```toml
[[d1_databases]]
binding = "DB"
database_name = "cerambycidae-db"
database_id = "여기에_생성된_ID_입력"
```

### 4. R2 버킷 연결

`wrangler.toml`에서 기존 R2 버킷 이름을 설정하세요:

```toml
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "your-existing-r2-bucket-name"
```

### 5. CORS 설정

`wrangler.toml`에서 허용할 도메인을 설정하세요:

```toml
[vars]
ALLOWED_ORIGINS = "https://your-vercel-domain.vercel.app,http://localhost:3000"
```

### 6. 스키마 마이그레이션

```bash
# 로컬 테스트용
wrangler d1 execute cerambycidae-db --local --file=./schema.sql

# 프로덕션
wrangler d1 execute cerambycidae-db --file=./schema.sql
```

### 7. Worker 배포

```bash
# 로컬 개발 서버
npm run dev

# 프로덕션 배포
npm run deploy
```

배포 후 Worker URL이 출력됩니다 (예: `https://cerambycidae-api.your-subdomain.workers.dev`)

---

## 데이터 마이그레이션

### Google Sheets에서 D1으로 데이터 마이그레이션

1. Next.js 프로젝트 루트에서 환경 변수 설정 (`.env`):

```env
# 기존 Google Sheets 설정
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# 새 Worker API URL
NEXT_PUBLIC_WORKER_API_URL=https://cerambycidae-api.your-subdomain.workers.dev
```

2. 마이그레이션 스크립트 실행:

```bash
npx ts-node scripts/migrate-to-d1.ts
```

---

## API 엔드포인트

### 표본 데이터

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/specimens` | 모든 표본 조회 (이미지 포함) |
| GET | `/api/specimens/:coll_id` | 특정 표본 조회 |
| POST | `/api/specimens` | 표본 추가 |
| PUT | `/api/specimens/:coll_id` | 표본 수정 |
| DELETE | `/api/specimens/:coll_id` | 표본 삭제 |

### 검색 & 분류

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/search?q=검색어` | 표본 검색 |
| GET | `/api/taxonomy?level=family` | 분류 계층 조회 |

### 이미지

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/images` | R2 이미지 목록 |
| POST | `/api/images/sync` | R2 이미지를 DB와 동기화 |

### 마이그레이션

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/migrate` | 일괄 데이터 입력 |

---

## Next.js 연동

`.env.local` 또는 Vercel 환경 변수에 추가:

```env
NEXT_PUBLIC_WORKER_API_URL=https://cerambycidae-api.your-subdomain.workers.dev
```

기존 Google Sheets 코드 대신 `src/lib/d1Api.ts`를 사용하세요:

```typescript
import { fetchAllSpecimens, searchSpecimens } from '@src/lib/d1Api';

// 모든 표본 가져오기
const specimens = await fetchAllSpecimens();

// 검색
const results = await searchSpecimens('검색어');
```

---

## 무료 티어 한도

| 항목 | 한도 |
|------|------|
| D1 저장소 | 5GB |
| D1 읽기 | 5백만 rows/일 |
| D1 쓰기 | 10만 rows/일 |
| Workers 요청 | 10만/일 |
| R2 저장소 | 10GB |

이 프로젝트 규모에서는 무료 티어로 충분합니다.
