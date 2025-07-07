import { CollDataType } from "@src/data/collData";

let isInitialized = false;

export async function initializeImageCache(): Promise<void> {
    if (isInitialized) return;
    
    console.log('이미지 캐시 초기화 중...');
    
    try {
        // 서버에서 캐시 초기화
        const response = await fetch('/cerambycidae/api/images?action=cache-info');
        if (response.ok) {
            const result = await response.json();
            console.log('서버 이미지 캐시 상태:', result.data);
        }
        
        isInitialized = true;
        console.log('이미지 캐시 초기화 완료 (서버 기반)');
    } catch (error) {
        console.error('이미지 캐시 초기화 실패:', error);
        isInitialized = true; // 실패해도 계속 진행
    }
}

export async function getSpecimenImageUrl(
    specimen: CollDataType, 
    type: string = 'Adult', 
    parts: string = 'dorsal'
): Promise<string> {
    // specimen.imageFiles에서 정확한 패턴 매칭으로 찾기
    if (specimen.imageFiles && specimen.imageFiles.length > 0) {
        const targetPattern = `${specimen.coll_id}_${type}_${parts}`.toLowerCase();
        
        for (const imageFile of specimen.imageFiles) {
            const fileName = imageFile.name.toLowerCase();
            if (fileName.includes(targetPattern)) {
                return `https://drive.google.com/uc?export=view&id=${imageFile.id}`;
            }
        }
        
        // 정확한 매칭이 없으면 첫 번째 이미지 반환
        return `https://drive.google.com/uc?export=view&id=${specimen.imageFiles[0].id}`;
    }
    
    // imageFiles가 없으면 API 방식 사용
    try {
        const response = await fetch(
            `/cerambycidae/api/images?action=specimen&coll_id=${encodeURIComponent(specimen.coll_id)}&type=${encodeURIComponent(type)}&parts=${encodeURIComponent(parts)}`
        );
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                return result.data.imageUrl;
            }
        }
        
        return '';
    } catch (error) {
        console.error('이미지 URL 조회 실패:', error);
        return '';
    }
}

export async function getAllSpecimenImages(
    specimen: CollDataType,
    types: string[] = ['Adult'],
    parts: string[] = ['default', 'dorsal', 'ventral', 'lateral']
): Promise<string[]> {
    // specimen.imageFiles가 있으면 모든 이미지 URL 반환
    if (specimen.imageFiles && specimen.imageFiles.length > 0) {
        return specimen.imageFiles.map(file => 
            `https://drive.google.com/uc?export=view&id=${file.id}`
        );
    }
    
    // imageFiles가 없으면 기존 방식으로 수집
    const images: string[] = [];
    
    for (const type of types) {
        for (const part of parts) {
            const imageUrl = await getSpecimenImageUrl(specimen, type, part);
            if (imageUrl) {
                images.push(imageUrl);
            }
        }
    }
    
    return images;
}

export async function getRepresentativeImageForTaxon(
    specimens: CollDataType[],
    level: 'family' | 'subfamily' | 'genus' | 'species'
): Promise<string> {
    if (!specimens || specimens.length === 0) return '';
    
    try {
        // 첫 번째 표본의 분류 정보로 계층 파악
        const firstSpecimen = specimens[0]!;
        const params = new URLSearchParams({
            action: 'representative',
            family: firstSpecimen.family_name
        });
        
        // 요청된 level에 따라 적절한 계층까지만 매개변수 추가
        if (level === 'subfamily' || level === 'genus' || level === 'species') {
            if (firstSpecimen.subfamily_name) {
                params.append('subfamily', firstSpecimen.subfamily_name);
            }
        }
        if (level === 'genus' || level === 'species') {
            if (firstSpecimen.genus_name) {
                params.append('genus', firstSpecimen.genus_name);
            }
        }
        if (level === 'species') {
            if (firstSpecimen.species_name) {
                params.append('species', firstSpecimen.species_name);
            }
        }
        
        const response = await fetch(`/cerambycidae/api/images?${params.toString()}`);
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                return result.data.imageUrl;
            }
        }
        
        return '';
    } catch (error) {
        console.error('대표 이미지 조회 실패:', error);
        return '';
    }
}