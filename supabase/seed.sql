-- =======================================================
-- AS.TOUR TRAVEL - Data awal (seed)
-- Jalankan SETELAH schema.sql dan SETELAH akun admin dibuat:
--   npm run create-admin -- <username> <password> "<nama admin>"
-- Aman dijalankan berulang: data yang sudah ada tidak ditimpa/digandakan.
-- Semua data ini bisa diubah lewat panel admin.
-- =======================================================

-- Kategori
INSERT INTO kategori (nama_kategori, slug) VALUES
('Penyewaan Armada', 'penyewaan-armada'),
('Paket Wisata', 'paket-wisata'),
('Paket Outbound', 'paket-outbound'),
('Wisata Religi', 'wisata-religi')
ON CONFLICT (slug) DO NOTHING;

-- Profil perusahaan (hanya dibuat jika belum ada)
INSERT INTO profil_perusahaan (id_admin, nama_perusahaan, deskripsi_profil, alamat, kontak_whatsapp, email)
SELECT (SELECT MIN(id_admin) FROM admin), 'AS.TOUR TRAVEL', 'AS.Tour Travel adalah mitra terpercaya perjalanan Anda yang berpusat di Jawa Timur. Didirikan dengan dedikasi tinggi oleh Al-Djaat Siyah Maghrib bersama tim profesional, kami menghadirkan pengalaman berwisata yang aman, nyaman, dan berkesan dengan armada modern serta kru berpengalaman.', 'Jl. Veteran No. 45, Kebomas, Gresik - Jawa Timur 61122', '6281232167707', 'info@astourtravel.id'
WHERE NOT EXISTS (SELECT 1 FROM profil_perusahaan);

-- Layanan
INSERT INTO layanan (id_kategori, id_admin, nama_layanan, slug, deskripsi, tujuan, durasi, itinerary, harga, is_active)
VALUES ((SELECT id_kategori FROM kategori WHERE slug = 'wisata-religi'), (SELECT MIN(id_admin) FROM admin), 'Wisata Ziarah Wali 5 (Jawa Timur)', 'wisata-ziarah-wali-5', 'Paket Wisata Religi Ziarah Wali 5 di Jawa Timur bersama AS.TOUR TRAVEL. Ziarah ke makam para waliyullah: Sunan Ampel (Surabaya), Syekh Maulana Ishaq (Lamongan), Syekh Asmorokondi (Tuban), Sunan Drajat (Lamongan), dan Sunan Bonang (Tuban).

Pilihan Paket & Tarif:
- Elf JetBus (19 peserta): Rp 155.000 / orang
- Bis Medium (30 - 34 orang): Rp 145.000 / orang

Perjalanan ibadah ziarah yang aman, nyaman, dan khusyuk didampingi Tour Leader berpengalaman serta fasilitas lengkap tanpa biaya tersembunyi.', 'Sunan Ampel, Maulana Ishaq, Asmorokondi, Drajat, Bonang', '1 Hari (Full Day)', '05:30 - Penjemputan peserta di titik kumpul (Surabaya / Gresik sekitarnya)
06:30 - Ziarah Makam Sunan Ampel (Surabaya) & doa bersama
08:30 - Perjalanan menuju Makam Syekh Maulana Ishaq (Lamongan)
10:30 - Ziarah Makam Syekh Asmorokondi (Tuban)
12:00 - Istirahat, Ishoma, & ziarah Makam Sunan Drajat (Paciran Lamongan)
14:30 - Ziarah Makam Sunan Bonang (Tuban)
16:30 - Belanja oleh-oleh khas pesisir Tuban & Lamongan
18:00 - Perjalanan kembali ke titik kumpul semula. Trip ziarah selesai penuh berkah.', 145000, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO layanan (id_kategori, id_admin, nama_layanan, slug, deskripsi, tujuan, durasi, itinerary, harga, is_active)
VALUES ((SELECT id_kategori FROM kategori WHERE slug = 'paket-wisata'), (SELECT MIN(id_admin) FROM admin), 'Wisata Jogja One Day (Jeep Kaliurang, Kopi Klothok, Malioboro)', 'wisata-jogja-one-day', 'Paket Wisata Jogja One Day bersama AS.TOUR TRAVEL! Eksplorasi keseruan petualangan Jeep Kaliurang Merapi menyusuri jejak erupsi dan manuver air yang memacu adrenalin, santap kuliner legendaris di Kopi Klothok Pakem, dan nikmati jalan-jalan santai belanja di kawasan ikonik Malioboro Yogyakarta.

Armada Elf JetBus nyaman, sudah termasuk BBM, Tol PP, tiket kawasan, driver as guide as fotografer, welcome drink, snack, serta gratis desain & cetak banner.', 'Jeep Kaliurang Jogja, Kopi Klothok, Malioboro', '1 Hari (One Day Tour)', '23:30 - Penjemputan di titik kumpul (Surabaya / Gresik / sekitarnya), perjalanan via Tol Trans Jawa
05:00 - Tiba di kawasan Kaliurang Yogyakarta, istirahat, sholat subuh, & persiapan trip
07:00 - Explore Jeep Kaliurang Merapi (Petilasan Rumah Mbah Maridjan, Batu Alien, Museum Sisa Hartaku, Makam Massal, rute Kali Opak, The Lost World, Tebing Mbendo, Cermin Cekung, Kopi Merapi, Kampung Sisa Erupsi, diakhiri Manuver Air basah-basahan)
10:30 - Bilas & bersiap menuju kuliner legendaris Kopi Klothok Pakem
11:30 - Menikmati sajian khas lodeh, telur krispi, & kopi klothok di Kopi Klothok Pakem
13:30 - Menuju pusat kota Yogyakarta & kawasan Malioboro
14:30 - Wisata belanja oleh-oleh, batik, bakpia, dan jalan santai di Malioboro
17:00 - Berkumpul di meeting point bus, perjalanan pulang kembali ke Jawa Timur via Tol
22:30 - Tiba kembali di meeting point awal dengan bahagia.', 350000, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO layanan (id_kategori, id_admin, nama_layanan, slug, deskripsi, tujuan, durasi, itinerary, harga, is_active)
VALUES ((SELECT id_kategori FROM kategori WHERE slug = 'paket-wisata'), (SELECT MIN(id_admin) FROM admin), 'Paket Trip Bromo 20 Orang', 'paket-trip-bromo-20-orang', 'Paket Trip Bromo khusus rombongan 20 orang dengan armada Elf ber-AC dan 4 unit Jeep 4x4 berstandar keselamatan tinggi (2 jeep isi 5 dan 2 jeep isi 6). Menikmati momen sunrise terbaik di Bukit Cinta / Lemah Pasar, keindahan Bukit Widodaren, Kawah Bromo, Pasir Berbisik (Pusung Gedhe), dan Bukit Teletubbies (Lembah Watangan).

Tarif Rp 325.000 / orang all-in sudah termasuk 1 Tour Leader dan 1 Fotografer Bromo dengan dokumentasi foto & video unlimited, free desain & cetak banner, serta welcome drink air mineral 600ml & snack.', 'Kawasan Kawah Bromo & Penanjakan', '1 Hari (Midnight Tour)', '23:30 - Penjemputan peserta di meeting point (Surabaya / Gresik / Malang / Sidoarjo)
02:30 - Tiba di rest area transit Bromo, briefing & oper ke 4 unit Jeep 4x4
03:30 - Perjalanan Jeep menuju Sunrise Point (Bukit Cinta / Lemah Pasar)
05:15 - Menyaksikan Golden Sunrise spektakuler Bromo
06:30 - Foto sesi di spot ikonik Bukit Widodaren
07:30 - Eksplorasi Kawasan Kawah Bromo & Pura Luhur Poten
09:00 - Menikmati sensasi Pasir Berbisik (Pusung Gedhe)
10:00 - Bersantai dan foto di Bukit Teletubbies (Lembah Watangan)
11:00 - Kembali ke rest area, bersih-bersih & sarapan
12:30 - Perjalanan pulang kembali via Tol PP
15:30 - Tiba di meeting point asal dengan hasil dokumentasi foto & video unlimited.', 325000, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO layanan (id_kategori, id_admin, nama_layanan, slug, deskripsi, tujuan, durasi, itinerary, harga, is_active)
VALUES ((SELECT id_kategori FROM kategori WHERE slug = 'paket-wisata'), (SELECT MIN(id_admin) FROM admin), 'Wisata Jeep Offroad Coban Talun Batu Malang', 'wisata-jeep-offroad-coban-talun-batu-malang', 'Paket Wisata Jeep Offroad Coban Talun Malang untuk rombongan besar (Big Bus 60 seat) dengan 15 unit Jeep Offroad (1 Jeep max 4 orang). Rasakan serunya petualangan Jeep 2-3 jam menjelajahi keasrian hutan pinus, serunya petik buah apel segar langsung dari pohonnya, jalur fun offroad, dan atraksi sungai seru yang pasti basah! (Disediakan banyak kamar mandi + musholla).

Trip berlanjut ke Pusat Oleh-oleh Batu Malang dan kunjungan ke Masjid Cheng Ho / Masjid Merah. Harga Rp 286.000 / orang sudah include makan siang prasmanan, fotografer dokumentasi foto/video unlimited via Google Drive, video reel dari paket jeep, free banner, air mineral 600ml, dan doorprize seru di perjalanan!', 'Jeep Offroad Coban Talun, Batu Malang, Masjid Cheng Ho', '1 Hari (Full Day)', '05:30 - Kumpul di titik kumpul penjemputan, pembagian snack & doorprize seru di perjalanan
06:00 - Berangkat menuju Malang via Tol Trans Jawa
08:30 - Tiba di basecamp Coban Talun, briefing & naik 15 unit Jeep (1 Jeep max 4 orang)
09:00 - Petualangan Jeep 2-3 jam: Jelajah Hutan Pinus, Petik Buah Apel, Jalur Fun Offroad, & Atraksi Sungai (pasti basah)
12:00 - Bilas & ganti pakaian di fasilitas kamar mandi yang bersih, sholat di musholla
12:30 - Makan Siang Prasmanan bersama rombongan
13:30 - Menuju Pusat Oleh-oleh Khas Batu Malang (belanja apel, keripik buah, dan souvenir)
15:30 - Wisata religi & foto di Masjid Cheng Ho / Masjid Merah
17:00 - Perjalanan kembali ke titik asal via Tol
20:00 - Tiba kembali di titik penjemputan. Dokumentasi foto/video diunggah ke Google Drive.', 286000, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO layanan (id_kategori, id_admin, nama_layanan, slug, deskripsi, tujuan, durasi, itinerary, harga, is_active)
VALUES ((SELECT id_kategori FROM kategori WHERE slug = 'paket-wisata'), (SELECT MIN(id_admin) FROM admin), 'Paket Wisata Eksotika Bromo Sunrise', 'paket-wisata-eksotika-bromo-sunrise', 'Saksikan keindahan magis matahari terbit (sunrise) terbaik di Gunung Bromo dari spot Penanjakan 1. Lanjutkan petualangan seru melintasi Lautan Pasir Berbisik, mendaki Kawah Bromo, berfoto di Bukit Teletubbies, dan keindahan Padang Savana dengan armada Jeep 4x4 berstandar keselamatan tinggi.', 'Taman Nasional Bromo Tengger Semeru', '1 Hari (Midnight Tour)', '00:00 - Penjemputan di Meeting Point (Surabaya / Gresik / Malang)
02:30 - Tiba di Pos Rest Area Jeep Sukapura / Tosari, briefing perjalanan
03:30 - Naik Jeep 4WD menuju Spot Sunrise Penanjakan 1 / Kingkong Hill
05:15 - Menikmati Golden Sunrise spektakuler dengan latar Gunung Semeru & Batok
06:30 - Eksplorasi Kawah Bromo & Pura Luhur Poten
08:30 - Menjelajahi Pasir Berbisik dan Spot Foto Bukit Teletubbies
10:00 - Kembali ke Rest Area, sarapan pagi & bersih-bersih
11:30 - Perjalanan kembali ke kota asal
14:00 - Tiba di meeting point semula, trip selesai dengan kenangan indah.', 375000, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO layanan (id_kategori, id_admin, nama_layanan, slug, deskripsi, tujuan, durasi, itinerary, harga, is_active)
VALUES ((SELECT id_kategori FROM kategori WHERE slug = 'penyewaan-armada'), (SELECT MIN(id_admin) FROM admin), 'Sewa Big Bus Pariwisata Jetbus SHD (45 - 50 Seats)', 'sewa-big-bus-pariwisata-jetbus-shd', 'Armada Big Bus Pariwisata tipe Jetbus Super High Deck (SHD) dengan mesin Mercedes-Benz / Hino terkini. Dilengkapi fasilitas entertainment lengkap (Karaoke, Smart TV, Audio Subwoofer), port USB charger tiap seat, reclining seats ergonomis, suspensi udara nyaman, serta bagasi ekstra luas untuk rombongan instansi atau studi tour sekolah.', 'Antarkota Dalam & Luar Propinsi (Jawa - Bali - Lombok)', 'Harian / Mingguan', 'Armada siap di lokasi penjemputan 1 jam sebelum jadwal keberangkatan.
Rute, jadwal singgah, dan destinasi perjalanan disesuaikan sepenuhnya dengan pesanan dan kenyamanan rombongan Anda.
Driver bersertifikasi resmi dan crew profesional siap melayani selama durasi sewa.', 3200000, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO layanan (id_kategori, id_admin, nama_layanan, slug, deskripsi, tujuan, durasi, itinerary, harga, is_active)
VALUES ((SELECT id_kategori FROM kategori WHERE slug = 'wisata-religi'), (SELECT MIN(id_admin) FROM admin), 'Paket Wisata Religi Ziarah Wali Songo Terpadu', 'paket-wisata-religi-ziarah-wali-songo-terpadu', 'Perjalanan spiritual mendalam menelusuri jejak sembilan wali penyebar Islam di Pulau Jawa: Sunan Ampel, Sunan Giri, Sunan Maulana Malik Ibrahim, Sunan Drajat, Sunan Bonang, Sunan Muria, Sunan Kudus, Sunan Kalijaga, dan Sunan Gunung Jati. Dipandu oleh Ustadz pembimbing ziarah yang berpengalaman dengan tahlil dan doa bersama.', 'Jawa Timur - Jawa Tengah - Jawa Barat', '4 Hari 3 Malam', 'Hari 1: Penjemputan di Gresik/Surabaya, Ziarah Sunan Ampel, Sunan Giri, & Maulana Malik Ibrahim. Bermalam di Tuban.
Hari 2: Ziarah Sunan Drajat & Sunan Bonang di Tuban. Menuju Kudus, ziarah Sunan Kudus & Sunan Muria.
Hari 3: Ziarah Sunan Kalijaga di Demak, Masjid Agung Demak. Melanjutkan perjalanan menuju Cirebon.
Hari 4: Ziarah Sunan Gunung Jati di Cirebon, wisata oleh-oleh khas Batik Trusmi, kembali ke kota asal.', 1250000, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO layanan (id_kategori, id_admin, nama_layanan, slug, deskripsi, tujuan, durasi, itinerary, harga, is_active)
VALUES ((SELECT id_kategori FROM kategori WHERE slug = 'paket-outbound'), (SELECT MIN(id_admin) FROM admin), 'Paket Outbound Team Building & Rafting Adventure', 'paket-outbound-team-building-rafting-adventure', 'Program outbound khusus perusahaan, instansi, atau komunitas yang dirancang untuk mempererat sinergi tim, melatih kepemimpinan, dan merefresh semangat kerja. Menggabungkan dinamika kelompok seru (Ice Breaking, Fun Games, Low/High Impact) dan arung jeram (whitewater rafting) berpacu adrenalin di alam terbuka.', 'Coban Rondo Batu / Sungai Kasembon Malang', '2 Hari 1 Malam (Fullboard)', 'Hari 1:
08:00 - Tiba di Venue Outbound, Welcome Drink & Snack Tradisional
09:00 - Opening, Ice Breaking, & Group Dynamic Games dipandu Trainer Profesional
12:00 - Ishoma Makan Siang Bersama
13:30 - Team Building Games & Problem Solving Challenge
16:00 - Check-in Penginapan Resort / Villa, istirahat
19:00 - Gala Dinner, Api Unggun, Organ Tunggal / Fun Night & Doorprize
Hari 2:
07:00 - Sarapan Pagi di Resort
08:30 - Simulasi Rafting 7.5 KM dengan jeram grade 3-4, didampingi Skipper Profesional
12:00 - Makan Siang Menu Khas Desa, penutupan acara, & kembali pulang.', 850000, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO layanan (id_kategori, id_admin, nama_layanan, slug, deskripsi, tujuan, durasi, itinerary, harga, is_active)
VALUES ((SELECT id_kategori FROM kategori WHERE slug = 'penyewaan-armada'), (SELECT MIN(id_admin) FROM admin), 'Sewa Toyota HiAce Premio Luxury (10 - 14 Seats)', 'sewa-toyota-hiace-premio-luxury', 'Kendaraan komuter berkelas tinggi yang sangat cocok untuk perjalanan keluarga eksekutif, tamu VIP, maupun delegasi bisnis. Dilengkapi interior mewah, kursi kapten (captain seat) empuk, AC double blower super sejuk, audio entertainment, dan peredaman kabin optimal demi ketenangan sepanjang rute.', 'Antarkota / Wisata / Drop Off Bandara Juanda', 'Harian (12 - 18 Jam)', 'Layanan door-to-door: Armada dan driver ramah kami menjemput tepat waktu di rumah, hotel, atau Bandara Juanda / Stasiun Pasar Turi. Siap mengantar keliling kota tujuan sesuai kebutuhan perjalanan Anda.', 1450000, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO layanan (id_kategori, id_admin, nama_layanan, slug, deskripsi, tujuan, durasi, itinerary, harga, is_active)
VALUES ((SELECT id_kategori FROM kategori WHERE slug = 'paket-wisata'), (SELECT MIN(id_admin) FROM admin), 'Paket Wisata Pesona Jogja Istimewa & Kuliner Legendaris', 'paket-wisata-pesona-jogja-istimewa', 'Jelajahi magisnya Kota Gudeg dengan mengunjungi Candi Prambanan yang megah, keindahan Tebing Breksi, petualangan Lava Tour Merapi dengan Jeep terbuka, sunset di Pantai Parangtritis, dan belanja santai di Malioboro.', 'D.I. Yogyakarta', '3 Hari 2 Malam', 'Hari 1: Berangkat dari titik kumpul, sarapan di resto lokal. Ziarah Candi Prambanan dan Tebing Breksi. Sunset di Obelix Hills. Check-in hotel.
Hari 2: Jeep Lava Tour Gunung Merapi (Bunker Kaliadem, Museum Sisa Hartaku). Wisata belanja sentra Bakpia Pathok & Dagadu. Malam di Malioboro.
Hari 3: Wisata Keraton Yogyakarta & Tamansari Water Castle. Makan siang Gudeg Yu Djum, perjalanan pulang ke Jawa Timur.', 1100000, true)
ON CONFLICT (slug) DO NOTHING;

-- Fasilitas
INSERT INTO fasilitas (id_layanan, nama_fasilitas, tipe)
SELECT l.id_layanan, v.nama, v.tipe FROM (VALUES
('wisata-ziarah-wali-5', 'Armada (Elf JetBus / Bis Medium) + BBM + Driver + Kernet', 'include'),
('wisata-ziarah-wali-5', 'Tips / uang makan sopir kernet', 'include'),
('wisata-ziarah-wali-5', 'Toll PP', 'include'),
('wisata-ziarah-wali-5', 'Tour Leader', 'include'),
('wisata-ziarah-wali-5', 'Uang infak rombongan ke semua lokasi ziarah', 'include'),
('wisata-ziarah-wali-5', 'Parkir dan retribusi ziarah', 'include'),
('wisata-ziarah-wali-5', 'Gratis Banner + air mineral', 'include'),
('wisata-ziarah-wali-5', 'Pengeluaran pribadi di luar program ziarah', 'exclude'),
('wisata-ziarah-wali-5', 'Obat-obatan pribadi', 'exclude'),
('wisata-jogja-one-day', 'Elf Jetbus + Driver + BBM', 'include'),
('wisata-jogja-one-day', 'Tips Driver', 'include'),
('wisata-jogja-one-day', 'Tol PP', 'include'),
('wisata-jogja-one-day', 'Tour Leader', 'include'),
('wisata-jogja-one-day', 'Parkir semua lokasi', 'include'),
('wisata-jogja-one-day', 'Tiket masuk / retribusi kawasan kaliurang', 'include'),
('wisata-jogja-one-day', 'Jeep (include helm, asuransi, driver as guide as photografer)', 'include'),
('wisata-jogja-one-day', 'Tiket semua destinasi wisata jeep kaliurang (explore jeep merapi)', 'include'),
('wisata-jogja-one-day', 'Destinasi Jeep: Petilasan Rumah Mbah Marijan', 'include'),
('wisata-jogja-one-day', 'Destinasi Jeep: Batu Alien', 'include'),
('wisata-jogja-one-day', 'Destinasi Jeep: Manuver Air (basah)', 'include'),
('wisata-jogja-one-day', 'Destinasi Jeep: Museum sisa hartaku', 'include'),
('wisata-jogja-one-day', 'Destinasi Jeep: Makam Massal (korban merapi)', 'include'),
('wisata-jogja-one-day', 'Rute Jeep: Melewati kali opak, gapuro the lost world, tebing mbendo, cermin cekung, kopi merapi, kampung sisa erupsi', 'include'),
('wisata-jogja-one-day', 'FREE welcome drink + snack', 'include'),
('wisata-jogja-one-day', 'FREE Desain + Cetak Banner', 'include'),
('wisata-jogja-one-day', 'Baju ganti untuk manuver air', 'exclude'),
('wisata-jogja-one-day', 'Belanja oleh-oleh pribadi', 'exclude'),
('paket-trip-bromo-20-orang', 'Elf + 1 driver + BBM (+ tips + makan driver)', 'include'),
('paket-trip-bromo-20-orang', 'Tol PP', 'include'),
('paket-trip-bromo-20-orang', '4 Jeep + tiket masuk Explore Bromo (2 jeep isi 5 dan 2 jeep isi 6)', 'include'),
('paket-trip-bromo-20-orang', '1 Tour Leader', 'include'),
('paket-trip-bromo-20-orang', '1 Fotografer Bromo (foto dan video unlimited)', 'include'),
('paket-trip-bromo-20-orang', 'Explore Bromo: Sunrise point (bukit cinta / lemah pasar)', 'include'),
('paket-trip-bromo-20-orang', 'Explore Bromo: Bukit widodaren', 'include'),
('paket-trip-bromo-20-orang', 'Explore Bromo: Kawasan kawah bromo', 'include'),
('paket-trip-bromo-20-orang', 'Explore Bromo: Pasir berbisik (pusung gedhe)', 'include'),
('paket-trip-bromo-20-orang', 'Explore Bromo: Bukit teletubies (lembah watangan)', 'include'),
('paket-trip-bromo-20-orang', 'Free desain dan cetak banner', 'include'),
('paket-trip-bromo-20-orang', 'Free welcome drink Air mineral 600ml dan snack', 'include'),
('paket-trip-bromo-20-orang', 'Sewa kuda di Lautan Pasir (opsional)', 'exclude'),
('paket-trip-bromo-20-orang', 'Pengeluaran pribadi di luar program', 'exclude'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Big bus 60 seat', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'BBM + DRIVER+KERNET BUS', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'TIPS + uang makan Sopir + kernet', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Parkir lokasi', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Toll PP', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', '15 Jeep + driver + BBM (1 Jeep Max 4 org)', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Destinasi Jeep (2-3 jam): Hutan pinus', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Destinasi Jeep (2-3 jam): Petik buah apel', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Destinasi Jeep (2-3 jam): Jalur fun offroad', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Destinasi Jeep (2-3 jam): Atraksi sungai (pasti BASAH, bawa baju ganti)', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Disediakan banyak kamar mandi + musholla', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Kunjungan Pusat oleh-oleh Batu Malang', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Kunjungan Masjid Cheng Ho / Masjid Merah', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Makan Siang prasmanan', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Fotografer selama perjalanan (dokumentasi unlimited foto/video via Google Drive)', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Dokumentasi video reel dari Paket Jeep', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Free banner + free air mineral 600 ml', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Doorprize di perjalanan', 'include'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Baju ganti untuk atraksi sungai', 'exclude'),
('wisata-jeep-offroad-coban-talun-batu-malang', 'Belanja oleh-oleh pribadi', 'exclude'),
('paket-wisata-eksotika-bromo-sunrise', 'Jeep Hardtop 4x4 Khusus Bromo', 'include'),
('paket-wisata-eksotika-bromo-sunrise', 'Tiket Masuk TNBTS Resmi & Asuransi', 'include'),
('paket-wisata-eksotika-bromo-sunrise', 'Driver Jeep Berpengalaman & BBM', 'include'),
('paket-wisata-eksotika-bromo-sunrise', 'Tour Leader / Guide Ramah', 'include'),
('paket-wisata-eksotika-bromo-sunrise', 'Air Mineral & Snack Box', 'include'),
('paket-wisata-eksotika-bromo-sunrise', 'Sewa Kuda di Lautan Pasir', 'exclude'),
('paket-wisata-eksotika-bromo-sunrise', 'Pengeluaran Pribadi & Tips Sukarela', 'exclude'),
('sewa-big-bus-pariwisata-jetbus-shd', 'Armada Bus Bersih, Full AC Dingin & Nyaman', 'include'),
('sewa-big-bus-pariwisata-jetbus-shd', 'Driver Utama & Co-Driver Handal', 'include'),
('sewa-big-bus-pariwisata-jetbus-shd', 'Sound System Karaoke & Smart TV', 'include'),
('sewa-big-bus-pariwisata-jetbus-shd', 'Port Charger USB di Setiap Baris Kursi', 'include'),
('sewa-big-bus-pariwisata-jetbus-shd', 'Biaya Tol & Parkir Destinasi', 'exclude'),
('sewa-big-bus-pariwisata-jetbus-shd', 'Konsumsi & Akomodasi Crew', 'exclude'),
('paket-wisata-religi-ziarah-wali-songo-terpadu', 'Bus Pariwisata Eksekutif AC Seat 2-2', 'include'),
('paket-wisata-religi-ziarah-wali-songo-terpadu', 'Penginapan Hotel / Asrama Transit Nyaman', 'include'),
('paket-wisata-religi-ziarah-wali-songo-terpadu', 'Makan 3x Sehari Prasmanan Menu Nusantara', 'include'),
('paket-wisata-religi-ziarah-wali-songo-terpadu', 'Ustadz Pembimbing Tahlil & Ziarah', 'include'),
('paket-wisata-religi-ziarah-wali-songo-terpadu', 'Buku Panduan Doa Ziarah & Air Zamzam', 'include'),
('paket-wisata-religi-ziarah-wali-songo-terpadu', 'Sedekah / Infaq Pribadi di Makam', 'exclude'),
('paket-wisata-religi-ziarah-wali-songo-terpadu', 'Ojek Lokal ke Lokasi Puncak Makam Muria', 'exclude'),
('paket-outbound-team-building-rafting-adventure', 'Master Trainer & Fasilitator Outbound Bersertifikat', 'include'),
('paket-outbound-team-building-rafting-adventure', 'Peralatan Safety Rafting (Helm, Pelampung, Dayung)', 'include'),
('paket-outbound-team-building-rafting-adventure', 'Akomodasi Resort 1 Malam (Twin/Triple Share)', 'include'),
('paket-outbound-team-building-rafting-adventure', 'Konsumsi Lengkap 4x Makan + 2x Coffee Break', 'include'),
('paket-outbound-team-building-rafting-adventure', 'Banner Kegiatan & Dokumentasi Foto/Video Drone', 'include'),
('paket-outbound-team-building-rafting-adventure', 'Kaos Polo Seragam Tambahan (Opsional)', 'exclude'),
('sewa-toyota-hiace-premio-luxury', 'Armada HiAce Premio Terbaru Bersih & Wangi', 'include'),
('sewa-toyota-hiace-premio-luxury', 'Jasa Driver Berpengalaman & Santun', 'include'),
('sewa-toyota-hiace-premio-luxury', 'Bahan Bakar (BBM) Sesuai Rute Kota', 'include'),
('sewa-toyota-hiace-premio-luxury', 'Tarif Tol, Parkir, & Tiket Masuk Objek', 'exclude'),
('paket-wisata-pesona-jogja-istimewa', 'Transportasi Bus Pariwisata / HiAce AC', 'include'),
('paket-wisata-pesona-jogja-istimewa', 'Hotel Bintang 3 (2 Malam di Pusat Kota Jogja)', 'include'),
('paket-wisata-pesona-jogja-istimewa', 'Jeep Merapi Lava Tour', 'include'),
('paket-wisata-pesona-jogja-istimewa', 'Makan Sesuai Program & Tiket Objek Lengkap', 'include'),
('paket-wisata-pesona-jogja-istimewa', 'Pengeluaran Pribadi di Malioboro', 'exclude')
) AS v(slug, nama, tipe)
JOIN layanan l ON l.slug = v.slug
WHERE NOT EXISTS (SELECT 1 FROM fasilitas f WHERE f.id_layanan = l.id_layanan AND f.nama_fasilitas = v.nama);

-- Foto layanan
INSERT INTO foto_layanan (id_layanan, file_foto, is_primary)
SELECT l.id_layanan, v.url, v.is_primary FROM (VALUES
('wisata-ziarah-wali-5', 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80', true),
('wisata-jogja-one-day', 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1200&q=80', true),
('paket-trip-bromo-20-orang', 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80', true),
('wisata-jeep-offroad-coban-talun-batu-malang', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80', true),
('paket-wisata-eksotika-bromo-sunrise', 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80', true),
('paket-wisata-eksotika-bromo-sunrise', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80', false),
('sewa-big-bus-pariwisata-jetbus-shd', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', true),
('sewa-big-bus-pariwisata-jetbus-shd', 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80', false),
('paket-wisata-religi-ziarah-wali-songo-terpadu', 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80', true),
('paket-wisata-religi-ziarah-wali-songo-terpadu', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80', false),
('paket-outbound-team-building-rafting-adventure', 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=1200&q=80', true),
('paket-outbound-team-building-rafting-adventure', 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80', false),
('sewa-toyota-hiace-premio-luxury', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', true),
('paket-wisata-pesona-jogja-istimewa', 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80', true)
) AS v(slug, url, is_primary)
JOIN layanan l ON l.slug = v.slug
WHERE NOT EXISTS (SELECT 1 FROM foto_layanan f WHERE f.id_layanan = l.id_layanan AND f.file_foto = v.url);

-- Testimoni
INSERT INTO testimoni (id_layanan, id_admin, nama_pelanggan, nama_layanan, ulasan, rating, is_published)
SELECT (SELECT id_layanan FROM layanan WHERE slug = v.slug), (SELECT MIN(id_admin) FROM admin), v.nama, v.layanan, v.ulasan, v.rating, v.pub FROM (VALUES
('paket-wisata-eksotika-bromo-sunrise', 'Rudi Hartono, S.T.', 'Paket Wisata Eksotika Bromo Sunrise', 'Pelayanan AS.Tour luar biasa memuaskan! Paket Bromo Sunrise terkoordinasi sangat rapi, driver jeep tepat waktu dan tour leader-nya sangat sigap membantu foto-foto keluarga kami. Sukses terus untuk AS.Tour Travel!', 5, true),
('sewa-big-bus-pariwisata-jetbus-shd', 'Hj. Siti Aminah', 'Sewa Big Bus Pariwisata Jetbus SHD', 'Kami menyewa Big Bus Jetbus SHD untuk rombongan pengajian ke Jawa Tengah. Bus sangat bersih, AC dingin merata, sound karaoke mantap, dan bapak sopirnya sangat sabar dan mengemudi dengan sangat hati-hati.', 5, true),
('paket-outbound-team-building-rafting-adventure', 'Bambang Kurniawan (HRD PT Semen Makmur)', 'Paket Outbound Team Building & Rafting Adventure', 'Gathering tahunan perusahaan kami di Malang berjalan lancar berkat tim AS.Tour. Fasilitator outbound sangat komunikatif membangkitkan kekompakan rekan kerja, dan kegiatan raftingnya aman berkesan!', 5, true),
('paket-wisata-religi-ziarah-wali-songo-terpadu', 'Ustadz H. Ahmad Fauzi', 'Paket Wisata Religi Ziarah Wali Songo Terpadu', 'Alhamdulillah, ziarah Wali Songo bersama jamaah masjid kami berlangsung khusyuk dan tertib. Itinerari tidak terburu-buru, hotel tempat transit bersih, dan konsumsi selalu tepat waktu.', 5, true)
) AS v(slug, nama, layanan, ulasan, rating, pub)
WHERE NOT EXISTS (SELECT 1 FROM testimoni t WHERE t.nama_pelanggan = v.nama AND t.ulasan = v.ulasan);
