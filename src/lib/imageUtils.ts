import { CollDataType } from "@src/data/collData";

// 구글드라이브 베이스 URL (실제 구글드라이브 공유 폴더 URL로 변경 필요)
const GOOGLE_DRIVE_BASE_URL = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_BASE_URL || 'https://drive.google.com/uc?export=view&id=';

/**
 * 표본 데이터를 기반으로 구글드라이브 이미지 URL을 생성합니다.
 * 경로 구조: /{family}/{subfamily}/{genus}/{species}/{coll_id}_{type}_{parts}.jpg
 */
export function getSpecimenImageUrl(
    specimen: CollDataType, 
    type: string = 'Adult', 
    parts: string = 'default'
): string {
    const {
        family_name,
        subfamily_name,
        genus_name,
        species_name,
        subspecies_name,
        coll_id
    } = specimen;
    
    // species 이름 구성 (subspecies가 있으면 포함)
    const fullSpeciesName = subspecies_name 
        ? `${species_name}_${subspecies_name}`
        : species_name;
    
    // 파일명 구성
    const fileName = `${coll_id}_${type}_${parts}.jpg`;
    
    // 전체 경로 구성
    const imagePath = `${family_name}/${subfamily_name}/${genus_name}/${fullSpeciesName}/${fileName}`;
    
    return `${GOOGLE_DRIVE_BASE_URL}${encodeURIComponent(imagePath)}`;
}

/**
 * 여러 표본의 기본 이미지 URL들을 반환합니다.
 */
export function getSpecimenDefaultImages(specimens: CollDataType[]): string[] {
    return specimens.map(specimen => getSpecimenImageUrl(specimen, 'Adult', 'default'));
}

/**
 * 표본의 다양한 타입/부위 이미지들을 반환합니다.
 */
export function getSpecimenAllImages(
    specimen: CollDataType,
    types: string[] = ['Adult'],
    parts: string[] = ['default', 'dorsal', 'ventral', 'lateral']
): string[] {
    const images: string[] = [];
    
    types.forEach(type => {
        parts.forEach(part => {
            images.push(getSpecimenImageUrl(specimen, type, part));
        });
    });
    
    return images;
}

/**
 * 이미지 URL이 유효한지 확인하는 함수 (선택적)
 */
export async function checkImageExists(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * 표본의 사용 가능한 이미지들만 필터링해서 반환
 */
export async function getAvailableImages(
    specimen: CollDataType,
    types: string[] = ['Adult'],
    parts: string[] = ['default']
): Promise<string[]> {
    const allImages = getSpecimenAllImages(specimen, types, parts);
    const availableImages: string[] = [];
    
    for (const imageUrl of allImages) {
        if (await checkImageExists(imageUrl)) {
            availableImages.push(imageUrl);
        }
    }
    
    return availableImages;
}