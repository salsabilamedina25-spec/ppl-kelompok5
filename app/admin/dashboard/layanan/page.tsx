"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Layanan, Kategori } from "@/lib/types";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminLayananListPage() {
  const [layananList, setLayananList] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("semua");
  const [msg, setMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/layanan?all=true");
      if (res.ok) {
        const data = await res.json();
        setLayananList(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    fetch("/api/kategori")
      .then((res) => (res.ok ? res.json() : []))
      .then(setKategoriList)
      .catch(() => setKategoriList([]));
  }, []);

  const handleToggleActive = async (item: Layanan) => {
    try {
      const res = await fetch("/api/layanan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_layanan: item.id_layanan,
          is_active: !item.is_active,
        }),
      });
      if (res.ok) {
        setLayananList((prev) =>
          prev.map((l) =>
            l.id_layanan === item.id_layanan
              ? { ...l, is_active: !l.is_active }
              : l
          )
        );
        setMsg(`Status ${item.nama_layanan} berhasil diperbarui.`);
        setTimeout(() => setMsg(""), 3000);
      }
    } catch {
      alert("Gagal memperbarui status");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus layanan "${name}"?`)) {
      try {
        const res = await fetch(`/api/layanan?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          setLayananList((prev) => prev.filter((l) => l.id_layanan !== id));
          setMsg(`Layanan "${name}" berhasil dihapus.`);
          setTimeout(() => setMsg(""), 3000);
        } else {
          const err = await res.json().catch(() => ({}));
          alert(err.error || "Gagal menghapus layanan");
        }
      } catch {
        alert("Gagal menghapus layanan");
      }
    }
  };

  const filtered = layananList.filter((item) => {
    if (categoryFilter !== "semua" && item.kategori?.slug !== categoryFilter) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.nama_layanan.toLowerCase().includes(q) ||
        item.tujuan.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Katalog Layanan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tambah, edit informasi tarif, fasilitas include/exclude, dan atur status tayang.
          </p>
        </div>

        <Link
          href="/admin/dashboard/layanan/baru"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-600/20 transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Layanan Baru</span>
        </Link>
      </div>

      {/* Message notification */}
      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama paket atau tujuan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl px-3 py-2 text-slate-700 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="semua">Semua Kategori</option>
            {kategoriList.map((k) => (
              <option key={k.id_kategori} value={k.slug}>
                {k.nama_kategori}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 font-medium">
            Memuat data katalog layanan...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Tidak ada layanan yang sesuai dengan pencarian atau filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Layanan &amp; Foto</th>
                  <th className="py-3.5 px-6">Kategori</th>
                  <th className="py-3.5 px-6">Tujuan</th>
                  <th className="py-3.5 px-6">Harga</th>
                  <th className="py-3.5 px-6">Status Tayang</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filtered.map((item) => (
                  <tr key={item.id_layanan} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl bg-cover bg-center shrink-0 border border-slate-200"
                          style={{
                            backgroundImage: `url(${
                              item.foto?.[0]?.file_foto ||
                              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80"
                            })`,
                          }}
                        />
                        <div className="max-w-xs">
                          <span className="block font-bold text-sm text-slate-900 truncate">
                            {item.nama_layanan}
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">
                            Durasi: {item.durasi}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {item.kategori?.nama_kategori || "-"}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {item.tujuan}
                    </td>
                    <td className="py-4 px-6 font-bold text-blue-700">
                      {formatRupiah(item.harga)}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          item.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {item.is_active ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Tayang Publik</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Disembunyikan</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Link
                          href={`/katalog/${item.slug}`}
                          target="_blank"
                          title="Lihat Pratinjau Publik"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/dashboard/layanan/${item.id_layanan}`}
                          title="Edit Layanan"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id_layanan, item.nama_layanan)}
                          title="Hapus Layanan"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
