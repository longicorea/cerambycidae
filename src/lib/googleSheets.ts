import {google} from 'googleapis';
import {CollDataType} from '../data/collData';

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || '';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

export async function getCollectionData(): Promise<CollDataType[]> {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: GOOGLE_PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({version: 'v4', auth});

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: 'A1:P10000', // 시트 범위 조정 필요시 수정
        });

        const rows = response.data.values || [];

        if (rows.length === 0) {
            return [];
        }

        // 첫 번째 행은 헤더로 가정
        const headers = rows[0];
        const data = rows.slice(1);

        const collectionData: CollDataType[] = data.map((row, index) => {
            const item: any = {};
            headers?.forEach((header, colIndex) => {
                const value = row[colIndex] || '';

                // 타입 변환
                switch (header.toLowerCase()) {
                    case 'id':
                        item.id = value;
                        break;
                    case 'coll_id':
                        item.coll_id = value;
                        break;
                    case 'type':
                        item.type = value;
                        break;
                    case 'dna_identified':
                        item.dna_identified = value;
                        break;
                    case 'dna_accession_no':
                        item.dna_accession_no = value;
                        break;
                    case 'seq_identifier':
                        item.seq_identifier = value;
                        break;
                    case 'coll_date':
                        item.coll_date = value;
                        break;
                    case 'collector_name':
                        item.collector_name = value;
                        break;
                    case 'family_name':
                        item.family_name = value;
                        break;
                    case 'subfamily_name':
                        item.subfamily_name = value;
                        break;
                    case 'tribe_name':
                        item.tribe_name = value;
                        break;
                    case 'genus_name':
                        item.genus_name = value;
                        break;
                    case 'species_name':
                        item.species_name = value;
                        break;
                    case 'subspecies_name':
                        item.subspecies_name = value;
                        break;
                    case 'name_ko':
                        item.name_ko = value;
                        break;
                    case 'location':
                        item.location = value;
                        break;
                    case 'host':
                        item.host = value;
                        break;
                    case 'is_hidden':
                        item.is_hidden = value.toLowerCase() === 'true' || value === '1';
                        break;
                    default:
                        // 기타 컬럼은 무시
                        break;
                }
            });

            return item as CollDataType;
        });
        console.log(`구글시트에서 ${collectionData.length}개의 데이터 로드 완료`);
        return collectionData;

    } catch (error) {
        console.error('구글시트 데이터 가져오기 실패:', error);
        return [];
    }
}