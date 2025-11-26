// 서버 전용 데이터 캐시 - Cloudflare D1 API 버전
import {CollDataType} from "@src/data/collData";

const CACHE_EXPIRY_MS = 60 * 1000; // 1분

// Worker API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_WORKER_API_URL || "https://cerambycidae-api.longicorea.workers.dev";

interface CacheData {
    data: CollDataType[];
    timestamp: number;
}

// 전역 캐시 정의
declare global {
    var serverCollectionCache: CacheData | null | undefined;
}

// 서버사이드 메모리 캐시 - 전역 객체 사용
function getServerCache(): CacheData | null {
    return globalThis.serverCollectionCache || null;
}

function setServerCache(cache: CacheData | null): void {
    globalThis.serverCollectionCache = cache;
}

// D1 API 응답을 CollDataType으로 변환
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

export async function getCachedCollectionData(force: boolean): Promise<CollDataType[]> {
    try {
        // 서버사이드 메모리 캐시 확인
        const serverCache = getServerCache();
        console.log('서버 캐시 상태:', serverCache ? '존재' : '없음');

        if (serverCache && !force) {
            const now = Date.now();
            if (now - serverCache.timestamp < CACHE_EXPIRY_MS) {
                console.log('서버사이드 메모리 캐시 사용');
                return serverCache.data;
            }
        }

        // 캐시가 없거나 만료되었으면 D1 API에서 데이터 가져오기
        console.log('D1 API에서 데이터 가져오기...');

        const response = await fetch(`${API_BASE_URL}/api/specimens`, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`D1 API 요청 실패: ${response.statusText}`);
        }

        const apiData: ApiSpecimen[] = await response.json();
        const freshData = apiData.map(transformToCollDataType);

        console.log(`D1 API에서 ${freshData.length}개 데이터 로드 완료`);

        // 서버사이드 메모리에 캐시 저장
        setServerCache({
            data: freshData,
            timestamp: Date.now()
        });

        return freshData;

    } catch (error) {
        console.error('D1 API 데이터 가져오기 실패:', error);

        // 에러 발생시 기존 캐시라도 반환
        const serverCache = getServerCache();
        if (serverCache) {
            console.log('에러 발생으로 서버 캐시된 데이터 사용');
            return serverCache.data;
        }

        // 모든 것이 실패하면 빈 배열 반환
        return [];
    }
}


// 서버 캐시 삭제 함수
export function clearCollectionDataCache(): void {
    setServerCache(null);
}

// 서버 캐시 직접 업데이트 함수
export function updateServerCache(data: CollDataType[]): void {
    setServerCache({
        data: data,
        timestamp: Date.now()
    });
    console.log('서버 캐시 업데이트 완료');
}

// 서버사이드 캐시 상태 조회 함수
export function getServerCacheInfo(): { hasCache: boolean, timestamp: number | null, age: number | null } {
    const serverCache = getServerCache();
    if (!serverCache) {
        return {hasCache: false, timestamp: null, age: null};
    }

    return {
        hasCache: true,
        timestamp: serverCache.timestamp,
        age: Date.now() - serverCache.timestamp
    };
}
