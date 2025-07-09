import {CollDataType, DriveImageInfo} from "@src/data/collData";
declare global {
    var __imageCache__: Map<string, DriveImageInfo> | undefined;
    var __lastCacheUpdate__: Date | undefined;
}

if (!globalThis.__imageCache__) {
    globalThis.__imageCache__ = new Map();
    globalThis.__lastCacheUpdate__ = new Date(0);
}


export function getImageCache() {
    return globalThis.__imageCache__!;
}

export function setImageCache(newCache: Map<string, DriveImageInfo>) {
    globalThis.__imageCache__ = newCache;
}

export function getLastCacheUpdate() {
    return globalThis.__lastCacheUpdate__!;
}

export function setLastCacheUpdate(date: Date) {
    globalThis.__lastCacheUpdate__ = date;
}

export function isInitializing() {
    return globalThis.__isInitializing__!;
}

export function setIsInitializing(value: boolean) {
    globalThis.__isInitializing__ = value;
}


// 캐시 만료 시간 (1시간)
const CACHE_EXPIRY_MS = 60 * 60 * 1000;


export async function refreshImageCache() {
    if (isInitializing()) return;

    setIsInitializing(true);
    console.log('Google Drive 이미지 캐시 갱신 시작...');
    let result: CollDataType[] = [];
    try {
        
        const imageInfos = await fetchR2Images();
        
        // 새로운 캐시 맵 생성
        const newCache = new Map<string, DriveImageInfo>();
        
        imageInfos.forEach(imageInfo => {
            const pathKey = imageInfo.key;
            newCache.set(pathKey, imageInfo);
        });
        
        setImageCache(newCache);
        setLastCacheUpdate(new Date());
        
        console.log(`Google Drive 캐시 갱신 완료: ${getImageCache().size}개 이미지`);
        
        // CollData에 이미지 URL 정보 추가
        result = await enrichCollDataWithImages();
        
    } catch (error) {
        console.error('Google Drive 캐시 갱신 실패:', error);
        throw error;
    } finally {
        setIsInitializing(false);
    }
    return result;

}

export async function enrichCollDataWithImages(): Promise<CollDataType[]> {
    let result : CollDataType[] = [];
    try {
        const { getCachedCollectionData, updateServerCache, getServerCacheInfo } = await import('@src/lib/dataCacheServer');
        if (isCacheExpired() || getImageCache().size === 0) {
            await refreshImageCache();
        }
        // 서버 캐시 상태 확인
        let collData: CollDataType[];
        collData = await getCachedCollectionData();

        
        console.log('CollData에 이미지 파일 정보 추가 중...');
        
        const result = collData.map((specimen: CollDataType) => {
            const imageFiles: DriveImageInfo[] = [];

            // 해당 표본의 모든 이미지 찾기
            getImageCache().forEach((imageInfo, key) => {
                // coll_id로 매칭되는 이미지 찾기
                if (imageInfo.name.toLowerCase().includes(specimen.coll_id.toLowerCase())) {
                    // 파일명 패턴 확인: {coll_id}_{type}_{parts}.jpg
                    const fileName = imageInfo.name.toLowerCase();
                    const expectedPattern = specimen.coll_id.toLowerCase();
                    
                    if (fileName.startsWith(expectedPattern)) {
                        // 전체 파일 정보 저장
                        imageFiles.push(imageInfo);
                    }
                }
            });
            // 중복 제거 및 정렬
            specimen.imageFiles = imageFiles;

            return specimen;
        });

        console.log(result)
        
        // 이미지 정보가 추가된 collData로 서버 캐시 업데이트
        updateServerCache(result);
        
        console.log('CollData 이미지 파일 정보 추가 완료');
        
    } catch (error) {
        console.error('CollData 이미지 파일 정보 추가 실패:', error);
    }
    return result
}

async function fetchR2Images(prefix: string = ''): Promise<DriveImageInfo[]> {
    const endpoint = `https://my-cdn-worker.longicorea.workers.dev/list?prefix=${encodeURIComponent(prefix)}`;

    try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`R2 목록 불러오기 실패: ${res.statusText}`);

        const data: {
            key: string;
            size: number;
            uploaded: string;
            url: string;
        }[] = await res.json();

        return data.map((item) => {
            const name = item.key.split('/').pop() || item.key;
            return {
                ...item,
                name,
            };
        });
    } catch (err) {
        console.error("이미지 목록 불러오기 실패:", err);
        return [];
    }
}

export function findImageForSpecimen(
    specimen: CollDataType, 
    type: string = 'Adult', 
    parts: string = 'dorsal'
): DriveImageInfo | null {
    const {
        family_name,
        subfamily_name,
        genus_name,
        species_name,
        subspecies_name,
        coll_id
    } = specimen;
    
    // species 이름 구성
    const fullSpeciesName = subspecies_name 
        ? `${species_name}_${subspecies_name}`
        : species_name;
    
    // 가능한 파일명 패턴들
    const possibleFileNames = [
        `${coll_id}_${type}_${parts}.jpg`,
        `${coll_id}_${type}_${parts}.jpeg`,
        `${coll_id}_${type}_${parts}.png`,
        `${coll_id} ${type} ${parts}.jpg`,
        `${coll_id} ${type} ${parts}.jpeg`,
        `${coll_id} ${type} ${parts}.png`
    ];
    
    // 경로 기반 검색
    const basePath = `${family_name}/${subfamily_name}/${genus_name}/${fullSpeciesName}`;
    
    for (const fileName of possibleFileNames) {
        const fullPath = `${basePath}/${fileName}`.toLowerCase();
        const imageInfo = getImageCache().get(fullPath);
        
        if (imageInfo) {
            return imageInfo;
        }
    }
    
    // 파일명만으로 검색 (하위 호환성)
    for (const fileName of possibleFileNames) {
        const imageInfo = getImageCache().get(fileName.toLowerCase());
        
        if (imageInfo) {
            return imageInfo;
        }
    }
    
    return null;
}





export function isCacheExpired(): boolean {
    const now = new Date();
    return (now.getTime() - getLastCacheUpdate().getTime()) > CACHE_EXPIRY_MS;
}

export function getCacheInfo(): {
    imageCount: number;
    lastUpdated: Date;
    isExpired: boolean;
    isInitializing: boolean;
} {
    return {
        imageCount: getImageCache().size,
        lastUpdated: getLastCacheUpdate(),
        isExpired: isCacheExpired(),
        isInitializing: isInitializing()
    };
}