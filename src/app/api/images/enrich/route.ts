import { NextRequest, NextResponse } from 'next/server';
import { enrichCollDataWithImages, getImageCache } from '@src/lib/driveImageServer';

export async function POST(request: NextRequest) {
    try {
        console.log('CollData 이미지 정보 보강 요청 시작...');
        
        // 이미지 캐시 먼저 가져오기
        await getImageCache();
        
        // CollData에 이미지 URL 정보 추가
        await enrichCollDataWithImages();
        
        return NextResponse.json({
            success: true,
            message: 'CollData에 이미지 URL 정보가 성공적으로 추가되었습니다.'
        });
        
    } catch (error) {
        console.error('CollData 이미지 정보 보강 실패:', error);
        return NextResponse.json({
            success: false,
            error: 'CollData 이미지 정보 보강에 실패했습니다.'
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        // CollData 이미지 정보 통계 반환
        const { getCachedCollectionData } = await import('@src/lib/dataCacheServer');
        const collData = await getCachedCollectionData();
        
        const stats = {
            totalSpecimens: collData.length,
            specimensWithImages: collData.filter(s => s.imageFiles && s.imageFiles.length > 0).length,
            totalImageFiles: collData.reduce((sum, s) => sum + (s.imageFiles?.length || 0), 0)
        };
        
        return NextResponse.json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('CollData 이미지 정보 통계 조회 실패:', error);
        return NextResponse.json({
            success: false,
            error: '통계 조회에 실패했습니다.'
        }, { status: 500 });
    }
}