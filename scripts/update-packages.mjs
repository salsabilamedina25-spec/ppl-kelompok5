import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updatePackages() {
  const { data: admin } = await supabase.from("admin").select("id_admin").limit(1).single();
  const idAdmin = admin?.id_admin || 1;

  const { data: categories } = await supabase.from("kategori").select("*");
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id_kategori]));

  // Non-aktifkan layanan lama template agar katalog fokus pada 4 paket yang aktif saat ini
  await supabase.from("layanan").update({ is_active: false }).neq("id_layanan", 0);

  const packages = [
    {
      nama_layanan: "Wisata Ziarah Wali 5 (Jawa Timur)",
      slug: "wisata-ziarah-wali-5",
      id_kategori: catMap["wisata-religi"] || 4,
      id_admin: idAdmin,
      tujuan: "Sunan Ampel, Maulana Ishaq, Asmorokondi, Drajat, Bonang",
      durasi: "1 Hari (Full Day)",
      harga: 145000,
      is_active: true,
      deskripsi:
        "Paket Wisata Religi Ziarah Wali 5 di Jawa Timur bersama AS.TOUR TRAVEL. Ziarah ke makam para waliyullah: Sunan Ampel (Surabaya), Syekh Maulana Ishaq (Lamongan), Syekh Asmorokondi (Tuban), Sunan Drajat (Lamongan), dan Sunan Bonang (Tuban).\n\nPilihan Paket & Tarif:\n- Elf JetBus (19 peserta): Rp 155.000 / orang\n- Bis Medium (30 - 34 orang): Rp 145.000 / orang\n\nPerjalanan ibadah ziarah yang aman, nyaman, dan khusyuk didampingi Tour Leader berpengalaman serta fasilitas lengkap tanpa biaya tersembunyi.",
      itinerary:
        "05:30 - Penjemputan peserta di titik kumpul (Surabaya / Gresik sekitarnya)\n06:30 - Ziarah Makam Sunan Ampel (Surabaya) & doa bersama\n08:30 - Perjalanan menuju Makam Syekh Maulana Ishaq (Lamongan)\n10:30 - Ziarah Makam Syekh Asmorokondi (Tuban)\n12:00 - Istirahat, Ishoma, & ziarah Makam Sunan Drajat (Paciran Lamongan)\n14:30 - Ziarah Makam Sunan Bonang (Tuban)\n16:30 - Belanja oleh-oleh khas pesisir Tuban & Lamongan\n18:00 - Perjalanan kembali ke titik kumpul semula. Trip ziarah selesai penuh berkah.",
      foto: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
      includes: [
        "Armada (Elf JetBus / Bis Medium) + BBM + Driver + Kernet",
        "Tips / uang makan sopir kernet",
        "Toll PP",
        "Tour Leader",
        "Uang infak rombongan ke semua lokasi ziarah",
        "Parkir dan retribusi ziarah",
        "Gratis Banner + air mineral",
      ],
      excludes: [
        "Pengeluaran pribadi di luar program ziarah",
        "Obat-obatan pribadi",
      ],
    },
    {
      nama_layanan: "Wisata Jogja One Day (Jeep Kaliurang, Kopi Klothok, Malioboro)",
      slug: "wisata-jogja-one-day",
      id_kategori: catMap["paket-wisata"] || 2,
      id_admin: idAdmin,
      tujuan: "Jeep Kaliurang Jogja, Kopi Klothok, Malioboro",
      durasi: "1 Hari (One Day Tour)",
      harga: 350000,
      is_active: true,
      deskripsi:
        "Paket Wisata Jogja One Day bersama AS.TOUR TRAVEL! Eksplorasi keseruan petualangan Jeep Kaliurang Merapi menyusuri jejak erupsi dan manuver air yang memacu adrenalin, santap kuliner legendaris di Kopi Klothok Pakem, dan nikmati jalan-jalan santai belanja di kawasan ikonik Malioboro Yogyakarta.\n\nArmada Elf JetBus nyaman, sudah termasuk BBM, Tol PP, tiket kawasan, driver as guide as fotografer, welcome drink, snack, serta gratis desain & cetak banner.",
      itinerary:
        "23:30 - Penjemputan di titik kumpul (Surabaya / Gresik / sekitarnya), perjalanan via Tol Trans Jawa\n05:00 - Tiba di kawasan Kaliurang Yogyakarta, istirahat, sholat subuh, & persiapan trip\n07:00 - Explore Jeep Kaliurang Merapi (Petilasan Rumah Mbah Maridjan, Batu Alien, Museum Sisa Hartaku, Makam Massal, rute Kali Opak, The Lost World, Tebing Mbendo, Cermin Cekung, Kopi Merapi, Kampung Sisa Erupsi, diakhiri Manuver Air basah-basahan)\n10:30 - Bilas & bersiap menuju kuliner legendaris Kopi Klothok Pakem\n11:30 - Menikmati sajian khas lodeh, telur krispi, & kopi klothok di Kopi Klothok Pakem\n13:30 - Menuju pusat kota Yogyakarta & kawasan Malioboro\n14:30 - Wisata belanja oleh-oleh, batik, bakpia, dan jalan santai di Malioboro\n17:00 - Berkumpul di meeting point bus, perjalanan pulang kembali ke Jawa Timur via Tol\n22:30 - Tiba kembali di meeting point awal dengan bahagia.",
      foto: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1200&q=80",
      includes: [
        "Elf Jetbus + Driver + BBM",
        "Tips Driver",
        "Tol PP",
        "Tour Leader",
        "Parkir semua lokasi",
        "Tiket masuk / retribusi kawasan kaliurang",
        'Jeep (include helm, asuransi, driver "as guide as photografer")',
        "Tiket semua destinasi wisata jeep kaliurang (explore jeep merapi)",
        "Destinasi Jeep: Petilasan Rumah Mbah Marijan",
        "Destinasi Jeep: Batu Alien",
        "Destinasi Jeep: Manuver Air (basah)",
        "Destinasi Jeep: Museum sisa hartaku",
        "Destinasi Jeep: Makam Massal (korban merapi)",
        "Rute Jeep: Melewati kali opak, gapuro the lost world, tebing mbendo, cermin cekung, kopi merapi, kampung sisa erupsi",
        "FREE welcome drink + snack",
        "FREE Desain + Cetak Banner",
      ],
      excludes: [
        "Baju ganti untuk manuver air",
        "Belanja oleh-oleh pribadi",
      ],
    },
    {
      nama_layanan: "Paket Trip Bromo 20 Orang",
      slug: "paket-trip-bromo-20-orang",
      id_kategori: catMap["paket-wisata"] || 2,
      id_admin: idAdmin,
      tujuan: "Kawasan Kawah Bromo & Penanjakan",
      durasi: "1 Hari (Midnight Tour)",
      harga: 325000,
      is_active: true,
      deskripsi:
        "Paket Trip Bromo khusus rombongan 20 orang dengan armada Elf ber-AC dan 4 unit Jeep 4x4 berstandar keselamatan tinggi (2 jeep isi 5 dan 2 jeep isi 6). Menikmati momen sunrise terbaik di Bukit Cinta / Lemah Pasar, keindahan Bukit Widodaren, Kawah Bromo, Pasir Berbisik (Pusung Gedhe), dan Bukit Teletubbies (Lembah Watangan).\n\nTarif Rp 325.000 / orang all-in sudah termasuk 1 Tour Leader dan 1 Fotografer Bromo dengan dokumentasi foto & video unlimited, free desain & cetak banner, serta welcome drink air mineral 600ml & snack.",
      itinerary:
        "23:30 - Penjemputan peserta di meeting point (Surabaya / Gresik / Malang / Sidoarjo)\n02:30 - Tiba di rest area transit Bromo, briefing & oper ke 4 unit Jeep 4x4\n03:30 - Perjalanan Jeep menuju Sunrise Point (Bukit Cinta / Lemah Pasar)\n05:15 - Menyaksikan Golden Sunrise spektakuler Bromo\n06:30 - Foto sesi di spot ikonik Bukit Widodaren\n07:30 - Eksplorasi Kawasan Kawah Bromo & Pura Luhur Poten\n09:00 - Menikmati sensasi Pasir Berbisik (Pusung Gedhe)\n10:00 - Bersantai dan foto di Bukit Teletubbies (Lembah Watangan)\n11:00 - Kembali ke rest area, bersih-bersih & sarapan\n12:30 - Perjalanan pulang kembali via Tol PP\n15:30 - Tiba di meeting point asal dengan hasil dokumentasi foto & video unlimited.",
      foto: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80",
      includes: [
        "Elf + 1 driver + BBM (+ tips + makan driver)",
        "Tol PP",
        "4 Jeep + tiket masuk Explore Bromo (2 jeep isi 5 dan 2 jeep isi 6)",
        "1 Tour Leader",
        "1 Fotografer Bromo (foto dan video unlimited)",
        "Explore Bromo: Sunrise point (bukit cinta / lemah pasar)",
        "Explore Bromo: Bukit widodaren",
        "Explore Bromo: Kawasan kawah bromo",
        "Explore Bromo: Pasir berbisik (pusung gedhe)",
        "Explore Bromo: Bukit teletubies (lembah watangan)",
        "Free desain dan cetak banner",
        "Free welcome drink Air mineral 600ml dan snack",
      ],
      excludes: [
        "Sewa kuda di Lautan Pasir (opsional)",
        "Pengeluaran pribadi di luar program",
      ],
    },
    {
      nama_layanan: "Wisata Jeep Offroad Coban Talun Batu Malang",
      slug: "wisata-jeep-offroad-coban-talun-batu-malang",
      id_kategori: catMap["paket-wisata"] || 2,
      id_admin: idAdmin,
      tujuan: "Jeep Offroad Coban Talun, Batu Malang, Masjid Cheng Ho",
      durasi: "1 Hari (Full Day)",
      harga: 286000,
      is_active: true,
      deskripsi:
        "Paket Wisata Jeep Offroad Coban Talun Malang untuk rombongan besar (Big Bus 60 seat) dengan 15 unit Jeep Offroad (1 Jeep max 4 orang). Rasakan serunya petualangan Jeep 2-3 jam menjelajahi keasrian hutan pinus, serunya petik buah apel segar langsung dari pohonnya, jalur fun offroad, dan atraksi sungai seru yang pasti basah! (Disediakan banyak kamar mandi + musholla).\n\nTrip berlanjut ke Pusat Oleh-oleh Batu Malang dan kunjungan ke Masjid Cheng Ho / Masjid Merah. Harga Rp 286.000 / orang sudah include makan siang prasmanan, fotografer dokumentasi foto/video unlimited via Google Drive, video reel dari paket jeep, free banner, air mineral 600ml, dan doorprize seru di perjalanan!",
      itinerary:
        "05:30 - Kumpul di titik kumpul penjemputan, pembagian snack & doorprize seru di perjalanan\n06:00 - Berangkat menuju Malang via Tol Trans Jawa\n08:30 - Tiba di basecamp Coban Talun, briefing & naik 15 unit Jeep (1 Jeep max 4 orang)\n09:00 - Petualangan Jeep 2-3 jam: Jelajah Hutan Pinus, Petik Buah Apel, Jalur Fun Offroad, & Atraksi Sungai (pasti basah)\n12:00 - Bilas & ganti pakaian di fasilitas kamar mandi yang bersih, sholat di musholla\n12:30 - Makan Siang Prasmanan bersama rombongan\n13:30 - Menuju Pusat Oleh-oleh Khas Batu Malang (belanja apel, keripik buah, dan souvenir)\n15:30 - Wisata religi & foto di Masjid Cheng Ho / Masjid Merah\n17:00 - Perjalanan kembali ke titik asal via Tol\n20:00 - Tiba kembali di titik penjemputan. Dokumentasi foto/video diunggah ke Google Drive.",
      foto: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
      includes: [
        "Big bus 60 seat",
        "BBM + DRIVER+KERNET BUS",
        "TIPS + uang makan Sopir + kernet",
        "Parkir lokasi",
        "Toll PP",
        "15 Jeep + driver + BBM (1 Jeep Max 4 org)",
        "Destinasi Jeep (2-3 jam): Hutan pinus",
        "Destinasi Jeep (2-3 jam): Petik buah apel",
        "Destinasi Jeep (2-3 jam): Jalur fun offroad",
        "Destinasi Jeep (2-3 jam): Atraksi sungai (pasti BASAH, bawa baju ganti)",
        "Disediakan banyak kamar mandi + musholla",
        "Kunjungan Pusat oleh-oleh Batu Malang",
        "Kunjungan Masjid Cheng Ho / Masjid Merah",
        "Makan Siang prasmanan",
        "Fotografer selama perjalanan (dokumentasi unlimited foto/video via Google Drive)",
        "Dokumentasi video reel dari Paket Jeep",
        "Free banner + free air mineral 600 ml",
        "Doorprize di perjalanan",
      ],
      excludes: [
        "Baju ganti untuk atraksi sungai",
        "Belanja oleh-oleh pribadi",
      ],
    },
  ];

  for (const pkg of packages) {
    const { foto, includes, excludes, ...layananData } = pkg;

    // Check if exists by slug
    const { data: existing } = await supabase
      .from("layanan")
      .select("id_layanan")
      .eq("slug", layananData.slug)
      .maybeSingle();

    let idLayanan = existing?.id_layanan;

    if (idLayanan) {
      await supabase
        .from("layanan")
        .update({ ...layananData, updated_at: new Date().toISOString() })
        .eq("id_layanan", idLayanan);
      console.log(`Updated: ${layananData.nama_layanan} (ID: ${idLayanan})`);
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from("layanan")
        .insert(layananData)
        .select("id_layanan")
        .single();
      if (insErr) {
        console.error("Error inserting:", layananData.nama_layanan, insErr);
        continue;
      }
      idLayanan = inserted.id_layanan;
      console.log(`Inserted: ${layananData.nama_layanan} (ID: ${idLayanan})`);
    }

    // Replace Fasilitas
    await supabase.from("fasilitas").delete().eq("id_layanan", idLayanan);
    const fasilitasRows = [
      ...includes.map((f) => ({ id_layanan: idLayanan, nama_fasilitas: f, tipe: "include" })),
      ...excludes.map((f) => ({ id_layanan: idLayanan, nama_fasilitas: f, tipe: "exclude" })),
    ];
    await supabase.from("fasilitas").insert(fasilitasRows);

    // Replace Foto
    await supabase.from("foto_layanan").delete().eq("id_layanan", idLayanan);
    await supabase.from("foto_layanan").insert([
      { id_layanan: idLayanan, file_foto: foto, is_primary: true },
    ]);
  }

  console.log("Semua paket wisata berhasil diupdate ke database Supabase!");
}

updatePackages()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
