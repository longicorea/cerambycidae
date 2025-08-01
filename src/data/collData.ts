export interface DriveImageFileInfo {
    id: string;
    name: string;
    webViewLink: string;
    webContentLink: string;
    thumbnailLink?: string;
    mimeType: string;
    size: string;
    modifiedTime: string;
    parents: string[];
    path: string;
}

export interface DriveImageInfo {
    key: string;
    size: number;
    uploaded: string;
    url: string;
    name: string;
}

export type CollDataType = {
    id: string,
    coll_id: string,
    type: string,
    dna_identified: string,
    dna_accession_no: string,
    seq_identifier: string,
    coll_date: string,
    collector_name: string,
    family_name: string,
    subfamily_name: string,
    tribe_name: string,
    genus_name: string,
    species_name: string,
    subspecies_name: string,
    name_ko: string,
    location: string,
    host: string,
    is_hidden: boolean | string,
    imageFiles?: DriveImageInfo[], // Drive 파일 정보 전체
}

export const CollData: CollDataType[] = [];