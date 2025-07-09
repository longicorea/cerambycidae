// 클라이언트 전용 데이터 캐시
import { CollDataType } from "@src/data/collData";

const CACHE_KEY = 'collection_data_cache';
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 60분

interface CacheData {
    data: CollDataType[];
    timestamp: number;
}

export async function getCachedCollectionData(): Promise<CollDataType[]> {
    try {
        // localStorage에서 캐시된 데이터 확인
        const hash = typeof window === "undefined" ? "" : (window?.document?.location?.hash ?? "")
        const isRefreshCache =  (hash === "#r") ? true:false;
        console.log('클라이언트 캐시 상태 조회:', isRefreshCache ? '캐시 강제 갱신' : '캐시 조회');
        const cachedDataString = localStorage.getItem(CACHE_KEY);
        console.log('클라이언트 캐시 조회:', cachedDataString ? '캐시 있음' : '캐시 없음');
        if (cachedDataString&&!isRefreshCache) {
            const cachedData: CacheData = JSON.parse(cachedDataString);
            const now = Date.now();
            
            // 캐시가 만료되지 않았으면 캐시된 데이터 반환
            if (now - cachedData.timestamp < CACHE_EXPIRY_MS) {
                console.log('클라이언트 캐시된 데이터 사용');
                return cachedData.data;
            }
        }

        // 캐시가 없거나 만료되었으면 API에서 새로 가져오기
        console.log('클라이언트에서 새로운 데이터 가져오기');
        const freshData = await fetchCollectionData();
        
        // localStorage에 새 데이터 저장
        const newCacheData: CacheData = {
            data: freshData,
            timestamp: Date.now()
        };
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(newCacheData));
        
        return freshData;
        
    } catch (error) {
        console.error('클라이언트 데이터 가져오기 실패:', error);
        
        // 에러 발생시 캐시된 데이터라도 반환
        const cachedDataString = localStorage.getItem(CACHE_KEY);
        if (cachedDataString) {
            const cachedData: CacheData = JSON.parse(cachedDataString);
            console.log('에러 발생으로 클라이언트 캐시된 데이터 사용');
            return cachedData.data;
        }
        
        // 모든 것이 실패하면 빈 배열 반환
        return [];
    }
}

async function fetchCollectionData(): Promise<CollDataType[]> {
    console.log('클라이언트에서 API로 데이터 요청');
    const response = await fetch('/api/collection-data');
    if (!response.ok) {
        throw new Error('데이터 가져오기 실패');
    }
    console.log('클라이언트에서 API로 데이터 가져오기 성공');
    const result = await response.json()
    console.log(result)
    return result;
}

// 클라이언트 캐시 강제 갱신 함수
export async function refreshCollectionData(): Promise<CollDataType[]> {
    localStorage.removeItem(CACHE_KEY);
    return await getCachedCollectionData();
}

// 클라이언트 캐시 삭제 함수
export function clearCollectionDataCache(): void {
    localStorage.removeItem(CACHE_KEY);
}

// 클라이언트 캐시 상태 조회 함수
export function getClientCacheInfo(): { hasCache: boolean, timestamp: number | null, age: number | null } {
    const cachedDataString = localStorage.getItem(CACHE_KEY);
    
    if (!cachedDataString) {
        return { hasCache: false, timestamp: null, age: null };
    }
    
    try {
        const cachedData: CacheData = JSON.parse(cachedDataString);
        return {
            hasCache: true,
            timestamp: cachedData.timestamp,
            age: Date.now() - cachedData.timestamp
        };
    } catch {
        return { hasCache: false, timestamp: null, age: null };
    }
}