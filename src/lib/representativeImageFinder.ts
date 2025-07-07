import { CollDataType, DriveImageFileInfo } from "@src/data/collData";

export async function findRepresentativeImageFromCollData(
    familyName: string,
    subfamilyName?: string,
    genusName?: string,
    speciesName?: string
): Promise<DriveImageFileInfo | null> {
    return await findRepresentativeImageFromSpecimens(
        familyName,
        subfamilyName,
        genusName,
        speciesName
    );
}

export async function findRepresentativeImageFromSpecimens(
    familyName: string,
    subfamilyName?: string,
    genusName?: string,
    speciesName?: string
): Promise<DriveImageFileInfo | null> {
    // CollData에서 해당 계층에 속하는 모든 표본 찾기
    let matchingSpecimens: CollDataType[] = [];
    
    try {
        // 서버사이드에서 CollData 가져오기
        const { getCachedCollectionData } = await import('@src/lib/dataCacheServer');
        const collData = await getCachedCollectionData();
        
        // 계층별 필터링
        matchingSpecimens = collData.filter((specimen: CollDataType) => {
            let matches = specimen.family_name === familyName;
            if (subfamilyName) matches = matches && specimen.subfamily_name === subfamilyName;
            if (genusName) matches = matches && specimen.genus_name === genusName;
            if (speciesName) {
                // species는 subspecies를 고려하여 매칭
                const fullSpeciesName = specimen.subspecies_name 
                    ? `${specimen.species_name}_${specimen.subspecies_name}`
                    : specimen.species_name;
                matches = matches && fullSpeciesName.startsWith(speciesName);
            }
            return matches;
        });
        
    } catch (error) {
        console.error('CollData 조회 실패:', error);
        return null;
    }
    
    if (matchingSpecimens.length === 0) {
        console.log(`해당 분류군의 표본을 찾을 수 없습니다: ${familyName} ${subfamilyName || ''} ${genusName || ''} ${speciesName || ''}`);
        return null;
    }
    
    // 각 표본의 이미지 파일들을 수집
    const allImageFiles: DriveImageFileInfo[] = [];
    
    matchingSpecimens.forEach(specimen => {
        if (specimen.imageFiles && specimen.imageFiles.length > 0) {
            specimen.imageFiles.forEach(imageFile => {
                // Adult dorsal 이미지만 선택
                const fileName = imageFile.name.toLowerCase();
                if (isAdultDorsalImage(fileName)) {
                    allImageFiles.push(imageFile);
                }
            });
        }
    });
    
    if (allImageFiles.length === 0) {
        console.log(`해당 분류군의 Adult dorsal 이미지를 찾을 수 없습니다: ${familyName} ${subfamilyName || ''} ${genusName || ''} ${speciesName || ''}`);
        return null;
    }
    
    // 파일명 알파벳 순으로 정렬하여 첫 번째 선택
    allImageFiles.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`대표 이미지 선택됨: ${allImageFiles[0].name} (총 ${allImageFiles.length}개 중)`);
    return allImageFiles[0];
}

function isAdultDorsalImage(fileName: string): boolean {
    const lowerFileName = fileName.toLowerCase();
    
    // Adult dorsal 패턴 확인
    if (lowerFileName.includes('adult') && lowerFileName.includes('dorsal')) {
        return true;
    }
    
    // Adult이 명시되지 않았지만 dorsal이고 larva가 아닌 경우
    if (lowerFileName.includes('dorsal') && !lowerFileName.includes('larv')) {
        return true;
    }
    
    // 기본적으로 dorsal 포함된 이미지
    if (lowerFileName.includes('dorsal')) {
        return true;
    }
    
    return false;
}

export async function getRepresentativeImageUrlFromCollData(
    familyName: string,
    subfamilyName?: string,
    genusName?: string,
    speciesName?: string
): Promise<string> {
    const imageFile = await findRepresentativeImageFromCollData(
        familyName,
        subfamilyName,
        genusName,
        speciesName
    );
    
    if (!imageFile) {
        return '';
    }
    
    return `https://drive.google.com/uc?export=view&id=${imageFile.id}`;
}