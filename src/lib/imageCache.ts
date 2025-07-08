import { CollDataType } from "@src/data/collData";

export function getSpecimenImageUrl(
    specimen: CollDataType, 
    type: string = 'A',
    parts: string = 'dorsal'
): string|null {
    // specimen.imageFiles에서 정확한 패턴 매칭으로 찾기
    if (specimen.imageFiles && specimen.imageFiles.length > 0) {
        const targetPattern = `${specimen.coll_id}_${type}_${parts}`.toLowerCase();
        
        for (const imageFile of specimen.imageFiles) {
            const fileName = imageFile.name.toLowerCase();
            if (fileName.includes(targetPattern)) {
                return imageFile.url ?? null;
            }
        }
        
        // 정확한 매칭이 없으면 첫 번째 이미지 반환
        return specimen?.imageFiles[0]?.url ?? null;
    }
    
   return null;
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
        
        const response = await fetch(`/api/images?${params.toString()}`);
        
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