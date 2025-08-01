// 서버 전용 데이터 캐시
import {CollDataType} from "@src/data/collData";
import {getCollectionData} from "@src/lib/googleSheets";
import {isImageCacheExpired, refreshImageCache} from "@src/lib/driveImageServer";

const CACHE_EXPIRY_MS = 60 * 1000; // 1분

interface CacheData {
    data: CollDataType[];
    timestamp: number;
}

// 전역 캐시 정의 (instrumentation과 API 간 공유)
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

export async function getCachedCollectionData(force: boolean): Promise<CollDataType[]> {
    try {
        if (isImageCacheExpired() || force) {
            await refreshImageCache();
        }
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

        // 캐시가 없거나 만료되었으면 Google Sheets에서 데이터 가져오기
        console.log('서버사이드에서 Google Sheets 데이터 새로 가져오기');

        // 기존 캐시 데이터 보존 (이미지 정보가 있는 경우)
        const oldData = serverCache?.data || [];

        // 서버 전용 모듈에서 데이터 로드
        const freshData = await getCollectionData();

        // 기존 데이터에서 이미지 정보가 있는 것들을 새 데이터에 병합
        const mergedData = freshData.map(newItem => {
            // coll_id로 기존 데이터 찾기
            const existingItem = oldData.find(oldItem => oldItem.coll_id === newItem.coll_id);

            // 기존 데이터에 이미지 정보가 있으면 유지
            if (existingItem && existingItem.imageFiles && existingItem.imageFiles.length > 0) {
                console.log(`이미지 정보 유지: ${newItem.coll_id} (${existingItem.imageFiles.length}개 이미지)`);
                return {
                    ...newItem,
                    imageFiles: existingItem.imageFiles
                };
            }

            return newItem;
        });

        // 서버사이드 메모리에 캐시 저장
        setServerCache({
            data: mergedData,
            timestamp: Date.now()
        });

        return mergedData;

    } catch (error) {
        console.error('서버 데이터 가져오기 실패:', error);

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

// 서버 캐시 직접 업데이트 함수 (이미지 정보 추가 후 사용)
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