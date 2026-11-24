"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, ExternalLink } from "lucide-react";
import { Kategori, Layanan } from "@/lib/types";

export default function AdminEditLayananPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string, 10) : 0;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [namaLayanan, setNamaLayanan] = useState("");
  const [slug, setSlug] = useState("");
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [idKategori, setIdKategori] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [durasi, setDurasi] = useState("");
  const [harga, setHarga] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [deskripsi, setDeskripsi] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [includesText, setIncludesText] = useState("");
  const [excludesText, setExcludesText] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/layanan?all=true`).then((res) => res.json()),
      fetch(`/api/kategori`).then((res) => res.json()),
    ])
      .then(([list, kategori]: [Layanan[], Kategori[]]) => {
        setKategoriList(kategori);
        const item = list.find((l) => l.id_layanan === id);
        if (item) {
          setNamaLayanan(item.nama_layanan);
          setSlug(item.slug);
          setIdKategori(String(item.id_kategori));
          setTujuan(item.tujuan);
          setDurasi(item.durasi);
          setHarga(item.harga.toString());
          setIsActive(item.is_active);
          setDeskripsi(item.deskripsi);
          setItinerary(item.itinerary || "");
          setFotoUrl(item.foto?.[0]?.file_foto || "");

          const incs = item.fasilitas
            ?.filter((f) => f.tipe === "include")
            .map((f) => f.nama_fasilitas)
            .join("\n");
          setIncludesText(incs || "");

          const excs = item.fasilitas
            ?.filter((f) => f.tipe === "exclude")
            .map((f) => f.nama_fasilitas)
            .join("\n");
          setExcludesText(excs || "");
        } else {
          setErrorMsg("Layanan tidak ditemukan");
        }
      })
      .catch(() => {
        setErrorMsg("Gagal memuat data layanan");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    try {
      const parsedHarga = parseFloat(harga) || 0;

      const includeList = includesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((nama_fasilitas) => ({ nama_fasilitas, tipe: "include" as const }));

      const excludeList = excludesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((nama_fasilitas) => ({ nama_fasilitas, tipe: "exclude" as const }));

      const finalFoto = fotoUrl.trim() || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

      const payload = {
        id_layanan: id,
        nama_layanan: namaLayanan,
        slug,
        id_kategori: parseInt(idKategori, 10),
        tujuan,
        durasi,
        harga: parsedHarga,
        is_active: isActive,
        deskripsi,
        itinerary,
        foto: [{ file_foto: finalFoto, is_primary: true }],
        fasilitas: [...includeList, ...excludeList],
      };

      const res = await fetch("/api/layanan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal memperbarui layanan");
      }

      router.push("/admin/dashboard/layanan");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Gagal memperbarui layanan");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 font-semibold">
        Memuat formulir layanan...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard/layanan"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Layanan</span>
        </Link>

        {slug && (
          <Link
            href={`/katalog/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Tampilan Publik</span>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Perbarui Layanan Perjalanan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ubah informasi paket, harga, foto utama, dan fasilitas.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid 1: Nama & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nama Layanan *
              </label>
              <input
                type="text"
                required
                value={namaLayanan}
                onChange={(e) => setNamaLayanan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Slug URL *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Grid 2: Kategori & Destinasi & Durasi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Kategori Layanan *
              </label>
              <select
                value={idKategori}
                onChange={(e) => setIdKategori(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {kategoriList.map((k) => (
                  <option key={k.id_kategori} value={k.id_kategori}>
                    {k.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tujuan / Destinasi *
              </label>
              <input
                type="text"
                required
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Durasi Perjalanan *
              </label>
              <input
                type="text"
                required
                value={durasi}
                onChange={(e) => setDurasi(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Grid 3: Harga & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Harga Mulai Dari (Rupiah) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="is_active_toggle"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="is_active_toggle" className="text-xs font-bold text-slate-800 cursor-pointer">
                Tayangkan langsung di katalog publik website
              </label>
            </div>
          </div>

          {/* Foto URL Thumbnail */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                URL Foto Utama (Opsional)
              </label>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span>Preset cepat:</span>
                <button
                  type="button"
                  onClick={() => setFotoUrl("https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80")}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Bromo
                </button>
                <button
                  type="button"
                  onClick={() => setFotoUrl("https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1200&q=80")}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Jogja
                </button>
                <button
                  type="button"
                  onClick={() => setFotoUrl("https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80")}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Ziarah
                </button>
                <button
                  type="button"
                  onClick={() => setFotoUrl("https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80")}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Offroad / Bus
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                type="text"
                value={fotoUrl}
                onChange={(e) => setFotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {fotoUrl.trim() && (
                <div
                  className="w-16 h-10 rounded-lg bg-cover bg-center border border-slate-200 shrink-0"
                  style={{ backgroundImage: `url(${fotoUrl.trim()})` }}
                  title="Pratinjau Foto"
                />
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Bisa menggunakan URL gambar dari Unsplash, Cloudinary, Imgur, atau link foto publik lainnya.
            </p>
          </div>

          {/* Deskripsi Lengkap */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Deskripsi Lengkap Layanan *
            </label>
            <textarea
              required
              rows={4}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Itinerari Program */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Rencana Perjalanan (Itinerary) - Opsional
            </label>
            <textarea
              rows={4}
              value={itinerary}
              onChange={(e) => setItinerary(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Fasilitas Include vs Exclude */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                Fasilitas Include (1 baris per item)
              </label>
              <textarea
                rows={5}
                value={includesText}
                onChange={(e) => setIncludesText(e.target.value)}
                className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
                Fasilitas Exclude (1 baris per item)
              </label>
              <textarea
                rows={5}
                value={excludesText}
                onChange={(e) => setExcludesText(e.target.value)}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/admin/dashboard/layanan"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Menyimpan Perubahan..." : "Perbarui Layanan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
