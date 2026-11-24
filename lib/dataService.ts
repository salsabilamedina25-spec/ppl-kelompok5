import { getSupabase } from "./supabaseClient";
import {
  Fasilitas,
  FotoLayanan,
  Kategori,
  Layanan,
  ProfilPerusahaan,
  Testimoni,
} from "./types";

/** Semua data dibaca/ditulis langsung ke Supabase. Tidak ada data cadangan di memori. */

const LAYANAN_SELECT = "*, kategori:id_kategori(*), fasilitas(*), foto:foto_layanan(*)";

function fail(context: string, error: { message: string }): never {
  throw new Error(`${context}: ${error.message}`);
}

function normalizeLayanan(row: Layanan): Layanan {
  return {
    ...row,
    harga: Number(row.harga),
    fasilitas: [...(row.fasilitas ?? [])].sort((a, b) => a.id_fasilitas - b.id_fasilitas),
    foto: [...(row.foto ?? [])].sort((a, b) =>
      a.is_primary === b.is_primary ? a.id_foto - b.id_foto : a.is_primary ? -1 : 1
    ),
  };
}

// ---------------------------------------------------------------------------
// Profil Perusahaan
// ---------------------------------------------------------------------------

export async function getProfilPerusahaan(): Promise<ProfilPerusahaan> {
  const { data, error } = await getSupabase()
    .from("profil_perusahaan")
    .select("*")
    .order("id_profil", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) fail("Gagal memuat profil perusahaan", error);
  if (!data) {
    throw new Error(
      "Profil perusahaan belum ada di database. Jalankan supabase/seed.sql atau isi tabel profil_perusahaan."
    );
  }
  return data as ProfilPerusahaan;
}

export async function updateProfilPerusahaan(
  payload: Partial<ProfilPerusahaan>
): Promise<ProfilPerusahaan> {
  const current = await getProfilPerusahaan();
  const update = {
    nama_perusahaan: payload.nama_perusahaan,
    deskripsi_profil: payload.deskripsi_profil,
    alamat: payload.alamat,
    kontak_whatsapp: payload.kontak_whatsapp,
    email: payload.email,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await getSupabase()
    .from("profil_perusahaan")
    .update(update)
    .eq("id_profil", current.id_profil)
    .select()
    .single();

  if (error) fail("Gagal memperbarui profil perusahaan", error);
  return data as ProfilPerusahaan;
}

// ---------------------------------------------------------------------------
// Kategori
// ---------------------------------------------------------------------------

export async function getKategoriList(): Promise<Kategori[]> {
  const { data, error } = await getSupabase()
    .from("kategori")
    .select("*")
    .order("id_kategori", { ascending: true });

  if (error) fail("Gagal memuat kategori", error);
  return (data ?? []) as Kategori[];
}

// ---------------------------------------------------------------------------
// Layanan
// ---------------------------------------------------------------------------

export async function getLayananList(options?: {
  kategoriSlug?: string;
  query?: string;
  onlyActive?: boolean;
}): Promise<Layanan[]> {
  const onlyActive = options?.onlyActive ?? true;

  let request = getSupabase()
    .from("layanan")
    .select(LAYANAN_SELECT)
    .order("id_layanan", { ascending: false });
  if (onlyActive) request = request.eq("is_active", true);

  const { data, error } = await request;
  if (error) fail("Gagal memuat layanan", error);

  let result = ((data ?? []) as Layanan[]).map(normalizeLayanan);

  if (options?.kategoriSlug && options.kategoriSlug !== "semua") {
    result = result.filter((item) => item.kategori?.slug === options.kategoriSlug);
  }

  if (options?.query && options.query.trim() !== "") {
    const q = options.query.toLowerCase().trim();
    result = result.filter(
      (item) =>
        item.nama_layanan.toLowerCase().includes(q) ||
        item.tujuan.toLowerCase().includes(q) ||
        item.deskripsi.toLowerCase().includes(q)
    );
  }

  return result;
}

export async function getLayananBySlug(slug: string): Promise<Layanan | null> {
  const { data, error } = await getSupabase()
    .from("layanan")
    .select(LAYANAN_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) fail("Gagal memuat layanan", error);
  return data ? normalizeLayanan(data as Layanan) : null;
}

export async function getLayananById(id: number): Promise<Layanan | null> {
  const { data, error } = await getSupabase()
    .from("layanan")
    .select(LAYANAN_SELECT)
    .eq("id_layanan", id)
    .maybeSingle();

  if (error) fail("Gagal memuat layanan", error);
  return data ? normalizeLayanan(data as Layanan) : null;
}

export interface LayananInput {
  id_kategori: number;
  id_admin?: number;
  nama_layanan: string;
  slug: string;
  deskripsi: string;
  tujuan: string;
  durasi: string;
  itinerary?: string | null;
  harga: number;
  is_active?: boolean;
  fasilitas?: Pick<Fasilitas, "nama_fasilitas" | "tipe">[];
  foto?: Pick<FotoLayanan, "file_foto" | "is_primary">[];
}

async function replaceFasilitas(id: number, items: LayananInput["fasilitas"]) {
  const supabase = getSupabase();
  const { error: delError } = await supabase.from("fasilitas").delete().eq("id_layanan", id);
  if (delError) fail("Gagal memperbarui fasilitas", delError);

  const rows = (items ?? [])
    .filter((f) => f.nama_fasilitas?.trim())
    .map((f) => ({
      id_layanan: id,
      nama_fasilitas: f.nama_fasilitas.trim(),
      tipe: f.tipe === "exclude" ? "exclude" : "include",
    }));
  if (rows.length === 0) return;

  const { error } = await supabase.from("fasilitas").insert(rows);
  if (error) fail("Gagal menyimpan fasilitas", error);
}

async function replaceFoto(id: number, items: LayananInput["foto"]) {
  const supabase = getSupabase();
  const { error: delError } = await supabase.from("foto_layanan").delete().eq("id_layanan", id);
  if (delError) fail("Gagal memperbarui foto", delError);

  const rows = (items ?? [])
    .filter((f) => f.file_foto?.trim())
    .map((f, index) => ({
      id_layanan: id,
      file_foto: f.file_foto.trim(),
      is_primary: f.is_primary ?? index === 0,
    }));
  if (rows.length === 0) return;

  const { error } = await supabase.from("foto_layanan").insert(rows);
  if (error) fail("Gagal menyimpan foto", error);
}

export async function createLayanan(payload: LayananInput): Promise<Layanan> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("layanan")
    .insert({
      id_kategori: payload.id_kategori,
      id_admin: payload.id_admin,
      nama_layanan: payload.nama_layanan,
      slug: payload.slug,
      deskripsi: payload.deskripsi,
      tujuan: payload.tujuan,
      durasi: payload.durasi,
      itinerary: payload.itinerary ?? null,
      harga: payload.harga,
      is_active: payload.is_active ?? true,
    })
    .select("id_layanan")
    .single();

  if (error) fail("Gagal menyimpan layanan", error);
  const id = (data as { id_layanan: number }).id_layanan;

  try {
    await replaceFasilitas(id, payload.fasilitas);
    await replaceFoto(id, payload.foto);
  } catch (err) {
    // Hapus layanan yang setengah jadi agar tidak ada data yatim.
    await supabase.from("layanan").delete().eq("id_layanan", id);
    throw err;
  }

  const created = await getLayananById(id);
  if (!created) throw new Error("Layanan tersimpan tetapi gagal dimuat ulang");
  return created;
}

export async function updateLayanan(
  id: number,
  payload: Partial<LayananInput>
): Promise<Layanan | null> {
  const existing = await getLayananById(id);
  if (!existing) return null;

  const fields = {
    id_kategori: payload.id_kategori,
    nama_layanan: payload.nama_layanan,
    slug: payload.slug,
    deskripsi: payload.deskripsi,
    tujuan: payload.tujuan,
    durasi: payload.durasi,
    itinerary: payload.itinerary,
    harga: payload.harga,
    is_active: payload.is_active,
  };
  const update = Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined)
  );

  const { error } = await getSupabase()
    .from("layanan")
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq("id_layanan", id);
  if (error) fail("Gagal memperbarui layanan", error);

  if (payload.fasilitas !== undefined) await replaceFasilitas(id, payload.fasilitas);
  if (payload.foto !== undefined) await replaceFoto(id, payload.foto);

  return getLayananById(id);
}

export async function deleteLayanan(id: number): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from("layanan")
    .delete()
    .eq("id_layanan", id)
    .select("id_layanan");

  if (error) fail("Gagal menghapus layanan", error);
  return (data ?? []).length > 0;
}

// ---------------------------------------------------------------------------
// Testimoni
// ---------------------------------------------------------------------------

export interface TestimoniInput {
  id_layanan?: number | null;
  id_admin?: number;
  nama_pelanggan: string;
  nama_layanan?: string | null;
  ulasan: string;
  rating: number;
  is_published?: boolean;
}

export async function getTestimoniList(onlyPublished: boolean = true): Promise<Testimoni[]> {
  let request = getSupabase()
    .from("testimoni")
    .select("*")
    .order("id_testimoni", { ascending: false });
  if (onlyPublished) request = request.eq("is_published", true);

  const { data, error } = await request;
  if (error) fail("Gagal memuat testimoni", error);
  return (data ?? []) as Testimoni[];
}

export async function createTestimoni(payload: TestimoniInput): Promise<Testimoni> {
  const { data, error } = await getSupabase()
    .from("testimoni")
    .insert({
      id_layanan: payload.id_layanan ?? null,
      id_admin: payload.id_admin,
      nama_pelanggan: payload.nama_pelanggan,
      nama_layanan: payload.nama_layanan || null,
      ulasan: payload.ulasan,
      rating: payload.rating,
      is_published: payload.is_published ?? true,
    })
    .select()
    .single();

  if (error) fail("Gagal menyimpan testimoni", error);
  return data as Testimoni;
}

export async function updateTestimoni(
  id: number,
  payload: Partial<TestimoniInput>
): Promise<Testimoni | null> {
  const fields = {
    id_layanan: payload.id_layanan,
    nama_pelanggan: payload.nama_pelanggan,
    nama_layanan: payload.nama_layanan,
    ulasan: payload.ulasan,
    rating: payload.rating,
    is_published: payload.is_published,
  };
  const update = Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined)
  );

  const { data, error } = await getSupabase()
    .from("testimoni")
    .update(update)
    .eq("id_testimoni", id)
    .select()
    .maybeSingle();

  if (error) fail("Gagal memperbarui testimoni", error);
  return (data as Testimoni | null) ?? null;
}

export async function deleteTestimoni(id: number): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from("testimoni")
    .delete()
    .eq("id_testimoni", id)
    .select("id_testimoni");

  if (error) fail("Gagal menghapus testimoni", error);
  return (data ?? []).length > 0;
}
