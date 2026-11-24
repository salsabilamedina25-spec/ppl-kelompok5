"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Layanan, Kategori } from "@/lib/types";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  X,
  Compass,
} from "lucide-react";

interface CatalogViewProps {
  initialLayanan: Layanan[];
  kategoriList: Kategori[];
  initialCategory?: string;
  initialSearch?: string;
}

export default function CatalogView({
  initialLayanan,
  kategoriList,
  initialCategory = "semua",
  initialSearch = "",
}: CatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedDuration, setSelectedDuration] = useState<string>("semua");
  const [sortBy, setSortBy] = useState<string>("default");

  // Dynamic Filtering
  const filteredList = useMemo(() => {
    return initialLayanan.filter((item) => {
      // 1. Category Filter
      if (selectedCategory !== "semua" && item.kategori?.slug !== selectedCategory) {
        return false;
      }

      // 2. Search Query Filter (name, destination, description)
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.nama_layanan.toLowerCase().includes(q);
        const matchesDest = item.tujuan.toLowerCase().includes(q);
        const matchesDesc = item.deskripsi.toLowerCase().includes(q);
        if (!matchesName && !matchesDest && !matchesDesc) return false;
      }

      // 3. Duration Filter
      if (selectedDuration !== "semua") {
        if (selectedDuration === "1-hari" && !item.durasi.toLowerCase().includes("1 hari") && !item.durasi.toLowerCase().includes("harian")) {
          return false;
        }
        if (selectedDuration === "multi-hari" && (item.durasi.toLowerCase().includes("1 hari") || item.durasi.toLowerCase().includes("harian"))) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.harga - b.harga;
      if (sortBy === "price-high") return b.harga - a.harga;
      if (sortBy === "name-asc") return a.nama_layanan.localeCompare(b.nama_layanan);
      return 0;
    });
  }, [initialLayanan, selectedCategory, searchQuery, selectedDuration, sortBy]);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const resetFilters = () => {
    setSelectedCategory("semua");
    setSearchQuery("");
    setSelectedDuration("semua");
    setSortBy("default");
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama layanan atau destinasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Duration Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-600 cursor-pointer"
              >
                <option value="semua">Semua Durasi</option>
                <option value="1-hari">1 Hari / Harian</option>
                <option value="multi-hari">2 Hari ke Atas (Inap)</option>
              </select>
            </div>
          </div>

          {/* Sort By Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-600 cursor-pointer"
              >
                <option value="default">Urutkan Rekomendasi</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
                <option value="name-asc">Nama: A - Z</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="md:col-span-1 flex justify-end">
            <button
              onClick={resetFilters}
              title="Reset Filter"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 mt-4 border-t border-slate-100 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("semua")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === "semua"
                ? "bg-sky-700 text-white shadow-md shadow-sky-700/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua Layanan ({initialLayanan.length})
          </button>
          {kategoriList.map((kat) => {
            const count = initialLayanan.filter((l) => l.kategori?.slug === kat.slug).length;
            const isSelected = selectedCategory === kat.slug;
            return (
              <button
                key={kat.id_kategori}
                onClick={() => setSelectedCategory(kat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-sky-700 text-white shadow-md shadow-sky-700/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {kat.nama_kategori} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>Menampilkan {filteredList.length} dari total {initialLayanan.length} layanan</span>
        {(selectedCategory !== "semua" || searchQuery || selectedDuration !== "semua") && (
          <button
            onClick={resetFilters}
            className="text-blue-700 hover:underline flex items-center gap-1"
          >
            <span>Hapus Semua Filter</span>
          </button>
        )}
      </div>

      {/* Catalog Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">
            Tidak Ada Layanan yang Ditemukan
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau reset filter untuk melihat katalog layanan lainnya.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 px-5 py-2.5 bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md"
          >
            Tampilkan Semua Layanan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredList.map((item) => {
            const primaryPhoto =
              item.foto && item.foto.length > 0
                ? item.foto.find((f) => f.is_primary)?.file_foto || item.foto[0].file_foto
                : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={item.id_layanan}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-sky-200 transition-all duration-300"
              >
                {/* Photo Thumbnail */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${primaryPhoto})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-blue-800 shadow-sm">
                      {item.kategori?.nama_kategori}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs font-medium text-white/95 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.durasi}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* Destination */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{item.tujuan}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-2.5">
                      <Link href={`/katalog/${item.slug}`}>{item.nama_layanan}</Link>
                    </h3>

                    {/* Description excerpt */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {item.deskripsi}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">
                        Mulai dari
                      </span>
                      <span className="text-lg font-extrabold text-blue-700">
                        {formatRupiah(item.harga)}
                      </span>
                    </div>

                    <Link
                      href={`/katalog/${item.slug}`}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-sky-50 group-hover:bg-sky-600 text-blue-700 group-hover:text-white transition-all shadow-sm"
                    >
                      <span>Lihat Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
