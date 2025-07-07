import { NextRequest, NextResponse } from 'next/server';
import { 
    getImageCache, 
    refreshImageCache, 
    findImageForSpecimen,
    getCacheInfo 
} from '@src/lib/driveImageServer';
// getCachedCollectionData는 동적 import로 사용
import { CollDataType } from '@src/data/collData';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        console.log(action)
        // 캐시 정보 조회
        if (action === 'cache-info') {
            const cacheInfo = getCacheInfo();
            return NextResponse.json({
                success: true,
                data: cacheInfo
            });
        }
        
        // 캐시 갱신
        if (action === 'refresh-cache') {
            await refreshImageCache();
            const cacheInfo = getCacheInfo();
            return NextResponse.json({
                success: true,
                message: '캐시가 성공적으로 갱신되었습니다.',
                data: cacheInfo
            });
        }
        
        // 특정 표본의 이미지 조회
        if (action === 'specimen') {
            const collId = searchParams.get('coll_id');
            const type = searchParams.get('type') || 'Adult';
            const parts = searchParams.get('parts') || 'dorsal';
            
            if (!collId) {
                return NextResponse.json({
                    success: false,
                    error: 'coll_id는 필수입니다.'
                }, { status: 400 });
            }
            
            // 컬렉션 데이터에서 해당 표본 찾기
            const { getCachedCollectionData } = await import('@src/lib/dataCacheServer');
            const allData = await getCachedCollectionData();
            const specimen = allData.find((item: CollDataType) => item.coll_id === collId);
            
            if (!specimen) {
                return NextResponse.json({
                    success: false,
                    error: '해당 표본을 찾을 수 없습니다.'
                }, { status: 404 });
            }
            
            // 이미지 캐시 가져오기
            await getImageCache();
            
            // 이미지 찾기
            const imageInfo = findImageForSpecimen(specimen, type, parts);
            
            if (!imageInfo) {
                return NextResponse.json({
                    success: false,
                    error: '해당 이미지를 찾을 수 없습니다.'
                }, { status: 404 });
            }
            
            return NextResponse.json({
                success: true,
                data: {
                    imageUrl: `https://drive.google.com/uc?export=view&id=${imageInfo.id}`,
                    thumbnailUrl: imageInfo.thumbnailLink,
                    imageInfo
                }
            });
        }
        
        // 계층별 대표 이미지 조회
        if (action === 'representative') {
            const familyName = searchParams.get('family');
            const subfamilyName = searchParams.get('subfamily');
            const genusName = searchParams.get('genus');
            const speciesName = searchParams.get('species');
            console.log(`대표 이미지 요청: ${familyName} ${subfamilyName || ''} ${genusName || ''} ${speciesName || ''}`);
            
            if (!familyName) {
                return NextResponse.json({
                    success: false,
                    error: 'family는 필수입니다.'
                }, { status: 400 });
            }
            
            // CollData 기반으로 대표 이미지 찾기
            const { findRepresentativeImageFromCollData } = await import('@src/lib/representativeImageFinder');
            const imageFile = await findRepresentativeImageFromCollData(
                familyName,
                subfamilyName || undefined,
                genusName || undefined,
                speciesName || undefined
            );
            
            console.log('선택된 대표 이미지:', imageFile?.name);
            
            if (!imageFile) {
                return NextResponse.json({
                    success: false,
                    error: '해당 분류군의 대표 이미지를 찾을 수 없습니다.'
                }, { status: 404 });
            }
            
            return NextResponse.json({
                success: true,
                data: {
                    imageUrl: `https://drive.google.com/uc?export=view&id=${imageFile.id}`,
                    thumbnailUrl: imageFile.thumbnailLink,
                    imageInfo: imageFile
                }
            });
        }
        
        return NextResponse.json({
            success: false,
            error: '지원하지 않는 액션입니다.'
        }, { status: 400 });
        
    } catch (error) {
        console.error('이미지 API 오류:', error);
        return NextResponse.json({
            success: false,
            error: '서버 오류가 발생했습니다.'
        }, { status: 500 });
    }
}