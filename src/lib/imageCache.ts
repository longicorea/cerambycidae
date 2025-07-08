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

