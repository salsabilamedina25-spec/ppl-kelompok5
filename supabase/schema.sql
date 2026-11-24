-- =======================================================
-- AS.TOUR TRAVEL (v2.0) - Supabase / PostgreSQL Schema DDL
-- Disusun untuk: AS.Tour Travel (Pimpinan: Al-Djaat Siyah Maghrib)
-- Tim Pengembang: UN(FOUR)TUNATELY (Sistem Informasi UISI)
-- =======================================================

-- 1. Tabel Admin
CREATE TABLE IF NOT EXISTS admin (
    id_admin SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama_admin VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Kategori
CREATE TABLE IF NOT EXISTS kategori (
    id_kategori SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE
);

-- 3. Tabel Profil Perusahaan
CREATE TABLE IF NOT EXISTS profil_perusahaan (
    id_profil SERIAL PRIMARY KEY,
    id_admin INT NOT NULL,
    nama_perusahaan VARCHAR(100) NOT NULL,
    deskripsi_profil TEXT NOT NULL,
    alamat TEXT NOT NULL,
    kontak_whatsapp VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_profil_admin FOREIGN KEY (id_admin) REFERENCES admin(id_admin) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 4. Tabel Layanan
CREATE TABLE IF NOT EXISTS layanan (
    id_layanan SERIAL PRIMARY KEY,
    id_kategori INT NOT NULL,
    id_admin INT NOT NULL,
    nama_layanan VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    deskripsi TEXT NOT NULL,
    tujuan VARCHAR(150) NOT NULL,
    durasi VARCHAR(50) NOT NULL,
    itinerary TEXT NULL,
    harga NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_layanan_kategori FOREIGN KEY (id_kategori) REFERENCES kategori(id_kategori) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_layanan_admin FOREIGN KEY (id_admin) REFERENCES admin(id_admin) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 5. Tabel Fasilitas
CREATE TABLE IF NOT EXISTS fasilitas (
    id_fasilitas SERIAL PRIMARY KEY,
    id_layanan INT NOT NULL,
    nama_fasilitas VARCHAR(150) NOT NULL,
    tipe VARCHAR(20) DEFAULT 'include' CHECK (tipe IN ('include', 'exclude')),
    CONSTRAINT fk_fasilitas_layanan FOREIGN KEY (id_layanan) REFERENCES layanan(id_layanan) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Tabel Foto Layanan
CREATE TABLE IF NOT EXISTS foto_layanan (
    id_foto SERIAL PRIMARY KEY,
    id_layanan INT NOT NULL,
    file_foto VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_foto_layanan FOREIGN KEY (id_layanan) REFERENCES layanan(id_layanan) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. Tabel Testimoni
CREATE TABLE IF NOT EXISTS testimoni (
    id_testimoni SERIAL PRIMARY KEY,
    id_layanan INT NULL,
    id_admin INT NOT NULL,
    nama_pelanggan VARCHAR(100) NOT NULL,
    nama_layanan VARCHAR(150) NULL,
    ulasan TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_testimoni_layanan FOREIGN KEY (id_layanan) REFERENCES layanan(id_layanan) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_testimoni_admin FOREIGN KEY (id_admin) REFERENCES admin(id_admin) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Untuk database yang sudah dibuat dengan versi schema sebelumnya
ALTER TABLE testimoni ADD COLUMN IF NOT EXISTS nama_layanan VARCHAR(150) NULL;

-- Indeks Pencarian & Kinerja Kueri
CREATE INDEX IF NOT EXISTS idx_layanan_kategori ON layanan(id_kategori);
CREATE INDEX IF NOT EXISTS idx_layanan_slug ON layanan(slug);
CREATE INDEX IF NOT EXISTS idx_kategori_slug ON kategori(slug);

-- =======================================================
-- KEAMANAN: Row Level Security
-- Aplikasi mengakses database hanya dari server (Next.js) memakai
-- service role key, yang melewati RLS. Dengan RLS aktif tanpa policy,
-- akses langsung memakai anon key (termasuk ke hash password admin) ditolak.
-- =======================================================
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE kategori ENABLE ROW LEVEL SECURITY;
ALTER TABLE profil_perusahaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE layanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasilitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE foto_layanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimoni ENABLE ROW LEVEL SECURITY;

-- Sinkronkan counter ID otomatis. Versi schema lama memasukkan baris dengan ID manual,
-- sehingga counter tertinggal dan INSERT berikutnya bentrok ("duplicate key ... _pkey").
SELECT setval(pg_get_serial_sequence('admin', 'id_admin'), COALESCE((SELECT MAX(id_admin) FROM admin), 1), (SELECT COUNT(*) > 0 FROM admin));
SELECT setval(pg_get_serial_sequence('kategori', 'id_kategori'), COALESCE((SELECT MAX(id_kategori) FROM kategori), 1), (SELECT COUNT(*) > 0 FROM kategori));
SELECT setval(pg_get_serial_sequence('profil_perusahaan', 'id_profil'), COALESCE((SELECT MAX(id_profil) FROM profil_perusahaan), 1), (SELECT COUNT(*) > 0 FROM profil_perusahaan));

-- Hak akses untuk server (service role). Project Supabase baru tidak lagi memberi
-- hak otomatis ke tabel yang dibuat lewat SQL Editor. anon/authenticated sengaja
-- TIDAK diberi akses.
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Data awal (kategori, profil, layanan, testimoni) ada di supabase/seed.sql.
-- Akun admin dibuat lewat: npm run create-admin -- <username> <password> "<nama>"
