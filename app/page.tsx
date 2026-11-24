import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import SearchBar from "@/components/home/SearchBar";
import TourProvider from "@/components/home/TourProvider";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedServices from "@/components/home/FeaturedServices";
import PopularPackages from "@/components/home/PopularPackages";
import Testimonials from "@/components/home/Testimonials";
import Gallery, { type GalleryPhoto } from "@/components/home/Gallery";
import CtaBanner from "@/components/home/CtaBanner";
import {
  getKategoriList,
  getLayananList,
  getProfilPerusahaan,
  getTestimoniList,
} from "@/lib/dataService";
import { buildFilterOptions, layananToPackage } from "@/lib/packages";

// Data berasal dari database, jadi halaman harus dirender per request.
export const dynamic = "force-dynamic";

const MAX_GALLERY_PHOTOS = 5;

export default async function HomePage() {
  const [profil, testimoniList, layananList, kategoriList] = await Promise.all([
    getProfilPerusahaan(),
    getTestimoniList(true),
    getLayananList({ onlyActive: true }),
    getKategoriList(),
  ]);

  const packages = layananList.map(layananToPackage);
  const filterOptions = buildFilterOptions(packages, kategoriList);

  // Galeri: foto layanan aktif dari database, satu foto utama per layanan.
  const galleryPhotos: GalleryPhoto[] = layananList
    .flatMap((layanan) => {
      const photo = layanan.foto?.find((f) => f.is_primary) ?? layanan.foto?.[0];
      return photo
        ? [{ src: photo.file_foto, alt: layanan.nama_layanan, caption: layanan.nama_layanan }]
        : [];
    })
    .slice(0, MAX_GALLERY_PHOTOS);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar whatsappNumber={profil.kontak_whatsapp} />

      <main className="flex-1">
        <TourProvider
          whatsappNumber={profil.kontak_whatsapp}
          packages={packages}
          filterOptions={filterOptions}
        >
          <Hero whatsappNumber={profil.kontak_whatsapp} />
          <SearchBar />
          <WhyChooseUs />
          <FeaturedServices kategoriList={kategoriList} layananList={layananList} />
          <PopularPackages />
        </TourProvider>
        <Testimonials testimonials={testimoniList} />
        <Gallery photos={galleryPhotos} />
        <CtaBanner whatsappNumber={profil.kontak_whatsapp} />
      </main>

      <Footer profil={profil} />
    </div>
  );
}
