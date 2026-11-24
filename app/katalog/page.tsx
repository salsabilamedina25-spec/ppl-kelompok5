import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogView from "@/components/CatalogView";
import {
  getProfilPerusahaan,
  getLayananList,
  getKategoriList,
} from "@/lib/dataService";
import { Compass } from "lucide-react";

export const dynamic = "force-dynamic";

interface CatalogPageProps {
  searchParams: Promise<{
    kategori?: string;
    q?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedParams = await searchParams;
  const initialCategory = resolvedParams.kategori || "semua";
  const initialSearch = resolvedParams.q || "";

  const [profil, allLayanan, kategoriList] = await Promise.all([
    getProfilPerusahaan(),
    getLayananList({ onlyActive: true }),
    getKategoriList(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Navbar without Login */}
      <Navbar whatsappNumber={profil.kontak_whatsapp} />

      {/* Catalog Header Banner */}
      <div className="bg-sky-900 text-white pt-32 pb-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Pilihan Paket Wisata &amp; Rental Armada
            </h1>
            <p className="mt-3 text-base text-slate-300">
              Temukan destinasi terbaik, sewa bus eksekutif, ziarah religi, dan paket outbound terpercaya dengan harga transparan dan pemesanan instan via WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* Main Catalog Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <CatalogView
          initialLayanan={allLayanan}
          kategoriList={kategoriList}
          initialCategory={initialCategory}
          initialSearch={initialSearch}
        />
      </main>

      {/* Footer without Login */}
      <Footer profil={profil} />
    </div>
  );
}
