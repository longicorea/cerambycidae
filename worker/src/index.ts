/**
 * Cerambycidae API Worker
 * Cloudflare D1 + R2 통합 API
 */

export interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  ALLOWED_ORIGINS: string;
  ENVIRONMENT: string;
}

// 타입 정의
interface Specimen {
  id: number;
  coll_id: string;
  type: string | null;
  dna_identified: string | null;
  dna_accession_no: string | null;
  seq_identifier: string | null;
  coll_date: string | null;
  collector_name: string | null;
  family_name: string | null;
  subfamily_name: string | null;
  tribe_name: string | null;
  genus_name: string | null;
  species_name: string | null;
  subspecies_name: string | null;
  name_ko: string | null;
  location: string | null;
  host: string | null;
  is_hidden: number;
}

interface SpecimenImage {
  id: number;
  specimen_coll_id: string;
  r2_key: string;
  file_name: string;
  size: number | null;
  uploaded_at: string | null;
  url: string | null;
}

interface SpecimenWithImages extends Specimen {
  imageFiles: {
    key: string;
    size: number;
    uploaded: string;
    url: string;
    name: string;
  }[];
}

// CORS 헤더 생성
function getCorsHeaders(request: Request, env: Env): Headers {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = env.ALLOWED_ORIGINS?.split(",") || [];

  const headers = new Headers();

  if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
    headers.set("Access-Control-Allow-Origin", origin);
  } else if (env.ENVIRONMENT === "development") {
    headers.set("Access-Control-Allow-Origin", "*");
  }

  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Max-Age", "86400");

  return headers;
}

// JSON 응답 헬퍼
function jsonResponse(data: unknown, status: number, corsHeaders: Headers): Response {
  const headers = new Headers(corsHeaders);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status, headers });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = getCorsHeaders(request, env);

    // Preflight 요청 처리
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      // 라우팅
      const path = url.pathname;

      // GET /api/specimens - 모든 표본 조회 (이미지 포함)
      if (path === "/api/specimens" && request.method === "GET") {
        return await getSpecimens(request, env, corsHeaders);
      }

      // GET /api/specimens/:coll_id - 특정 표본 조회
      if (path.startsWith("/api/specimens/") && request.method === "GET") {
        const collId = path.split("/api/specimens/")[1];
        return await getSpecimenById(collId, env, corsHeaders);
      }

      // POST /api/specimens - 표본 추가
      if (path === "/api/specimens" && request.method === "POST") {
        return await createSpecimen(request, env, corsHeaders);
      }

      // PUT /api/specimens/:coll_id - 표본 수정
      if (path.startsWith("/api/specimens/") && request.method === "PUT") {
        const collId = path.split("/api/specimens/")[1];
        return await updateSpecimen(collId, request, env, corsHeaders);
      }

      // DELETE /api/specimens/:coll_id - 표본 삭제
      if (path.startsWith("/api/specimens/") && request.method === "DELETE") {
        const collId = path.split("/api/specimens/")[1];
        return await deleteSpecimen(collId, env, corsHeaders);
      }

      // GET /api/images - R2 이미지 목록
      if (path === "/api/images" && request.method === "GET") {
        return await listImages(request, env, corsHeaders);
      }

      // POST /api/images/sync - R2 이미지를 DB와 동기화
      if (path === "/api/images/sync" && request.method === "POST") {
        return await syncImages(env, corsHeaders);
      }

      // GET /api/taxonomy - 분류 계층 조회
      if (path === "/api/taxonomy" && request.method === "GET") {
        return await getTaxonomy(request, env, corsHeaders);
      }

      // GET /api/search - 검색
      if (path === "/api/search" && request.method === "GET") {
        return await searchSpecimens(request, env, corsHeaders);
      }

      // POST /api/migrate - 데이터 마이그레이션 (일회성)
      if (path === "/api/migrate" && request.method === "POST") {
        return await migrateData(request, env, corsHeaders);
      }

      // POST /api/specimens/:coll_id/images - 이미지 업로드
      if (path.match(/^\/api\/specimens\/[^\/]+\/images$/) && request.method === "POST") {
        const collId = path.split("/api/specimens/")[1].split("/images")[0];
        return await uploadImage(collId, request, env, corsHeaders);
      }

      // DELETE /api/specimens/:coll_id/images/:key - 이미지 삭제
      if (path.match(/^\/api\/specimens\/[^\/]+\/images\//) && request.method === "DELETE") {
        const parts = path.split("/api/specimens/")[1].split("/images/");
        const collId = parts[0];
        const imageKey = decodeURIComponent(parts[1]);
        return await deleteImage(collId, imageKey, env, corsHeaders);
      }

      return jsonResponse({ error: "Not Found" }, 404, corsHeaders);

    } catch (error) {
      console.error("API Error:", error);
      return jsonResponse(
        { error: error instanceof Error ? error.message : "Internal Server Error" },
        500,
        corsHeaders
      );
    }
  },
};

// 모든 표본 조회 (이미지 포함)
async function getSpecimens(request: Request, env: Env, corsHeaders: Headers): Promise<Response> {
  const url = new URL(request.url);
  const includeHidden = url.searchParams.get("includeHidden") === "true";

  let query = `
    SELECT * FROM specimens
    ${includeHidden ? "" : "WHERE is_hidden = 0"}
    ORDER BY family_name, subfamily_name, genus_name, species_name
  `;

  const specimens = await env.DB.prepare(query).all<Specimen>();

  // 각 표본에 이미지 정보 추가
  const specimensWithImages: SpecimenWithImages[] = await Promise.all(
    (specimens.results || []).map(async (specimen) => {
      const images = await env.DB.prepare(
        "SELECT * FROM specimen_images WHERE specimen_coll_id = ?"
      ).bind(specimen.coll_id).all<SpecimenImage>();

      return {
        ...specimen,
        imageFiles: (images.results || []).map(img => ({
          key: img.r2_key,
          size: img.size || 0,
          uploaded: img.uploaded_at || "",
          url: img.url || "",
          name: img.file_name,
        })),
      };
    })
  );

  return jsonResponse(specimensWithImages, 200, corsHeaders);
}

// 특정 표본 조회
async function getSpecimenById(collId: string, env: Env, corsHeaders: Headers): Promise<Response> {
  const specimen = await env.DB.prepare(
    "SELECT * FROM specimens WHERE coll_id = ?"
  ).bind(collId).first<Specimen>();

  if (!specimen) {
    return jsonResponse({ error: "Specimen not found" }, 404, corsHeaders);
  }

  const images = await env.DB.prepare(
    "SELECT * FROM specimen_images WHERE specimen_coll_id = ?"
  ).bind(collId).all<SpecimenImage>();

  const result: SpecimenWithImages = {
    ...specimen,
    imageFiles: (images.results || []).map(img => ({
      key: img.r2_key,
      size: img.size || 0,
      uploaded: img.uploaded_at || "",
      url: img.url || "",
      name: img.file_name,
    })),
  };

  return jsonResponse(result, 200, corsHeaders);
}

// 표본 생성
async function createSpecimen(request: Request, env: Env, corsHeaders: Headers): Promise<Response> {
  const body = await request.json() as Partial<Specimen>;

  if (!body.coll_id) {
    return jsonResponse({ error: "coll_id is required" }, 400, corsHeaders);
  }

  const result = await env.DB.prepare(`
    INSERT INTO specimens (
      coll_id, type, dna_identified, dna_accession_no, seq_identifier,
      coll_date, collector_name, family_name, subfamily_name, tribe_name,
      genus_name, species_name, subspecies_name, name_ko, location, host, is_hidden
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    body.coll_id,
    body.type || null,
    body.dna_identified || null,
    body.dna_accession_no || null,
    body.seq_identifier || null,
    body.coll_date || null,
    body.collector_name || null,
    body.family_name || null,
    body.subfamily_name || null,
    body.tribe_name || null,
    body.genus_name || null,
    body.species_name || null,
    body.subspecies_name || null,
    body.name_ko || null,
    body.location || null,
    body.host || null,
    body.is_hidden ? 1 : 0
  ).run();

  return jsonResponse({ success: true, id: result.meta.last_row_id }, 201, corsHeaders);
}

// 표본 수정
async function updateSpecimen(collId: string, request: Request, env: Env, corsHeaders: Headers): Promise<Response> {
  const body = await request.json() as Partial<Specimen>;

  const result = await env.DB.prepare(`
    UPDATE specimens SET
      type = COALESCE(?, type),
      dna_identified = COALESCE(?, dna_identified),
      dna_accession_no = COALESCE(?, dna_accession_no),
      seq_identifier = COALESCE(?, seq_identifier),
      coll_date = COALESCE(?, coll_date),
      collector_name = COALESCE(?, collector_name),
      family_name = COALESCE(?, family_name),
      subfamily_name = COALESCE(?, subfamily_name),
      tribe_name = COALESCE(?, tribe_name),
      genus_name = COALESCE(?, genus_name),
      species_name = COALESCE(?, species_name),
      subspecies_name = COALESCE(?, subspecies_name),
      name_ko = COALESCE(?, name_ko),
      location = COALESCE(?, location),
      host = COALESCE(?, host),
      is_hidden = COALESCE(?, is_hidden),
      updated_at = CURRENT_TIMESTAMP
    WHERE coll_id = ?
  `).bind(
    body.type,
    body.dna_identified,
    body.dna_accession_no,
    body.seq_identifier,
    body.coll_date,
    body.collector_name,
    body.family_name,
    body.subfamily_name,
    body.tribe_name,
    body.genus_name,
    body.species_name,
    body.subspecies_name,
    body.name_ko,
    body.location,
    body.host,
    body.is_hidden !== undefined ? (body.is_hidden ? 1 : 0) : null,
    collId
  ).run();

  if (result.meta.changes === 0) {
    return jsonResponse({ error: "Specimen not found" }, 404, corsHeaders);
  }

  return jsonResponse({ success: true }, 200, corsHeaders);
}

// 표본 삭제
async function deleteSpecimen(collId: string, env: Env, corsHeaders: Headers): Promise<Response> {
  // 연관 이미지도 삭제
  await env.DB.prepare("DELETE FROM specimen_images WHERE specimen_coll_id = ?").bind(collId).run();

  const result = await env.DB.prepare("DELETE FROM specimens WHERE coll_id = ?").bind(collId).run();

  if (result.meta.changes === 0) {
    return jsonResponse({ error: "Specimen not found" }, 404, corsHeaders);
  }

  return jsonResponse({ success: true }, 200, corsHeaders);
}

// R2 이미지 목록 조회
async function listImages(request: Request, env: Env, corsHeaders: Headers): Promise<Response> {
  const url = new URL(request.url);
  const prefix = url.searchParams.get("prefix") || "";

  const listed = await env.R2_BUCKET.list({ prefix });

  const images = listed.objects.map(obj => ({
    key: obj.key,
    size: obj.size,
    uploaded: obj.uploaded.toISOString(),
    url: `https://my-cdn-worker.longicorea.workers.dev/${obj.key}`,
  }));

  return jsonResponse(images, 200, corsHeaders);
}

// R2 이미지를 DB와 동기화
async function syncImages(env: Env, corsHeaders: Headers): Promise<Response> {
  // 먼저 모든 coll_id 가져오기 (캐싱)
  const allSpecimens = await env.DB.prepare("SELECT coll_id FROM specimens").all();
  const validCollIds = new Set((allSpecimens.results || []).map((s: { coll_id: string }) => s.coll_id));

  // R2에서 이미지 목록 가져오기 (페이지네이션)
  let cursor: string | undefined;
  let synced = 0;
  const batchStatements: D1PreparedStatement[] = [];

  do {
    const listed = await env.R2_BUCKET.list({ cursor, limit: 500 });
    cursor = listed.truncated ? listed.cursor : undefined;

    for (const obj of listed.objects) {
      const fileName = obj.key.split("/").pop() || obj.key;

      // 파일명에서 coll_id 추출 (예: 250722-SHL-23_L_Dorsal.webp → 250722-SHL-23)
      const collIdMatch = fileName.match(/^(\d{6}-[A-Z]+-\d+)/i);
      if (!collIdMatch) continue;

      const collId = collIdMatch[1];

      // 캐싱된 coll_id 확인
      if (!validCollIds.has(collId)) continue;

      // 배치에 추가
      batchStatements.push(
        env.DB.prepare(`
          INSERT OR REPLACE INTO specimen_images (specimen_coll_id, r2_key, file_name, size, uploaded_at, url)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          collId,
          obj.key,
          fileName,
          obj.size,
          obj.uploaded.toISOString(),
          `https://my-cdn-worker.longicorea.workers.dev/${obj.key}`
        )
      );

      synced++;

      // 100개씩 배치 실행
      if (batchStatements.length >= 100) {
        await env.DB.batch(batchStatements);
        batchStatements.length = 0;
      }
    }
  } while (cursor);

  // 남은 배치 실행
  if (batchStatements.length > 0) {
    await env.DB.batch(batchStatements);
  }

  return jsonResponse({ success: true, synced }, 200, corsHeaders);
}

// 분류 계층 조회
async function getTaxonomy(request: Request, env: Env, corsHeaders: Headers): Promise<Response> {
  const url = new URL(request.url);
  const level = url.searchParams.get("level") || "family";
  const parent = url.searchParams.get("parent");

  let query = "";
  let params: string[] = [];

  switch (level) {
    case "family":
      query = `
        SELECT DISTINCT family_name as name, COUNT(*) as count
        FROM specimens WHERE is_hidden = 0 AND family_name IS NOT NULL
        GROUP BY family_name ORDER BY family_name
      `;
      break;
    case "subfamily":
      query = `
        SELECT DISTINCT subfamily_name as name, COUNT(*) as count
        FROM specimens WHERE is_hidden = 0 AND family_name = ? AND subfamily_name IS NOT NULL
        GROUP BY subfamily_name ORDER BY subfamily_name
      `;
      params = [parent || ""];
      break;
    case "genus":
      query = `
        SELECT DISTINCT genus_name as name, COUNT(*) as count
        FROM specimens WHERE is_hidden = 0 AND subfamily_name = ? AND genus_name IS NOT NULL
        GROUP BY genus_name ORDER BY genus_name
      `;
      params = [parent || ""];
      break;
    case "species":
      query = `
        SELECT DISTINCT species_name as name, subspecies_name, COUNT(*) as count
        FROM specimens WHERE is_hidden = 0 AND genus_name = ? AND species_name IS NOT NULL
        GROUP BY species_name, subspecies_name ORDER BY species_name
      `;
      params = [parent || ""];
      break;
  }

  const stmt = env.DB.prepare(query);
  const result = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

  return jsonResponse(result.results, 200, corsHeaders);
}

// 검색
async function searchSpecimens(request: Request, env: Env, corsHeaders: Headers): Promise<Response> {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const limit = parseInt(url.searchParams.get("limit") || "50");

  if (!q) {
    return jsonResponse([], 200, corsHeaders);
  }

  const searchTerm = `%${q}%`;

  const specimens = await env.DB.prepare(`
    SELECT * FROM specimens
    WHERE is_hidden = 0 AND (
      coll_id LIKE ? OR
      name_ko LIKE ? OR
      genus_name LIKE ? OR
      species_name LIKE ? OR
      location LIKE ? OR
      host LIKE ?
    )
    ORDER BY family_name, subfamily_name, genus_name, species_name
    LIMIT ?
  `).bind(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, limit).all<Specimen>();

  // 이미지 정보 추가
  const results: SpecimenWithImages[] = await Promise.all(
    (specimens.results || []).map(async (specimen) => {
      const images = await env.DB.prepare(
        "SELECT * FROM specimen_images WHERE specimen_coll_id = ?"
      ).bind(specimen.coll_id).all<SpecimenImage>();

      return {
        ...specimen,
        imageFiles: (images.results || []).map(img => ({
          key: img.r2_key,
          size: img.size || 0,
          uploaded: img.uploaded_at || "",
          url: img.url || "",
          name: img.file_name,
        })),
      };
    })
  );

  return jsonResponse(results, 200, corsHeaders);
}

// 이미지 업로드
async function uploadImage(collId: string, request: Request, env: Env, corsHeaders: Headers): Promise<Response> {
  // 표본 존재 확인
  const specimen = await env.DB.prepare(
    "SELECT coll_id FROM specimens WHERE coll_id = ?"
  ).bind(collId).first();

  if (!specimen) {
    return jsonResponse({ error: "Specimen not found" }, 404, corsHeaders);
  }

  // FormData에서 파일 가져오기
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return jsonResponse({ error: "No file provided" }, 400, corsHeaders);
  }

  // 파일명 생성 (coll_id_원본파일명.확장자)
  const originalName = file.name;
  const extension = originalName.split(".").pop() || "webp";
  const timestamp = Date.now();
  const fileName = `${collId}_${timestamp}.${extension}`;
  const r2Key = `images/${fileName}`;

  // R2에 업로드
  const arrayBuffer = await file.arrayBuffer();
  await env.R2_BUCKET.put(r2Key, arrayBuffer, {
    httpMetadata: {
      contentType: file.type || "image/webp",
    },
  });

  // DB에 레코드 추가
  const url = `https://my-cdn-worker.longicorea.workers.dev/${r2Key}`;
  const uploadedAt = new Date().toISOString();

  await env.DB.prepare(`
    INSERT INTO specimen_images (specimen_coll_id, r2_key, file_name, size, uploaded_at, url)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(collId, r2Key, fileName, file.size, uploadedAt, url).run();

  return jsonResponse({
    success: true,
    image: {
      key: r2Key,
      name: fileName,
      size: file.size,
      uploaded: uploadedAt,
      url: url,
    }
  }, 201, corsHeaders);
}

// 이미지 삭제
async function deleteImage(collId: string, imageKey: string, env: Env, corsHeaders: Headers): Promise<Response> {
  // 표본 존재 확인
  const specimen = await env.DB.prepare(
    "SELECT coll_id FROM specimens WHERE coll_id = ?"
  ).bind(collId).first();

  if (!specimen) {
    return jsonResponse({ error: "Specimen not found" }, 404, corsHeaders);
  }

  // 이미지 레코드 확인
  const image = await env.DB.prepare(
    "SELECT * FROM specimen_images WHERE specimen_coll_id = ? AND r2_key = ?"
  ).bind(collId, imageKey).first();

  if (!image) {
    return jsonResponse({ error: "Image not found" }, 404, corsHeaders);
  }

  // R2에서 삭제
  await env.R2_BUCKET.delete(imageKey);

  // DB에서 레코드 삭제
  await env.DB.prepare(
    "DELETE FROM specimen_images WHERE specimen_coll_id = ? AND r2_key = ?"
  ).bind(collId, imageKey).run();

  return jsonResponse({ success: true }, 200, corsHeaders);
}

// 데이터 마이그레이션 (Google Sheets에서 가져온 데이터를 일괄 입력)
async function migrateData(request: Request, env: Env, corsHeaders: Headers): Promise<Response> {
  const body = await request.json() as { specimens: Partial<Specimen>[] };

  if (!body.specimens || !Array.isArray(body.specimens)) {
    return jsonResponse({ error: "specimens array is required" }, 400, corsHeaders);
  }

  let inserted = 0;
  let errors: string[] = [];

  for (const specimen of body.specimens) {
    if (!specimen.coll_id) {
      errors.push("Missing coll_id for specimen");
      continue;
    }

    try {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO specimens (
          coll_id, type, dna_identified, dna_accession_no, seq_identifier,
          coll_date, collector_name, family_name, subfamily_name, tribe_name,
          genus_name, species_name, subspecies_name, name_ko, location, host, is_hidden
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        specimen.coll_id,
        specimen.type || null,
        specimen.dna_identified || null,
        specimen.dna_accession_no || null,
        specimen.seq_identifier || null,
        specimen.coll_date || null,
        specimen.collector_name || null,
        specimen.family_name || null,
        specimen.subfamily_name || null,
        specimen.tribe_name || null,
        specimen.genus_name || null,
        specimen.species_name || null,
        specimen.subspecies_name || null,
        specimen.name_ko || null,
        specimen.location || null,
        specimen.host || null,
        specimen.is_hidden ? 1 : 0
      ).run();

      inserted++;
    } catch (e) {
      errors.push(`Error inserting ${specimen.coll_id}: ${e}`);
    }
  }

  return jsonResponse({ success: true, inserted, errors }, 200, corsHeaders);
}
