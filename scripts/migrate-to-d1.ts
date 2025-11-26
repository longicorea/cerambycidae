/**
 * Google Sheets 데이터를 Cloudflare D1으로 마이그레이션하는 스크립트
 *
 * 사용법:
 * 1. .env 파일에 환경 변수 설정
 * 2. npx ts-node scripts/migrate-to-d1.ts
 */

import * as dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";

// 환경 변수
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || "";
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";
const WORKER_API_URL = process.env.NEXT_PUBLIC_WORKER_API_URL || "";

interface SpecimenData {
  coll_id: string;
  type?: string;
  dna_identified?: string;
  dna_accession_no?: string;
  seq_identifier?: string;
  coll_date?: string;
  collector_name?: string;
  family_name?: string;
  subfamily_name?: string;
  tribe_name?: string;
  genus_name?: string;
  species_name?: string;
  subspecies_name?: string;
  name_ko?: string;
  location?: string;
  host?: string;
  is_hidden?: boolean;
}

async function getGoogleSheetsData(): Promise<SpecimenData[]> {
  console.log("Google Sheets에서 데이터 가져오는 중...");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: "A1:P10000",
  });

  const rows = response.data.values || [];

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0];
  const data = rows.slice(1);

  const collectionData: SpecimenData[] = data.map((row) => {
    const item: SpecimenData = { coll_id: "" };

    headers?.forEach((header, colIndex) => {
      const value = row[colIndex] || "";

      switch (header.toLowerCase()) {
        case "coll_id":
          item.coll_id = value;
          break;
        case "type":
          item.type = value;
          break;
        case "dna_identified":
          item.dna_identified = value;
          break;
        case "dna_accession_no":
          item.dna_accession_no = value;
          break;
        case "seq_identifier":
          item.seq_identifier = value;
          break;
        case "coll_date":
          item.coll_date = value;
          break;
        case "collector_name":
          item.collector_name = value;
          break;
        case "family_name":
          item.family_name = value;
          break;
        case "subfamily_name":
          item.subfamily_name = value;
          break;
        case "tribe_name":
          item.tribe_name = value;
          break;
        case "genus_name":
          item.genus_name = value;
          break;
        case "species_name":
          item.species_name = value;
          break;
        case "subspecies_name":
          item.subspecies_name = value;
          break;
        case "name_ko":
          item.name_ko = value;
          break;
        case "location":
          item.location = value;
          break;
        case "host":
          item.host = value;
          break;
        case "is_hidden":
          item.is_hidden = value.toLowerCase() === "true" || value === "1";
          break;
      }
    });

    return item;
  });

  // coll_id가 있는 데이터만 반환
  return collectionData.filter((item) => item.coll_id);
}

async function migrateToD1(specimens: SpecimenData[]): Promise<void> {
  console.log(`D1으로 ${specimens.length}개 데이터 마이그레이션 중...`);

  // 배치 크기 (한 번에 100개씩)
  const BATCH_SIZE = 100;
  let totalInserted = 0;
  const allErrors: string[] = [];

  for (let i = 0; i < specimens.length; i += BATCH_SIZE) {
    const batch = specimens.slice(i, i + BATCH_SIZE);
    console.log(`배치 ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(specimens.length / BATCH_SIZE)} 처리 중...`);

    try {
      const response = await fetch(`${WORKER_API_URL}/api/migrate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ specimens: batch }),
      });

      if (!response.ok) {
        throw new Error(`API 응답 오류: ${response.statusText}`);
      }

      const result = await response.json();
      totalInserted += result.inserted;

      if (result.errors && result.errors.length > 0) {
        allErrors.push(...result.errors);
      }

      console.log(`  - ${result.inserted}개 삽입 완료`);
    } catch (error) {
      console.error(`  - 배치 처리 실패:`, error);
      allErrors.push(`Batch ${i}-${i + BATCH_SIZE}: ${error}`);
    }

    // Rate limiting 방지
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("\n=== 마이그레이션 완료 ===");
  console.log(`총 삽입: ${totalInserted}개`);

  if (allErrors.length > 0) {
    console.log(`오류: ${allErrors.length}개`);
    allErrors.forEach((err) => console.log(`  - ${err}`));
  }
}

async function syncImages(): Promise<void> {
  console.log("\nR2 이미지 동기화 중...");

  try {
    const response = await fetch(`${WORKER_API_URL}/api/images/sync`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`이미지 동기화 실패: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`이미지 동기화 완료: ${result.synced}개`);
  } catch (error) {
    console.error("이미지 동기화 실패:", error);
  }
}

async function main(): Promise<void> {
  console.log("=== Google Sheets → D1 마이그레이션 시작 ===\n");

  // 환경 변수 확인
  if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    console.error("Google Sheets 환경 변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  if (!WORKER_API_URL) {
    console.error("NEXT_PUBLIC_WORKER_API_URL 환경 변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  try {
    // 1. Google Sheets에서 데이터 가져오기
    const specimens = await getGoogleSheetsData();
    console.log(`Google Sheets에서 ${specimens.length}개 데이터 로드 완료\n`);

    if (specimens.length === 0) {
      console.log("마이그레이션할 데이터가 없습니다.");
      return;
    }

    // 2. D1으로 마이그레이션
    await migrateToD1(specimens);

    // 3. R2 이미지 동기화
    await syncImages();

    console.log("\n=== 모든 작업 완료 ===");
  } catch (error) {
    console.error("마이그레이션 실패:", error);
    process.exit(1);
  }
}

main();
