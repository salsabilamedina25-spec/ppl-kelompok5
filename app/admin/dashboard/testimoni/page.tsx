"use client";

import { useState, useEffect } from "react";
import { Testimoni } from "@/lib/types";
import {
  MessageSquareHeart,
  Plus,
  Star,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Save,
} from "lucide-react";

export default function AdminTestimoniPage() {
  const [testimoniList, setTestimoniList] = useState<Testimoni[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // Add modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [namaLayanan, setNamaLayanan] = useState("");
  const [ulasan, setUlasan] = useState("");
  const [rating, setRating] = useState(5);
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/testimoni?all=true");
      if (res.ok) {
        const data = await res.json();
        setTestimoniList(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePublish = async (item: Testimoni) => {
    try {
      const res = await fetch("/api/testimoni", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_testimoni: item.id_testimoni,
          is_published: !item.is_published,
        }),
      });

      if (res.ok) {
        setTestimoniList((prev) =>
          prev.map((t) =>
            t.id_testimoni === item.id_testimoni
              ? { ...t, is_published: !t.is_published }
              : t
          )
        );
        setMsg(`Status testimoni ${item.nama_pelanggan} diperbarui.`);
        setTimeout(() => setMsg(""), 3000);
      }
    } catch {
      alert("Gagal memperbarui status publikasi");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus testimoni dari "${name}"?`)) {
      try {
        const res = await fetch(`/api/testimoni?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setTestimoniList((prev) => prev.filter((t) => t.id_testimoni !== id));
          setMsg(`Testimoni dari ${name} berhasil dihapus.`);
          setTimeout(() => setMsg(""), 3000);
        }
      } catch {
        alert("Gagal menghapus testimoni");
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/testimoni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_pelanggan: namaPelanggan,
          nama_layanan: namaLayanan || undefined,
          ulasan,
          rating,
          is_published: isPublished,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setTestimoniList((prev) => [created, ...prev]);
        setIsModalOpen(false);
        setNamaPelanggan("");
        setNamaLayanan("");
        setUlasan("");
        setRating(5);
        setMsg("Testimoni baru berhasil ditambahkan!");
        setTimeout(() => setMsg(""), 3000);
      }
    } catch {
      alert("Gagal menambahkan testimoni");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Ulasan &amp; Testimoni
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola ulasan tamu yang tampil di carousel beranda publik AS.TOUR TRAVEL.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Testimoni</span>
        </button>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Testimonial List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-500 font-semibold">
            Memuat daftar ulasan pelanggan...
          </div>
        ) : testimoniList.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-500">
            Belum ada data ulasan testimoni.
          </div>
        ) : (
          testimoniList.map((item) => (
            <div
              key={item.id_testimoni}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div>
                {/* Header Star & Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < item.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleTogglePublish(item)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 transition-colors ${
                      item.is_published
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.is_published ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Tayang</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-slate-400" />
                        <span>Disembunyikan</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                  &ldquo;{item.ulasan}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {item.nama_pelanggan}
                  </h4>
                  {item.nama_layanan && (
                    <span className="text-[10px] text-blue-600 block">
                      {item.nama_layanan}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(item.id_testimoni, item.nama_pelanggan)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-lg font-black text-slate-900">
                Tambah Ulasan Testimoni Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Pelanggan *
                </label>
                <input
                  type="text"
                  required
                  value={namaPelanggan}
                  onChange={(e) => setNamaPelanggan(e.target.value)}
                  placeholder="Contoh: Bpk. H. Ahmad Dahlan"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Layanan / Paket Terkait
                </label>
                <input
                  type="text"
                  value={namaLayanan}
                  onChange={(e) => setNamaLayanan(e.target.value)}
                  placeholder="Contoh: Paket Wisata Bromo Sunrise"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Rating Bintang (1 - 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      className="p-1 text-slate-300 hover:text-amber-400"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          starVal <= rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Isi Ulasan / Testimoni *
                </label>
                <textarea
                  required
                  rows={4}
                  value={ulasan}
                  onChange={(e) => setUlasan(e.target.value)}
                  placeholder="Ceritakan pengalaman kepuasan berwisata bersama armada dan crew AS.Tour..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub_check"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="pub_check" className="text-xs font-bold text-slate-700">
                  Langsung publikasikan ke halaman Beranda
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? "Menyimpan..." : "Simpan Ulasan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
