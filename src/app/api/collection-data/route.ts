import { NextResponse } from 'next/server';
import { getCachedCollectionData } from '@src/lib/dataCacheServer';

export async function GET() {
  try {
    // 서버 캐시를 통해 데이터 가져오기
    const data = await getCachedCollectionData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('구글시트 데이터 가져오기 실패:', error);
    return NextResponse.json({ error: '데이터를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}