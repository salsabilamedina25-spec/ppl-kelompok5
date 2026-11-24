export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
  slug: string;
}

export interface Fasilitas {
  id_fasilitas: number;
  id_layanan: number;
  nama_fasilitas: string;
  tipe: "include" | "exclude";
}

export interface FotoLayanan {
  id_foto: number;
  id_layanan: number;
  file_foto: string;
  is_primary: boolean;
}

export interface Layanan {
  id_layanan: number;
  id_kategori: number;
  id_admin: number;
  nama_layanan: string;
  slug: string;
  deskripsi: string;
  tujuan: string;
  durasi: string;
  itinerary: string | null;
  harga: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  // Relational virtual fields
  kategori?: Kategori;
  fasilitas?: Fasilitas[];
  foto?: FotoLayanan[];
}

export interface Testimoni {
  id_testimoni: number;
  id_layanan: number | null;
  id_admin: number;
  nama_pelanggan: string;
  ulasan: string;
  rating: number;
  is_published: boolean;
  created_at?: string;
  nama_layanan?: string | null;
}

export interface ProfilPerusahaan {
  id_profil: number;
  id_admin: number;
  nama_perusahaan: string;
  deskripsi_profil: string;
  alamat: string;
  kontak_whatsapp: string;
  email: string;
}

export interface AdminUser {
  id_admin: number;
  username: string;
  nama_admin: string;
}
