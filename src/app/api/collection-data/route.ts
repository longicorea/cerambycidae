import {NextResponse} from 'next/server';
import {getCachedCollectionData} from '@src/lib/dataCacheServer';

export const runtime = 'nodejs';

export async function GET() {
    try {
        // D1 API를 통해 데이터 가져오기
        const data = await getCachedCollectionData(false);
        console.log('D1 API에서 데이터 가져오기:', data.length, '개 항목');
        return NextResponse.json(data);
    } catch (error) {
        console.error('D1 API 데이터 가져오기 실패:', error);
        return NextResponse.json({error: '데이터를 불러오는데 실패했습니다.'}, {status: 500});
    }
}
