import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

// 서버사이드 메모리 캐시 (실제 운영에서는 Redis 등 사용 권장)
const imageCache = new Map<string, { imageUrl: string | null; timestamp: number }>();
const CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10분
export const dynamic = 'force-dynamic';
/**
 * 구글드라이브 API 인증 객체 생성
 */
async function getGoogleDriveAuth() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: GOOGLE_PRIVATE_KEY,
        },
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    
    return auth;
}

/**
 * 구글드라이브에서 이미지 검색
 */
async function searchRepresentativeImage(
    familyName: string,
    subfamilyName?: string,
    genusName?: string,
    speciesName?: string
): Promise<string | null> {
    try {
        const auth = await getGoogleDriveAuth();
        const drive = google.drive({ version: 'v3', auth });
        
        // 검색 쿼리 생성
        let searchQuery = `name contains '_A_dorsal' and mimeType contains 'image/' and parents in '${GOOGLE_DRIVE_FOLDER_ID}'`;
        
        const response = await drive.files.list({
            q: searchQuery,
            fields: 'files(id, name, parents)',
            pageSize: 1000,
        });
        
        const files = response.data.files || [];
        console.log(files)
        // 가장 구체적인 레벨부터 검색
        if (speciesName && genusName && subfamilyName) {
            // Species 레벨 검색
            for (const file of files) {
                if (file.name && file.name.includes('_A_dorsal')) {
                    // 파일 경로가 일치하는지 확인 (실제로는 폴더 구조를 확인해야 함)
                    const pathPattern = `${familyName}/${subfamilyName}/${genusName}/${speciesName}/`;
                    // 여기서는 파일명으로 추정
                    if (file.name.toLowerCase().includes(speciesName.toLowerCase())) {
                        return `https://drive.google.com/uc?export=view&id=${file.id}`;
                    }
                }
            }
        }
        
        if (genusName && subfamilyName) {
            // Genus 레벨 검색
            for (const file of files) {
                if (file.name && file.name.includes('_A_dorsal')) {
                    if (file.name.toLowerCase().includes(genusName.toLowerCase())) {
                        return `https://drive.google.com/uc?export=view&id=${file.id}`;
                    }
                }
            }
        }
        
        if (subfamilyName) {
            // Subfamily 레벨 검색
            for (const file of files) {
                if (file.name && file.name.includes('_A_dorsal')) {
                    if (file.name.toLowerCase().includes(subfamilyName.toLowerCase())) {
                        return `https://drive.google.com/uc?export=view&id=${file.id}`;
                    }
                }
            }
        }
        
        // Family 레벨 검색
        for (const file of files) {
            if (file.name && file.name.includes('_A_dorsal')) {
                if (file.name.toLowerCase().includes(familyName.toLowerCase())) {
                    return `https://drive.google.com/uc?export=view&id=${file.id}`;
                }
            }
        }
        
        return null;
    } catch (error) {
        console.error('구글드라이브 이미지 검색 실패:', error);
        return null;
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const familyName = searchParams.get('family');
        const subfamilyName = searchParams.get('subfamily');
        const genusName = searchParams.get('genus');
        const speciesName = searchParams.get('species');
        
        if (!familyName) {
            return NextResponse.json({ error: 'Family name is required' }, { status: 400 });
        }
        
        // 캐시 키 생성
        const cacheKey = `${familyName}_${subfamilyName || ''}_${genusName || ''}_${speciesName || ''}_A_dorsal`;
        
        // 캐시 확인
        const cached = imageCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY_MS) {
            return NextResponse.json({ imageUrl: cached.imageUrl });
        }
        if(!familyName || !subfamilyName || !genusName || !speciesName) {
            return NextResponse.json({ error: 'Family name is required' }, { status: 400 });
        }
        // 캐시에 없으면 검색
        const imageUrl = await searchRepresentativeImage(familyName, subfamilyName, genusName, speciesName);
        
        // 캐시에 저장
        imageCache.set(cacheKey, { imageUrl, timestamp: Date.now() });
        
        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error('대표 이미지 API 에러:', error);
        return NextResponse.json({ error: '이미지 검색 실패' }, { status: 500 });
    }
}