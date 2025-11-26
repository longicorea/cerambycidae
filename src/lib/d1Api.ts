/**
 * Cloudflare D1 Worker API 클라이언트
 */

import { CollDataType, DriveImageInfo } from "@src/data/collData";

// Worker API URL (환경 변수로 관리)
const API_BASE_URL = process.env.NEXT_PUBLIC_WORKER_API_URL || "https://cerambycidae-api.your-subdomain.workers.dev";

// API 응답을 기존 CollDataType 형식으로 변환
interface ApiSpecimen {
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
  imageFiles: {
    key: string;
    size: number;
    uploaded: string;
    url: string;
    name: string;
  }[];
}

// API 응답을 기존 형식으로 변환
function transformToCollDataType(specimen: ApiSpecimen): CollDataType {
  return {
    id: String(specimen.id),
    coll_id: specimen.coll_id,
    type: specimen.type || "",
    dna_identified: specimen.dna_identified || "",
    dna_accession_no: specimen.dna_accession_no || "",
    seq_identifier: specimen.seq_identifier || "",
    coll_date: specimen.coll_date || "",
    collector_name: specimen.collector_name || "",
    family_name: specimen.family_name || "",
    subfamily_name: specimen.subfamily_name || "",
    tribe_name: specimen.tribe_name || "",
    genus_name: specimen.genus_name || "",
    species_name: specimen.species_name || "",
    subspecies_name: specimen.subspecies_name || "",
    name_ko: specimen.name_ko || "",
    location: specimen.location || "",
    host: specimen.host || "",
    is_hidden: specimen.is_hidden === 1,
    imageFiles: specimen.imageFiles?.map(img => ({
      key: img.key,
      size: img.size,
      uploaded: img.uploaded,
      url: img.url,
      name: img.name,
    })) || [],
  };
}

/**
 * 모든 표본 데이터 가져오기
 */
export async function fetchAllSpecimens(includeHidden = false): Promise<CollDataType[]> {
  const url = `${API_BASE_URL}/api/specimens${includeHidden ? "?includeHidden=true" : ""}`;

  const response = await fetch(url, {
    next: { revalidate: 60 }, // 60초 캐시 (Next.js)
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.statusText}`);
  }

  const data: ApiSpecimen[] = await response.json();
  return data.map(transformToCollDataType);
}

/**
 * 특정 표본 데이터 가져오기
 */
export async function fetchSpecimenById(collId: string): Promise<CollDataType | null> {
  const url = `${API_BASE_URL}/api/specimens/${encodeURIComponent(collId)}`;

  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.statusText}`);
  }

  const data: ApiSpecimen = await response.json();
  return transformToCollDataType(data);
}

/**
 * 검색
 */
export async function searchSpecimens(query: string, limit = 50): Promise<CollDataType[]> {
  const url = `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`;

  const response = await fetch(url, {
    next: { revalidate: 30 }, // 검색은 30초 캐시
  });

  if (!response.ok) {
    throw new Error(`검색 실패: ${response.statusText}`);
  }

  const data: ApiSpecimen[] = await response.json();
  return data.map(transformToCollDataType);
}

/**
 * 분류 계층 가져오기
 */
export async function fetchTaxonomy(
  level: "family" | "subfamily" | "genus" | "species",
  parent?: string
): Promise<{ name: string; count: number }[]> {
  let url = `${API_BASE_URL}/api/taxonomy?level=${level}`;
  if (parent) {
    url += `&parent=${encodeURIComponent(parent)}`;
  }

  const response = await fetch(url, {
    next: { revalidate: 300 }, // 분류 계층은 5분 캐시
  });

  if (!response.ok) {
    throw new Error(`분류 계층 조회 실패: ${response.statusText}`);
  }

  return response.json();
}

/**
 * R2 이미지 목록 가져오기
 */
export async function fetchImages(prefix = ""): Promise<DriveImageInfo[]> {
  const url = `${API_BASE_URL}/api/images?prefix=${encodeURIComponent(prefix)}`;

  const response = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`이미지 목록 조회 실패: ${response.statusText}`);
  }

  const data = await response.json();
  return data.map((img: { key: string; size: number; uploaded: string; url: string }) => ({
    key: img.key,
    size: img.size,
    uploaded: img.uploaded,
    url: img.url,
    name: img.key.split("/").pop() || img.key,
  }));
}

/**
 * 이미지 동기화 (R2 -> DB)
 */
export async function syncImages(): Promise<{ success: boolean; synced: number }> {
  const response = await fetch(`${API_BASE_URL}/api/images/sync`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`이미지 동기화 실패: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 데이터 마이그레이션 (Google Sheets -> D1)
 */
export async function migrateData(specimens: Partial<CollDataType>[]): Promise<{
  success: boolean;
  inserted: number;
  errors: string[];
}> {
  const response = await fetch(`${API_BASE_URL}/api/migrate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      specimens: specimens.map(s => ({
        ...s,
        is_hidden: s.is_hidden ? 1 : 0,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`마이그레이션 실패: ${response.statusText}`);
  }

  return response.json();
}
