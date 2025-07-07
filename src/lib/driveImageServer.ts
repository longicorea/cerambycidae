import { CollDataType, DriveImageFileInfo } from "@src/data/collData";

export interface DriveImageInfo {
    id: string;
    name: string;
    webViewLink: string;
    webContentLink: string;
    thumbnailLink?: string;
    mimeType: string;
    size: string;
    modifiedTime: string;
    parents: string[];
    path: string; // family/subfamily/genus/species/filename
}

let imageCache: Map<string, DriveImageInfo> = new Map();
let lastCacheUpdate: Date = new Date(0);
let isInitializing = false;

// 캐시 만료 시간 (1시간)
const CACHE_EXPIRY_MS = 60 * 60 * 1000;

export async function getImageCache(): Promise<Map<string, DriveImageInfo>> {
    if (isCacheExpired() && !isInitializing) {
        await refreshImageCache();
    }
    return imageCache;
}

export async function refreshImageCache(): Promise<void> {
    if (isInitializing) return;
    
    isInitializing = true;
    console.log('Google Drive 이미지 캐시 갱신 시작...');
    
    try {
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
        
        if (!folderId || !apiKey) {
            console.warn('Google Drive 설정이 누락되었습니다.');
            return;
        }
        
        const imageInfos = await fetchAllImages(folderId, apiKey);
        
        // 새로운 캐시 맵 생성
        const newCache = new Map<string, DriveImageInfo>();
        
        imageInfos.forEach(imageInfo => {
            // 경로 기반 키 생성 (family/subfamily/genus/species/filename)
            const pathKey = imageInfo.path.toLowerCase();
            newCache.set(pathKey, imageInfo);
            
            // 파일명 기반 키도 생성 (하위 호환성)
            const fileName = imageInfo.name.toLowerCase();
            newCache.set(fileName, imageInfo);
        });
        
        imageCache = newCache;
        lastCacheUpdate = new Date();
        
        console.log(`Google Drive 캐시 갱신 완료: ${imageCache.size}개 이미지`);
        
        // CollData에 이미지 URL 정보 추가
        await enrichCollDataWithImages();
        
    } catch (error) {
        console.error('Google Drive 캐시 갱신 실패:', error);
        throw error;
    } finally {
        isInitializing = false;
    }
}

export async function enrichCollDataWithImages(): Promise<void> {
    try {
        const { getCachedCollectionData, updateServerCache, getServerCacheInfo } = await import('@src/lib/dataCacheServer');
        
        // 서버 캐시 상태 확인
        const cacheInfo = getServerCacheInfo();
        let collData: CollDataType[];
        collData = await getCachedCollectionData();

        
        console.log('CollData에 이미지 파일 정보 추가 중...');
        
        const result = collData.map((specimen: CollDataType) => {
            const imageFiles: DriveImageFileInfo[] = [];
            
            // 해당 표본의 모든 이미지 찾기
            imageCache.forEach((imageInfo, key) => {
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
            console.log(imageFiles)
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
}

async function fetchAllImages(folderId: string, apiKey: string, path: string = ''): Promise<DriveImageInfo[]> {
    const allImages: DriveImageInfo[] = [];
    
    try {
        const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,webViewLink,webContentLink,thumbnailLink,mimeType,size,modifiedTime,parents)`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Google Drive API 호출 실패: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.files || !Array.isArray(data.files)) {
            console.warn('폴더에서 파일을 찾을 수 없습니다:', folderId);
            return [];
        }
        
        for (const file of data.files) {
            const currentPath = path ? `${path}/${file.name}` : file.name;
            console.log(`파일 탐색 중: ${currentPath} (${file.mimeType})`);
            if (file.mimeType === 'application/vnd.google-apps.folder') {
                // 폴더인 경우 재귀적으로 탐색
                const subImages = await fetchAllImages(file.id, apiKey, currentPath);
                allImages.push(...subImages);
            } else if (file.mimeType && file.mimeType.startsWith('image/')) {
                // 이미지 파일인 경우 캐시에 추가
                allImages.push({
                    id: file.id,
                    name: file.name,
                    webViewLink: file.webViewLink || '',
                    webContentLink: file.webContentLink || '',
                    thumbnailLink: file.thumbnailLink,
                    mimeType: file.mimeType,
                    size: file.size || '0',
                    modifiedTime: file.modifiedTime || new Date().toISOString(),
                    parents: file.parents || [],
                    path: currentPath
                });
            }
        }
        
    } catch (error) {
        console.error(`폴더 ${folderId} 탐색 실패:`, error);
    }
    
    return allImages;
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
        const imageInfo = imageCache.get(fullPath);
        
        if (imageInfo) {
            return imageInfo;
        }
    }
    
    // 파일명만으로 검색 (하위 호환성)
    for (const fileName of possibleFileNames) {
        const imageInfo = imageCache.get(fileName.toLowerCase());
        
        if (imageInfo) {
            return imageInfo;
        }
    }
    
    return null;
}

export function findRepresentativeImageByTaxonomy(
    familyName: string,
    subfamilyName?: string,
    genusName?: string,
    speciesName?: string
): DriveImageInfo | null {
    // 해당 계층에 속하는 모든 이미지 찾기
    const matchingImages: DriveImageInfo[] = [];

    imageCache.forEach((imageInfo) => {
        const pathParts = imageInfo.path.split('/');
        
        // 경로가 충분한 깊이를 가지는지 확인
        if (pathParts.length < 5) return; // family/subfamily/genus/species/filename
        
        const [family, subfamily, genus, species] = pathParts;
        
        // 계층별 매칭 확인
        if (family !== familyName) return;
        if (subfamilyName && subfamily !== subfamilyName) return;
        if (genusName && genus !== genusName) return;
        if (speciesName && !species?.startsWith(speciesName)) return;
        
        // Adult dorsal 이미지만 선택
        const fileName = imageInfo.name.toLowerCase();
        if (fileName.includes('adult') && fileName.includes('dorsal')) {
            matchingImages.push(imageInfo);
        } else if (fileName.includes('dorsal') && !fileName.includes('larv')) {
            // Adult이 명시되지 않았지만 dorsal이고 larva가 아닌 경우
            matchingImages.push(imageInfo);
        }
    });
    
    if (matchingImages.length === 0) return null;
    
    // 파일명 알파벳 순으로 정렬하여 첫 번째 선택
    matchingImages.sort((a, b) => a.name.localeCompare(b.name));
    
    return matchingImages[0] ?? null;
}



export function isCacheExpired(): boolean {
    const now = new Date();
    return (now.getTime() - lastCacheUpdate.getTime()) > CACHE_EXPIRY_MS;
}

export function getCacheInfo(): {
    imageCount: number;
    lastUpdated: Date;
    isExpired: boolean;
    isInitializing: boolean;
} {
    return {
        imageCount: imageCache.size,
        lastUpdated: lastCacheUpdate,
        isExpired: isCacheExpired(),
        isInitializing
    };
}