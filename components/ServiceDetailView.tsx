"use client";

import { useState } from "react";
import Link from "next/link";
import { Layanan, ProfilPerusahaan } from "@/lib/types";
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Calendar,
  Share2,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Sparkles,
} from "lucide-react";

interface ServiceDetailViewProps {
  layanan: Layanan;
  profil: ProfilPerusahaan;
  relatedLayanan: Layanan[];
}

export default function ServiceDetailView({
  layanan,
  profil,
  relatedLayanan,
}: ServiceDetailViewProps) {
  // Photos
  const photos = layanan.foto && layanan.foto.length > 0
    ? layanan.foto
    : [
        {
          id_foto: 1,
          id_layanan: layanan.id_layanan,
          file_foto: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
          is_primary: true,
        },
      ];

  const [activePhoto, setActivePhoto] = useState(
    photos.find((f) => f.is_primary)?.file_foto || photos[0].file_foto
  );

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  // WhatsApp Message Generator (Strict PRD Format)
  const waUrl = `https://wa.me/${profil.kontak_whatsapp}?text=${encodeURIComponent(
    `Halo AS.Tour, saya tertarik dengan paket ${layanan.nama_layanan}`
  )}`;

  // Facilities split
  const includes = layanan.fasilitas?.filter((f) => f.tipe === "include") || [];
  const excludes = layanan.fasilitas?.filter((f) => f.tipe === "exclude") || [];

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: layanan.nama_layanan,
        text: `Lihat penawaran ${layanan.nama_layanan} di AS.TOUR TRAVEL`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Tautan berhasil disalin ke clipboard!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6 overflow-x-auto">
        <Link href="/" className="hover:text-blue-700">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/katalog" className="hover:text-blue-700">Katalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 truncate">{layanan.nama_layanan}</span>
      </nav>

      {/* Main Grid: Left Details & Right Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column (8 cols): Title, Photos, Specs, Description, Itinerary, Facilities */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
              {layanan.kategori?.nama_kategori}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {layanan.nama_layanan}
            </h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-3 text-xs sm:text-sm text-slate-600 font-semibold">
              <span className="flex items-center gap-1.5 text-rose-600">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{layanan.tujuan}</span>
              </span>
              <span className="flex items-center gap-1.5 text-blue-600">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Durasi: {layanan.durasi}</span>
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors ml-auto"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan</span>
              </button>
            </div>
          </div>

          {/* Photo Gallery with Thumbnail Selector */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden shadow-md bg-slate-100">
              <div
                className="w-full h-full bg-cover bg-center transition-all duration-300"
                style={{ backgroundImage: `url(${activePhoto})` }}
              />
            </div>
            {photos.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {photos.map((p, idx) => (
                  <button
                    key={p.id_foto || idx}
                    onClick={() => setActivePhoto(p.file_foto)}
                    className={`relative w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activePhoto === p.file_foto
                        ? "border-blue-600 ring-2 ring-blue-300"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${p.file_foto})` }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Overview / Deskripsi Lengkap */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Deskripsi Layanan
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {layanan.deskripsi}
            </p>
          </div>

          {/* Itinerari Program */}
          {layanan.itinerary && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Calendar className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  Rencana Perjalanan (Itinerary)
                </h2>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-mono whitespace-pre-line leading-relaxed">
                {layanan.itinerary}
              </div>
            </div>
          )}

          {/* Fasilitas Include & Exclude */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Rincian Fasilitas Perjalanan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fasilitas Include */}
              <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fasilitas Termasuk (Include):</span>
                </div>
                {includes.length > 0 ? (
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {includes.map((f) => (
                      <li key={f.id_fasilitas} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f.nama_fasilitas}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">Termasuk fasilitas standar armada &amp; pemandu.</p>
                )}
              </div>

              {/* Fasilitas Exclude */}
              <div className="bg-rose-50/60 p-5 rounded-xl border border-rose-100">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-3">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Tidak Termasuk (Exclude):</span>
                </div>
                {excludes.length > 0 ? (
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {excludes.map((f) => (
                      <li key={f.id_fasilitas} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{f.nama_fasilitas}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">Tidak termasuk pengeluaran pribadi di luar program.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Sticky Booking & WhatsApp CTA Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Booking Card */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xl shadow-blue-900/5">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                Tarif Terbaik
              </span>
              <div className="text-3xl font-black text-blue-700 mb-1">
                {formatRupiah(layanan.harga)}
              </div>
              <span className="text-xs text-slate-400 block mb-6">
                *Tarif dapat dinegosiasikan sesuai jumlah seat &amp; kebutuhan rute
              </span>

              {/* Quick Perks */}
              <div className="space-y-2.5 pb-6 mb-6 border-b border-slate-100 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Armada Resmi &amp; Pengemudi Berpengalaman</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Pemesanan Tanpa Registrasi Akun</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Respon WhatsApp Cepat 24 Jam</span>
                </div>
              </div>

              {/* WHATSAPP CTA BUTTON (PRD Mandated Format) */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                <span>Pesan via WhatsApp</span>
              </a>


            </div>

            {/* Need Assistance Card */}
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-6 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <PhoneCall className="w-4 h-4" />
                <span>Konsultasi Khusus</span>
              </div>
              <h4 className="text-base font-bold">
                Punya Rencana Perjalanan Khusus?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                AS.Tour Travel siap merancang rute kustom untuk instansi, sekolah, atau keluarga besar Anda.
              </p>
              <a
                href={`https://wa.me/${profil.kontak_whatsapp}?text=${encodeURIComponent(
                  `Halo Admin AS.Tour, saya ingin berkonsultasi custom trip untuk ${layanan.nama_layanan}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs font-bold text-amber-300 hover:text-white underline underline-offset-4"
              >
                Hubungi Admin Hotline &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Packages */}
      {relatedLayanan.length > 0 && (
        <div className="mt-20 pt-12 border-t border-slate-200">
          <h3 className="text-2xl font-black text-slate-900 mb-8">
            Layanan Lain yang Mungkin Anda Sukai
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedLayanan.map((item) => (
              <Link
                key={item.id_layanan}
                href={`/katalog/${item.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all p-4 flex gap-4 items-center"
              >
                <div
                  className="w-20 h-20 rounded-xl bg-cover bg-center shrink-0"
                  style={{
                    backgroundImage: `url(${
                      item.foto?.[0]?.file_foto ||
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"
                    })`,
                  }}
                />
                <div className="overflow-hidden">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    {item.kategori?.nama_kategori}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 truncate">
                    {item.nama_layanan}
                  </h4>
                  <span className="text-xs font-black text-slate-900 block mt-1">
                    {formatRupiah(item.harga)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
