import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceDetailView from "@/components/ServiceDetailView";
import {
  getLayananBySlug,
  getLayananList,
  getProfilPerusahaan,
} from "@/lib/dataService";

export const dynamic = "force-dynamic";

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const layanan = await getLayananBySlug(slug);

  if (!layanan) {
    return {
      title: "Layanan Tidak Ditemukan - AS.TOUR TRAVEL",
    };
  }

  return {
    title: `${layanan.nama_layanan} - AS.TOUR TRAVEL`,
    description: layanan.deskripsi.substring(0, 160),
    openGraph: {
      title: `${layanan.nama_layanan} - AS.TOUR TRAVEL`,
      description: layanan.deskripsi.substring(0, 160),
      images: layanan.foto?.[0]?.file_foto ? [layanan.foto[0].file_foto] : [],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const [layanan, profil] = await Promise.all([
    getLayananBySlug(slug),
    getProfilPerusahaan(),
  ]);

  if (!layanan) {
    notFound();
  }

  // Get related packages in the same category
  const allInCat = await getLayananList({
    kategoriSlug: layanan.kategori?.slug,
    onlyActive: true,
  });
  const relatedLayanan = allInCat
    .filter((l) => l.id_layanan !== layanan.id_layanan)
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Public Navbar (No Login Button) */}
      <Navbar whatsappNumber={profil.kontak_whatsapp} />

      {/* Spacer for Fixed Navbar */}
      <div className="h-20 bg-slate-900" />

      {/* Main Detail Content */}
      <main className="flex-1">
        <ServiceDetailView
          layanan={layanan}
          profil={profil}
          relatedLayanan={relatedLayanan}
        />
      </main>

      {/* Public Footer (No Login Button) */}
      <Footer profil={profil} />
    </div>
  );
}
