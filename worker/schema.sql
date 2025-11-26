-- Cerambycidae D1 Database Schema

-- 표본 데이터 테이블
CREATE TABLE IF NOT EXISTS specimens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coll_id TEXT UNIQUE NOT NULL,
    type TEXT,
    dna_identified TEXT,
    dna_accession_no TEXT,
    seq_identifier TEXT,
    coll_date TEXT,
    collector_name TEXT,
    family_name TEXT,
    subfamily_name TEXT,
    tribe_name TEXT,
    genus_name TEXT,
    species_name TEXT,
    subspecies_name TEXT,
    name_ko TEXT,
    location TEXT,
    host TEXT,
    is_hidden INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 이미지 데이터 테이블 (R2와 연동)
CREATE TABLE IF NOT EXISTS specimen_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    specimen_coll_id TEXT NOT NULL,
    r2_key TEXT NOT NULL,
    file_name TEXT NOT NULL,
    size INTEGER,
    uploaded_at TEXT,
    url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (specimen_coll_id) REFERENCES specimens(coll_id)
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_specimens_coll_id ON specimens(coll_id);
CREATE INDEX IF NOT EXISTS idx_specimens_family ON specimens(family_name);
CREATE INDEX IF NOT EXISTS idx_specimens_subfamily ON specimens(subfamily_name);
CREATE INDEX IF NOT EXISTS idx_specimens_genus ON specimens(genus_name);
CREATE INDEX IF NOT EXISTS idx_specimens_species ON specimens(species_name);
CREATE INDEX IF NOT EXISTS idx_specimens_name_ko ON specimens(name_ko);
CREATE INDEX IF NOT EXISTS idx_specimens_location ON specimens(location);
CREATE INDEX IF NOT EXISTS idx_specimens_host ON specimens(host);
CREATE INDEX IF NOT EXISTS idx_specimens_is_hidden ON specimens(is_hidden);

CREATE INDEX IF NOT EXISTS idx_images_specimen_id ON specimen_images(specimen_coll_id);
CREATE INDEX IF NOT EXISTS idx_images_r2_key ON specimen_images(r2_key);
