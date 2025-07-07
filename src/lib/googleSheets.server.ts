// 서버 전용 Google Sheets API 모듈
// 이 파일은 서버사이드에서만 사용됩니다.

import { google } from 'googleapis';
import { CollDataType } from '@src/data/collData';

export async function getCollectionData(): Promise<CollDataType[]> {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                type: 'service_account',
                project_id: 'longicorea-464914',
                private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                client_id: process.env.GOOGLE_CLIENT_ID,
                // auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                // token_uri: 'https://oauth2.googleapis.com/token',
                // auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
                // client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        if (!spreadsheetId) {
            throw new Error('GOOGLE_SHEET_ID 환경변수가 설정되지 않았습니다.');
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A:R', // A부터 R열까지
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log('데이터가 없습니다.');
            return [];
        }

        // 첫 번째 행은 헤더이므로 제외
        const dataRows = rows.slice(1);
        
        const collectionData: CollDataType[] = dataRows.map((row, index) => ({
            id: String(index + 1),
            coll_id: row[1] || '',
            type: row[2] || '',
            dna_identified: row[3] || '',
            dna_accession_no: row[4] || '',
            coll_date: row[5] || '',
            collector_name: row[6] || '',
            family_name: row[7] || '',
            subfamily_name: row[8] || '',
            genus_name: row[9] || '',
            species_name: row[10] || '',
            subspecies_name: row[11] || '',
            name_ko: row[12] || '',
            location: row[13] || '',
            host: row[14] || '',
            is_hidden: row[15] === 'TRUE' || row[15] === 'true' || row[15] === '1',
        }));

        console.log(`Google Sheets에서 ${collectionData.length}개 데이터 로드 완료`);
        return collectionData;

    } catch (error) {
        console.error('Google Sheets 데이터 가져오기 실패:', error);
        throw error;
    }
}