import { CollDataType } from "@src/data/collData";

// 클라이언트사이드 캐시
const IMAGE_CACHE_KEY = 'drive_image_cache';
const CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10분

interface ImageCacheData {
    [key: string]: {
        imageUrl: string | null;
        timestamp: number;
    };
}

/**
 * 캐시된 이미지 URL 가져오기
 */
function getCachedImageUrl(cacheKey: string): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
        const cachedData = localStorage.getItem(IMAGE_CACHE_KEY);
        if (!cachedData) return null;
        
        const cache: ImageCacheData = JSON.parse(cachedData);
        const item = cache[cacheKey];
        
        if (!item) return null;
        
        // 캐시가 만료되었는지 확인
        if (Date.now() - item.timestamp > CACHE_EXPIRY_MS) {
            return null;
        }
        
        return item.imageUrl;
    } catch {
        return null;
    }
}

/**
 * 이미지 URL을 캐시에 저장
 */
function setCachedImageUrl(cacheKey: string, imageUrl: string | null): void {
    if (typeof window === 'undefined') return;
    
    try {
        const cachedData = localStorage.getItem(IMAGE_CACHE_KEY);
        const cache: ImageCacheData = cachedData ? JSON.parse(cachedData) : {};
        
        cache[cacheKey] = {
            imageUrl,
            timestamp: Date.now(),
        };
        
        localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('이미지 캐시 저장 실패:', error);
    }
}

/**
 * 계층별 대표 이미지 URL 가져오기 (캐싱 포함)
 */
export async function getRepresentativeImage(
    familyName: string,
    subfamilyName?: string,
    genusName?: string,
    speciesName?: string
): Promise<string | null> {
    // 캐시 키 생성
    const cacheKey = `${familyName}_${subfamilyName || ''}_${genusName || ''}_${speciesName || ''}_A_dorsal`;
    
    // 캐시된 결과 확인
    const cachedUrl = getCachedImageUrl(cacheKey);
    if (cachedUrl !== null) {
        return cachedUrl;
    }
    
    // API 호출로 이미지 검색
    try {
        const params = new URLSearchParams();
        params.append('family', familyName);
        if (subfamilyName) params.append('subfamily', subfamilyName);
        if (genusName) params.append('genus', genusName);
        if (speciesName) params.append('species', speciesName);
        
        const response = await fetch(`/api/representative-image?${params.toString()}`);
        if (!response.ok) {
            throw new Error('이미지 검색 API 호출 실패');
        }
        
        const data = await response.json();
        const imageUrl = data.imageUrl;
        
        // 결과를 캐시에 저장
        setCachedImageUrl(cacheKey, imageUrl);
        
        return imageUrl;
    } catch (error) {
        console.error('대표 이미지 검색 실패:', error);
        // 에러 시에도 null을 캐시하여 재시도 방지
        setCachedImageUrl(cacheKey, null);
        return null;
    }
}

/**
 * 표본 데이터 배열에서 대표 이미지 찾기
 */
export async function getRepresentativeImageFromSpecimens(specimens: CollDataType[]): Promise<string | null> {
    if (specimens.length === 0) return null;
    
    const firstSpecimen = specimens[0]!;
    const speciesName = firstSpecimen.subspecies_name 
        ? `${firstSpecimen.species_name}_${firstSpecimen.subspecies_name}`
        : firstSpecimen.species_name;
    
    return await getRepresentativeImage(
        firstSpecimen.family_name,
        firstSpecimen.subfamily_name,
        firstSpecimen.genus_name,
        speciesName
    );
}

/**
 * 이미지 캐시 클리어
 */
export function clearImageCache(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(IMAGE_CACHE_KEY);
    }
}